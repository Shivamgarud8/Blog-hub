#!/usr/bin/env bash
# One-command server setup for BloomScript.
# Usage (on the server, inside the repo):  git pull && bash deploy.sh
#
# - creates/completes .env (keeps the existing DB password so data is not lost)
# - rebuilds and starts postgres, backend, frontend (nginx) and pgAdmin
# - creates the app admin login + demo account, then prints every credential
set -euo pipefail

cd "$(dirname "$0")"

if docker compose version >/dev/null 2>&1; then DC="docker compose"; else DC="docker-compose"; fi

rand() { openssl rand -hex "$1" 2>/dev/null || head -c "$1" /dev/urandom | od -An -tx1 | tr -d ' \n'; }

# Set KEY=VALUE in .env (replace the line or append it)
set_var() {
  if grep -q "^$1=" .env; then sed -i "s|^$1=.*|$1=$2|" .env; else echo "$1=$2" >> .env; fi
}
# Add KEY=VALUE only when the key is missing or still a placeholder/empty
ensure_var() {
  local cur
  cur=$(grep "^$1=" .env | head -1 | cut -d= -f2- || true)
  if [ -z "$cur" ] || [[ "$cur" == change_this* ]]; then set_var "$1" "$2"; fi
}
get_var() { grep "^$1=" .env | head -1 | cut -d= -f2-; }

# Value of an env var inside a running/stopped container, if it exists
container_env() {
  docker inspect -f '{{range .Config.Env}}{{println .}}{{end}}' "$1" 2>/dev/null | grep "^$2=" | cut -d= -f2- || true
}

APP_URL=${APP_URL:-http://localhost:3000}

echo "==> Preparing .env"
[ -f .env ] || cp .env.example .env

# Reuse the credentials the existing database was created with, otherwise generate new ones
OLD_PG_USER=$(container_env blog-gen-postgres POSTGRES_USER)
OLD_PG_PASS=$(container_env blog-gen-postgres POSTGRES_PASSWORD)
OLD_PG_DB=$(container_env blog-gen-postgres POSTGRES_DB)
[ -n "$OLD_PG_USER" ] && set_var POSTGRES_USER "$OLD_PG_USER"
[ -n "$OLD_PG_DB" ] && set_var POSTGRES_DB "$OLD_PG_DB"
if [ -n "$OLD_PG_PASS" ]; then
  set_var POSTGRES_PASSWORD "$OLD_PG_PASS"
elif ! docker volume inspect blog_gen_postgres_data >/dev/null 2>&1; then
  # Fresh database: safe to pick a new password
  ensure_var POSTGRES_PASSWORD "$(rand 16)"
fi
ensure_var POSTGRES_USER blog_user
ensure_var POSTGRES_DB blog_gen
set_var DATABASE_URL "postgresql+psycopg://$(get_var POSTGRES_USER):$(get_var POSTGRES_PASSWORD)@postgres:5432/$(get_var POSTGRES_DB)"

OLD_JWT=$(container_env blog-gen-backend JWT_SECRET_KEY)
if [ -n "$OLD_JWT" ]; then ensure_var JWT_SECRET_KEY "$OLD_JWT"; else ensure_var JWT_SECRET_KEY "$(rand 32)"; fi

OLD_PGADMIN_EMAIL=$(container_env blog-gen-pgadmin PGADMIN_DEFAULT_EMAIL)
OLD_PGADMIN_PASS=$(container_env blog-gen-pgadmin PGADMIN_DEFAULT_PASSWORD)
[ -n "$OLD_PGADMIN_EMAIL" ] && set_var PGADMIN_DEFAULT_EMAIL "$OLD_PGADMIN_EMAIL"
if [ -n "$OLD_PGADMIN_PASS" ]; then set_var PGADMIN_DEFAULT_PASSWORD "$OLD_PGADMIN_PASS"; else ensure_var PGADMIN_DEFAULT_PASSWORD "$(rand 8)"; fi
ensure_var PGADMIN_DEFAULT_EMAIL admin@bloomscript.dev
ensure_var PGADMIN_BIND 0.0.0.0

ensure_var APP_ADMIN_EMAIL admin@bloomscript.dev
ensure_var APP_ADMIN_PASSWORD "$(rand 8)"
chmod 600 .env

echo "==> Rebuilding and starting containers (data volumes are kept)"
$DC down --remove-orphans || true
# Remove leftovers with the same names from an older checkout of the project
docker rm -f blog-gen-frontend blog-gen-backend blog-gen-pgadmin blog-gen-postgres >/dev/null 2>&1 || true
$DC up -d --build

echo "==> Waiting for the app at $APP_URL"
for i in $(seq 1 60); do
  if curl -fs $APP_URL/health | grep -q healthy; then break; fi
  [ "$i" = 60 ] && { echo "App did not become healthy. Logs:"; $DC logs --tail 50 backend frontend; exit 1; }
  sleep 3
done

echo "==> Creating users"
$DC exec -T backend python seed.py

ADMIN_EMAIL=$(get_var APP_ADMIN_EMAIL)
ADMIN_PASS=$(get_var APP_ADMIN_PASSWORD)
# Goes through nginx exactly like the browser does
code=$(curl -s -o /tmp/bloomscript_register.json -w '%{http_code}' -X POST $APP_URL/api/auth/register \
  -H 'Content-Type: application/json' \
  -d "{\"full_name\":\"BloomScript Admin\",\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASS\"}")
case "$code" in
  201) echo "Created app login $ADMIN_EMAIL" ;;
  400) echo "App login $ADMIN_EMAIL already exists" ;;
  *)   echo "Register failed ($code): $(cat /tmp/bloomscript_register.json)"; exit 1 ;;
esac
rm -f /tmp/bloomscript_register.json

login=$(curl -s -o /dev/null -w '%{http_code}' -X POST $APP_URL/api/auth/login \
  -H 'Content-Type: application/json' -d "{\"email\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASS\"}")
[ "$login" = 200 ] && echo "Login check OK" || echo "WARNING: login for $ADMIN_EMAIL returned $login (the account existed before with a different password)"

echo "==> Users in the database"
docker exec blog-gen-postgres psql -U "$(get_var POSTGRES_USER)" -d "$(get_var POSTGRES_DB)" \
  -c "SELECT id, email, full_name, created_at FROM users ORDER BY id;"

IP=$(curl -s -m 3 http://checkip.amazonaws.com 2>/dev/null || true)
LAN_IP=$(tailscale ip -4 2>/dev/null | head -1 || true)
[ -n "$LAN_IP" ] || LAN_IP=$(hostname -I 2>/dev/null | awk '{print $1}')
cat <<EOF

================ BloomScript is running ================
App (UI)    : http://${LAN_IP:-<server-ip>}:3000   ${IP:+(public: http://$IP:3000)}
API docs    : http://${LAN_IP:-<server-ip>}:3000/docs
pgAdmin     : http://${LAN_IP:-<server-ip>}:5050   (bound to $(get_var PGADMIN_BIND))

App login   : $ADMIN_EMAIL / $ADMIN_PASS
Demo login  : priya.sharma@example.com / password123
pgAdmin     : $(get_var PGADMIN_DEFAULT_EMAIL) / $(get_var PGADMIN_DEFAULT_PASSWORD)
Postgres    : $(get_var POSTGRES_USER) / $(get_var POSTGRES_PASSWORD)  db=$(get_var POSTGRES_DB)

All values are stored in $(pwd)/.env
Watch requests live: docker logs -f blog-gen-backend
=========================================================
EOF

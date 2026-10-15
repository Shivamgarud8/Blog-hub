#!/bin/sh
# Writes a pgpass file into the pgAdmin user's storage dir so the
# pre-registered server in servers.json connects without a password prompt.
set -e

STORAGE_DIR="/var/lib/pgadmin/storage/$(echo "$PGADMIN_DEFAULT_EMAIL" | sed 's/@/_/g')"
mkdir -p "$STORAGE_DIR"
echo "postgres:5432:*:${POSTGRES_USER}:${POSTGRES_PASSWORD}" > "$STORAGE_DIR/pgpass"
chmod 600 "$STORAGE_DIR/pgpass"

exec /entrypoint.sh "$@"

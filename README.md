# BloomScript — Full-Stack AI Blog Studio

BloomScript is a production-quality, multi-tiered AI Blog Generator built with a **Light Pink & Botanical Cinematic aesthetic**, **Python 3.12+ FastAPI backend**, **PostgreSQL 18 database with persistent Docker volume**, **SQLAlchemy 2.x ORM**, **Alembic database migrations**, and a **React 19 + TypeScript + Tailwind CSS** frontend.

---

## 1. Architecture Overview

```text
                                INTERNET
                                   │
                                   ▼
                           [ Web Browser ]
                                   │
                                   │ HTTPS / Client Request
                                   ▼
                   ┌───────────────────────────────┐
                   │           Frontend            │
                   │    React 19 + TypeScript      │
                   │   Tailwind CSS (Vite / Node)  │
                   │    Port: 3000 / Light Pink    │
                   └───────────────┬───────────────┘
                                   │
                                   │ REST API / JWT Bearer
                                   ▼
                   ┌───────────────────────────────┐
                   │         FastAPI Backend       │
                   │          Python 3.12+         │
                   │      SQLAlchemy 2.x + Pydantic│
                   │           Port: 8000          │
                   └───────┬───────────────┬───────┘
                           │               │
       SQLAlchemy (psycopg)│               │ JSON API Client
                           ▼               ▼
      ┌─────────────────────────┐   ┌─────────────────────────────┐
      │      PostgreSQL 18      │   │     External AI Provider    │
      │    Container: postgres  │   │   OpenAI / Gemini / Groq    │
      │       Port: 5432        │   │ (or Offline Smart Engine)   │
      └────────────┬────────────┘   └─────────────────────────────┘
                   │
                   ▼
         [ postgres_data Volume ]
          (Survives restarts)
```

---

## 2. Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Canvas Petal Physics.
- **Backend**: Python 3.12, FastAPI, SQLAlchemy 2.0+, Pydantic v2, Alembic, Passlib/Bcrypt, Python-Jose (JWT), HTTPX.
- **Database**: PostgreSQL 18 with persistent volume (`postgres_data`).
- **Containerization**: Docker Compose v2, multi-stage Dockerfiles, built-in healthchecks.
- **AI Engine**: Modular provider architecture supporting OpenAI, Gemini, Groq, Ollama, DeepSeek, or high-fidelity offline synthesis.

---

## 3. Directory Structure

```text
blog-gen/
├── backend/
│   ├── app/
│   │   ├── ai/
│   │   │   ├── __init__.py
│   │   │   ├── offline_generator.py   # Smart fallback generator
│   │   │   ├── openai_provider.py     # OpenAI-compatible integration
│   │   │   ├── prompt_builder.py      # Structured editorial prompt engine
│   │   │   └── provider_base.py       # Abstract AIProvider interface
│   │   ├── auth/
│   │   │   ├── dependencies.py        # JWT verification & user dependency
│   │   │   └── security.py            # Bcrypt hashing & JWT signing
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   ├── blog.py                # SQLAlchemy model for blogs
│   │   │   ├── image.py               # SQLAlchemy model for blog_images
│   │   │   └── user.py                # SQLAlchemy model for users
│   │   ├── routers/
│   │   │   ├── auth.py                # /api/auth (register, login, me)
│   │   │   ├── blogs.py               # /api/blogs (CRUD, generate, download)
│   │   │   ├── health.py              # /health (PostgreSQL ping)
│   │   │   ├── images.py              # /api/images (upload & AI image)
│   │   │   └── users.py               # /api/users (profile & stats)
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── blog.py
│   │   │   ├── image.py
│   │   │   └── user.py
│   │   ├── services/
│   │   │   ├── blog_service.py
│   │   │   ├── image_service.py
│   │   │   └── user_service.py
│   │   ├── config.py                  # Pydantic Settings
│   │   ├── database.py                # SQLAlchemy 2.x sessionmaker
│   │   └── main.py                    # FastAPI application entry
│   ├── alembic/
│   │   ├── versions/
│   │   │   └── 001_initial_schema.py  # PostgreSQL 18 schema migration
│   │   ├── env.py
│   │   └── script.py.mako
│   ├── tests/
│   │   ├── test_auth.py
│   │   └── test_blogs.py
│   ├── alembic.ini
│   ├── Dockerfile
│   ├── requirements.txt
│   └── seed.py                        # Demo development seeder
├── src/                               # React 19 Frontend
│   ├── components/
│   │   ├── BlogCard.tsx
│   │   ├── BlogEditor.tsx
│   │   ├── BlogPreviewModal.tsx
│   │   ├── CreateBlogStudio.tsx
│   │   ├── DashboardView.tsx
│   │   ├── ExportModal.tsx
│   │   ├── FloatingPetals.tsx
│   │   ├── LandingHero.tsx
│   │   ├── LoginModal.tsx
│   │   ├── Navbar.tsx
│   │   ├── ProfileView.tsx
│   │   └── RegisterModal.tsx
│   ├── services/
│   │   └── api.ts                     # Real API client + client-side sync
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── docker-compose.yml                 # PostgreSQL 18, FastAPI, and Frontend
├── Dockerfile                         # Frontend production Dockerfile
├── .env.example                       # Environment variables template
├── query.md                           # PostgreSQL 18 queries & administration
└── README.md
```

---

## 4. Quickstart with Docker Compose

### Step 1: Clone and Configure Environment
```bash
cp .env.example .env
```
Edit `.env` to configure your passwords and optional AI API keys.

### Step 2: Launch All Services
```bash
docker compose up -d --build
```

### Step 3: Verify Health Status
```bash
docker compose ps
```
Both `postgres` and `backend` containers will display `healthy`.

### Step 4: Run Database Migrations
```bash
docker exec -it blog-gen-backend alembic upgrade head
```

### Step 5: (Optional) Seed Sample Development Data
```bash
docker exec -it blog-gen-backend python seed.py
```
This provisions a pre-configured creator account:
- **Email:** `priya.sharma@example.com`
- **Password:** `password123`

---

## 5. Environment Variables Reference

| Variable | Description | Default |
|---|---|---|
| `POSTGRES_DB` | PostgreSQL 18 database name | `blog_gen` |
| `POSTGRES_USER` | PostgreSQL user | `blog_user` |
| `POSTGRES_PASSWORD` | PostgreSQL password | Set securely in `.env` |
| `DATABASE_URL` | SQLAlchemy connection string | `postgresql+psycopg://...` |
| `JWT_SECRET_KEY` | Secret used for HMAC-SHA256 tokens | Random 64-char string |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Lifetime of JWT session token | `1440` (24 hours) |
| `AI_API_KEY` | OpenAI / Gemini / Groq API Key | Optional (Smart offline fallback if blank) |
| `AI_API_BASE_URL` | Base URL for OpenAI-compatible API | `https://api.openai.com/v1` |
| `AI_MODEL` | Text generation model | `gpt-4o-mini` |
| `IMAGE_API_KEY` | Image generation API key | Optional |
| `IMAGE_MODEL` | Image model name | `dall-e-3` |
| `CORS_ORIGINS` | Permitted origin origins | `http://localhost:3000` |

---

## 6. Accessing PostgreSQL 18

Direct terminal access into PostgreSQL:
```bash
docker exec -it blog-gen-postgres psql -U blog_user -d blog_gen
```

Verify tables:
```sql
\dt
```

Check blogs created:
```sql
SELECT id, title, topic, word_count, created_at FROM blogs ORDER BY created_at DESC;
```

See **`query.md`** for 30+ production queries including table descriptions, joins, analytics, performance diagnostics, and backup commands.

---

## 7. Interactive API Documentation

Once running, FastAPI automatically serves interactive Swagger and ReDoc documentation:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **Health Check**: `http://localhost:8000/health`

---

## 8. Exporting Blogs

BloomScript supports 4 distinct export formats directly from the preview reader:
1. **Markdown (.md)**: Clean GitHub-flavored Markdown with frontmatter.
2. **HTML (.html)**: Self-contained, styled HTML document ready for web publishing.
3. **PDF Document (.pdf)**: High-fidelity print styling optimized for editorial reading.
4. **Microsoft Word (.docx)**: Structured document format with headers and quotes.

---

## 9. Production Linux Server Deployment

### System Requirements
- Ubuntu 22.04 LTS / 24.04 LTS or Debian 12
- 2 vCPU, 2GB+ RAM
- Docker Engine 24+ & Docker Compose v2

### Setup Steps
```bash
# 1. Install Docker & Compose plugin
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh

# 2. Clone repository onto server
git clone <your-repo-url> /opt/bloomscript
cd /opt/bloomscript

# 3. Configure .env with strong production secrets
cp .env.example .env
nano .env

# 4. Start services in background
docker compose up -d

# 5. Check logs
docker compose logs -f backend
```

---

## 10. Database Backup & Restore

### Backup
```bash
docker exec blog-gen-postgres pg_dump -U blog_user -d blog_gen > blog_gen_$(date +%Y%m%d).sql
```

### Restore
```bash
cat blog_gen_*.sql | docker exec -i blog-gen-postgres psql -U blog_user -d blog_gen
```

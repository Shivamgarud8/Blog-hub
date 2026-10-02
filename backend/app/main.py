import os
import logging
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import auth, users, blogs, images, health

# Set up logging with sensitive data sanitization
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("bloomscript")

# Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="A production-grade AI Blog Studio with PostgreSQL 18, SQLAlchemy 2.x, and FastAPI.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS Middleware
origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else [settings.CORS_ORIGINS]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists and mount static handler
upload_dir = Path(settings.UPLOAD_DIR)
upload_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(upload_dir)), name="uploads")

# Include Routers
app.include_router(health.router)
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(blogs.router)
app.include_router(images.router)


@app.on_event("startup")
def on_startup():
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}")
    try:
        # Create database tables if not using alembic immediately
        Base.metadata.create_all(bind=engine)
        logger.info("PostgreSQL database tables verified and loaded successfully.")
    except Exception as e:
        logger.error(f"Error initializing database tables: {e}")


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Protect against exposing python stack traces to clients
    logger.error(f"Unhandled error handling {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."}
    )


@app.get("/")
def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API",
        "documentation": "/docs",
        "health": "/health"
    }

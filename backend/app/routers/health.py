import logging
from fastapi import APIRouter, Depends, status, Response
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app.config import settings

router = APIRouter(tags=["Health"])
logger = logging.getLogger(__name__)


@router.get("/health")
def health_check(db: Session = Depends(get_db)):
    """
    Check application and PostgreSQL database health.
    Returns 200 OK if both backend and database are functional.
    """
    db_status = "healthy"
    try:
        # PostgreSQL ping check
        db.execute(text("SELECT 1"))
    except Exception as e:
        logger.error(f"PostgreSQL health check failed: {e}")
        db_status = "unhealthy"
        return Response(
            content='{"status": "error", "database": "disconnected", "error": "PostgreSQL connection failed"}',
            media_type="application/json",
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "database": db_status
    }

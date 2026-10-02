from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserResponse, UserUpdate, UserStatsResponse
from app.services.user_service import UserService
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get full profile details for the authenticated user.
    Never exposes password_hash.
    """
    # Count user's blogs
    current_user.blogs_count = len(current_user.blogs)
    return current_user


@router.put("/me/update", response_model=UserResponse)
def update_user_profile(
    user_in: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update profile details for the current user.
    """
    updated_user = UserService.update_user(db, current_user, user_in)
    updated_user.blogs_count = len(updated_user.blogs)
    return updated_user


@router.get("/me/stats", response_model=UserStatsResponse)
def get_user_statistics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve author analytics (total blogs, words written, published/draft breakdown, top category).
    """
    return UserService.get_stats(db, current_user.id)

from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.config import settings
from app.schemas.auth import Token, LoginRequest
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import UserService
from app.auth.security import create_access_token
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account with minimal required details.
    Password is automatically securely hashed with bcrypt.
    Returns a JWT access token for immediate session login.
    """
    user = UserService.create_user(db, user_in)
    access_token = create_access_token(
        subject=user.email,
        user_id=user.id,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return Token(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        full_name=user.full_name
    )


@router.post("/login", response_model=Token)
def login(login_req: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticate a user with Email and Password.
    Returns a signed JWT access token.
    """
    user = UserService.authenticate(db, login_req.email, login_req.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Account is currently inactive"
        )

    access_token = create_access_token(
        subject=user.email,
        user_id=user.id,
        expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return Token(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        email=user.email,
        full_name=user.full_name
    )


@router.get("/me", response_model=UserResponse)
def get_auth_me(current_user: User = Depends(get_current_user)):
    """
    Get profile information of currently authenticated user.
    """
    return current_user

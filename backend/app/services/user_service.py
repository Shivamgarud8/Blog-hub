from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status
from app.models.user import User
from app.models.blog import Blog
from app.schemas.user import UserCreate, UserUpdate, UserStatsResponse
from app.auth.security import get_password_hash, verify_password


class UserService:

    @staticmethod
    def get_by_email(db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email.lower().strip()).first()

    @staticmethod
    def get_by_id(db: Session, user_id: int) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def create_user(db: Session, user_in: UserCreate) -> User:
        clean_email = user_in.email.lower().strip()
        existing = db.query(User).filter(User.email == clean_email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email address already exists."
            )

        hashed = get_password_hash(user_in.password)
        db_user = User(
            email=clean_email,
            password_hash=hashed,
            full_name=user_in.full_name.strip(),
            mobile_number=user_in.mobile_number,
            age=user_in.age,
            date_of_birth=user_in.date_of_birth,
            gender=user_in.gender,
            profession=user_in.profession,
            education=user_in.education,
            marital_status=user_in.marital_status,
            bio=user_in.bio,
            profile_image=user_in.profile_image or f"https://api.dicebear.com/7.x/notionists/svg?seed={clean_email}",
            is_active=True
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def authenticate(db: Session, email: str, password: str) -> Optional[User]:
        user = UserService.get_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.password_hash):
            return None
        return user

    @staticmethod
    def update_user(db: Session, user: User, user_in: UserUpdate) -> User:
        update_data = user_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(user, field, value)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_stats(db: Session, user_id: int) -> UserStatsResponse:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        blogs = db.query(Blog).filter(Blog.user_id == user_id).all()
        total_blogs = len(blogs)
        total_words = sum(b.word_count for b in blogs)
        published_blogs = sum(1 for b in blogs if b.status == "published")
        draft_blogs = total_blogs - published_blogs

        # Determine top category
        categories = [b.blog_type for b in blogs if b.blog_type]
        top_cat = max(set(categories), key=categories.count) if categories else "General"

        return UserStatsResponse(
            total_blogs=total_blogs,
            total_words=total_words,
            published_blogs=published_blogs,
            draft_blogs=draft_blogs,
            top_category=top_cat,
            account_created_date=user.created_at
        )

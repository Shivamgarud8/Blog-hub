from datetime import datetime, date
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    mobile_number: Optional[str] = None
    age: Optional[int] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    profession: Optional[str] = None
    education: Optional[str] = None
    marital_status: Optional[str] = None
    bio: Optional[str] = None
    profile_image: Optional[str] = None


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Plain text password will be hashed with bcrypt")


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    mobile_number: Optional[str] = None
    age: Optional[int] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    profession: Optional[str] = None
    education: Optional[str] = None
    marital_status: Optional[str] = None
    bio: Optional[str] = None
    profile_image: Optional[str] = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    blogs_count: int = 0

    class Config:
        from_attributes = True


class UserStatsResponse(BaseModel):
    total_blogs: int
    total_words: int
    published_blogs: int
    draft_blogs: int
    top_category: Optional[str] = None
    account_created_date: datetime

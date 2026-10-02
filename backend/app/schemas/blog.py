from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class BlogSection(BaseModel):
    heading: str
    content: str
    subsections: Optional[List[Dict[str, str]]] = None


class StructuredBlogContent(BaseModel):
    title: str
    subtitle: Optional[str] = None
    introduction: str
    sections: List[BlogSection]
    conclusion: str
    key_takeaways: List[str] = Field(default_factory=list)


class BlogGenerateRequest(BaseModel):
    topic: str = Field(..., min_length=3, max_length=300)
    blog_length: str = Field(default="Medium", description="Short, Medium, Long, or Custom")
    custom_word_count: Optional[int] = Field(default=1000, ge=300, le=4000)
    blog_type: str = Field(default="Educational")
    tone: str = Field(default="Professional")
    target_audience: str = Field(default="General Audience")
    language: str = Field(default="English")
    keywords: Optional[str] = None
    important_points: Optional[str] = None
    additional_instructions: Optional[str] = None
    author_name: Optional[str] = None
    featured_image_url: Optional[str] = None
    uploaded_image_urls: List[str] = Field(default_factory=list)


class BlogCreate(BaseModel):
    title: str
    subtitle: Optional[str] = None
    topic: str
    content: str
    blog_type: str = "Educational"
    tone: str = "Professional"
    target_audience: str = "General Audience"
    language: str = "English"
    word_count: int = 0
    keywords: Optional[str] = None
    status: str = "published"
    featured_image: Optional[str] = None


class BlogUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    content: Optional[str] = None
    blog_type: Optional[str] = None
    tone: Optional[str] = None
    target_audience: Optional[str] = None
    language: Optional[str] = None
    keywords: Optional[str] = None
    status: Optional[str] = None
    featured_image: Optional[str] = None


class BlogImageResponse(BaseModel):
    id: int
    image_path: str
    image_url: str
    alt_text: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class BlogResponse(BaseModel):
    id: int
    user_id: int
    title: str
    subtitle: Optional[str] = None
    topic: str
    content: str
    blog_type: str
    tone: str
    target_audience: str
    language: str
    word_count: int
    keywords: Optional[str] = None
    status: str
    featured_image: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    author_name: Optional[str] = None
    images: List[BlogImageResponse] = Field(default_factory=list)

    class Config:
        from_attributes = True


class BlogListResponse(BaseModel):
    total: int
    page: int
    limit: int
    blogs: List[BlogResponse]

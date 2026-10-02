from datetime import datetime
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Integer, DateTime, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.image import BlogImage


class Blog(Base):
    __tablename__ = "blogs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(300), nullable=False, index=True)
    subtitle: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    topic: Mapped[str] = mapped_column(String(300), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    blog_type: Mapped[str] = mapped_column(String(50), nullable=False, default="Educational")
    tone: Mapped[str] = mapped_column(String(50), nullable=False, default="Professional")
    target_audience: Mapped[str] = mapped_column(String(50), nullable=False, default="General Audience")
    language: Mapped[str] = mapped_column(String(50), nullable=False, default="English")
    word_count: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    keywords: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="published")  # draft, published
    featured_image: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    author: Mapped["User"] = relationship("User", back_populates="blogs")
    images: Mapped[List["BlogImage"]] = relationship("BlogImage", back_populates="blog", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<Blog id={self.id} title={self.title[:30]} author_id={self.user_id}>"

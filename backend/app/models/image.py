from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base

if TYPE_CHECKING:
    from app.models.blog import Blog


class BlogImage(Base):
    __tablename__ = "blog_images"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True, autoincrement=True)
    blog_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("blogs.id", ondelete="CASCADE"), nullable=True, index=True)
    image_path: Mapped[str] = mapped_column(String(500), nullable=False)
    image_url: Mapped[str] = mapped_column(String(500), nullable=False)
    alt_text: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationship
    blog: Mapped[Optional["Blog"]] = relationship("Blog", back_populates="images")

    def __repr__(self) -> str:
        return f"<BlogImage id={self.id} blog_id={self.blog_id} url={self.image_url}>"

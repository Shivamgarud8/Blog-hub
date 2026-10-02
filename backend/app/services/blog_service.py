import re
from typing import Optional, List, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from fastapi import HTTPException, status
from app.models.blog import Blog
from app.models.image import BlogImage
from app.schemas.blog import (
    BlogCreate,
    BlogGenerateRequest,
    BlogUpdate,
    StructuredBlogContent
)
from app.ai import get_ai_provider


def count_words(text: str) -> int:
    """Calculate word count accurately."""
    words = re.findall(r'\b\w+\b', text)
    return len(words)


def format_structured_blog_markdown(sb: StructuredBlogContent, images: List[str] = None) -> str:
    """Format structured blog output into rich editorial Markdown."""
    lines = []
    if sb.subtitle:
        lines.append(f"> *{sb.subtitle}*\n")

    lines.append(f"{sb.introduction}\n")

    for i, section in enumerate(sb.sections):
        lines.append(f"## {section.heading}\n")
        lines.append(f"{section.content}\n")

        # If user uploaded images, insert one after the first section
        if images and i == 0 and len(images) > 0:
            lines.append(f"![Illustration]({images[0]})\n")

        if section.subsections:
            for sub in section.subsections:
                title = sub.get("title") or "Key Aspect"
                content = sub.get("content") or ""
                lines.append(f"### {title}\n")
                lines.append(f"{content}\n")

    lines.append("## Conclusion\n")
    lines.append(f"{sb.conclusion}\n")

    if sb.key_takeaways:
        lines.append("### Key Takeaways\n")
        for takeaway in sb.key_takeaways:
            lines.append(f"- {takeaway}")
        lines.append("")

    return "\n".join(lines)


class BlogService:

    @staticmethod
    def get_user_blogs(
        db: Session,
        user_id: int,
        search: Optional[str] = None,
        blog_type: Optional[str] = None,
        blog_status: Optional[str] = None,
        page: int = 1,
        limit: int = 10
    ) -> Tuple[List[Blog], int]:
        query = db.query(Blog).filter(Blog.user_id == user_id)

        if search:
            pattern = f"%{search.strip()}%"
            query = query.filter(
                (Blog.title.ilike(pattern)) |
                (Blog.topic.ilike(pattern)) |
                (Blog.content.ilike(pattern))
            )

        if blog_type and blog_type.lower() != "all":
            query = query.filter(Blog.blog_type == blog_type)

        if blog_status and blog_status.lower() != "all":
            query = query.filter(Blog.status == blog_status.lower())

        total = query.count()
        offset = (page - 1) * limit
        blogs = query.order_by(desc(Blog.created_at)).offset(offset).limit(limit).all()
        return blogs, total

    @staticmethod
    def get_blog_by_id(db: Session, blog_id: int, user_id: int) -> Blog:
        blog = db.query(Blog).filter(Blog.id == blog_id).first()
        if not blog:
            raise HTTPException(status_code=404, detail="Blog post not found")
        # Strict user data isolation: prevent unauthorized access
        if blog.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to view or modify this blog"
            )
        return blog

    @staticmethod
    async def generate_and_save(db: Session, user_id: int, req: BlogGenerateRequest) -> Blog:
        ai_provider = get_ai_provider()

        # Generate structured content
        structured: StructuredBlogContent = await ai_provider.generate_blog(req)

        # Featured image resolution: use user-supplied, or generate AI image
        featured_image = req.featured_image_url
        if not featured_image:
            img_data = await ai_provider.generate_image(req.topic, req.tone)
            featured_image = img_data.get("image_url")

        # Format markdown body
        content_md = format_structured_blog_markdown(structured, req.uploaded_image_urls)
        words = count_words(content_md)

        db_blog = Blog(
            user_id=user_id,
            title=structured.title,
            subtitle=structured.subtitle or req.topic,
            topic=req.topic,
            content=content_md,
            blog_type=req.blog_type,
            tone=req.tone,
            target_audience=req.target_audience,
            language=req.language,
            word_count=words,
            keywords=req.keywords,
            status="published",
            featured_image=featured_image
        )
        db.add(db_blog)
        db.commit()
        db.refresh(db_blog)

        # Save any uploaded images to blog_images table
        for img_url in req.uploaded_image_urls:
            blog_img = BlogImage(
                blog_id=db_blog.id,
                image_path=img_url,
                image_url=img_url,
                alt_text=f"Uploaded image for {structured.title}"
            )
            db.add(blog_img)

        if req.uploaded_image_urls:
            db.commit()
            db.refresh(db_blog)

        return db_blog

    @staticmethod
    def update_blog(db: Session, blog_id: int, user_id: int, update_in: BlogUpdate) -> Blog:
        blog = BlogService.get_blog_by_id(db, blog_id, user_id)
        update_data = update_in.model_dump(exclude_unset=True)

        for field, value in update_data.items():
            setattr(blog, field, value)

        if "content" in update_data and update_data["content"]:
            blog.word_count = count_words(update_data["content"])

        db.commit()
        db.refresh(blog)
        return blog

    @staticmethod
    def delete_blog(db: Session, blog_id: int, user_id: int) -> None:
        blog = BlogService.get_blog_by_id(db, blog_id, user_id)
        db.delete(blog)
        db.commit()

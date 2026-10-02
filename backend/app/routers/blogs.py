from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.blog import (
    BlogCreate,
    BlogGenerateRequest,
    BlogUpdate,
    BlogResponse,
    BlogListResponse
)
from app.services.blog_service import BlogService, count_words
from app.auth.dependencies import get_current_user
from app.models.user import User
from app.models.blog import Blog

router = APIRouter(prefix="/api/blogs", tags=["Blogs"])


@router.get("", response_model=BlogListResponse)
def list_my_blogs(
    search: Optional[str] = Query(None, description="Search term for title or content"),
    blog_type: Optional[str] = Query(None, description="Filter by blog type"),
    status: Optional[str] = Query(None, description="Filter by status (all, published, draft)"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=50),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve paginated list of blogs belonging to the authenticated user.
    """
    blogs, total = BlogService.get_user_blogs(
        db=db,
        user_id=current_user.id,
        search=search,
        blog_type=blog_type,
        blog_status=status,
        page=page,
        limit=limit
    )
    blog_responses = []
    for b in blogs:
        resp = BlogResponse.model_validate(b)
        resp.author_name = current_user.full_name
        blog_responses.append(resp)

    return BlogListResponse(
        total=total,
        page=page,
        limit=limit,
        blogs=blog_responses
    )


@router.post("/generate", response_model=BlogResponse, status_code=status.HTTP_201_CREATED)
async def generate_ai_blog(
    req: BlogGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate an end-to-end structured AI blog post and persist directly into PostgreSQL.
    """
    if not req.author_name:
        req.author_name = current_user.full_name

    blog = await BlogService.generate_and_save(db=db, user_id=current_user.id, req=req)
    resp = BlogResponse.model_validate(blog)
    resp.author_name = current_user.full_name
    return resp


@router.post("", response_model=BlogResponse, status_code=status.HTTP_201_CREATED)
def create_manual_blog(
    blog_in: BlogCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new blog manually without AI generation.
    """
    words = count_words(blog_in.content)
    db_blog = Blog(
        user_id=current_user.id,
        title=blog_in.title,
        subtitle=blog_in.subtitle,
        topic=blog_in.topic,
        content=blog_in.content,
        blog_type=blog_in.blog_type,
        tone=blog_in.tone,
        target_audience=blog_in.target_audience,
        language=blog_in.language,
        word_count=words,
        keywords=blog_in.keywords,
        status=blog_in.status,
        featured_image=blog_in.featured_image
    )
    db.add(db_blog)
    db.commit()
    db.refresh(db_blog)

    resp = BlogResponse.model_validate(db_blog)
    resp.author_name = current_user.full_name
    return resp


@router.get("/{id}", response_model=BlogResponse)
def get_blog(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific blog post by ID with strict ownership verification.
    """
    blog = BlogService.get_blog_by_id(db, id, current_user.id)
    resp = BlogResponse.model_validate(blog)
    resp.author_name = current_user.full_name
    return resp


@router.put("/{id}", response_model=BlogResponse)
def update_blog(
    id: int,
    update_in: BlogUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a blog's title, subtitle, content, or status.
    """
    blog = BlogService.update_blog(db, id, current_user.id, update_in)
    resp = BlogResponse.model_validate(blog)
    resp.author_name = current_user.full_name
    return resp


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blog(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Permanently delete a blog post.
    """
    BlogService.delete_blog(db, id, current_user.id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{id}/regenerate", response_model=BlogResponse)
async def regenerate_blog(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Regenerate an existing blog with fresh AI copy while preserving metadata.
    """
    blog = BlogService.get_blog_by_id(db, id, current_user.id)
    req = BlogGenerateRequest(
        topic=blog.topic,
        blog_type=blog.blog_type,
        tone=blog.tone,
        target_audience=blog.target_audience,
        language=blog.language,
        keywords=blog.keywords,
        author_name=current_user.full_name,
        featured_image_url=blog.featured_image
    )
    new_blog = await BlogService.generate_and_save(db, current_user.id, req)
    # Update current blog content
    blog.title = new_blog.title
    blog.subtitle = new_blog.subtitle
    blog.content = new_blog.content
    blog.word_count = new_blog.word_count
    db.commit()
    db.refresh(blog)
    # Remove transient new_blog
    db.delete(new_blog)
    db.commit()

    resp = BlogResponse.model_validate(blog)
    resp.author_name = current_user.full_name
    return resp


@router.get("/{id}/download")
def download_blog_document(
    id: int,
    format: str = Query("markdown", description="markdown, html, or text"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Download blog in Markdown or formatted HTML.
    """
    blog = BlogService.get_blog_by_id(db, id, current_user.id)
    filename_base = blog.title.lower().replace(" ", "_")[:30]

    if format.lower() == "html":
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{blog.title}</title>
<style>
  body {{ font-family: 'Georgia', serif; max-width: 800px; margin: 40px auto; padding: 0 20px; line-height: 1.8; color: #292524; }}
  h1 {{ font-size: 2.5rem; margin-bottom: 0.2rem; color: #1c1917; }}
  .subtitle {{ font-size: 1.25rem; color: #78716c; font-style: italic; margin-bottom: 1.5rem; }}
  .meta {{ font-size: 0.9rem; color: #a8a29e; border-bottom: 1px solid #f5f5f4; padding-bottom: 1rem; margin-bottom: 2rem; }}
  img {{ max-width: 100%; border-radius: 8px; margin: 20px 0; }}
  blockquote {{ border-left: 4px solid #f43f5e; margin: 20px 0; padding-left: 16px; color: #57534e; }}
</style>
</head>
<body>
<h1>{blog.title}</h1>
<div class="subtitle">{blog.subtitle or ''}</div>
<div class="meta">By {current_user.full_name} · {blog.created_at.strftime('%B %d, %Y')} · {blog.word_count} words</div>
{f'<img src="{blog.featured_image}" alt="{blog.title}">' if blog.featured_image else ''}
<div>
{blog.content.replace(chr(10), '<br/>')}
</div>
</body>
</html>"""
        return Response(
            content=html_content,
            media_type="text/html",
            headers={"Content-Disposition": f'attachment; filename="{filename_base}.html"'}
        )

    # Default to Markdown
    md_content = f"""# {blog.title}

> *{blog.subtitle or ''}*

**Author:** {current_user.full_name}  
**Date:** {blog.created_at.strftime('%B %d, %Y')}  
**Word Count:** {blog.word_count} words  
**Type:** {blog.blog_type} | **Tone:** {blog.tone} | **Audience:** {blog.target_audience}  

{f'![Featured Image]({blog.featured_image})' if blog.featured_image else ''}

---

{blog.content}
"""
    return Response(
        content=md_content,
        media_type="text/markdown",
        headers={"Content-Disposition": f'attachment; filename="{filename_base}.md"'}
    )

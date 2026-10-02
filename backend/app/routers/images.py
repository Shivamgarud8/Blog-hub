from fastapi import APIRouter, Depends, UploadFile, File
from app.schemas.image import ImageUploadResponse, ImageGenerateRequest, ImageGenerateResponse
from app.services.image_service import ImageService
from app.ai import get_ai_provider
from app.auth.dependencies import get_current_user
from app.models.user import User

router = APIRouter(prefix="/api/images", tags=["Images"])


@router.post("/upload", response_model=ImageUploadResponse)
async def upload_blog_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Upload an image for a blog post.
    Validates file extension and ensures file is <= 5MB.
    """
    return await ImageService.process_and_save_upload(file)


@router.post("/generate", response_model=ImageGenerateResponse)
async def generate_blog_featured_image(
    req: ImageGenerateRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Generate an AI-powered featured image concept tailored to the blog's topic and tone.
    """
    ai_provider = get_ai_provider()
    result = await ai_provider.generate_image(req.topic, req.tone or "Professional")
    return ImageGenerateResponse(
        image_url=result["image_url"],
        prompt_used=result["prompt_used"]
    )

import os
import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException, status
from app.config import settings
from app.schemas.image import ImageUploadResponse


class ImageService:

    @staticmethod
    async def process_and_save_upload(file: UploadFile) -> ImageUploadResponse:
        # Validate content type
        if file.content_type not in settings.ALLOWED_IMAGE_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type '{file.content_type}'. Allowed types: PNG, JPG, JPEG, WEBP."
            )

        # Read content and validate size (max 5MB)
        content = await file.read()
        max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        if len(content) > max_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB."
            )

        # Create upload directory if not exists
        upload_path = Path(settings.UPLOAD_DIR)
        upload_path.mkdir(parents=True, exist_ok=True)

        # Generate unique filename
        ext = Path(file.filename or "upload.jpg").suffix.lower()
        if not ext:
            ext = ".jpg"
        unique_name = f"{uuid.uuid4().hex}{ext}"
        destination = upload_path / unique_name

        # Save file to disk
        with open(destination, "wb") as f:
            f.write(content)

        # Construct public URL
        image_url = f"/uploads/{unique_name}"

        return ImageUploadResponse(
            image_url=image_url,
            image_path=str(destination),
            file_name=file.filename or unique_name,
            size_bytes=len(content)
        )

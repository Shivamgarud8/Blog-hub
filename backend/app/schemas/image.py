from typing import Optional
from pydantic import BaseModel


class ImageUploadResponse(BaseModel):
    image_url: str
    image_path: str
    file_name: str
    size_bytes: int


class ImageGenerateRequest(BaseModel):
    topic: str
    tone: Optional[str] = "Professional"
    style: Optional[str] = "Editorial cinematic photography, soft rose and warm ambient lighting"


class ImageGenerateResponse(BaseModel):
    image_url: str
    prompt_used: str

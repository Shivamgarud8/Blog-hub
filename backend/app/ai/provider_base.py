from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from app.schemas.blog import BlogGenerateRequest, StructuredBlogContent


class AIProvider(ABC):
    """
    Abstract base class for AI Providers.
    Allows easy swapping between OpenAI, Gemini, Anthropic, Ollama, or local mock.
    """

    @abstractmethod
    async def generate_blog(self, request: BlogGenerateRequest) -> StructuredBlogContent:
        """Generate structured blog content based on parameters."""
        pass

    @abstractmethod
    async def generate_image(self, topic: str, tone: str) -> Dict[str, str]:
        """Generate a blog featured image or image URL."""
        pass

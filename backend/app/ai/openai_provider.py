import json
import logging
from typing import Dict, Any
import httpx
from app.config import settings
from app.schemas.blog import BlogGenerateRequest, StructuredBlogContent, BlogSection
from app.ai.provider_base import AIProvider
from app.ai.prompt_builder import build_blog_generation_prompt
from app.ai.offline_generator import OfflineSmartProvider

logger = logging.getLogger(__name__)


class OpenAIProvider(AIProvider):
    """
    OpenAI-compatible AI Provider.
    Supports OpenAI, OpenRouter, Groq, Ollama, DeepSeek, etc. via standard REST API.
    """

    def __init__(self):
        self.api_key = settings.AI_API_KEY
        self.base_url = settings.AI_API_BASE_URL.rstrip("/")
        self.model = settings.AI_MODEL
        self.fallback = OfflineSmartProvider()

    async def generate_blog(self, req: BlogGenerateRequest) -> StructuredBlogContent:
        if not self.api_key:
            logger.info("AI_API_KEY is not set. Using smart offline generation engine.")
            return await self.fallback.generate_blog(req)

        prompt = build_blog_generation_prompt(req)
        endpoint = f"{self.base_url}/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "You are a professional editorial blog writer that generates well-structured blogs in pure JSON format."},
                {"role": "user", "content": prompt}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.7
        }

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                response = await client.post(endpoint, headers=headers, json=payload)
                response.raise_for_status()
                data = response.json()
                raw_content = data["choices"][0]["message"]["content"]
                parsed = json.loads(raw_content)

                sections = []
                for s in parsed.get("sections", []):
                    sections.append(BlogSection(
                        heading=s.get("heading", "Key Section"),
                        content=s.get("content", ""),
                        subsections=s.get("subsections", [])
                    ))

                return StructuredBlogContent(
                    title=parsed.get("title", req.topic),
                    subtitle=parsed.get("subtitle"),
                    introduction=parsed.get("introduction", ""),
                    sections=sections,
                    conclusion=parsed.get("conclusion", ""),
                    key_takeaways=parsed.get("key_takeaways", [])
                )
        except Exception as e:
            logger.warning(f"Error calling OpenAI-compatible API: {e}. Falling back to offline generator.")
            return await self.fallback.generate_blog(req)

    async def generate_image(self, topic: str, tone: str) -> Dict[str, str]:
        image_key = settings.IMAGE_API_KEY or self.api_key
        if not image_key:
            return await self.fallback.generate_image(topic, tone)

        prompt = f"Cinematic editorial photo for blog about '{topic}', {tone} atmosphere, light rose tones, beautiful aesthetic, professional magazine photography, highly detailed."
        endpoint = f"{settings.IMAGE_API_BASE_URL.rstrip('/')}/images/generations"
        headers = {
            "Authorization": f"Bearer {image_key}",
            "Content-Type": "application/json"
        }
        payload = {
            "prompt": prompt,
            "model": settings.IMAGE_MODEL or "dall-e-3",
            "n": 1,
            "size": "1024x1024"
        }

        try:
            async with httpx.AsyncClient(timeout=45.0) as client:
                res = await client.post(endpoint, headers=headers, json=payload)
                res.raise_for_status()
                data = res.json()
                image_url = data["data"][0]["url"]
                return {"image_url": image_url, "prompt_used": prompt}
        except Exception as e:
            logger.warning(f"Error generating image via API: {e}. Using fallback image.")
            return await self.fallback.generate_image(topic, tone)

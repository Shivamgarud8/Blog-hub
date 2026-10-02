from app.ai.provider_base import AIProvider
from app.ai.openai_provider import OpenAIProvider

_provider_instance = None


def get_ai_provider() -> AIProvider:
    global _provider_instance
    if _provider_instance is None:
        _provider_instance = OpenAIProvider()
    return _provider_instance

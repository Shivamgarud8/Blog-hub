import os
from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "BloomScript - AI Blog Studio"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"

    # PostgreSQL 18 Database
    POSTGRES_DB: str = "blog_gen"
    POSTGRES_USER: str = "blog_user"
    POSTGRES_PASSWORD: str = "change_this_password"
    DATABASE_URL: str = "postgresql+psycopg://blog_user:change_this_password@postgres:5432/blog_gen"

    # Security & JWT
    JWT_SECRET_KEY: str = "change_this_secret_super_secure_key_12345"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # AI Configuration
    AI_API_KEY: str = ""
    AI_API_BASE_URL: str = "https://api.openai.com/v1"
    AI_MODEL: str = "gpt-4o-mini"

    # Image API Configuration
    IMAGE_API_KEY: str = ""
    IMAGE_API_BASE_URL: str = "https://api.openai.com/v1"
    IMAGE_MODEL: str = "dall-e-3"

    # Upload & Storage
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE_MB: int = 5
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp", "image/jpg"]

    # CORS
    CORS_ORIGINS: Union[str, List[str]] = "http://localhost:3000,http://127.0.0.1:3000"

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        elif isinstance(v, list):
            return v
        return ["*"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings = Settings()

import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

class Settings:
    SECRET_KEY: str = os.getenv("SECRET_KEY", "fallback-secret-key")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://user:password@db:5432/taskdb")
    DEBUG: int = int(os.getenv("DEBUG", 1))
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

settings = Settings()

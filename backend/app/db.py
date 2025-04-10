from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Read database URL from environment variable
DATABASE_URL = settings.DATABASE_URL
DEBUG = settings.DEBUG

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in the environment")

# Create an async SQLAlchemy engine
async_engine = create_async_engine(DATABASE_URL, echo=DEBUG == 1)

# Create a session factory
AsyncSessionLocal = sessionmaker(bind=async_engine, class_=AsyncSession, expire_on_commit=False)

# Base class for models
Base = declarative_base()

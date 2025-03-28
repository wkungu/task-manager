from .base import Base  # Import Base from the new file
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Integer, String

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(String(500), nullable=True)

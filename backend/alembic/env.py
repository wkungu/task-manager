import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import logging
logger = logging.getLogger("alembic.runtime.migration")

import asyncio

from logging.config import fileConfig

from alembic import context
from app.db import Base, async_engine  # Ensure this points to your SQLAlchemy models and engine

# This is required for logging setup
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Import your models to ensure Alembic detects them
from app.models import * 

target_metadata = Base.metadata

async def run_migrations():
    """Run migrations in an asynchronous environment."""
    async with async_engine.connect() as conn:
        await conn.run_sync(do_run_migrations)

def do_run_migrations(connection):
    """Helper function to run migrations in a sync context."""
    context.configure(connection=connection, target_metadata=target_metadata)
    with context.begin_transaction():
        context.run_migrations()

# Run the async migration process
asyncio.run(run_migrations())

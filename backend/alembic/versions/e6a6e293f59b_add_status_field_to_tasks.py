"""Add status field to tasks

Revision ID: e6a6e293f59b
Revises: 7929874f5973
Create Date: 2025-04-04 12:05:38.873755

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
import enum


# revision identifiers, used by Alembic.
revision: str = 'e6a6e293f59b'
down_revision: Union[str, None] = '7929874f5973'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


# Define the Enum type for PostgreSQL
class TaskStatus(enum.Enum):
    pending = "pending"
    in_progress = "in_progress"
    done = "done"


def upgrade() -> None:
    """Upgrade schema."""
    # Create the Enum type in PostgreSQL
    task_status_enum = sa.Enum('pending', 'in_progress', 'done', name='taskstatus')
    task_status_enum.create(op.get_bind(), checkfirst=True)

    # Add the status column with a default value
    op.add_column('tasks', sa.Column('status', task_status_enum, nullable=False, server_default='pending'))


def downgrade() -> None:
    """Downgrade schema."""
    # Drop the column and Enum type during downgrade
    op.drop_column('tasks', 'status')
    sa.Enum('pending', 'in_progress', 'done', name='taskstatus').drop(op.get_bind(), checkfirst=True)

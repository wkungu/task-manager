from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.services.auth import get_current_user

router = APIRouter()

# Create a task (Only Authenticated Users)
@router.post("/", response_model=TaskResponse)
async def create_task(
    task_data: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_task = Task(
        title=task_data.title,
        description=task_data.description,
        user_id=current_user.id  # Assign the task to the logged-in user
    )
    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)
    return new_task

# Get all tasks (Only the User's Own Tasks)
@router.get("/", response_model=list[TaskResponse])
async def get_tasks(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Task).where(Task.user_id == current_user.id))  # Filter by user_id
    tasks = result.scalars().all()
    return tasks

# Get a specific task (Only if Owned by User)
@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Task).where(Task.id == task_id, Task.user_id == current_user.id))  # Restrict access
    task = result.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or not authorized")
    return task

# Update a task (Only if Owned by User)
@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Task).where(Task.id == task_id, Task.user_id == current_user.id))
    task = result.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or not authorized")

    task.title = task_data.title or task.title
    task.description = task_data.description or task.description
    await db.commit()
    await db.refresh(task)
    return task

# Delete a task (Only if Owned by User)
@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Task).where(Task.id == task_id, Task.user_id == current_user.id))
    task = result.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found or not authorized")

    await db.delete(task)
    await db.commit()
    return {"message": "Task deleted successfully"}

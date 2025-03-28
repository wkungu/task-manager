from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse

router = APIRouter()

# ✅ Create a task
@router.post("/", response_model=TaskResponse)
async def create_task(task_data: TaskCreate, db: AsyncSession = Depends(get_db)):
    new_task = Task(title=task_data.title, description=task_data.description)
    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)
    return new_task

# ✅ Get all tasks
@router.get("/", response_model=list[TaskResponse])
async def get_tasks(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Task))
    tasks = result.scalars().all()
    return tasks

# ✅ Get a task by ID
@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(task_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

# ✅ Update a task
@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(task_id: int, task_data: TaskUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    task.title = task_data.title or task.title
    task.description = task_data.description or task.description
    await db.commit()
    await db.refresh(task)
    return task

# ✅ Delete a task
@router.delete("/{task_id}")
async def delete_task(task_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    await db.delete(task)
    await db.commit()
    return {"message": "Task deleted successfully"}

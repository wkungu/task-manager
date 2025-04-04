from pydantic import BaseModel

class TaskBase(BaseModel):
    title: str
    status: str | None = None
    description: str | None = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    title: str | None = None
    description: str | None = None

class TaskResponse(TaskBase):
    id: int

    class Config:
        from_attributes = True

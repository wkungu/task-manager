from fastapi import FastAPI
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.future import select
from passlib.context import CryptContext

from app.api.routes import auth, tasks
from app.core.database import init_db, get_db
from app.models.user import User
from app.models.task import Task

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Include authentication and task management routes
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["Tasks"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.on_event("startup")
async def startup():
    """Initialize the database and seed data"""
    await init_db()

    async for db in get_db():
        # Check if a default user exists
        result = await db.execute(select(User))
        user = result.scalars().first()  # Extract first user
        
        if not user:
            default_user = User(
                username="admin",
                email="admin@example.com",
                password_hash=pwd_context.hash("admin123"),  # Hash the password
            )
            db.add(default_user)
            await db.commit()
            print("Default user created: admin@example.com / admin123")

        # Check if any tasks exist
        result = await db.execute(select(Task))
        task = result.scalars().first()
        
        if not task:
            default_task = Task(
                title="Welcome Task",
                description="This is your first task!",
                user_id = 1,
            )
            db.add(default_task)
            await db.commit()
            print("Default task created: Welcome Task")

        break  # Exit the loop after using one session

@app.get("/")
async def read_root():
    return {"message": "Welcome to the Task Management API"}

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession  # ✅ Use AsyncSession
from sqlalchemy.future import select  # ✅ Required for async queries
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.services.auth import hash_password, verify_password, create_access_token

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):  # ✅ Use AsyncSession
    # ✅ Use async query
    result = await db.execute(select(User).filter(User.email == user_data.email))
    existing_user = result.scalars().first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user_data.password)
    new_user = User(username=user_data.username, email=user_data.email, password_hash=hashed_password)
    
    db.add(new_user)
    await db.commit()  # ✅ Use `await`
    await db.refresh(new_user)  # ✅ Use `await`
    
    return new_user

@router.post("/login")
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):  # ✅ Use AsyncSession
    # ✅ Use async query
    result = await db.execute(select(User).filter(User.email == user_data.email))
    user = result.scalars().first()

    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

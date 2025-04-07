from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.core.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserResponse, UpdateUserProfile, UpdatePassword
from app.services.auth import hash_password, verify_password, create_access_token
from app.services.auth import get_current_user

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    
    result = await db.execute(select(User).filter(User.email == user_data.email))
    existing_user = result.scalars().first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user_data.password)
    new_user = User(username=user_data.username, email=user_data.email, password_hash=hashed_password)
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return new_user

@router.post("/login")
async def login(user_data: UserLogin, db: AsyncSession = Depends(get_db)):
    
    result = await db.execute(select(User).filter(User.email == user_data.email))
    user = result.scalars().first()

    if not user or not verify_password(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/users/{user_id}/profile", response_model=UserResponse)
async def update_user_profile(
    user_id: int,
    data: UpdateUserProfile,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # restrict updates to only the current logged-in user
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this user")

    # Check for email conflict with other users
    result = await db.execute(select(User).filter(User.email == data.email, User.id != user_id))
    email_conflict = result.scalars().first()

    if email_conflict:
        raise HTTPException(status_code=400, detail="Email already in use by another account")

    user.username = data.username
    user.email = data.email

    await db.commit()
    await db.refresh(user)

    return user


@router.put("/users/{user_id}/password")
async def update_user_password(
    user_id: int,
    data: UpdatePassword,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(User).filter(User.id == user_id))
    user = result.scalars().first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # restrict updates to only the current logged-in user
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to modify this user")

    if not verify_password(data.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    user.password_hash = hash_password(data.new_password)
    await db.commit()

    return {"message": "Password updated successfully"}

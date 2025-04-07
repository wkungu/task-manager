from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3)
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    username: str = Field(..., min_length=3)
    email: EmailStr

    class Config:
        from_attributes = True

class UpdateUserProfile(BaseModel):
    username: str = Field(..., min_length=3)
    email: EmailStr

class UpdatePassword(BaseModel):
    current_password: str = Field(..., min_length=4)
    new_password: str = Field(..., min_length=4)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.models.users import User as UserModel
from backend.schema import UserCreate, User as UserSchema
from backend.db_depends import get_async_db
from backend.auth import hash_password

router = APIRouter(prefix='/users', tags=['users'])


@router.post('/', response_model=UserSchema, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_async_db)):
    '''
    Signing up new user
    '''

    # checking that email is unique
    result_email = await db.scalars(select(UserModel).where(UserModel.email == user.email))
    if result_email.first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Email already exists')

    # creating onject user
    db_user = UserModel(
        email = user.email,
        hashed_password = hash_password(user.password),
        full_name = user.full_name
    )

    db.add(db_user)
    await db.commit()
    return db_user

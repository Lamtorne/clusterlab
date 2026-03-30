from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta, timezone
import jwt
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.models.users import User as UserModel
from backend.config import SECRET_KEY, ALGORITHM
from backend.db_depends import get_async_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")  # объект, хэширующий пароль

ACCESS_TOKEN_EXPIRE_MINUTES = 30
oauth2_scheme = OAuth2PasswordBearer(tokenUrl='users/token')


def hash_password(password: str) -> str:
    '''
    password to hash using bcrypt algorithm
    '''
    return pwd_context.hash(password)


def verify_password(password: str, hash_password: str) -> bool:
    '''
    verifying password through using password hash
    '''
    return pwd_context.verify(password, hash_password)


def create_access_token(data: dict):
    '''
    creating JWT
    '''

    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({
        'exp': expire, 'token_type': 'refresh'
    })
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(token: str = Depends(oauth2_scheme),
                           db: AsyncSession = Depends(get_async_db)):
    """
    Проверяет JWT и возвращает пользователя из базы.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise credentials_exception
    result = await db.scalars(
        select(UserModel).where(UserModel.email == email, UserModel.is_active == True))
    user = result.first()
    if user is None:
        raise credentials_exception
    return user

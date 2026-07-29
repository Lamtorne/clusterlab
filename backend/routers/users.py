from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi.security import OAuth2PasswordRequestForm

from backend.models.users import User as UserModel
from backend.schema import UserCreate, User as UserSchema
from backend.db_depends import get_async_db
from backend.auth import hash_password, verify_password, create_access_token, get_current_user
from sqlalchemy import func
from backend.models.fields import Field as FieldModel

router = APIRouter(prefix='/users', tags=['users'])

async def get_used_area(user_id: int, db: AsyncSession) -> float:
    result = await db.execute(
        select(func.coalesce(func.sum(FieldModel.area), 0))
        .where(FieldModel.user_id == user_id, FieldModel.status != "Ошибка")
    )
    return float(result.scalar())

@router.post('/', response_model=UserSchema, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, db: AsyncSession = Depends(get_async_db)):
    '''
    Signing up new user
    '''

    # checking that email is unique
    result_email = await db.scalars(select(UserModel).where(UserModel.email == user.email))
    if result_email.first():
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail='Email already exists')
    print(f"DEBUG: Registrating {user.email} with password length: {len(user.password)}")

    # creating onject user
    db_user = UserModel(
        email=user.email,
        hashed_password=hash_password(user.password),
        full_name=user.full_name
    )

    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


@router.post('/token')
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_async_db)):
    '''
    auth user and return email, name, id
    '''
    result = await db.scalars(select(UserModel).where(UserModel.email == form_data.username))
    user = result.first()

    # проверка существования и пароля
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный email или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token_data = {
        "sub": user.email,
        "id": user.id,
        "full_name": user.full_name,
        "tariff": user.tariff
    }

    access_token = create_access_token(data=token_data)

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_name": user.full_name
    }


@router.get('/personal_info')
async def get_personal_info(
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_async_db),
):
    if current_user.tariff == 'test':
        tier = 'Тестовый'
    elif current_user.tariff == 'pro':
        tier = 'Про'
    else:
        tier = 'Стандарт'

    used_area = await get_used_area(current_user.id, db)

    return {
        "name": current_user.full_name,
        "tier": tier,
        "expireDate": current_user.tariff_ends_at.strftime("%d.%m.%Y"),
        "usedHectares": used_area,
        "totalHectares": float(current_user.max_area)
    }
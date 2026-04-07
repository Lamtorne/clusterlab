from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime
from backend.models.fields import Field as FieldModel
from backend.schema import FieldCreate, Field as FieldSchema
from backend.db_depends import get_async_db
from backend.auth import get_current_user

router = APIRouter(prefix='/fields', tags=['fields'])

@router.post('/analyze', response_model=FieldSchema)
async def create_field(
    payload: FieldCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_async_db),
    current_user = Depends(get_current_user)
):
    calculated_area = round(((2*payload.radius) ** 2) / 10000, 2)

    if datetime.now() > current_user.tariff_ends_at:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail='Срок подписки завершён'
        )
    if current_user.current_area + field_area > current_user.max_area:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail='Доступная площадь для анализа исчерпана'
        )
    new_field = FieldModel(
        latitude=payload.latitude,
        longitude=payload.longitude,
        radius=payload.radius,
        area=calculated_area,
        culture=payload.culture,
        region=payload.region,
        agrochem=payload.agrochem,
        user_id=current_user.id,
        status="В обработке"
    )

    current_user.current_area += calculated_area

    db.add(new_field)
    await db.commit()
    try:
        await db.commit()
        await db.refresh(new_field)  # Исправлено: db.refresh
    except Exception as e:
        await db.rollback()
        raise HTTPException(500, detail=f"Ошибка БД: {str(e)}")

    # Запускаем фоновую задачу (пока заглушка)
    # background_tasks.add_task(mock_analysis_process, new_field.id)

    return new_field

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from backend.models.fields import Field as FieldModel
from backend.schema import FieldCreate, Field as FieldSchema
from backend.db_depends import get_async_db
from backend.auth import get_current_user

router = APIRouter(prefic='/fields', tags=['fields'])

@router.post('/analyze', response_model=FieldSchema)
async def create_field(
    payload: FieldCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_async_db),
    current_user = Depends(get_current_user)
):
    calculate_area = round((2*payload.radius) ** 2, 1)
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

    db.add(new_field)
    await db.commit()
    await dr.refresh(new_field)

    # Запускаем фоновую задачу (пока заглушка)
    background_tasks.add_task(mock_analysis_process, new_field.id)

    return new_field

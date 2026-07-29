from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import asyncio
from datetime import datetime
from decimal import Decimal

from backend.models.fields import Field as FieldModel
from backend.schema import FieldCreate, Field as FieldSchema
from backend.db_depends import get_async_db
from backend.auth import get_current_user
from backend.services.analysis import run_clustering_logic
from backend.database import async_session_maker
from backend.models.analysis_result import AnalysisResult as AnalysisResultModel
from fastapi.responses import HTMLResponse
from backend.services.analysis import build_cluster_map_html

CLUSTER_COLORS = ["#3C3126", "#EC6A40", "#6B9B7A", "#E6E1C5", "#7D8C6B", "#A65D57"]



router = APIRouter(prefix='/fields', tags=['fields'])

@router.get("/{field_id}/status")
async def get_field_status(
    field_id: int,
    db: AsyncSession = Depends(get_async_db)
):
    result = await db.execute(select(FieldModel).where(FieldModel.id == field_id))
    field = result.scalar_one_or_none()
    if not field:
        raise HTTPException(404, detail="Поле не найдено")
    return {"status": field.status}

@router.post('/analyze', response_model=FieldSchema)
async def create_field(
        payload: FieldCreate,
        background_tasks: BackgroundTasks,
        db: AsyncSession = Depends(get_async_db),
        current_user=Depends(get_current_user)
):
    calculated_area_float = ((2*payload.radius) ** 2) / 10000
    calculated_area = Decimal(str(round(calculated_area_float, 2)))

    if datetime.now() > current_user.tariff_ends_at:
        raise HTTPException(403, detail='Срок подписки завершён')

    if current_user.current_area + calculated_area > current_user.max_area:
        raise HTTPException(400, detail='Площадь для анализа закончилась')

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

    try:
        await db.commit()
        await db.refresh(new_field)
    except Exception as e:
        await db.rollback()
        print(f"ERROR: {e}")
        raise HTTPException(500, detail='Ошибка сохранения в БД')

    background_tasks.add_task(run_clustering_logic, new_field.id, async_session_maker)
    return new_field

@router.get('/my_fields', response_model=list[FieldSchema])
async def get_user_fields(db: AsyncSession = Depends(get_async_db), current_user = Depends(get_current_user)):
    result = await db.scalars(select(FieldModel).where(FieldModel.user_id == current_user.id))
    return result.all()

@router.get("/{field_id}/result")
async def get_field_result(
    field_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_user)
):
    result = await db.execute(
        select(FieldModel).where(
            FieldModel.id == field_id,
            FieldModel.user_id == current_user.id
        )
    )
    field = result.scalar_one_or_none()
    if not field:
        raise HTTPException(404, detail="Поле не найдено")

    if field.status != "Готово":
        return {"status": field.status, "field": None, "result": None}

    analysis_result = await db.execute(
        select(AnalysisResultModel).where(AnalysisResultModel.field_id == field_id)
    )
    analysis = analysis_result.scalar_one_or_none()

    return {
        "status": field.status,
        "field": {
            "culture": field.culture,
            "region": field.region,
            "area": float(field.area),
            "latitude": float(field.latitude),
            "longitude": float(field.longitude),
            "radius": float(field.radius),
        },
        "result": analysis.cluster_data if analysis else None,
    }

@router.get("/{field_id}/map", response_class=HTMLResponse)
async def get_field_map(
    field_id: int,
    db: AsyncSession = Depends(get_async_db),
    current_user=Depends(get_current_user),
):
    result = await db.execute(
        select(FieldModel).where(FieldModel.id == field_id, FieldModel.user_id == current_user.id)
    )
    field = result.scalar_one_or_none()
    if not field or field.status != "Готово":
        raise HTTPException(404, detail="Карта недоступна")

    analysis_result = await db.execute(
        select(AnalysisResultModel).where(AnalysisResultModel.field_id == field_id)
    )
    analysis = analysis_result.scalar_one_or_none()
    if not analysis:
        raise HTTPException(404, detail="Результат анализа не найден")

    html = await asyncio.to_thread(
        build_cluster_map_html,
        field.latitude,
        field.longitude,
        field.radius,
        analysis.cluster_data["map_data"],
        CLUSTER_COLORS,
    )
    return HTMLResponse(content=html)
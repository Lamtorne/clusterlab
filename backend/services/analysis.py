from sqlalchemy import update
from backend.models.fields import Field as FieldModel


async def run_clustering_logic(field_id: int, db_factory):
    async with db_factory() as db:
        try:
            result = await db.execute(select(FieldModel).where(FieldModel.id == field_id))
            field_info = result.scalar().first()

            # --- ЗДЕСЬ ТВОЯ КЛАСТЕРИЗАЦИЯ ---
            # Например: данные = получение_снимков(field.latitude, field.longitude)
            # кластеры = твой_SEM_алгоритм.fit(данные)
            # сохранение_результатов_в_таблицу(field_id, кластеры)

            import asyncio
            await asyncio.sleep(10)

            await db.execute(
                update(FieldModel)
                .where(FieldModel.id == field_id)
                .values(status="Готово")
            )
            await db.commit()

        except Exception as e:
            await db.rollback()
            print(f"Ошибка в фоновом анализе поля {field_id}: {e}")

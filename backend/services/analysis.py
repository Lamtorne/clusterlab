# from sqlalchemy import update, select
# from backend.models.fields import Field as FieldModel
# from backend.models.analysis_result import AnalysisResult as AnalysisResultModel
# import rasterio
# import numpy as np
# from sklearn.metrics import silhouette_score
# import pandas as pd
# from sklearn.cluster import KMeans, BisectingKMeans, Birch, MiniBatchKMeans
# from sklearn.mixture import GaussianMixture
# import json
# from sklearn.preprocessing import StandardScaler
# import ee
# import requests
# import os
#
# ee.Initialize(project='clusterlab-487108')
#
#
# # def download_field_data(field_id, user_id, lat, lon, radius):
# #     point = ee.Geometry.Point([lon, lat])
# #     region = point.buffer(radius).bounds()
# #
# #     image = (ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
# #              .filterBounds(region)
# #              .filterDate('2025-01-01', '2026-04-09')
# #              .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 10))
# #              .median()
# #              .clip(region)
# #              .select(['B2', 'B3', 'B4', 'B8', 'B11', 'B12']))
# #
# #     url = image.getDownloadURL({
# #         'scale': 10,
# #         'format': 'GEO_TIFF',
# #         'region': region
# #     })
# #
# #     file_path = f"backend/storage/field_{field_id}_{user_id}.tif"
# #     os.makedirs("backend/storage", exist_ok=True)
# #
# #     response = requests.get(url)
# #     if response.status_code == 200:
# #         with open(file_path, 'wb') as f:
# #             f.write(response.content)
# #         print(f"--- [GEE] Снимок сохранен: {file_path} ---") # Вывод в консоль
# #         return file_path
# #     else:
# #         raise Exception(f"Ошибка GEE: {response.status_code}")
#
# def download_field_data(field_id, user_id, lat, lon, radius):
#     # Убеждаемся, что радиус достаточен для формирования геометрии (минимум 100м)
#     # Иначе на 10 метрах Sentinel выдаст ошибку "Invalid Geometry"
#     safe_radius = max(float(radius), 100.0)
#
#     point = ee.Geometry.Point([float(lon), float(lat)])
#     # Указываем проекцию явно, чтобы буфер строился корректно
#     region = point.buffer(safe_radius).bounds(maxError=1)
#
#     print(f"--- [GEE] Запрос снимка: lat={lat}, lon={lon}, radius={safe_radius}m ---")
#
#     # Используем коллекцию Sentinel-2
#     image = (ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
#              .filterBounds(region)
#              .filterDate('2024-05-01', '2026-04-09')  # Расширил диапазон для поиска лучшего кадра
#              .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 15))
#              .median()
#              .clip(region)
#              .select(['B2', 'B3', 'B4', 'B8', 'B11', 'B12']))
#
#     try:
#         url = image.getDownloadURL({
#             'scale': 10,  # Разрешение Sentinel-2
#             'format': 'GEO_TIFF',
#             'region': region
#         })
#     except Exception as e:
#         print(f"!!! [GEE ERROR] Не удалось получить URL (возможно, нет снимков): {e}")
#         raise
#
#     file_path = f"backend/storage/field_{field_id}_{user_id}.tif"
#     os.makedirs("backend/storage", exist_ok=True)
#
#     response = requests.get(url)
#     if response.status_code == 200:
#         with open(file_path, 'wb') as f:
#             f.write(response.content)
#         print(f"--- [GEE] Снимок сохранен: {file_path} ---")
#         return file_path
#     else:
#         raise Exception(f"Ошибка скачивания GEE: {response.status_code} - {response.text}")
#
# # def best_cluster_algo(path):
# #     with rasterio.open(path) as src:
# #         data_raw = src.read().astype('float32')
# #         pixels_flat = data_raw.transpose(1, 2, 0).reshape(-1, 6)
# #
# #         sc = StandardScaler()
# #         data_scaled = sc.fit_transform(pixels_flat)
# #
# #         idx = np.random.choice(data_scaled.shape[0], 10000, replace=False)
# #         data_sample = data_scaled[idx]
# #
# #         results = []
# #
# #         # Тестируем алгоритмы с фиксированным числом кластеров
# #         n_range = [i for i in range(3, 13)]
# #
# #         fixed_methods = {
# #             'KMeans': lambda n: KMeans(n_clusters=n, random_state=42, n_init=5),
# #             'BisectingKMeans': lambda n: BisectingKMeans(n_clusters=n, random_state=42),
# #             'GMM': lambda n: GaussianMixture(n_components=n, random_state=42),
# #             'Birch': lambda n: Birch(n_clusters=n),
# #             'MiniBatchKMeans': lambda n: MiniBatchKMeans(n_clusters=n, random_state=42, n_init=3)
# #         }
# #
# #         for n in n_range:
# #             for name, method_func in fixed_methods.items():
# #                 model = method_func(n)
# #                 labels = model.fit_predict(data_sample)
# #                 score = silhouette_score(data_sample, labels)
# #                 results.append({
# #                     'method': name,
# #                     'n_clusters': n,
# #                     'silhouette_score': score
# #                 })
# #
# #         df = pd.DataFrame(results)
# #
# #         best_row = df.loc[df['silhouette_score'].idxmax()]
# #
# #         return best_row['method'], best_row['n_clusters'], round(best_row['silhouette_score'], 2)
#
# def best_cluster_algo(path):
#     with rasterio.open(path) as src:
#         data_raw = src.read().astype('float32')
#         pixels_flat = data_raw.transpose(1, 2, 0).reshape(-1, 6)
#
#         # Убираем возможные NaN (бывает на краях снимка)
#         pixels_flat = pixels_flat[~np.isnan(pixels_flat).any(axis=1)]
#
#         sc = StandardScaler()
#         data_scaled = sc.fit_transform(pixels_flat)
#
#         # Безопасный выбор размера выборки
#         sample_size = min(len(data_scaled), 10000)
#         idx = np.random.choice(data_scaled.shape[0], sample_size, replace=False)
#         data_sample = data_scaled[idx]
#
#         results = []
#         # Если поле совсем крошечное, уменьшаем диапазон кластеров
#         max_clusters = min(13, len(data_sample))
#         n_range = [i for i in range(2, max_clusters)]
#
#         fixed_methods = {
#             'KMeans': lambda n: KMeans(n_clusters=n, random_state=42, n_init=5),
#             'BisectingKMeans': lambda n: BisectingKMeans(n_clusters=n, random_state=42),
#             'GMM': lambda n: GaussianMixture(n_components=n, random_state=42),
#             'MiniBatchKMeans': lambda n: MiniBatchKMeans(n_clusters=n, random_state=42, n_init=3)
#         }
#
#         for n in n_range:
#             for name, method_func in fixed_methods.items():
#                 try:
#                     model = method_func(n)
#                     labels = model.fit_predict(data_sample)
#                     score = silhouette_score(data_sample, labels)
#                     results.append({'method': name, 'n_clusters': n, 'silhouette_score': score})
#                 except:
#                     continue # Пропускаем, если алгоритм не сошелся на малых данных
#
#         df = pd.DataFrame(results)
#         if df.empty:
#             return 'KMeans', 3, 0.0 # Заглушка, если ничего не подошло
#
#         best_row = df.loc[df['silhouette_score'].idxmax()]
#         return best_row['method'], int(best_row['n_clusters']), round(float(best_row['silhouette_score']), 2)
#
#
#
#
# async def run_clustering_logic(field_id: int, db_factory):
#     print(f"\n[TASK] Начинаем анализ поля ID: {field_id}")
#     async with db_factory() as db:
#         try:
#             result = await db.execute(select(FieldModel).where(FieldModel.id == field_id))
#             field_info = result.scalar_one()
#             print(f"[TASK] Данные из БД получены для поля: {field_id}")
#
#             path_tif = download_field_data(
#                 field_id=field_info.id,
#                 user_id=field_info.user_id,
#                 lat=field_info.latitude,
#                 lon=field_info.longitude,
#                 radius=field_info.radius
#             )
#             print(f"[TASK] TIF файл готов: {path_tif}")
#
#             with rasterio.open(path_tif) as src:
#                 data_raw = src.read().astype('float32')
#                 bands, height, width = data_raw.shape
#                 pixels_flat = data_raw.transpose(1, 2, 0).reshape(-1, bands)
#
#                 sc = StandardScaler()
#                 data_scaled = sc.fit_transform(pixels_flat)
#
#             best_name, n_clusters, score = best_cluster_algo(path_tif)
#             print(f"[TASK] Алгоритм выбран: {best_name}, силуэт: {score}")
#
#             if best_name == 'KMeans':
#                 final_model = KMeans(n_clusters=n_clusters, random_state=42)
#             elif best_name == 'BisectingKMeans':
#                 final_model = BisectingKMeans(n_clusters=n_clusters, random_state=42)
#             elif best_name == 'GMM':
#                 final_model = GaussianMixture(n_components=n_clusters, random_state=42)
#             elif best_name == 'Birch':
#                 final_model = Birch(n_clusters=n_clusters)
#             else:
#                 final_model = MiniBatchKMeans(n_clusters=n_clusters, random_state=42)
#
#             labels = final_model.fit_predict(data_scaled)
#
#             analysis_data = {
#                 "field_id": field_id,
#                 "algorithm": best_name,
#                 "n_clusters": int(n_clusters),
#                 "silhouette_score": float(score),
#                 "map_data": {
#                     "width": width,
#                     "height": height,
#                     "labels": labels.tolist()
#                 }
#             }
#
#
#             new_result = AnalysisResultModel(field_id=field_id, cluster_data=analysis_data, silhouette_score=score)
#             db.add(new_result)
#
#             await db.execute(
#                 update(FieldModel)
#                 .where(FieldModel.id == field_id)
#                 .values(status="Готово")
#             )
#             await db.commit()
#             print(f"[TASK] УСПЕХ: Анализ поля {field_id} сохранен в БД.\n")
#
#
#         except Exception as e:
#
#             await db.rollback()
#
#             print(f"!!! [TASK ERROR] Поле {field_id}: {e}")
#
#
#             await db.execute(
#
#                 update(FieldModel).where(FieldModel.id == field_id).values(status="Ошибка")
#
#             )
#
#             await db.commit()

# импортируем библиотеки, в т.ч. Sentinel
import numpy as np
import os
from sentinelhub import (
    SHConfig, DataCollection, SentinelHubRequest,
    BBox, CRS, MimeType, bbox_to_dimensions
)

from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

def get_sentinel_config():
    config = SHConfig()
    config.sh_client_id = os.getenv("SH_CLIENT_ID")
    config.sh_client_secret = os.getenv("SH_CLIENT_SECRET")
    config.sh_token_url = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"
    config.sh_base_url = "https://sh.dataspace.copernicus.eu"
    return config


EVALSCRIPT_BANDS = """
//VERSION=3
function setup() {
  return {
    input: ["B02", "B03", "B04", "B08", "B11", "B12"],
    output: { bands: 6, sampleType: "FLOAT32" }
  };
}
function evaluatePixel(sample) {
  return [sample.B02, sample.B03, sample.B04, sample.B08, sample.B11, sample.B12];
}
"""


def download_field_data(lat, lon, radius):
    """
    Синхронная функция — получает мультиспектральные данные Sentinel-2
    через Sentinel Hub API и сразу возвращает numpy-массив, без сохранения на диск.
    Вызывать только через asyncio.to_thread.
    """
    config = get_sentinel_config()
    safe_radius = max(float(radius), 100.0)

    delta = safe_radius / 111000  # перевод метров в градусы (приблизительно)
    bbox = BBox(
        bbox=[lon - delta, lat - delta, lon + delta, lat + delta],
        crs=CRS.WGS84
    )
    size = bbox_to_dimensions(bbox, resolution=10)

    print(f"--- [Sentinel Hub] Запрос снимка: lat={lat}, lon={lon}, radius={safe_radius}m, size={size} ---")

    request = SentinelHubRequest(
        evalscript=EVALSCRIPT_BANDS,
        input_data=[
            SentinelHubRequest.input_data(
                data_collection=DataCollection.SENTINEL2_L2A.define_from(
                    "s2l2a", service_url=config.sh_base_url
                ),
                time_interval=('2024-05-01', '2026-04-09'),
                mosaicking_order='leastCC',
            )
        ],
        responses=[
            SentinelHubRequest.output_response('default', MimeType.TIFF)
        ],
        bbox=bbox,
        size=size,
        config=config,
    )

    data = request.get_data()

    if not data or data[0] is None:
        raise ValueError(
            "Sentinel Hub не вернул данные для этой области "
            "(нет снимков за период, либо регион вне покрытия)"
        )

    array = data[0]  # numpy массив формы (height, width, 6)
    print(f"--- [Sentinel Hub] Данные получены: shape={array.shape} ---")
    return array


async def run_clustering_logic(field_id: int, db_factory):
    print(f"\n[TASK] Начинаем анализ поля ID: {field_id}")
    async with db_factory() as db:
        try:
            result = await db.execute(select(FieldModel).where(FieldModel.id == field_id))
            field_info = result.scalar_one()
            print(f"[TASK] Данные из БД получены для поля: {field_id}")

            # --- Шаг 1: получение данных со спутника ---
            array = await asyncio.to_thread(
                download_field_data,
                field_info.latitude,
                field_info.longitude,
                field_info.radius,
            )
            print(f"[TASK] Массив получен: shape={array.shape}")

            # --- Дальше кластеризация — добавим на следующем шаге ---
            await db.execute(
                update(FieldModel)
                .where(FieldModel.id == field_id)
                .values(status="Данные получены")
            )
            await db.commit()
            print(f"[TASK] УСПЕХ: данные для поля {field_id} получены.\n")

        except Exception as e:
            await db.rollback()
            print(f"!!! [TASK ERROR] Поле {field_id}: {e}")
            await db.execute(
                update(FieldModel).where(FieldModel.id == field_id).values(status="Ошибка")
            )
            await db.commit()
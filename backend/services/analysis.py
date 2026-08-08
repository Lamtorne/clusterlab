import asyncio
import os
import numpy as np
import pandas as pd
from pathlib import Path

from dotenv import load_dotenv
from sqlalchemy import select, update

from sentinelhub import (
    SHConfig, DataCollection, SentinelHubRequest,
    BBox, CRS, MimeType, bbox_to_dimensions
)
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans, BisectingKMeans, MiniBatchKMeans
from sklearn.mixture import GaussianMixture
from sklearn.metrics import silhouette_score

from backend.models.fields import Field as FieldModel
from backend.models.analysis_result import AnalysisResult as AnalysisResultModel
from backend.models.field_recommendation import FieldRecommendation as FieldRecommendationModel
import folium
from shapely.geometry import shape, mapping
from shapely.ops import unary_union
from rasterio import features as rio_features
from rasterio import transform as rio_transform
import re
from gigachat import GigaChat
import json

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

    # Приводим к float на случай, если из БД пришёл Decimal (столбцы Numeric)
    lat = float(lat)
    lon = float(lon)
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


def best_cluster_algo(data_scaled: np.ndarray):
    """
    Принимает уже отмасштабированный массив пикселей (N, bands).
    Перебирает несколько алгоритмов и чисел кластеров, возвращает лучший вариант.
    """
    sample_size = min(len(data_scaled), 10000)
    idx = np.random.choice(data_scaled.shape[0], sample_size, replace=False)
    data_sample = data_scaled[idx]

    results = []
    max_clusters = min(13, len(data_sample))
    n_range = range(2, max_clusters)

    fixed_methods = {
        'KMeans': lambda n: KMeans(n_clusters=n, random_state=42, n_init=5),
        'BisectingKMeans': lambda n: BisectingKMeans(n_clusters=n, random_state=42),
        'GMM': lambda n: GaussianMixture(n_components=n, random_state=42),
        'MiniBatchKMeans': lambda n: MiniBatchKMeans(n_clusters=n, random_state=42, n_init=3),
    }

    for n in n_range:
        for name, method_func in fixed_methods.items():
            try:
                model = method_func(n)
                labels = model.fit_predict(data_sample)
                score = silhouette_score(data_sample, labels)
                results.append({'method': name, 'n_clusters': n, 'silhouette_score': score})
            except Exception:
                continue

    df = pd.DataFrame(results)
    if df.empty:
        return 'KMeans', 3, 0.0

    best_row = df.loc[df['silhouette_score'].idxmax()]
    return best_row['method'], int(best_row['n_clusters']), round(float(best_row['silhouette_score']), 2)


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

            height, width, bands = array.shape
            pixels_flat = array.reshape(-1, bands)

            # Убираем возможные NaN на краях
            pixels_flat = pixels_flat[~np.isnan(pixels_flat).any(axis=1)]

            sc = StandardScaler()
            data_scaled = sc.fit_transform(pixels_flat)

            # --- Шаг 2: подбор лучшего алгоритма и кластеризация ---
            best_name, n_clusters, score = await asyncio.to_thread(best_cluster_algo, data_scaled)
            print(f"[TASK] Алгоритм выбран: {best_name}, силуэт: {score}")

            def fit_final_model():
                if best_name == 'KMeans':
                    model = KMeans(n_clusters=n_clusters, random_state=42)
                elif best_name == 'BisectingKMeans':
                    model = BisectingKMeans(n_clusters=n_clusters, random_state=42)
                elif best_name == 'GMM':
                    model = GaussianMixture(n_components=n_clusters, random_state=42)
                else:
                    model = MiniBatchKMeans(n_clusters=n_clusters, random_state=42)
                return model.fit_predict(data_scaled)

            labels = await asyncio.to_thread(fit_final_model)
            print(f"[TASK] Кластеризация завершена, меток: {len(labels)}")

            # --- Шаг 3: характеристики кластеров ---
            cluster_stats = compute_cluster_stats(pixels_flat, labels, n_clusters)
            print(f"[TASK] Статистика по кластерам посчитана: {cluster_stats}")

            # --- Шаг 4: рекомендации от LLM ---
            zones = []
            try:
                zones = await get_llm_recommendations(field_info, cluster_stats)
                print(f"[TASK] Рекомендации получены: {len(zones)} зон")
            except Exception as llm_error:
                print(f"!!! [LLM ERROR] Не удалось получить рекомендации: {llm_error}")

            analysis_data = {
                "field_id": field_id,
                "algorithm": best_name,
                "n_clusters": int(n_clusters),
                "silhouette_score": float(score),
                "cluster_stats": cluster_stats,
                "map_data": {
                    "width": width,
                    "height": height,
                    "labels": labels.tolist()
                }
            }

            new_result = AnalysisResultModel(
                field_id=field_id,
                cluster_data=analysis_data,
                silhouette_score=score
            )
            db.add(new_result)

            if zones:
                # сортируем по номеру кластера — гарантирует совпадение индекса списка с cluster_id
                zones_sorted = sorted(zones, key=lambda z: z["cluster"])
                short_recs = [z.get("short_rec", "") for z in zones_sorted]

                new_recommendation = FieldRecommendationModel(
                    field_id=field_id,
                    zones_rec=zones_sorted,
                    short_zone_rec=short_recs,
                )
                db.add(new_recommendation)
                print(f"[TASK] Рекомендации сохранены: short_zone_rec={short_recs}")

            await db.execute(
                update(FieldModel).where(FieldModel.id == field_id).values(status="Готово")
            )
            await db.commit()
            print(f"[TASK] УСПЕХ: Анализ поля {field_id} сохранён в БД.\n")

        except Exception as e:
            await db.rollback()
            print(f"!!! [TASK ERROR] Поле {field_id}: {e}")
            await db.execute(
                update(FieldModel).where(FieldModel.id == field_id).values(status="Ошибка")
            )
            await db.commit()

def get_zoom_for_radius(radius: float) -> int:
    if radius <= 300:
        return 18
    elif radius <= 800:
        return 17
    elif radius <= 1500:
        return 16
    return 15

def build_cluster_polygons(lat, lon, radius, map_data: dict) -> dict[int, "shapely.geometry.base.BaseGeometry"]:
    """Векторизация растровой сетки кластеров в полигоны — переиспользуется картой и экспортом."""
    lat = float(lat)
    lon = float(lon)
    safe_radius = max(float(radius), 100.0)
    delta = safe_radius / 111000

    west, south = lon - delta, lat - delta
    east, north = lon + delta, lat + delta

    width = map_data["width"]
    height = map_data["height"]
    labels = np.array(map_data["labels"], dtype="int16").reshape(height, width)

    affine = rio_transform.from_bounds(west, south, east, north, width, height)
    shapes_gen = rio_features.shapes(labels, transform=affine)

    polygons_by_cluster: dict[int, list] = {}
    for geom, value in shapes_gen:
        cluster_id = int(value)
        polygons_by_cluster.setdefault(cluster_id, []).append(shape(geom))

    return {cid: unary_union(polys) for cid, polys in polygons_by_cluster.items()}


def build_cluster_map_html(lat, lon, radius, map_data: dict, cluster_colors: list[str], short_recs: list[str] | None = None) -> str:
    lat = float(lat)
    lon = float(lon)

    polygons_by_cluster = build_cluster_polygons(lat, lon, radius, map_data)

    geo_features = []
    for cluster_id, geom in polygons_by_cluster.items():
        short_rec = short_recs[cluster_id] if short_recs and cluster_id < len(short_recs) else "Нет данных"
        geo_features.append({
            "type": "Feature",
            "properties": {
                "cluster_label": f"Зона {cluster_id + 1}",
                "color": cluster_colors[cluster_id % len(cluster_colors)],
                "short_rec": short_rec,
            },
            "geometry": mapping(geom),
        })

    geojson_data = {"type": "FeatureCollection", "features": geo_features}

    m = folium.Map(location=[lat, lon], zoom_start=get_zoom_for_radius(max(float(radius), 100.0)), control_scale=True)

    folium.TileLayer(
        tiles="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        attr="Google",
        name="Google Satellite",
        overlay=False,
        control=True,
    ).add_to(m)

    folium.GeoJson(
        geojson_data,
        name="Зоны кластеризации",
        style_function=lambda feature: {
            "fillColor": feature["properties"]["color"],
            "color": "white",
            "weight": 1,
            "fillOpacity": 0.5,
        },
        highlight_function=lambda feature: {"weight": 3, "color": "yellow", "fillOpacity": 0.7},
        tooltip=folium.GeoJsonTooltip(
            fields=["cluster_label", "short_rec"],
            aliases=["Зона:", "Рекомендация:"],
            sticky=True,
        ),
    ).add_to(m)

    folium.LayerControl().add_to(m)
    return m.get_root().render()
# def build_cluster_map_html(lat, lon, radius, map_data: dict, cluster_colors: list[str]) -> str:
#     """
#     Строит интерактивную карту кластеров (folium) на реальных спутниковых тайлах.
#     Синхронная и не самая лёгкая функция — вызывать через asyncio.to_thread.
#     """
#     lat = float(lat)
#     lon = float(lon)
#     safe_radius = max(float(radius), 100.0)
#     delta = safe_radius / 111000
#
#     west, south = lon - delta, lat - delta
#     east, north = lon + delta, lat + delta
#
#     width = map_data["width"]
#     height = map_data["height"]
#     labels = np.array(map_data["labels"], dtype="int16").reshape(height, width)
#
#     # Строим affine-трансформацию вручную по bbox — то же, что делал rasterio при чтении .tif
#     affine = rio_transform.from_bounds(west, south, east, north, width, height)
#
#     # Векторизация: превращаем растровую сетку кластеров в полигоны
#     shapes_gen = rio_features.shapes(labels, transform=affine)
#
#     polygons_by_cluster: dict[int, list] = {}
#     for geom, value in shapes_gen:
#         cluster_id = int(value)
#         polygons_by_cluster.setdefault(cluster_id, []).append(shape(geom))
#
#     # Объединяем разрозненные кусочки одного кластера в единый полигон (dissolve)
#     geo_features = []
#     for cluster_id, polys in polygons_by_cluster.items():
#         merged = unary_union(polys)
#         geo_features.append({
#             "type": "Feature",
#             "properties": {
#                 "cluster": cluster_id,
#                 "color": cluster_colors[cluster_id % len(cluster_colors)],
#             },
#             "geometry": mapping(merged),
#         })
#
#     geojson_data = {"type": "FeatureCollection", "features": geo_features}
#
#     m = folium.Map(location=[lat, lon], zoom_start=get_zoom_for_radius(safe_radius), control_scale=True)
#
#     folium.TileLayer(
#         tiles="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
#         attr="Google",
#         name="Google Satellite",
#         overlay=False,
#         control=True,
#     ).add_to(m)
#
#     folium.GeoJson(
#         geojson_data,
#         name="Зоны кластеризации",
#         style_function=lambda feature: {
#             "fillColor": feature["properties"]["color"],
#             "color": "white",
#             "weight": 1,
#             "fillOpacity": 0.5,
#         },
#         highlight_function=lambda feature: {"weight": 3, "color": "yellow", "fillOpacity": 0.7},
#         tooltip=folium.GeoJsonTooltip(fields=["cluster"], aliases=["Зона №:"], sticky=True),
#     ).add_to(m)
#
#     folium.LayerControl().add_to(m)
#     return m.get_root().render()

# функции для LLM

def compute_cluster_stats(pixels_flat: np.ndarray, labels: np.ndarray, n_clusters: int) -> list[dict]:
    """
    Считает характеристики каждого кластера: долю площади, NDVI, NDMI.
    Принимает уже плоский массив пикселей (N, bands), не исходный 3D-массив.
    """
    total_pixels = len(labels)

    stats = []
    for cluster_id in range(n_clusters):
        mask = labels == cluster_id
        cluster_pixels = pixels_flat[mask]
        if len(cluster_pixels) == 0:
            continue

        b02, b03, b04, b08, b11, b12 = [cluster_pixels[:, i] for i in range(6)]
        ndvi = (b08 - b04) / (b08 + b04 + 1e-6)
        ndmi = (b08 - b11) / (b08 + b11 + 1e-6)

        stats.append({
            "cluster": int(cluster_id),
            "share_percent": round(100 * mask.sum() / total_pixels, 1),
            "mean_ndvi": round(float(ndvi.mean()), 3),
            "mean_ndmi": round(float(ndmi.mean()), 3),
        })
    return stats

# Составляем промпт
def build_llm_prompt(field_info, cluster_stats: list[dict]) -> str:
    clusters_json = json.dumps(cluster_stats, ensure_ascii=False)  # 👈 эта строка должна быть здесь

    return f"""Ты — агроном-консультант по точному земледелию.

Данные о поле:
- Культура: {field_info.culture or "не указана"}
- Регион: {field_info.region or "не указан"}
- Известные агрохимические данные почвы: {field_info.agrochem or "не указаны"}
- Площадь: {field_info.area} га

Зоны поля по данным спутниковой съёмки:
{clusters_json}

Для каждой зоны определи удобрение и дозировку (кг/га) на основе NDVI и NDMI.

Ответь СТРОГО в виде валидного JSON-массива, без markdown-разметки, без пояснений до или после — только сам JSON. Для каждой зоны укажи:
- "cluster": номер зоны (число, как в исходных данных)
- "fertilizer": название удобрения
- "dose_kg_ha": дозировка (число)
- "reasoning": краткое обоснование (1-2 предложения)
- "short_rec": подсказка до 5 слов, например "Много азота, +40 кг/га\""""

gigachat_client = GigaChat(
    credentials=os.getenv("GIGACHAT_AUTH_KEY"),
    scope="GIGACHAT_API_PERS",
    model="GigaChat-2",  # или GigaChat-2-Pro / GigaChat-2-Max
    verify_ssl_certs=False,
)


def clean_json_response(raw_text: str) -> str:
    """GigaChat иногда оборачивает JSON в markdown-блок — убираем перед парсингом."""
    return re.sub(r"^```(?:json)?|```$", "", raw_text.strip(), flags=re.MULTILINE).strip()


async def get_llm_recommendations(field_info, cluster_stats: list[dict]) -> list[dict]:
    prompt = build_llm_prompt(field_info, cluster_stats)

    response = await asyncio.to_thread(gigachat_client.chat, prompt)
    raw_text = response.choices[0].message.content
    print(f"[GIGACHAT RAW] {raw_text}")  # временно — чтобы видеть сырой ответ в консоли

    cleaned = clean_json_response(raw_text)
    return json.loads(cleaned)
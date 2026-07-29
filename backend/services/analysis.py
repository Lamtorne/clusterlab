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
import folium
from shapely.geometry import shape, mapping
from shapely.ops import unary_union
from rasterio import features as rio_features
from rasterio import transform as rio_transform

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

            analysis_data = {
                "field_id": field_id,
                "algorithm": best_name,
                "n_clusters": int(n_clusters),
                "silhouette_score": float(score),
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


def build_cluster_map_html(lat, lon, radius, map_data: dict, cluster_colors: list[str]) -> str:
    """
    Строит интерактивную карту кластеров (folium) на реальных спутниковых тайлах.
    Синхронная и не самая лёгкая функция — вызывать через asyncio.to_thread.
    """
    lat = float(lat)
    lon = float(lon)
    safe_radius = max(float(radius), 100.0)
    delta = safe_radius / 111000

    west, south = lon - delta, lat - delta
    east, north = lon + delta, lat + delta

    width = map_data["width"]
    height = map_data["height"]
    labels = np.array(map_data["labels"], dtype="int16").reshape(height, width)

    # Строим affine-трансформацию вручную по bbox — то же, что делал rasterio при чтении .tif
    affine = rio_transform.from_bounds(west, south, east, north, width, height)

    # Векторизация: превращаем растровую сетку кластеров в полигоны
    shapes_gen = rio_features.shapes(labels, transform=affine)

    polygons_by_cluster: dict[int, list] = {}
    for geom, value in shapes_gen:
        cluster_id = int(value)
        polygons_by_cluster.setdefault(cluster_id, []).append(shape(geom))

    # Объединяем разрозненные кусочки одного кластера в единый полигон (dissolve)
    geo_features = []
    for cluster_id, polys in polygons_by_cluster.items():
        merged = unary_union(polys)
        geo_features.append({
            "type": "Feature",
            "properties": {
                "cluster": cluster_id,
                "color": cluster_colors[cluster_id % len(cluster_colors)],
            },
            "geometry": mapping(merged),
        })

    geojson_data = {"type": "FeatureCollection", "features": geo_features}

    m = folium.Map(location=[lat, lon], zoom_start=get_zoom_for_radius(safe_radius), control_scale=True)

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
        tooltip=folium.GeoJsonTooltip(fields=["cluster"], aliases=["Зона №:"], sticky=True),
    ).add_to(m)

    folium.LayerControl().add_to(m)

    return m.get_root().render()
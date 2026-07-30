"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import "@/app/ui/field-result.css";

interface MapData {
  width: number;
  height: number;
  labels: number[];
}

interface ClusterStat {
  cluster: number;
  share_percent: number;
  mean_ndvi: number;
  mean_ndmi: number;
}

interface ResultData {
  status: string;
  field: {
    culture: string;
    region: string;
    area: number;
    latitude: number;
    longitude: number;
    radius: number;
  } | null;
  result: {
    algorithm: string;
    n_clusters: number;
    silhouette_score: number;
    cluster_stats: ClusterStat[];
    recommendations: string;
    map_data: MapData;
  } | null;
}

const CLUSTER_COLORS = [
  "#FFB800",
  "#FF5722",
  "#00D2C4",
  "#FFFFFF",
  "#E91E63",
  "#29B6F6",
];

export default function FieldResultPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<ResultData | null>(null);
  const [mapHtml, setMapHtml] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch(`http://localhost:8000/fields/${id}/result`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Не удалось загрузить результат");
        return res.json();
      })
      .then(setData)
      .catch(() => setError("Не удалось загрузить результаты анализа"));
  }, [id]);

  useEffect(() => {
    if (data?.status !== "Готово") return;

    const token = localStorage.getItem("access_token");
    fetch(`http://localhost:8000/fields/${id}/map`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.text())
      .then(setMapHtml)
      .catch(() => setMapHtml(null));
  }, [data, id]);

  if (error) return <p className="error-message">{error}</p>;
  if (!data) return <p className="Field-Result-Loading">Загрузка...</p>;
  if (data.status !== "Готово") {
    return <p className="Field-Result-Loading">Анализ ещё не завершён. Текущий статус: {data.status}</p>;
  }

  return (
    <main className="Field-Result-Page">
      <div className="Field-Result-Split">

        <div className="Field-Result-Left">
          <h2 className="Field-Result-Title">Поле №{id}</h2>

          <div className="Field-Result-Stats">
            <div className="Stat-Item">
              <span className="Stat-Label">Культура</span>
              <span className="Stat-Value">{data.field?.culture}</span>
            </div>
            <div className="Stat-Item">
              <span className="Stat-Label">Регион</span>
              <span className="Stat-Value">{data.field?.region}</span>
            </div>
            <div className="Stat-Item">
              <span className="Stat-Label">Площадь поля</span>
              <span className="Stat-Value">{data.field?.area} га</span>
            </div>
            <div className="Stat-Item">
              <span className="Stat-Label">Кластеров</span>
              <span className="Stat-Value">{data.result?.n_clusters}</span>
            </div>
          </div>

          <div className="Cluster-Legend">
            {Array.from({ length: data.result?.n_clusters ?? 0 }).map((_, i) => {
              const stat = data.result?.cluster_stats?.find((s) => s.cluster === i);
              return (
                <div key={i} className="Cluster-Legend-Item">
                  <span
                    className="Cluster-Legend-Swatch"
                    style={{ backgroundColor: CLUSTER_COLORS[i % CLUSTER_COLORS.length] }}
                  />
                  <span>
                    Кластер {i + 1}
                    {stat && (
                      <span className="Cluster-Legend-Details">
                        {" "}— {stat.share_percent}% площади, NDVI {stat.mean_ndvi}
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="Field-Result-Recommendations">
            <h4 className="Field-Result-Subtitle">Рекомендации по удобрениям</h4>
            <p className="Recommendations-Text">
              {data.result?.recommendations || "Рекомендации ещё не готовы"}
            </p>
          </div>

          <div className="Field-Result-Actions">
            <button className="Download-Button" disabled>
              Скачать результаты (скоро)
            </button>
          </div>
        </div>

        <div className="Field-Result-Right">
          <h3 className="Field-Result-Subtitle">Карта кластеров</h3>
          <div className="Cluster-Map-Container">
            {mapHtml ? (
              <iframe
                srcDoc={mapHtml}
                style={{ width: "100%", height: "100%", border: "none", borderRadius: "12px" }}
              />
            ) : (
              <p>Загрузка карты...</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
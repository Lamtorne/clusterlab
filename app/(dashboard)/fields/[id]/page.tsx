"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import "@/app/ui/profile.css";

interface MapData {
  width: number;
  height: number;
  labels: number[];
}

interface ResultData {
  status: string;
  field: { culture: string; region: string; area: number } | null;
  result: {
    algorithm: string;
    n_clusters: number;
    silhouette_score: number;
    map_data: MapData;
  } | null;
}

const CLUSTER_COLORS = [
  "#4ade80",
  "#f87171",
  "#60a5fa",
  "#fbbf24",
  "#a78bfa",
  "#fb923c",
  "#2dd4bf",
  "#f472b6",
];

export default function FieldResultPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<ResultData | null>(null);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    if (!data?.result?.map_data || !canvasRef.current) return;

    const { width, height, labels } = data.result.map_data;
    const canvas = canvasRef.current;
    const scale = Math.max(4, Math.min(24, Math.floor(500 / width)));
    canvas.width = width * scale;
    canvas.height = height * scale;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    labels.forEach((clusterLabel, i) => {
      const x = i % width;
      const y = Math.floor(i / width);
      ctx.fillStyle = CLUSTER_COLORS[clusterLabel % CLUSTER_COLORS.length];
      ctx.fillRect(x * scale, y * scale, scale, scale);
    });
  }, [data]);

  if (error) return <p className="error-message">{error}</p>;
  if (!data) return <p>Загрузка...</p>;
  if (data.status !== "Готово") {
    return <p>Анализ ещё не завершён. Текущий статус: {data.status}</p>;
  }

  return (
    <main className="Field-Result-Page">
      <div className="Field-Result-Split">
        <div className="Field-Result-Left">
          <h2>{data.field?.culture}</h2>
          <p className="Field-Result-Region">{data.field?.region}</p>

          <div className="Field-Result-Stats">
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
            {Array.from({ length: data.result?.n_clusters ?? 0 }).map(
              (_, i) => (
                <div key={i} className="Cluster-Legend-Item">
                  <span
                    className="Cluster-Legend-Swatch"
                    style={{
                      backgroundColor:
                        CLUSTER_COLORS[i % CLUSTER_COLORS.length],
                    }}
                  />
                  Кластер {i + 1}
                </div>
              ),
            )}
          </div>

          {/* Заглушка под будущее: скачивание результатов и рекомендации */}
          <div className="Field-Result-Actions">
            <button className="Download-Button" disabled>
              Скачать результаты (скоро)
            </button>
          </div>
        </div>

        {/* Правая колонка — карта кластеризации */}
        <div className="Field-Result-Right">
          <h3>Карта кластеров</h3>
          <div className="Cluster-Map-Wrapper">
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>
    </main>
  );
}

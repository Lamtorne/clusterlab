"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import "@/app/ui/field-result.css";

interface ResultData {
  status: string;
  field: { culture: string; region: string; area: number } | null;
  result: {
    algorithm: string;
    n_clusters: number;
    silhouette_score: number;
  } | null;
}

const CLUSTER_COLORS = [
  "#3C3126",
  "#EC6A40",
  "#6B9B7A",
  "#E6E1C5",
  "#7D8C6B",
  "#A65D57"
];

export default function FieldResultPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<ResultData | null>(null);
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
            {Array.from({ length: data.result?.n_clusters ?? 0 }).map((_, i) => (
              <div key={i} className="Cluster-Legend-Item">
                <span
                  className="Cluster-Legend-Swatch"
                  style={{ backgroundColor: CLUSTER_COLORS[i % CLUSTER_COLORS.length] }}
                />
                Кластер {i + 1}
              </div>
            ))}
          </div>

          <div className="Field-Result-Actions">
            <button className="Download-Button" disabled>
              Скачать результаты (скоро)
            </button>
          </div>
        </div>

        <div className="Field-Result-Right">
          <h3 className="Field-Result-Subtitle">Карта кластеров</h3>
          <div className="Cluster-Map-Placeholder">
            <span>Карта появится здесь</span>
          </div>
        </div>

      </div>
    </main>
  );
}
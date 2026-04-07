"use client";
import { useState, useEffect } from "react";
import "app/ui/new-field.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function NewFieldPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    lat: "",
    lon: "",
    radius: "100", // По умолчанию из макета
    crop: "",
    region: "",
    agrochemicals: "",
  });

  const [calculatedArea, setCalculatedArea] = useState(0);

  // UX: Считаем площадь сразу для отображения пользователю
  useEffect(() => {
    const r = parseFloat(formData.radius);
    if (r > 0) {
      const area = Math.pow(2 * r, 2) / 10000;
      setCalculatedArea(Number(area.toFixed(2)));
    }
  }, [formData.radius]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      latitude: parseFloat(formData.lat),
      longitude: parseFloat(formData.lon),
      radius: parseFloat(formData.radius),
      culture: formData.crop,
      region: formData.region,
      agrochem: formData.agrochemicals,
    };

    try {
      const response = await fetch("http://localhost:8000/fields/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Передаем токен для get_current_user
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Успех: редирект в ЛК
        router.push("/main_profile");
      } else {
        const errorData = await response.json();
        // Обработка твоих кастомных ошибок из FastAPI
        alert(`Внимание: ${errorData.detail}`);
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      alert("Не удалось связаться с сервером. Проверьте, запущен ли бэкенд.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="new-field-page">
      <h2 className="new-field-title">Новое поле для анализа</h2>

      {/* Оборачиваем в форму, чтобы работала кнопка type="submit" */}
      <form onSubmit={handleSubmit} className="new-field-form">
        {/* Карточка 1: Координаты и Радиус */}
        <div className="input-grid">
          <div className="input-item">
            <p>Широта</p>
            <input
              type="text"
              placeholder="45.582847"
              value={formData.lat}
              onChange={(e) =>
                setFormData({ ...formData, lat: e.target.value })
              }
              required
            />
          </div>
          <div className="input-item">
            <p>Долгота</p>
            <input
              type="text"
              placeholder="38.785923"
              value={formData.lon}
              onChange={(e) =>
                setFormData({ ...formData, lon: e.target.value })
              }
              required
            />
          </div>
          <div className="input-item input-item-full">
            <p>Радиус в метрах</p>
            <input
              type="number"
              placeholder="100"
              value={formData.radius}
              onChange={(e) =>
                setFormData({ ...formData, radius: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Карточка 2: Данные о культуре */}
        <div className="input-group">
          <div className="input-item">
            <p>Культура на поле</p>
            <input
              type="text"
              placeholder="Пшеница и Кукуруза"
              value={formData.crop}
              onChange={(e) =>
                setFormData({ ...formData, crop: e.target.value })
              }
              required
            />
          </div>
          <div className="input-item">
            <p>Регион произрастания</p>
            <input
              type="text"
              placeholder="Краснодарский край, Тимашевский район"
              value={formData.region}
              onChange={(e) =>
                setFormData({ ...formData, region: e.target.value })
              }
              required
            />
          </div>
        </div>

        {/* Карточка 3: Агрохимия */}
        <div className="input-group">
          <div className="input-item">
            <p>Известные агрохим данные</p>
            <input
              type="text"
              placeholder="Макроэлементы, кислотность и органика"
              value={formData.agrochemicals}
              onChange={(e) =>
                setFormData({ ...formData, agrochemicals: e.target.value })
              }
            />
          </div>
        </div>

        {/* Пока заглушка площади, как в Фигме */}
        <div className="area-info">
          Площадь поля: <span className="area-value">{calculatedArea} га</span>
          <span className="icons">{calculatedArea > 0 ? "✔️" : "❌"}</span>
        </div>

        <button
          type="submit"
          className="new-field-submit"
          disabled={loading || calculatedArea <= 0}
        >
          {loading ? "Запуск..." : "Начать"}
        </button>
      </form>
    </main>
  );
}

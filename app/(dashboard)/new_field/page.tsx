"use client";
import { useState } from "react";
import "app/ui/new-field.css";
import Link from "next/link";
import Image from "next/image";
export default function NewFieldPage() {
  // Добавляем состояние для хранения данных формы
  const [formData, setFormData] = useState({
    lat: "",
    lon: "",
    radius: "100", // По умолчанию из макета
    crop: "",
    region: "",
    agrochemicals: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Отправляем на бэкенд ClusterLab:", formData);
    // Тут будет fetch запрос
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
          Площадь поля:{" "}
          <span className="placeholder-text">{`{Тут полученная площадь поля}`}</span>
          <span className="icons">✔️ ❌</span>
        </div>

        <button type="submit" className="new-field-submit">
          Начать
        </button>
      </form>
    </main>
  );
}

"use client";
import { useState, useEffect } from "react";
import "@/app/ui/profile.css";

export default function FieldsPage() {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const response = await fetch("http://localhost:8000/fields/my_fields", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setFields(data);
        }
      } catch (error) {
        console.error("Ошибка загрузки полей:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFields();
  }, []);

  if (loading) return <p>Загрузка полей...</p>;

  return (
    <main className="Fields-Background">
      <h2 className="Fields-Header">Мои поля</h2>

      <div className="Fields-Cards-Container">
        {fields.length > 0 ? (
          fields.map((field) => (
            <div key={field.id} className="Field-Card">
              <div className="Field-Card-Top">
                <span className="Field-Name">Поле #{field.id}</span>
                <span className="Field-Date">
                  {field.created_at
                    ? new Date(field.created_at).toLocaleDateString("ru-RU")
                    : "Дата не указана"}
                </span>
              </div>

              <div className="Field-Card-Info">
                <div className="Info-Item">
                  <img src="/dashboard/area.svg" alt="Площадь:" />
                  <span>{field.area} га</span>
                </div>
                <div className="Info-Item">
                  <img src="/dashboard/leaf.svg" alt="Культура:" />
                  <span>{field.culture}</span>
                </div>
                <div className="Info-Item">
                  <span
                    className={`Status-Dot ${field.status === "В обработке" ? "status-orange" : "status-green"}`}
                  ></span>
                  <span>{field.status}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>
            У вас пока нет полей для анализа. Создайте первое в разделе "Новое
            поле"!
          </p>
        )}
      </div>
    </main>
  );
}

"use client";
import { useState, useEffect } from "react";
import "app/ui/profile.css"; // Создадим этот файл рядом

export default function ProfilePage() {
  // В будущем сюда придут данные с бэкенда ClusterLab
  const [userData, setUserData] = useState({
    name: "Арина",
    tier: "Тестовый",
    expireDate: "01.06.2026",
    usedHectares: 9, // Для теста поставил 9, чтобы увидеть оранжевый цвет
    totalHectares: 10,
  });

  const usagePercentage =
    (userData.usedHectares / userData.totalHectares) * 100;
  const isHighUsage = usagePercentage >= 80;

  return (
    <main className="profile-container">
      <div className="profile-header">
        <h1 className="profile-welcome">Добро пожаловать, {userData.name}!</h1>
        <p className="profile-info">
          Тариф: <span className="highlight">{userData.tier}</span>
        </p>
        <p className="profile-info">
          Действителен до:{" "}
          <span className="highlight">{userData.expireDate}</span>
        </p>
      </div>

      <div className="usage-section">
        <div className="progress-container">
          <div className="progress-labels">
            <span>Использовано площади</span>
            <span>
              {userData.usedHectares} / {userData.totalHectares} га
            </span>
          </div>

          <div className="progress-bar-bg">
            <div
              className={`progress-bar-fill ${isHighUsage ? "high-usage" : "normal-usage"}`}
              style={{ width: `${usagePercentage}%` }}
            >
              <span className="percent-text">
                {userData.usedHectares} / {userData.totalHectares} га
              </span>
            </div>
          </div>

          <p className="usage-hint">
            {isHighUsage
              ? "Внимание: более 80% лимита использовано"
              : "Доступно для анализа достаточно места"}
          </p>
        </div>
      </div>
    </main>
  );
}

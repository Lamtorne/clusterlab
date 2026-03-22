"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function StepsPage() {
     const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    return (
        <main className="Steps-Page-PageBackground">
            {isVisible && (
                <button onClick={scrollToTop} className="ScrollToTopButton">
                    ↑
                </button>
            )}
            <div className="Steps-Page-Block-1">
                <h2 className="Steps-Page-Block-1-Header">
                    Какой путь Вы пройдете, чтобы получить нужный результат?
                </h2>

        <div className="Steps-Page-Block-1-Cards-Container">
          <div className="Steps-Page-Block-1-SubBlock">
            <div className="Steps-Page-Block-1-Text">
              <p className="Steps-Page-Block-1-SubHeader">
                Этап 1. Ваши данные
              </p>
              <div className="Steps-Page-Block-1-SubText">
                <p>
                  Нам нужны базовые данные о поле, заполняйте их при заказе в
                  личном кабинете.
                </p>
                <ul>
                  <li>Геолокация: координаты центра поля и радиус.</li>
                  <li>Культура и регион.</li>
                  <li>Агрохимические данные - так результат улучшается!</li>
                </ul>
              </div>
            </div>
            <div className="Steps-Page-Block-1-Steps">
              <div className="Steps-Page-Block-1-Circle-1">
                <p>1</p>
              </div>
              <div className="Steps-Page-Block-1-Line"></div>
              <div className="Steps-Page-Block-1-Circle"></div>
              <div className="Steps-Page-Block-1-Line"></div>
              <div className="Steps-Page-Block-1-Circle"></div>
            </div>
          </div>
          <div className="Steps-Page-Block-1-SubBlock">
            <div className="Steps-Page-Block-1-Steps">
              <div className="Steps-Page-Block-1-Circle"></div>
              <div className="Steps-Page-Block-1-Line"></div>
              <div className="Steps-Page-Block-1-Circle-2">
                <p>2</p>
              </div>
              <div className="Steps-Page-Block-1-Line"></div>
              <div className="Steps-Page-Block-1-Circle"></div>
            </div>
            <div className="Steps-Page-Block-1-Text">
              <p className="Steps-Page-Block-1-SubHeader">
                Этап 2. Аналитика ClusterLab
              </p>
              <div className="Steps-Page-Block-1-SubText">
                <p>Черный ящик для пользователя: машинное обучение и ИИ</p>
                <ul>
                  <li>
                    Используя гипер- и мультиспектральные снимки поля, мы
                    подбираем лучший алгоритм кластеризации и делим поле на
                    агрозоны.
                  </li>
                  <li>
                    С помощью LLM и ваших данных, формируем рекомендации
                    удобрений.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="Steps-Page-Block-1-SubBlock">
            <div className="Steps-Page-Block-1-Text">
              <p className="Steps-Page-Block-1-SubHeader">
                Этап 3. Получение результатов
              </p>
              <div className="Steps-Page-Block-1-SubText">
                <p>После проделанной работы что получит пользователь?</p>
                <ul>
                  <li>
                    Интерактивную карту: с ней можно работать прямо в браузере
                    (просматривать зоны и рекомендации по ним).
                  </li>
                  <li>
                    Файл для скачивания для применения в системах умного
                    земледелия.
                  </li>
                </ul>
              </div>
            </div>

            <div className="Steps-Page-Block-1-Steps">
              <div className="Steps-Page-Block-1-Circle"></div>
              <div className="Steps-Page-Block-1-Line"></div>
              <div className="Steps-Page-Block-1-Circle"></div>
              <div className="Steps-Page-Block-1-Line"></div>
              <div className="Steps-Page-Block-1-Circle-3">
                <p>3</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="Steps-Page-Block-2">
        <h2 className="Steps-Page-Block-2-Header">
          Начните Работу Уже Сейчас: Войдите или Зарегистрируйтесь
        </h2>
        <Link href="/">
          <p className="Steps-Page-Block-2-Button">Начать Работу</p>
        </Link>
      </div>
    </main>
  );
}

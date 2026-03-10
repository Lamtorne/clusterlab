import Link from "next/link";
import Image from "next/image";

export default function A_TechPage() {
    return (
        <main className="PageBackground">
            <div className="Steps-Page-Block-1">
                <h2 className="Steps-Page-Block-1-Heder">
                    Какой путь Вы пройдете, чтобы получить нужный результат?
                </h2>

                <div className="Steps-Page-Block-1-Cards-Container">
                    <div className="Steps-Page-Block-1-SubBlock">
                        <div className="Steps-Page-Block-1-Text">
                            <h2 className="Steps-Page-Block-1-SubHeader">
                                Этап 1. Ваши данные
                            </h2>
                            <div className="Steps-Page-Block-1-SubText">
                                <p>
                                    Нам нужны базовые данные о поле, заполняйте их при заказе при инициализации в личном кабинете.
                                </p>
                                <ul>
                                    <li>
                                        Геолокация: координаты центра и радиус, чтобы не анализировать лишнее
                                    </li>
                                    <li>
                                        Культура и регион
                                    </li>
                                    <li>
                                        Агрохимические данные - так результат кластеризации и качество рекомендаций возрастает!
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="Steps-Page-Block-1-Steps">
                            <div className="Steps-Page-Block-1-Circle">
                                1
                            </div>
                            <div className="Steps-Page-Block-1-Line">
                            </div>
                            <div className="Steps-Page-Block-1-Circle">
                            </div>
                            <div className="Steps-Page-Block-1-Line">
                            </div>
                            <div className="Steps-Page-Block-1-Circle">
                            </div>
                        </div>
                    </div>
                    <div className="Steps-Page-Block-1-SubBlock">
                        <div className="Steps-Page-Block-1-Steps">
                            <div className="Steps-Page-Block-1-Circle">
                            </div>
                            <div className="Steps-Page-Block-1-Line">
                            </div>
                            <div className="Steps-Page-Block-1-Circle">
                                2
                            </div>
                            <div className="Steps-Page-Block-1-Line">
                            </div>
                            <div className="Steps-Page-Block-1-Circle">
                            </div>
                        </div>
                        <div className="Steps-Page-Block-1-Text">
                            <h2 className="Steps-Page-Block-1-SubHeader">
                                Этап 2. Аналитика ClusterLab
                            </h2>
                            <div className="Steps-Page-Block-1-SubText">
                                <p>
                                    Черный ящик для пользователя: машинное обучение и ИИ
                                </p>
                                <ul>
                                    <li>
                                        Используя гипер- и мультиспектральные снимки поля, мы подбираем лучший алгоритм кластеризации и делим поле на агрозоны.
                                    </li>
                                    <li>
                                        После, с помощью LLM и ваших данных, формируем рекомендации удобрений
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>

                    <div className="Steps-Page-Block-1-SubBlock">
                        <div className="Steps-Page-Block-1-Text">
                            <h2 className="Steps-Page-Block-1-SubHeader">
                                Этап 3. Получение результатов
                            </h2>
                            <div className="Steps-Page-Block-1-SubText">
                                <p>
                                    После проделанной работы что получит пользователь?
                                </p>
                                <ul>
                                    <li>
                                        Интерактивную карту: с ней можно работать прямо в браузере (просматривать зоны и рекомендации по ним)
                                    </li>
                                    <li>
                                        Файл для скачивания для применения в системах умного земледелия
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="Steps-Page-Block-1-Steps">
                            <div className="Steps-Page-Block-1-Circle">
                            </div>
                            <div className="Steps-Page-Block-1-Line">
                            </div>
                            <div className="Steps-Page-Block-1-Circle">
                            </div>
                            <div className="Steps-Page-Block-1-Line">
                            </div>
                            <div className="Steps-Page-Block-1-Circle">
                                3
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
import Link from "next/link";
import Image from "next/image";

export default function A_TechPage() {
    return (
        <main>
            <div className="Prices-Page-PageBackground">
                <h2 className="Prices-Page-Header">
                    Расскажем про возможные тарифы и версии подписки: выберите подходящую и начните работу
                </h2>
                <div className="Prices-Page-Block-1">
                    <div className="Prices-Page-Block-1-Cards-Container">
                        <div className="Prices-Page-Block-1-SubBlock">
                            <div className="Prices-Page-Block-1-Type-Wrapper">
                                <p>
                                    Стандарт
                                </p>
                            </div>
                            <div className="Prices-Page-Block-1-SubHeader">
                                <h2>
                                    Идеальный старт для небольших фермерских хозяйств
                                </h2>
                            </div>
                            <div className="Prices-Page-Block-1-SubText">
                                <p>
                                    Что входит:
                                </p>
                                <ul>
                                    <li>
                                        <p>
                                            Интерактивная карта и экспорт рекомендаций в любом формате
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            Кластеризация по NDVI
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            Площадь обрабатываемых угодий за месяц - не более 100 га
                                        </p>
                                    </li>
                                </ul>
                            </div>
                            <div className="Prices-Page-Block-1-Bottom">
                                <div className="Prices-Page-Block-1-Price">
                                    <p>
                                        2000 руб / месяц
                                    </p>
                                </div>
                                <Link href="/">
                                    <p className="Prices-Page-Block-1-Button">
                                        Начать Работу
                                    </p>
                                </Link>
                            </div>
                        </div>

                        <div className="Prices-Page-Block-1-SubBlock">
                            <div className="Prices-Page-Block-1-Type-Wrapper">
                                <p>
                                    Про
                                </p>
                            </div>
                            <div className="Prices-Page-Block-1-SubHeader">
                                <h2>
                                    Инструмент для масштабного роста и максимального точности
                                </h2>
                            </div>
                            <div className="Prices-Page-Block-1-SubText">
                                <p>
                                    Что входит:
                                </p>
                                <ul>
                                    <li>
                                        <p>
                                            Интерактивная карта и экспорт рекомендаций в любом формате
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            Кластеризация по NDVI + 6 каналов
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            Учет агрохимических свойств почв, вегетационного периода и типа культуры
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            Площадь обрабатываемых угодий за месяц - не более 500 га
                                        </p>
                                    </li>
                                </ul>
                            </div>
                            <div className="Prices-Page-Block-1-Bottom">
                                <div className="Prices-Page-Block-1-Price">
                                    <p>7500 руб / месяц</p>
                                </div>
                                <Link href="/">
                                    <p className="Prices-Page-Block-1-Button">Начать Работу</p>
                                </Link>
                            </div>

                        </div>
                    </div>

                </div>



                <div className="Prices-Page-Block-2">
                    <div className="Prices-Page-Block-2-Cards-Container">
                        <div className="Prices-Page-Block-2-SubBlock">
                            <div className="Prices-Page-Block-2-Type-Wrapper">
                                <p>
                                    Демо
                                </p>
                            </div>
                            <div className="Prices-Page-Block-2-SubHeader">
                                <h2>
                                    Попробуйте возможности на небольшом поле
                                </h2>
                            </div>
                            <div className="Prices-Page-Block-2-SubText">
                                <p>
                                    Что входит:
                                </p>
                                <ul>
                                    <li>
                                        <p>
                                            Анализ 1 поля площадью до 10 га
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            Демонстрационная кластеризация по NDVI
                                        </p>
                                    </li>
                                    <li>
                                        <p>
                                            Интерактивная карта и экспорт рекомендаций в одном формате
                                        </p>
                                    </li>
                                </ul>
                            </div>
                            <div className="Prices-Page-Block-1-Bottom">
                                <div className="Prices-Page-Block-2-Price">
                                    <p>
                                        0 рублей
                                    </p>
                                </div>
                                <Link href="/">
                                    <p className="Prices-Page-Block-2-Button">
                                        Начать Работу
                                    </p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </main >
    );
}
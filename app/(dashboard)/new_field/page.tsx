"use client";
import { useState, useEffect } from "react";
import "@/app/ui/profile.css"
import Link from "next/link";
import Image from "next/image";
export default function NewFieldPage() {
    return (
        <main className="New-Field-Background">
            <h2 className="New-Field-Header">
                Новое поле для анализа
            </h2>
            <div className="New-Field-Cards-Container">
                <div className="New-Field-SubLabel">
                    <p>
                        Широта
                    </p>
                    <label>
                        ...
                    </label>
                    <input
                        type="latitude"
                        required
                    />
                </div>
                <div className="New-Field-SubLabel">
                    <p>
                        Долгота
                    </p>
                    <label>
                        ...
                    </label>
                    <input
                        type="altitude"
                        required
                    />
                </div>
                <div className="New-Field-SubLabel">
                    <p>
                        Радиус в метрах
                    </p>
                    <label>
                        ...
                    </label>
                    <input
                        type="radius"
                        required
                    />
                </div>
                <div className="New-Field-SubLabel">
                    <p>
                        Культура на поле
                    </p>
                    <label>
                        ...
                    </label>
                    <input
                        type="breed"
                        required
                    />
                </div>
                <div className="New-Field-SubLabel">
                    <p>
                        Регион произрастания
                    </p>
                    <label>
                        ...
                    </label>
                    <input
                        type="region"
                        required
                    />
                </div>
                <div className="New-Field-SubLabel">
                    <p>
                        Известные агрохим. данные
                    </p>
                    <label>
                        ...
                    </label>
                    <input
                        type="add-data"
                    />
                </div>
            </div>
            <Link href="/fields" className="New-Field-Button">
                Начать
            </Link>
        </main>
    );
}

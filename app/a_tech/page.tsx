import Link from "next/link";
import Image from "next/image";

export default function A_TechPage() {
    return (
        <main className="PageBackground">
            <div className="Block-1">
                <Image
                    className="Satellite-Picture"
                    src="/satellite.svg"
                    alt="Satellite picture"
                    width={700}
                    height={500}
                    priority
                />
                <div className="Block-1-Text">
                    <div className="Block-1-Text-Blur">
                        <h2>Технологическая основа Clusterlab</h2>

                        <p>
                            Наш сервис интегрирует мультиспектральные и гиперспектральные данные спутника "Лобачевский" и сервиса от ИКИ РАН "ВЕГА-Science" с алгоритмами машинного обучения для автоматизированного агрозонирования и оптимизации внесения минеральных удобрений.
                        </p>

                    </div>
                </div>
            </div>
        </main>
    );
}
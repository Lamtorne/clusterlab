import Link from "next/link";
import Image from "next/image";
import Feature from "@/app/components/Features"


export default function HomePage() {
  return (
    <main className="PageBackground">
      <div className="Block-1">
        <Image
          className="NASA-Picture"
          src="/NASA_pic.svg"
          alt="NASA picture from space"
          width={500}
          height={500}
          priority
        />
        <div className="Block-1-Text">
          <div className="Block-1-Text-Blur">
            <h2>
              Оптимизация Внесения Удобрений На Основе Спутниковых Данных
            </h2>

            <p >
              Сократите расходы на удобрения до 30% с помощью ДЗЗ. Используем гиперспектральные данные российского спутника «Лобачевский»
            </p>

            <div>
              <button className="Block-1-Button-1">Начать работу</button>
              <button className="Block-1-Button-2">Узнать больше</button>
            </div>
          </div>
        </div>
      </div>

      <div className="Block-2">
        <h2 className="Block-2-Header">
          Почему традиционное внесение удобрений неэффективно?
        </h2>
        <div className="Block-2-Cards-Container">
          <div className="Block-2-SubBlock">
            <div className="Block-2-Icon-Wrapper">
              <Image
                className="Pig-Picture"
                src="/Pig.svg"
                alt="Pig picture"
                width={60}
                height={60}
                priority
              />
            </div>

            <p className="Block-2-SubHeader">
              Перерасход ресурсов
            </p>
            <p className="Block-2-SubText">
              Усреднённые нормы приводят к переизбытку удобрений на одних участках и нехватке на других
            </p>
          </div>

          <div className="Block-2-SubBlock">
            <div className="Block-2-Icon-Wrapper">
              <Image
                className="Arrow-Picture"
                src="/Arrow.svg"
                alt="Arrow picture"
                width={60}
                height={60}
                priority
              />
            </div>

            <p className="Block-2-SubHeader">
              Снижение урожайности
            </p>
            <p className="Block-2-SubText">
              Неравномерное удобрение растений снижает общую продуктивность поля
            </p>
          </div>

          <div className="Block-2-SubBlock">
            <div className="Block-2-Icon-Wrapper">
              <Image
                className="Planet-Picture"
                src="/Planet.svg"
                alt="Planet picture"
                width={60}
                height={6}
                priority
              />
            </div>
            <p className="Block-2-SubHeader">
              Экологический вред
            </p>
            <p className="Block-2-SubText">
              Избыток удобрений загрязняет близлежащие почву и водоемы
            </p>
          </div>
        </div>
      </div>

      <div className="Block-3">
        <h2 className="Block-3-Header">
          <b>ClusterLab</b> автоматически разделит поле на зоны и рассчитает оптимальные дозы удобрений
        </h2>

        <div className="Block-3-Cards-Container">
          <div className="Block-3-SubImage">
            <Image
              className="Image-Before"
              src="/TestSPb.png"
              alt="Изображение до"
              width={500}
              height={500}
              priority
            />
          </div>
          <div className="Block-3-SubBlock">
            <div>
              <a>
                Мы используем <b>спутниковые снимки</b> и <b>агрохимические данные</b> для точного агрозондирования.
              </a>
            </div>
            <div>
              <a>
                Вы получаете карту поля с рекомендациями по каждой зоне.
              </a>
            </div>
          </div>
          <div className="Block-3-SubImage">
            <Image
              className="Image-After"
              src="/TestSPb.png"
              alt="Изображение после"
              width={500}
              height={500}
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
}

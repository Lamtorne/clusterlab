import Link from "next/link";
import Image from "next/image";


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
                width={100}
                height={100}
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
                width={100}
                height={100}
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
                width={100}
                height={100}
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

      <div className="Block-4">
        <div className="Block-4-Header">
          <h2>
            Как это работает?
          </h2>
        </div>
        <div className="Block-4-Cards-Container">
          <div className="Block-4-SubBlock">
            <div className="Block-4-List">
              <p>1</p>
            </div>
            <div className="Block-4-SubText">
              <h2>
                Сбор данных
              </h2>
              <p>
                Получаем мульти- и гиперспектральные снимки с российского спутника "Лобачевский" и агрохимическиие данные почв.
              </p>
            </div>
          </div>

          <div className="Block-4-SubBlock">
            <div className="Block-4-List">
              <p>2</p>
            </div>
            <div className="Block-4-SubText">
              <h2>
                Кластерный анализ
              </h2>
              <p>Алгоримы машинного обучения автоматически выделяют зоны с разными потребностями в удобрениях.
              </p>
            </div>

          </div>

          <div className="Block-4-SubBlock">
            <div className="Block-4-List">
              <p>3</p>
            </div>
            <div className="Block-4-SubText">
              <h2>
                Расчёт доз
              </h2>
              <p>
                Рассчитываем оптимальные дозы удобрений для каждой зоны на основе данных о почве.
              </p>
            </div>
          </div>

          <div className="Block-4-SubBlock">
            <div className="Block-4-List">
              <p>4</p>
            </div>
            <div className="Block-4-SubText">
              <h2>
                Карта агрозонирования
              </h2>
              <p>
                Вы получаете цифровую карту с рекомендациями, совместимую с системами точного земледелия.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="Block-5">
        <h2 className="Block-5-Header">
          Наши преимущества
        </h2>

        <div className="Block-5-Cards-Container">
          <div className="Block-5-SubBlock-1">
            <div className="Block-5-Blur">
              <h2>
                Анализ с отечественного спутника «Лобачевский»
              </h2>
              <p>
                В отличие от аналогов наш сервис работает с данными высокого спектрального и пространственного разрешения, что позволяет детальнеее отслеживать состояние посевов.
              </p>
            </div>
          </div>

          <div className="Block-5-SubBlock-2">
            <div className="Block-5-Blur">
              <h2>
                Комплексный подход
              </h2>
              <p>
                Мы объединяем данные дистанционного зондирования Земли (ДЗЗ) с реальными агрохимическими характеристиками почв конкретного хозяйства.
              </p>
            </div>
          </div>

          <div className="Block-5-SubBlock-3">
            <div className="Block-5-Blur">
              <h2>
                Совместимость
              </h2>
              <p>
                Результаты экспортируются в виде цифровых карт, полностью совместимых с современными системами точного земледелия для дифференцированного внесения.
              </p>
            </div>
          </div>

          <div className="Block-5-SubBlock-4">
            <div className="Block-5-Blur">
              <h2>
                Автоматизация через ML
              </h2>
              <p>
                Использоваание современных алгоритмов машинного обучения и кластерного анализа позволяет выделять агрозоны автоматически, без необходимости ручной настройки агрономом.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="Block-6">
        <h2 className="Block-6-Header">
          Для кого
        </h2>
        <div className="Block-6-Cards-Container">
          <div className="Block-6-SubBlock">
            <div className="Block-6-Icon-Wrapper">
              <Image
                className="Truck-Picture"
                src="/Truck.svg"
                alt="Truck picture"
                width={100}
                height={100}
                priority
              />
            </div>

            <p className="Block-6-SubHeader">
              Перерасход ресурсов
            </p>
            <p className="Block-6-SubText">
              Усреднённые нормы приводят к переизбытку удобрений на одних участках и нехватке на других
            </p>
          </div>

          <div className="Block-6-SubBlock">
            <div className="Block-6-Icon-Wrapper">
              <Image
                className="Bank-Picture"
                src="/Bank.svg"
                alt="Bank picture"
                width={100}
                height={100}
                priority
              />
            </div>

            <p className="Block-6-SubHeader">
              Снижение урожайности
            </p>
            <p className="Block-6-SubText">
              Неравномерное удобрение растений снижает общую продуктивность поля
            </p>
          </div>

          <div className="Block-6-SubBlock">
            <div className="Block-6-Icon-Wrapper">
              <Image
                className="Atom-Picture"
                src="/Atom.svg"
                alt="Atom picture"
                width={100}
                height={100}
                priority
              />
            </div>
            <p className="Block-6-SubHeader">
              Экологический вред
            </p>
            <p className="Block-6-SubText">
              Избыток удобрений загрязняет близлежащие почву и водоемы
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

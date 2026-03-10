import Link from "next/link";
import Image from "next/image";

export default function A_TechPage() {
  return (
    <main className="PageBackground">
      <div className="A-Tech-Page-Block-1">
        <Image
          className="A-Tech-Page-Satellite-Picture"
          src="/a-tech/satellite.svg"
          alt="Satellite picture"
          width={700}
          height={500}
          priority
        />
        <div className="A-Tech-Page-Block-1-Text">
          <div className="A-Tech-Page-Block-1-Text-Blur">
            <h2>Технологическая основа Clusterlab</h2>

            <p>
              Наш сервис интегрирует мультиспектральные и гиперспектральные
              данные спутника "Лобачевский" и сервиса от ИКИ РАН "ВЕГА-Science"
              с алгоритмами машинного обучения для автоматизированного
              агрозонирования и оптимизации внесения минеральных удобрений.
            </p>
          </div>
        </div>
      </div>

      <div className="A-Tech-Page-Block-2">
        <h2 className="A-Tech-Page-Block-2-Header">
          Спутник "Лобачевский": платформа для агроэкологического мониторинга
        </h2>
        <div className="A-Tech-Page-Block-2-Cards-Container">
          <div className="A-Tech-Page-Block-2-Text">
            <p>
              Малый космический аппарат "Лобачевский" создан ННГУ им. Н. И.
              Лобачевский на базе спутниковой платформы "Геоскан 16U".
            </p>
            <p>
              Спутник оснащён спектральными камерами для ДЗЗ и FM-ретранслятором
              радиосигнала. Основная научная задача миссии — получение снимков с
              последующей обработкой данных.
            </p>
          </div>
          <div className="A-Tech-Page-Block-2-Image">
            <Image
              className="A-Tech-Page-Lobachev-Picture"
              src="/a-tech/lobachev_satelitte.svg"
              alt="Lobachev picture"
              width={500}
              height={500}
              priority
            />
          </div>
        </div>
      </div>

      <div className="A-Tech-Page-Block-3">
        <div className="A-Tech-Page-Block-3-Cards-Container">
          <div className="A-Tech-Page-Block-3-SubBlock">
            <div className="A-Tech-Page-Block-3-Icon-Wrapper">
              <Image
                className="A-Tech-Page-Camera-Picture"
                src="/a-tech/camera.svg"
                alt="Lobachev picture"
                width={100}
                height={100}
                priority
              />
            </div>
            <div className="A-Tech-Page-Block-3-SubHeader">
              Бортовая аппаратура
            </div>
            <div className="A-Tech-Page-Block-3-SubText">
              <ul>
                <li>Спектральные камеры:</li>
                <ol>
                  <li>Мультиспектральная камера</li>
                  <li>Гиперспектральная камера</li>
                </ol>
                <li>Дополнительная аппаратура</li>
                <ol>
                  <li>FM-ретранслятор радиосигнала</li>
                  <li>Мемристорная плата</li>
                </ol>
              </ul>
            </div>
          </div>
          <div className="A-Tech-Page-Block-3-SubBlock">
            <div className="A-Tech-Page-Block-3-Icon-Wrapper">
              <Image
                className="A-Tech-Page-Arrow-Picture"
                src="/a-tech/arrow.svg"
                alt="Arrow picture"
                width={100}
                height={100}
                priority
              />
            </div>
            <div className="A-Tech-Page-Block-3-SubHeader">
              Научные и прикладные задачи
            </div>
            <div className="A-Tech-Page-Block-3-SubText">
              <ul>
                <li>Агроэкологический мониторинг:</li>
                <ol>
                  <li>Спутниковая съемка полей и с/х культур</li>
                  <li>Оценка биофизических параметров растений</li>
                </ol>
                <li>Научные исследования</li>
                <li>Радиолюбительская миссия:</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="A-Tech-Page-Block-3-SubSubBlock">
          <div className="A-Tech-Page-Block-3-Icon-Wrapper">
            <Image
              className="A-Tech-Page-Sputnik-Picture"
              src="/a-tech/sputnik.svg"
              alt="Sputnik picture"
              width={100}
              height={100}
              priority
            />
          </div>
          <div className="A-Tech-Page-Block-3-SubHeader">
            Спутниковая платформа
          </div>
          <div className="A-Tech-Page-Block-3-SubText-Cards-Container">
            <div className="A-Tech-Page-Block-3-SubText">
              <p>Платформа Геоскан 16U:</p>
              <ol>
                <li>Стандарт: CubeSat, форм-фактор 16U</li>
                <li>Габариты 10×20×34 см</li>
                <li>Высокоточная система ориентации и стабилизации</li>
              </ol>
            </div>

            <div className="A-Tech-Page-Block-3-SubText">
              <p>Разработчики:</p>
              <ol>
                <li>ННГУ им. Н. И. Лобачевского</li>
                <li>АО "Геоскан"</li>
                <li>Самарский университет</li>
                <li>НПО "Лептон", Зеленоград</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <div className="A-Tech-Page-Block-4">
        <h2 className="A-Tech-Page-Block-4-Header">Медия и ресурсы.</h2>
        <div className="A-Tech-Page-Block-4-Cards-Container">
          <div className="A-Tech-Page-Block-4-Video">
            <p>Тут будет видео запуска</p>
          </div>
          <div className="A-Tech-Page-Block-4-Image">
            <Image
              className="A-Tech-Page-LobachevBody-Picture"
              src="/a-tech/LobachevBody.svg"
              alt="Sputnik body picture"
              width={700}
              height={700}
              priority
            />
            <div className="A-Tech-Page-Block-4-ImgTitle">
              Спутник "Лобачевский"
            </div>
          </div>
        </div>
        <nav className="A-Tech-Page-Block-4-Links">
          <p>Трансляция запуска: YouTube, Vk</p>
          <p>Статья о проекте на Space-π</p>
          <p>Новости в Телеграм Геоскана</p>
        </nav>
      </div>

      <div className="A-Tech-Page-Block-5">
        <h2 className="A-Tech-Page-Block-5-Header">
          Научная часть ClusterLab: кластеризация и LLM-интерпретация
        </h2>

        <div className="A-Tech-Page-Block-5-Cards-Container">
          <div className="A-Tech-Page-Block-5-SubBlock">
            <div className="A-Tech-Page-Block-5-Icon-Wrapper">
              <Image
                className="A-Tech-Page-Box-Picture"
                src="/a-tech/box.svg"
                alt="Box picture"
                width={150}
                height={150}
                priority
              />
            </div>
            <div className="A-Tech-Page-Block-5-SubHeader">
              <p>Машинное обучение для сегментации полец</p>
            </div>
            <div className="A-Tech-Page-Block-5-SubText">
              <p>
                Для каждого поля после его анализа подбирается лучший алгоритм
                кластеризации на основе метрик, рассчитанных с помощью данных с
                ДЗЗ. Превращаем поле из миллиона спектральных точек в четкие
                агрозоны.
              </p>
            </div>
          </div>
          <div className="A-Tech-Page-Block-5-SubBlock">
            <div className="A-Tech-Page-Block-5-Icon-Wrapper">
              <Image
                className="A-Tech-Page-PCHuman-Picture"
                src="/a-tech/pchuman.svg"
                alt="PCHuman picture"
                width={150}
                height={150}
                priority
              />
            </div>
            <div className="A-Tech-Page-Block-5-SubHeader">
              <p>LLM-интерпретация и расчет доз</p>
            </div>
            <div className="A-Tech-Page-Block-5-SubText">
              <p>
                Используем современные большие языковые модели для формирования
                экспертных рекомендаций удобрений для каждой зоны, учитывая тип
                культуры, вегетационный период, агрохимические характеристики
                региона.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

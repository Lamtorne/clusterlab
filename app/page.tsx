import Link from "next/link";
import Image from "next/image";
import Header from './components/header';

export default function HomePage() {
  return (
    <main className="PageBackground">
      <Header/>


      <div className="Block_1">
        <Image
          className="NASA_Picture"
          src="/NASA_pic.svg"
          alt="NASA picture from space"
          width={700}
          height={700}
          priority
        />
        <div className="TextBlock_1">
          <h1 className="Header_1">
            Оптимизация Внесения Удобрений На Основе Спутниковых Данных
          </h1>

          <p className="Text_1">
            Сократите расходы на удобрения до 30% с помощью ДЗЗ. Используем гиперспектральные данные российского спутника «Лобачевский»
          </p>

          <div className="Buttons">
            <button className="PrimaryButton">Начать работу</button>
            <button className="SecondaryButton">Узнать больше</button>
          </div>
        </div>
      </div>

      <div className="Block_2">
        <h1>
          Почему традиционное внесение удобрений неэффективно?
        </h1>
        <ul className="TableBlock_2">
          <li>
            <div className="Icon-circle">
            <Image 
            className="Pig"
            src="/Pig.svg"
            alt="Money Pig Image"
            width={130}
            height={100}
            priority
            />
            </div>
            <h2>
              Перерасход ресурсов
            </h2>
            <p>
              Усреднённые нормы приводят к переизбытку удобрений на одних участках и нехватке на других
            </p>
          </li>
          <li>
            <div className="Icon-circle">
            <Image
            className="Arrow"
            src="/Arrow.svg"
            alt="Falling Arrow Image"
            width={130}
            height={100}
            priority
            />
            </div>
            <h2>
              Снижение урожайности
            </h2>
            <p>
              Неравномерное удобрение растений снижает общую продуктивность поля
            </p>
          </li>
          <li>
            <div className="Icon-circle">
            <Image
            className="Planet"
            src="/Planet.svg"
            alt="Planet Image"
            width={130}
            height={100}
            priority
            />
            </div>
            <h2>
              Экологический вред
            </h2>
            <p>
              Избыток удобрений загрязняет близлежащие почву и водоемы
            </p>
          </li>
        </ul>
      </div>
    </main>
  );
}

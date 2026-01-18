import React from 'react';
import Image from 'next/image';

const Header = () => {
  return (
    <header className="Header">
      <div className="Logo">
        <Image
          className="LogoImg"
          src="/Logo-Transparent.svg"
          alt="Next.js logo"
          width={50}
          height={100}
          priority
        />
        <a className="LogoText">ClusterLab</a>
      </div>
      <nav>
        <a href="#">О технологии</a>
        <a href="#">Результаты</a>
        <a href="#">Тарифы</a>
        <button className="ButtonStart">Начать работу</button>
      </nav>
    </header>
  );
};

export default Header;
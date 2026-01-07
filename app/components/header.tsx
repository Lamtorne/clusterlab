import React from 'react';
import Image from 'next/image';

const Header = () =>{
  return (
    <header className="Header">
      <div className="Logo">
        <Image
          className="LogoImg"
          src="/Logo.svg"
          alt="Next.js logo"
          width={50}
          height={100}
          priority
        />
        <a className="LogoText">ClusterLab</a>
      </div>
      <nav>
        <ul>
          <li><a className='HeaderSpaceText'>О технологии</a></li>
          <li><a className='HeaderSpaceText'>Результаты</a></li>
          <li><a className='HeaderSpaceText'>Тарифы</a></li>
        </ul>
      </nav>
      <div className="right-align"><a className="StartWorkText">Начать работу</a></div>
    </header>
  );
};

export default Header;
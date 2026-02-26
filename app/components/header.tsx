import React from "react";
import Image from "next/image";
import Link from "next/link";
import '@/app/components/header.css'
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
        <Link href="/">
          <p className="LogoText">ClusterLab</p>
        </Link>
      </div>
      <nav>
        <Link href="/a_tech">
          <p>О технологии</p>
        </Link>
        <Link href="/steps">
          <p>Этапы</p>
        </Link>
        <Link href="/prices">
          <p>Тарифы</p>
        </Link>
        <button className="ButtonStart">Начать работу</button>
      </nav>
    </header>
  );
};

export default Header;

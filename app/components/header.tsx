import React from "react";
import Image from "next/image";
import Link from "next/link";
import '@/app/components/header.css'
const Header = () => {
  return (
    <header className="Header-Header">
      <div className="Header-Logo">
        <Image
          className="Header-LogoImg"
          src="/header/Logo-Transparent.svg"
          alt="Next.js logo"
          width={50}
          height={100}
          priority
        />
        <Link href="/">
          <p className="Header-LogoText">ClusterLab</p>
        </Link>
      </div>
      <nav className="Header-nav">
        <Link href="/a_tech">
          <p>О технологии</p>
        </Link>
        <Link href="/steps">
          <p>Этапы</p>
        </Link>
        <Link href="/prices">
          <p>Тарифы</p>
        </Link>
        <button className="Header-ButtonStart">Начать работу</button>
      </nav>
    </header>
  );
};

export default Header;

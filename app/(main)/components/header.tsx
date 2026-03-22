import React from "react";
import Image from "next/image";
import Link from "next/link";
import '@/app/(ncomponents/header.css'
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
          <p className="Header-nav-p">О технологии</p>
        </Link>
        <Link href="/steps">
          <p className="Header-nav-p">Этапы</p>
        </Link>
        <Link href="/prices">
          <p className="Header-nav-p">Тарифы</p>
        </Link>
        <Link href="/sign_in">
          <p className="Header-ButtonStart">Начать работу</p>
        </Link>
      </nav>
    </header>
  );
};

export default Header;

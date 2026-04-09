import React from "react";
import Image from "next/image";
import Link from "next/link";
import "@/app/(main)/components/header.css"
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
        <Link href="/a_tech" className="Header-nav-p">
          О технологии
        </Link>
        <Link href="/steps" className="Header-nav-p">
          Этапы
        </Link>
        <Link href="/prices" className="Header-nav-p">
          Тарифы
        </Link>
        <Link href="/sign_in" className="Header-ButtonStart">
          Начать работу
        </Link>
      </nav>
    </header>
  );
};

export default Header;

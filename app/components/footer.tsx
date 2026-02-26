import React from "react";
import Image from "next/image";
import Link from "next/link";
import "@/app/components/footer.css";
export default function Footer() {
  return (
    <footer className="footer-style">
      <div className="Logo">
        <Image
          className="LogoImg"
          src="/Logo-Transparent.svg"
          alt="ClusterLab Logo"
          width={50}
          height={100}
          priority
        />
        <Link href="/">
          <p className="LogoText">ClusterLab</p>
        </Link>
      </div>
      <div className="Mail">
        <Image
          className="Mail-Img"
          src="/Mail.svg"
          alt="Mail Icon"
          width={25}
          height={20}
          priority
        />
        <a className="MailText">clusterlab.ru@gmail.com</a>
      </div>
      <nav>
        <p>Обработка персональных данных и договор оферты</p>
        <Link href="/a_tech">
          <p>О технологии</p>
        </Link>
        <Link href="/steps">
          <p>Этапы</p>
        </Link>
        <Link href="/prices">
          <p>Тарифы</p>
        </Link>
      </nav>
    </footer>
  );
}

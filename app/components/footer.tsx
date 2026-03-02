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
          src="/footer/Logo-Transparent.svg"
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
          src="/footer/Mail.svg"
          alt="Mail Icon"
          width={25}
          height={20}
          priority
        />
        <a className="MailText">clusterlab.ru@gmail.com</a>
      </div>
      <nav className="Pages">
        <p>Согласие на обработку персональных данных</p>
        <p>Договор оферты</p>
      </nav>
    </footer>
  );
}

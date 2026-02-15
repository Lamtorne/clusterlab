import React from 'react';
import Image from 'next/image';
import "@/app/components/footer.css"
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
        <a className="LogoText">ClusterLab</a>
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
    </footer>
  );
}
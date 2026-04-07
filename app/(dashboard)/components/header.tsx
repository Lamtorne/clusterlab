"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="Header">
      <div className="Header-Left">
        <div className="Header-Logo">
          <Image
            src="/header/Logo-Transparent.svg"
            alt="Logo"
            width={120}
            height={120}
          />
        </div>
      </div>

      <div className="Header-Right">
        <Link href="/tariffs" className="Header-Upgrade-Button">
          Обновить Тариф
        </Link>
      </div>
    </header>
  );
}

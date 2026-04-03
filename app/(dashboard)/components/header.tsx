"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="dashboard-header">
      <div className="header-left">
        {/* Можно оставить пустым или продублировать лого для мобильных версий */}
        <div className="mobile-logo">
          <Image
            src="/header/Logo-Transparent.svg"
            alt="Logo"
            width={40}
            height={40}
          />
        </div>
      </div>

      <div className="header-right">
        <Link href="/tariffs" className="upgrade-button">
          Обновить Тариф
        </Link>
      </div>
    </header>
  );
}

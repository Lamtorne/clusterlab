"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Профиль", href: "/profile", icon: "/icons/profile.svg" },
    { name: "Мои поля", href: "/fields", icon: "/icons/fields.svg" },
    { name: "Новое поле", href: "/new_field", icon: "/icons/plus.svg" },
  ];

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <span className={isActive ? "text-orange" : ""}>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <button
          onClick={() => {
            /* логика выхода */
          }}
          className="nav-item logout-btn"
        >
          Выйти
        </button>
      </div>
    </aside>
  );
}

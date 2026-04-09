"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Профиль", href: "/profile", icon: "/icons/profile.svg" },
    { name: "Мои поля", href: "/fields", icon: "/icons/fields.svg" },
    { name: "Новое поле", href: "/new_field", icon: "/icons/plus.svg" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_name");

    router.push("/");

    router.refresh();
  };

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
          onClick={handleLogout}
          className="nav-item logout-btn w-full text-left"
        >
          Выйти
        </button>
      </div>
    </aside>
  );
}

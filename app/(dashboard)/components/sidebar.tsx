"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";


export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { name: "Профиль", href: "/profile", icon: "/dashboard/Profile_Icon.svg" },
    { name: "Мои поля", href: "/fields", icon: "/dashboard/My_Fields_Icon.svg" },
    { name: "Новое поле", href: "/new_field", icon: "/dashboard/New_Field_Icon.svg" },
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
            <div key={item.href} className="Sidebar-wrapper">
              <Image
                className="Sidebar-Icons"
                src={item.icon}
                alt="Sidebar-Icons"
                width={40}
                height={40}
                priority
              />
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? "active" : ""}`}
              >
                <span className={isActive ? "text-orange" : ""}>{item.name}</span>
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <Image
          className="Log_out-Icon"
                src="/dashboard/Log_out.svg"
                alt="Logout-Icon"
                width={40}
                height={40}
                priority
        />
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

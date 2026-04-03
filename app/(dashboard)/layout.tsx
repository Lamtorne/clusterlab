import Sidebar from "./components/sidebar";
import Header from "./components/header";
import "./dashboard.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#e8dcc4]">
      {/* Твой зеленый сайдбар из макета */}
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Шапка с лого и кнопкой тарифа */}
        <Header />

        {/* Сюда будут подставляться страницы: profile, fields и т.д. */}
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

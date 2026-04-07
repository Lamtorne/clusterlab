import { righteous, inter, lusitana } from "@/app/ui/fonts";
import { Metadata } from "next";
import "@/app/ui/profile.css";
import { Jura } from "next/font/google";

const jura = Jura({
  subsets: ["cyrillic"],
  weight: ["400", "700"],
});

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className={jura.className}>
      {" "}
      {/* Шрифты применятся ко всему внутри */}
      {children}
    </main>
  );
}

/*
export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
  */

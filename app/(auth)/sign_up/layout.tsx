import "@/app/ui/global.css";
import "@/app/ui/sign-up-page.css";
import { righteous, inter, lusitana } from "../../ui/fonts";
import { Metadata } from "next";
import Header from "@/app/(main)/components/header";
import Footer from "@/app/(main)/components/footer";
export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}

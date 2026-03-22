import '@/app/ui/global.css';
import '@/app/ui/a-tech-page.css'
import { righteous, inter, lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
import Header from '@/app/(main)/components/header'
import Footer from '@/app/(main)/components/footer';
export default function A_TechLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <main>{children}</main>

      <Footer />
    </>
  );
}
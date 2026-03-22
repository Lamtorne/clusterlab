import '@/app/ui/global.css';
import '@/app/components/header.css'
import '@/app/ui/a-tech-page.css'
import { righteous, inter, lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
import Header from '@/app/components/header.tsx'
import Footer from '@/app/components/footer.tsx';
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
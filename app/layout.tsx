import '@/app/ui/global.css';
import '@/app/ui/app-page.css'
import '@/app/components/header.css'
import { righteous, inter, lusitana } from './ui/fonts'
import { Metadata } from 'next';
import Header from '@/app/components/header.tsx'
import Footer from '@/app/components/footer.tsx';

export const metadata: Metadata = {
  title: 'ClusterLab',
  icons: {
    icon: 'icon.svg',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
      </head>
      <body className={`${inter.className} antialiased`}>

        <Header />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}
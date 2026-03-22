import '@/app/ui/global.css';
import '@/app/ui/app-page.css'
import { righteous, inter, lusitana } from './ui/fonts'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'ClusterLab',
  icons: {
    icon: 'images/icon.svg',
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
        <main>{children}</main>
      </body>
    </html>
  );
}
import '@/app/ui/global.css';
import '@/app/components/header.css'
import {righteous, inter, lusitana } from './ui/fonts'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
       <body>{children}</body>
    </html>
  );
}

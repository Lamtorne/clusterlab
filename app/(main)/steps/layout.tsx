import '@/app/ui/global.css';
import '@/app/(main)/components/header.css'
import '@/app/ui/steps-page.css'
import { righteous, inter, lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
import Header from '@/app/(main)/components/header'
import Footer from '@/app/(main)/components/footer';
export default function StepsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main>{children}</main>
    );
}
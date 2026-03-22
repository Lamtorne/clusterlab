import '@/app/ui/global.css';
import '@/app/ui/sign-in-page.css'
import { righteous, inter, lusitana } from '../../ui/fonts';
import { Metadata } from 'next';
import Header from '@/app/(main)/components/header'
import Footer from '@/app/(main)/components/footer';
export default function Sign_InLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main>{children}</main>
    );
}
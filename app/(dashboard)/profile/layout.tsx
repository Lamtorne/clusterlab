import { righteous, inter, lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
import "../../ui/profile.css"
export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main>{children}</main>
    );
}
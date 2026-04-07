import { righteous, inter, lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
import "../../ui/new-field.css"
export default function NewFieldLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main>{children}</main>
    );
}
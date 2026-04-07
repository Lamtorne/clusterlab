import { righteous, inter, lusitana } from '@/app/ui/fonts';
import { Metadata } from 'next';
import "../../ui/fields.css"
export default function FieldsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main>{children}</main>
    );
}
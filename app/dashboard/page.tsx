import Link from "next/link";

export default function DashboardPage(){
    return (
        <main className="PageBackground">
            <h1 className="text">Начало</h1>
            
            <Link href="/">
                <h1 className="text">Назад</h1>
            </Link>
        
        </main>
    );

}
import Link from "next/link";

export default function LoginPage(){
    return(
        <main className="PageBackground">
            <h1 className="text"> 
                Log in.
            </h1>
            <Link href="/" className="text"> 
                Log out.
            </Link>
        </main>
    );
}
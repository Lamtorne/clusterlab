'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';




import Link from "next/link";
import Image from "next/image";
export default function Sign_InPage() {

  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === 'user@example.com' && password === 'password') {
      router.push('/');
    } else {
      setError('Invalid email or password.');
    }
  };


  return (
    <main className="SignIn-Page-PageBackground">
      <div className="SignIn-Page-Block-1">
        <div className="SignIn-Page-Block-1-Header">
          <Image
            className="SignIn-Page-Block-1-Logo"
            src="/header/Logo-Transparent.svg"
            alt="ClusterLab Logo"
            width={100}
            height={100}
            priority
          />
          <h2>ClusterLab</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p style={{color: 'red'}}>{error}</p>}
          <button type="submit">Sign In</button>
        </form>
      </div >
    </main >
  );
}
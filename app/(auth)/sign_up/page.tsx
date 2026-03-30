"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Sign_Up() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Позже здесь будет fetch('/api/auth/register', ...)
    console.log("Регистрация:", { fullName, companyName, email, password });

    // После успешной регистрации обычно редиректим на логин или сразу в профиль
    router.push("/sign_in");
  };

  return (
    <main className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Image
            className="auth-logo"
            src="/header/Logo-Transparent.svg"
            alt="ClusterLab Logo"
            width={60}
            height={60}
          />
          <h1>ClusterLab</h1>
          <p>Создайте аккаунт для управления полями</p>
        </div>

        <form onSubmit={handleSignUp} className="auth-form">
          <div className="input-group">
            <label>Имя или название компании</label>
            <input
              type="text"
              placeholder="Иван Иванов / ООО Агросоюз"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Почта</label>
            <input
              type="email"
              placeholder="agronom@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>Пароль</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="auth-button">
            Создать аккаунт
          </button>
        </form>

        <div className="auth-footer">
          <span>Уже есть аккаунт? </span>
          <Link href="/sign_in">Войти</Link>
        </div>
      </div>
    </main>
  );
}

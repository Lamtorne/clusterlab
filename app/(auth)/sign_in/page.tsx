"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Sign_InPage() {
  const router = useRouter();

  // Добавляем Full Name к состоянию
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Пока оставляем заглушку, скоро заменим на fetch запрос к FastAPI
    if (email && password) {
      console.log("Данные для входа:", { fullName, email, password });
      router.push("/");
    } else {
      setError("Пожалуйста, заполните все поля.");
    }
  };

  return (
    <main className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <Image
            className="auth-logo"
            src="/header/Logo-Transparent.svg"
            alt="ClusterLab Logo"
            width={80}
            height={80}
            priority
          />
          <h1>ClusterLab</h1>
          <p>Добро пожаловать в систему точного земледелия</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label>Почта</label>
            <input
              type="email"
              placeholder="example@mail.com"
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
            Войти
          </button>
        </form>

        <div className="auth-footer">
          <span>Нет аккаунта? </span>
          <Link href="/sign_up">Зарегистрироваться</Link>
        </div>
      </div>
    </main>
  );
}

"use client";
import { useState, useEffect } from "react";
import "@/app/ui/profile.css"
import Link from "next/link";
import Image from "next/image";
export default function ProfilePage() {
  return (
    <main className="Profile-Background">
      <h2 className="Profile-Welcome">
        Добро пожаловать ... !
      </h2>
      <h2 className="Profile-Tier">
        Тариф ...
      </h2>
      <h2 className="Profile-Expire">
        Действителен до ...
      </h2>
    </main>
  );
}

"use client";
import { useState, useEffect } from "react";
import "@/app/ui/profile.css"
import Link from "next/link";
import Image from "next/image";
export default function FieldsPage() {
  return (
    <main className="Fields-Background">
      <h2 className="Fields-Header">
        Мои поля
      </h2>

      <div className="Fields-Cards-Container">
        {/*А тут я не знаю, как делать N элементов из  БД, стили я сделаю, оформлю, но именно случайное количество не знаю как */}
      </div>
    </main>
  );
}

"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/dashboard",
    });
    if (res?.error) setError("Неверный email или пароль");
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm p-6 space-y-3">
      <h1 className="text-xl font-semibold">Вход</h1>
      <input
        name="email"
        type="email"
        required
        className="w-full border rounded px-3 py-2"
      />
      <input
        name="password"
        type="password"
        required
        className="w-full border rounded px-3 py-2"
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="w-full rounded bg-black text-white py-2">Войти</button>
    </form>
  );
}

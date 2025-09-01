"use client";

import { useActionState } from "react";
import { signup } from "@/lib/actions";

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signup, undefined);

  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="text-xl font-semibold mb-4">Регистрация</h1>

      <form action={formAction} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Пароль</label>
          <input
            name="password"
            type="password"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Имя (необязательно)</label>
          <input
            name="name"
            type="text"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded bg-black text-white py-2"
        >
          {pending ? "Создание..." : "Создать аккаунт"}
        </button>
      </form>
    </div>
  );
}

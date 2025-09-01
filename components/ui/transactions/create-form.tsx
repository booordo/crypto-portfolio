"use client";

import { createTransaction } from "@/lib/actions";
import { SelectAsset } from "@/db/schema";
import { Button } from "../button";

export default function CreateTransactionForm({
  assets,
}: {
  assets: SelectAsset[];
}) {
  return (
    <form
      action={createTransaction}
      className="rounded-2xl bg-white p-6 shadow space-y-4"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">Актив</label>
          <select
            name="assetId"
            className="w-full rounded-lg border px-3 py-2"
            required
          >
            <option value="">— выбери —</option>
            {assets.map((a) => (
              <option key={a.id} value={a.id}>
                {a.symbol} — {a.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Тип</label>
          <select
            name="type"
            className="w-full rounded-lg border px-3 py-2"
            required
          >
            <option value="buy">Покупка</option>
            <option value="sell">Продажа</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">
            Дата и время
          </label>
          <input
            name="ts"
            type="datetime-local"
            defaultValue={new Date().toISOString().slice(0, 16)}
            className="w-full rounded-lg border px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Количество</label>
          <input
            name="qty"
            inputMode="decimal"
            placeholder="0.5"
            className="w-full rounded-lg border px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Цена, $</label>
          <input
            name="priceUsd"
            inputMode="decimal"
            placeholder="30000"
            className="w-full rounded-lg border px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Комиссия, $
          </label>
          <input
            name="feeUsd"
            inputMode="decimal"
            defaultValue="0"
            className="w-full rounded-lg border px-3 py-2"
          />
        </div>
      </div>

      <Button type="submit">Добавить</Button>
    </form>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { loadJson, saveJson } from "@/lib/tstore";

type TxType = "buy" | "sell";

type Tx = {
  id: number;
  asset: string;
  type: TxType;
  ts: string; // ISO
  qty: number;
  priceUsd: number;
  feeUsd: number;
};

const demoAssets = ["BTC", "ETH", "SOL"];

export default function TransactionsPage() {
  const [rows, setRows] = useState<Tx[]>(() => loadJson<Tx[]>("tx_rows", []));
  const [form, setForm] = useState({
    asset: "BTC",
    type: "buy" as TxType,
    ts: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
    qty: "",
    priceUsd: "",
    feeUsd: "0",
  });

  useEffect(() => {
    saveJson("tx_rows", rows);
  }, [rows]);

  function addTx() {
    const qty = Number(form.qty);
    const price = Number(form.priceUsd);
    const fee = Number(form.feeUsd || 0);
    if (!qty || !price) return alert("Укажи количество и цену");

    const tx: Tx = {
      id: Date.now(),
      asset: form.asset,
      type: form.type,
      ts: new Date(form.ts).toISOString(),
      qty,
      priceUsd: price,
      feeUsd: fee,
    };
    setRows((s) => [tx, ...s]);
    // сброс полей количества/цены
    setForm((f) => ({ ...f, qty: "", priceUsd: "", feeUsd: "0" }));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Сделки (локально, без БД)</h1>

      {/* Форма */}
      <div className="rounded-2xl bg-white p-6 shadow space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
          {/* Актив */}
          <div className="sm:col-span-1">
            <label className="block text-sm text-gray-600 mb-1">Актив</label>
            <select
              value={form.asset}
              onChange={(e) =>
                setForm((f) => ({ ...f, asset: e.target.value }))
              }
              className="w-full rounded-lg border px-3 py-2"
            >
              {demoAssets.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Тип */}
          <div className="sm:col-span-1">
            <label className="block text-sm text-gray-600 mb-1">Тип</label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm((f) => ({ ...f, type: e.target.value as TxType }))
              }
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="buy">Покупка</option>
              <option value="sell">Продажа</option>
            </select>
          </div>

          {/* Дата/время */}
          <div className="sm:col-span-2">
            <label className="block text-sm text-gray-600 mb-1">
              Дата и время
            </label>
            <input
              type="datetime-local"
              value={form.ts}
              onChange={(e) => setForm((f) => ({ ...f, ts: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          {/* Кол-во */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Количество
            </label>
            <input
              inputMode="decimal"
              value={form.qty}
              onChange={(e) => setForm((f) => ({ ...f, qty: e.target.value }))}
              placeholder="напр. 0.5"
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          {/* Цена, $ */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Цена, $</label>
            <input
              inputMode="decimal"
              value={form.priceUsd}
              onChange={(e) =>
                setForm((f) => ({ ...f, priceUsd: e.target.value }))
              }
              placeholder="напр. 30000"
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>

          {/* Комиссия, $ */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Комиссия, $
            </label>
            <input
              inputMode="decimal"
              value={form.feeUsd}
              onChange={(e) =>
                setForm((f) => ({ ...f, feeUsd: e.target.value }))
              }
              placeholder="0"
              className="w-full rounded-lg border px-3 py-2"
            />
          </div>
        </div>

        <Button onClick={addTx}>Добавить</Button>
      </div>

      {/* Таблица */}
      <div className="rounded-2xl bg-white p-6 shadow">
        {rows.length === 0 ? (
          <p className="text-gray-600">Пока нет сделок. Добавь первую выше.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500">
                <tr>
                  <th className="py-2">Дата</th>
                  <th>Актив</th>
                  <th>Тип</th>
                  <th>Qty</th>
                  <th>Цена $</th>
                  <th>Комиссия $</th>
                  <th>Сумма $</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="py-2">{new Date(r.ts).toLocaleString()}</td>
                    <td>{r.asset}</td>
                    <td>{r.type === "buy" ? "Покупка" : "Продажа"}</td>
                    <td>{r.qty}</td>
                    <td>{r.priceUsd}</td>
                    <td>{r.feeUsd}</td>
                    <td>
                      {(
                        r.qty * r.priceUsd +
                        r.feeUsd * (r.type === "buy" ? 1 : 0)
                      ).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

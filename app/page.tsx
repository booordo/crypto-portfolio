"use client";

import { useMemo } from "react";
import { loadJson } from "@/lib/tstore";

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

type Position = {
  asset: string;
  qty: number;
  cost: number; // суммарная себестоимость
  avgCost: number; // cost / qty (если qty>0)
};

// расчёт позиций по WAC
function computePositions(rows: Tx[]): Position[] {
  // важен порядок дат для корректной обработки продаж
  const ordered = [...rows].sort(
    (a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime()
  );

  const map = new Map<string, { qty: number; cost: number }>();

  for (const r of ordered) {
    const state = map.get(r.asset) ?? { qty: 0, cost: 0 };
    if (r.type === "buy") {
      state.qty += r.qty;
      state.cost += r.qty * r.priceUsd + (r.feeUsd || 0);
    } else {
      const qtyBefore = state.qty;
      const costBefore = state.cost;
      const avg = qtyBefore > 0 ? costBefore / qtyBefore : 0;
      state.qty = Math.max(0, qtyBefore - r.qty); // защитимся от отрицательных остатков
      state.cost = Math.max(0, costBefore - avg * r.qty);
      // Примечание: комиссию на продажах сейчас не учитываем. Можно добавить позже.
    }
    map.set(r.asset, state);
  }

  const list: Position[] = [];
  for (const [asset, { qty, cost }] of map.entries()) {
    if (qty <= 0) continue; // не показываем закрытые позиции
    list.push({
      asset,
      qty: Number(qty.toFixed(8)),
      cost: Number(cost.toFixed(2)),
      avgCost: Number((cost / qty).toFixed(6)),
    });
  }
  // сортируем по стоимости убыв.
  list.sort((a, b) => b.cost - a.cost);
  return list;
}

export default function Home() {
  const rows = useMemo<Tx[]>(() => loadJson<Tx[]>("tx_rows", []), []);

  const positions = useMemo(() => computePositions(rows), [rows]);

  const totalTrades = rows.length;
  const totalCost = positions.reduce((s, p) => s + p.cost, 0);

  const fmtUSD = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold">Дашборд</h1>

      {/* Карточки */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="text-gray-500 text-sm">Всего сделок</div>
          <div className="text-3xl font-semibold mt-1">{totalTrades}</div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="text-gray-500 text-sm">
            Себестоимость открытых позиций
          </div>
          <div className="text-3xl font-semibold mt-1">
            {fmtUSD.format(totalCost)}
          </div>
        </div>
      </div>

      {/* Таблица позиций */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <div className="text-lg font-semibold mb-3">Позиции (WAC)</div>
        {positions.length === 0 ? (
          <p className="text-gray-600">
            Пока нет открытых позиций. Добавь сделки на странице{" "}
            <span className="font-medium">/transactions</span>.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-gray-500">
                <tr>
                  <th className="py-2">Актив</th>
                  <th>Кол-во</th>
                  <th>Средняя цена ($)</th>
                  <th>Себестоимость ($)</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((p) => (
                  <tr key={p.asset} className="border-t">
                    <td className="py-2 font-medium">{p.asset}</td>
                    <td>{p.qty}</td>
                    <td>{p.avgCost}</td>
                    <td>{fmtUSD.format(p.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="mt-3 text-right text-sm text-gray-600">
          Итого себестоимость:{" "}
          <span className="font-medium">{fmtUSD.format(totalCost)}</span>
        </div>
      </div>

      <p className="text-gray-600">
        Цена рынка пока не учитывается. Позже добавим «живые цены» и PnL. Сейчас
        считаем только количество и среднюю стоимость.
      </p>
    </main>
  );
}

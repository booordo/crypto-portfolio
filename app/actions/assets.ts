// app/actions/assets.ts
"use server";

import { db } from "@/db/client";
import { assets } from "@/db/schema";

export async function seedAssets() {
  // Простой сид: добавим BTC/ETH/SOL. Если сид нажмёшь дважды — будет ошибка о дублях.
  // Позже добавим уникальный индекс и onConflictDoNothing. Сейчас — коротко и по делу.
  await db.insert(assets).values([
    { symbol: "BTC", name: "Bitcoin", coingeckoId: "bitcoin", isActive: 1 },
    { symbol: "ETH", name: "Ethereum", coingeckoId: "ethereum", isActive: 1 },
    { symbol: "SOL", name: "Solana", coingeckoId: "solana", isActive: 1 },
  ]);
}

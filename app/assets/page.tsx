// app/assets/page.tsx
import { db } from "@/db/client";
import { assets } from "@/db/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { seedAssets } from "@/app/actions/assets";

export default async function AssetsPage() {
  const rows = await db.select().from(assets).orderBy(assets.symbol);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Доступные активы</h1>
        {/* Простая форма, чтобы вызвать Server Action */}
        <form action={seedAssets}>
          <Button type="submit" variant="outline">
            Добавить BTC/ETH/SOL
          </Button>
        </form>
      </div>

      {rows.length === 0 ? (
        <p className="text-gray-600">
          Пока в базе нет активов. Нажми кнопку «Добавить BTC/ETH/SOL».
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {rows.map((a) => (
            <Card key={a.id} className="p-4">
              <div className="text-sm text-gray-500">{a.symbol}</div>
              <div className="text-lg font-semibold">{a.name}</div>
              <div className="mt-1 text-xs text-gray-500">
                coingecko: <code>{a.coingeckoId ?? "—"}</code>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

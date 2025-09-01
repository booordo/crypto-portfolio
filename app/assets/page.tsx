import { Card } from "@/components/ui/card";

const demoAssets = [
  { symbol: "BTC", name: "Bitcoin", coingeckoId: "bitcoin" },
  { symbol: "ETH", name: "Ethereum", coingeckoId: "ethereum" },
  { symbol: "SOL", name: "Solana", coingeckoId: "solana" },
];

export default function AssetsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Доступные активы</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {demoAssets.map((a) => (
          <Card key={a.symbol} className="p-4">
            <div className="text-sm text-gray-500">{a.symbol}</div>
            <div className="text-lg font-semibold">{a.name}</div>
            <div className="mt-1 text-xs text-gray-500">
              coingecko: <code>{a.coingeckoId}</code>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

import { fetchAssets, fetchTransaction } from "@/lib/data";
import CreateTransactionForm from "@/components/ui/transactions/create-form";

export default async function Page() {
  const assets = await fetchAssets();
  const transactions = await fetchTransaction();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Сделки (БД)</h1>

      {/* Форма добавления */}
      <CreateTransactionForm assets={assets} />

      {/* Таблица из БД */}
      <div className="rounded-2xl bg-white p-6 shadow">
        {transactions.length === 0 ? (
          <p className="text-gray-600">
            Пока нет сделок для пользователя demo.
          </p>
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
                </tr>
              </thead>
              <tbody>
                {transactions.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="py-2">
                      {new Date(
                        r.tsTrade as unknown as string
                      ).toLocaleString()}
                    </td>
                    <td>
                      {assets.find((a) => a.id === r.assetId)?.symbol ??
                        r.assetId}
                    </td>
                    <td>{r.type === "buy" ? "Покупка" : "Продажа"}</td>
                    <td>{String(r.qty)}</td>
                    <td>{String(r.price)}</td>
                    <td>{String(r.feeAmount ?? 0)}</td>
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

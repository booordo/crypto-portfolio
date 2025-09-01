"use client";

export default function Home() {
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold">Дашборд</h1>

      {/* Карточки */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="text-gray-500 text-sm">Всего сделок</div>
          <div className="text-3xl font-semibold mt-1"></div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="text-gray-500 text-sm">
            Себестоимость открытых позиций
          </div>
          <div className="text-3xl font-semibold mt-1"></div>
        </div>
      </div>

      {/* Таблица позиций */}
      <div className="rounded-2xl bg-white p-6 shadow">
        <div className="text-lg font-semibold mb-3">Позиции (WAC)</div>
        <div className="mt-3 text-right text-sm text-gray-600">
          Итого себестоимость: <span className="font-medium"></span>
        </div>
      </div>

      <p className="text-gray-600">
        Цена рынка пока не учитывается. Позже добавим «живые цены» и PnL. Сейчас
        считаем только количество и среднюю стоимость.
      </p>
    </main>
  );
}

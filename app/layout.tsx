import type { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crypto Portfolio",
  description: "Трекер крипто-портфеля",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gray-100">
        {/* Навигация */}
        <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
          <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
            <div className="flex items-center space-x-6">
              <Link href="/" className="font-bold text-lg">
                Crypto Portfolio
              </Link>
              <Link
                href="/transactions"
                className="text-gray-700 hover:text-blue-600"
              >
                Сделки
              </Link>
              <Link
                href="/assets"
                className="text-gray-700 hover:text-blue-600"
              >
                Активы
              </Link>
            </div>
            <Button size="sm" variant="outline">
              Войти
            </Button>
          </nav>
        </header>

        {/* Контент */}
        <main className="mx-auto max-w-5xl p-6">{children}</main>
      </body>
    </html>
  );
}

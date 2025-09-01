import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  numeric,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const assetsTable = pgTable(
  "assets",
  {
    id: serial("id").primaryKey(),
    symbol: text("symbol").notNull(), // "BTC"
    name: text("name"),
    coingeckoId: text("coingecko_id"),
    isActive: integer("is_active").default(1),
  },
  (table) => [uniqueIndex("assets_symbol_unique").on(table.symbol)]
);

export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  assetId: integer("asset_id").notNull(),
  tsTrade: timestamp("ts_trade", { withTimezone: true }).notNull(),
  type: text("type").notNull(), // "buy" | "sell"
  qty: numeric("qty", { precision: 20, scale: 8 }).notNull(),
  priceUsd: numeric("price_usd", { precision: 20, scale: 8 }).notNull(),
  feeUsd: numeric("fee_usd", { precision: 20, scale: 8 }).default("0"),
  note: text("note"),
  extRef: text("ext_ref"),
});

export type InsertAsset = typeof assetsTable.$inferInsert;
export type SelectAsset = typeof assetsTable.$inferSelect;
export type InsertTransaction = typeof transactionsTable.$inferInsert;
export type SelectTransaction = typeof transactionsTable.$inferSelect;

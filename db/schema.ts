import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  numeric,
} from "drizzle-orm/pg-core";

export const assets = pgTable("assets", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  name: text("name"),
  coingeckoId: text("coingecko_id"),
  isActive: integer("is_active").default(1),
});

export const transactions = pgTable("transactions", {
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

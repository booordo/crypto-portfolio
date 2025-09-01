import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  numeric,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    name: text("name"),
    passwordHash: text("password_hash").notNull(),
    image: text("image"),
    emailVerified: timestamp("email_verified", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [uniqueIndex("users_email_unique").on(t.email)]
);

export const userSettingsTable = pgTable("user_settings", {
  userId: text("user_id").primaryKey(),
  baseCurrency: text("base_currency").notNull().default("USD"),
});

export const providersTable = pgTable(
  "providers",
  {
    id: serial("id").primaryKey(),
    code: text("code").notNull(),
    name: text("name").notNull(),
    website: text("website"),
    isActive: integer("is_active").default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [uniqueIndex("providers_code_unique").on(t.code)]
);

export const assetsTable = pgTable(
  "assets",
  {
    id: serial("id").primaryKey(),
    symbol: text("symbol").notNull(),
    name: text("name"),
    coingeckoId: text("coingecko_id"),
    isActive: integer("is_active").default(1),
  },
  (t) => [uniqueIndex("assets_symbol_unique").on(t.symbol)]
);

export const accountsTable = pgTable(
  "accounts",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),
    providerId: integer("provider_id")
      .notNull()
      .references(() => providersTable.id, { onDelete: "restrict" }),
    displayName: text("display_name").notNull(),
    note: text("note"),
    isActive: integer("is_active").default(1),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (t) => [
    index("accounts_user_idx").on(t.userId),
    index("accounts_exchange_idx").on(t.providerId),
  ]
);

export const transactionsTable = pgTable(
  "transactions",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(),

    accountId: integer("account_id").references(() => accountsTable.id, {
      onDelete: "set null",
    }),

    assetId: integer("asset_id")
      .notNull()
      .references(() => assetsTable.id, { onDelete: "restrict" }),

    tsTrade: timestamp("ts_trade", { withTimezone: true }).notNull(),
    type: text("type").notNull(), // 'BUY' | 'SELL' | 'TRANSFER_IN' | 'TRANSFER_OUT' | 'FEE' | 'AIRDROP' | 'STAKING_REWARD' | 'SWAP'

    qty: numeric("qty", { precision: 20, scale: 8 }).notNull(),
    price: numeric("price", { precision: 20, scale: 8 }),

    quoteSymbol: text("quote_symbol"),
    quoteAmount: numeric("quote_amount", { precision: 20, scale: 8 }),

    feeSymbol: text("fee_symbol"),
    feeAmount: numeric("fee_amount", { precision: 20, scale: 8 }),

    side: text("side"), // для spot: BUY/SELL
    orderType: text("order_type"), // LIMIT/MARKET/...
    isMaker: integer("is_maker"), // 1/0
    orderId: text("order_id"),
    tradeId: text("trade_id"),

    source: text("source").default("CSV"), // CSV | API | MANUAL
    extRef: text("ext_ref"),
    note: text("note"),
  },
  (t) => [
    index("tx_user_ts_idx").on(t.userId, t.tsTrade),
    index("tx_user_asset_idx").on(t.userId, t.assetId),
    index("tx_account_idx").on(t.accountId),
  ]
);

export type InsertAsset = typeof assetsTable.$inferInsert;
export type SelectAsset = typeof assetsTable.$inferSelect;
export type InsertTransaction = typeof transactionsTable.$inferInsert;
export type SelectTransaction = typeof transactionsTable.$inferSelect;

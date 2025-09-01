import { db } from "@/db";
import {
  assetsTable,
  transactionsTable,
  SelectAsset,
  SelectTransaction,
} from "@/db/schema";

export async function fetchAssets(): Promise<SelectAsset[]> {
  return await db.select().from(assetsTable).orderBy(assetsTable.symbol);
}

export async function fetchTransaction(): Promise<SelectTransaction[]> {
  return await db
    .select()
    .from(transactionsTable)
    .orderBy(transactionsTable.tsTrade);
}

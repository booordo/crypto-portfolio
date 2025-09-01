"use server";

import { db } from "@/lib/db/client";
import {
  InsertAsset,
  InsertTransaction,
  assetsTable,
  transactionsTable,
} from "@/lib/db/schema";

const USER_ID = "user-123";

export async function createAsset(formData: FormData) {
  const asset: InsertAsset = {
    symbol: formData.get("symbol") as string,
    name: formData.get("name") as string,
    coingeckoId: formData.get("coingeckoId") as string,
  };

  await db.insert(assetsTable).values(asset);
}

export async function createTransaction(formData: FormData) {
  const transaction: InsertTransaction = {
    userId: USER_ID,
    assetId: Number(formData.get("assetId")),
    tsTrade: new Date(formData.get("tsTrade") as string),
    type: formData.get("type") as string,
    qty: formData.get("qty") as string,
    priceUsd: formData.get("priceUsd") as string,
    feeUsd: formData.get("feeUsd") ? (formData.get("feeUsd") as string) : "0",
  };

  await db.insert(transactionsTable).values(transaction);
}

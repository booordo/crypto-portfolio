"use server";

import { db } from "@/db";
import { z } from "zod";
import { randomUUID } from "crypto";
import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import {
  InsertAsset,
  InsertTransaction,
  assetsTable,
  transactionsTable,
  usersTable,
  userSettingsTable,
} from "@/db/schema";

const SignUp = z.object({
  email: z.email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export async function signup(
  _: { error?: string } | undefined,
  formData: FormData
) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "");

  const p = SignUp.safeParse({ email, password, name });
  if (!p.success) return { error: p.error.message ?? "Invalid form" };

  const [exists] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);
  if (exists) return { error: "Email уже используется" };

  const id = randomUUID();
  const passwordHash = await hash(password, 10);

  await db
    .insert(usersTable)
    .values({ id, email, passwordHash, name: name || null });
  await db
    .insert(userSettingsTable)
    .values({ userId: id, baseCurrency: "USD" });

  redirect(`/api/auth/signin?callbackUrl=/dashboard`);
}

export async function createAsset(formData: FormData) {
  const asset: InsertAsset = {
    symbol: formData.get("symbol") as string,
    name: formData.get("name") as string,
    coingeckoId: formData.get("coingeckoId") as string,
  };

  await db.insert(assetsTable).values(asset);
}

const USER_ID = "8a1f3c2e-6f4b-4d2e-9f4e-2b5c6d7e8f90"; // Замените на реальный userId из сессии

export async function createTransaction(formData: FormData) {
  const transaction: InsertTransaction = {
    userId: USER_ID,
    assetId: Number(formData.get("assetId")),
    tsTrade: new Date(formData.get("tsTrade") as string),
    type: formData.get("type") as string,
    qty: formData.get("qty") as string,
    price: formData.get("price") as string,
    feeAmount: formData.get("feeAmount")
      ? (formData.get("feeAmount") as string)
      : "0",
  };

  await db.insert(transactionsTable).values(transaction);
}

// lib/auth-options.ts
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";
import { db } from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const Login = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// lib/auth-options.ts
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  debug: true, // ← добавь
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error("authorize: no credentials");
            return null;
          }
          const email = String(credentials.email);
          const password = String(credentials.password);

          const [user] = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, email))
            .limit(1);

          if (!user) {
            console.error("authorize: user not found", { email });
            return null;
          }

          const ok = await compare(password, user.passwordHash);
          if (!ok) {
            console.error("authorize: bad password", { email });
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name ?? undefined,
          };
        } catch (e) {
          console.error("authorize error:", e);
          // вернуть null, чтобы NextAuth показал CredentialsSignin
          return null;
        }
      },
    }),
  ],
};

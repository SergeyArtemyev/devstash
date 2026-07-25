import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "./auth.config";

// Full Auth.js config: the edge-safe base (`auth.config.ts`) plus the Prisma
// adapter. `strategy: "jwt"` is required with the split-config pattern — the
// proxy has no adapter, so it can't look sessions up in the database.
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
});

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { signInSchema } from "@/lib/auth-schemas";
import { getUserByEmail } from "@/lib/db/users";
import { prisma } from "@/lib/prisma";
import authConfig from "./auth.config";

// The real email/password provider: same shape as the placeholder in
// `auth.config.ts`, but `authorize` verifies the submitted password against the
// bcrypt hash on the User row.
const credentials = Credentials({
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  authorize: async (raw) => {
    const parsed = signInSchema.safeParse(raw);
    if (!parsed.success) return null;

    const user = await getUserByEmail(parsed.data.email);
    // No `password` means the account was created via OAuth — it can only sign
    // in through that provider.
    if (!user?.password) return null;

    const matches = await bcrypt.compare(parsed.data.password, user.password);
    if (!matches) return null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    };
  },
});

// Full Auth.js config: the edge-safe base (`auth.config.ts`) plus the Prisma
// adapter. `strategy: "jwt"` is required with the split-config pattern — the
// proxy has no adapter, so it can't look sessions up in the database. It is
// also the only strategy the Credentials provider supports, since credentials
// sign-ins are never persisted as adapter sessions.
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: authConfig.providers.map((provider) =>
    "id" in provider && provider.id === "credentials" ? credentials : provider,
  ),
});

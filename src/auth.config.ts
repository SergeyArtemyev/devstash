import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

// Edge/proxy-safe half of the Auth.js config: providers and callbacks only,
// no database adapter. `src/proxy.ts` initializes NextAuth with just this so
// route protection never pulls Prisma (and its TCP driver) into the proxy.
// The full config lives in `src/auth.ts`.
export default {
  providers: [
    GitHub,
    // Placeholder only — declaring it here keeps the provider list (and so the
    // sign-in form Auth.js renders) identical on both halves of the split
    // config. `authorize` always denies because validating a password needs
    // Prisma + bcrypt; `src/auth.ts` swaps in the real implementation.
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: () => null,
    }),
  ],
  callbacks: {
    // With `strategy: "jwt"` the session is built from the token, so the user
    // id has to be copied onto the token at sign-in to survive later requests.
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

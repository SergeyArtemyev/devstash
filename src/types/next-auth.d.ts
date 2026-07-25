import type { DefaultSession } from "next-auth";

// Module augmentation: expose the user id on the session and the JWT so
// `session.user.id` is typed everywhere (populated by the callbacks in
// `src/auth.config.ts`).
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

// Augment `@auth/core/jwt`, not `next-auth/jwt` — the latter only re-exports
// (`export * from "@auth/core/jwt"`), so augmenting it declares a separate
// interface instead of merging into the one the callbacks actually use.
declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
  }
}

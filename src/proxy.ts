import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import authConfig from "./auth.config";

// Initialized from the adapter-free config on purpose — the proxy only needs
// to read the JWT, never the database. See `src/auth.config.ts`.
const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
  if (req.auth) return;

  // Send unauthenticated visitors to NextAuth's built-in sign-in page and
  // bring them back to whatever they were trying to reach.
  const signInUrl = new URL("/api/auth/signin", req.nextUrl.origin);
  signInUrl.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);

  return NextResponse.redirect(signInUrl);
});

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};

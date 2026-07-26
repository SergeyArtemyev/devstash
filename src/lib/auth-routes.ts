// Kept out of `src/actions/auth.ts`: a `"use server"` module may only export
// async functions, so shared auth constants live here instead.

export const SIGN_IN_ROUTE = "/sign-in";

// Where a successful sign-in lands when no `callbackUrl` was supplied.
export const DEFAULT_SIGN_IN_REDIRECT = "/dashboard";

"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { DEFAULT_SIGN_IN_REDIRECT, SIGN_IN_ROUTE } from "@/lib/auth-routes";
import { signInSchema } from "@/lib/auth-schemas";

export interface SignInState {
  error?: string;
}

// Only same-origin paths are accepted as a post-sign-in destination. Auth.js
// also normalizes `redirectTo` through its `redirect` callback, but rejecting
// absolute URLs here keeps the open-redirect surface at zero.
function safeCallbackUrl(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return DEFAULT_SIGN_IN_REDIRECT;
  if (!value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_SIGN_IN_REDIRECT;
  }
  return value;
}

export async function signInWithGitHub(formData: FormData) {
  await signIn("github", { redirectTo: safeCallbackUrl(formData.get("callbackUrl")) });
}

export async function signInWithCredentials(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await signIn("credentials", {
      ...parsed.data,
      redirectTo: safeCallbackUrl(formData.get("callbackUrl")),
    });
  } catch (error) {
    // A successful sign-in throws NEXT_REDIRECT, which is not an AuthError and
    // so has to bubble up for Next.js to perform the redirect.
    if (error instanceof AuthError) {
      return {
        error:
          error.type === "CredentialsSignin"
            ? "Invalid email or password"
            : "Could not sign you in. Please try again.",
      };
    }
    throw error;
  }

  return {};
}

export async function signOutAction() {
  await signOut({ redirectTo: SIGN_IN_ROUTE });
}

import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";

import { FormError } from "@/components/auth/FormError";
import { SignInForm } from "@/components/auth/SignInForm";
import { DEFAULT_SIGN_IN_REDIRECT } from "@/lib/auth-routes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign in — DevStash",
};

// Auth.js appends `?error=<code>` when a provider callback fails. Only the
// codes reachable from this page are spelled out; the rest fall back.
const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Invalid email or password",
  OAuthAccountNotLinked:
    "An account with that email already exists. Sign in with your password instead.",
  OAuthSignin: "Could not start the GitHub sign-in. Please try again.",
  OAuthCallbackError: "GitHub sign-in was cancelled or failed.",
  Configuration: "Sign-in is misconfigured. Please contact support.",
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string; registered?: string }>;
}) {
  const params = await searchParams;
  const error = params.error
    ? (ERROR_MESSAGES[params.error] ?? "Could not sign you in. Please try again.")
    : undefined;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your DevStash account.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {params.registered && (
          <p className="flex items-start gap-2 rounded-md bg-emerald-500/10 px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            <span>Account created. Sign in to continue.</span>
          </p>
        )}

        <FormError message={error} />

        <SignInForm callbackUrl={params.callbackUrl ?? DEFAULT_SIGN_IN_REDIRECT} />
      </CardContent>
    </Card>
  );
}

"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { signInWithCredentials, signInWithGitHub } from "@/actions/auth";
import { FormError } from "@/components/auth/FormError";
import { GitHubIcon } from "@/components/auth/GitHubIcon";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignInForm({ callbackUrl }: { callbackUrl: string }) {
  const [state, formAction] = useActionState(signInWithCredentials, {});
  // React resets uncontrolled fields once a form action settles, which would
  // wipe the email on every failed attempt. Keeping it controlled preserves it.
  const [email, setEmail] = useState("");

  return (
    <div className="space-y-4">
      {/* Separate <form> from the credentials one below — forms cannot nest. */}
      <form action={signInWithGitHub}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <SubmitButton
          variant="outline"
          pendingLabel="Redirecting..."
          className="w-full"
        >
          <GitHubIcon className="size-4" />
          Sign in with GitHub
        </SubmitButton>
      </form>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground uppercase">or</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="callbackUrl" value={callbackUrl} />

        <FormError message={state.error} />

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
          />
        </div>

        <SubmitButton pendingLabel="Signing in..." className="w-full">
          Sign in
        </SubmitButton>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { FormError } from "@/components/auth/FormError";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema } from "@/lib/auth-schemas";

type FieldErrors = Partial<Record<keyof z.infer<typeof registerSchema>, string>>;

interface RegisterResponse {
  success: boolean;
  error?: string;
}

// A client form rather than a Server Action: registration posts to the public
// `POST /api/auth/register` endpoint that already exists (and that future
// CLI/mobile clients share).
export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(undefined);
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const parsed = registerSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
      const flattened = z.flattenError(parsed.error);
      setFieldErrors(
        Object.fromEntries(
          Object.entries(flattened.fieldErrors).map(([field, messages]) => [
            field,
            messages?.[0],
          ]),
        ),
      );
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
        const result: RegisterResponse = await response.json();

        if (!response.ok || !result.success) {
          setFormError(result.error ?? "Something went wrong. Please try again.");
          return;
        }

        router.push("/sign-in?registered=1");
      } catch {
        setFormError("Could not reach the server. Please try again.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormError message={formError} />

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          placeholder="Ada Lovelace"
          aria-invalid={Boolean(fieldErrors.name)}
        />
        <FieldError message={fieldErrors.name} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          aria-invalid={Boolean(fieldErrors.email)}
        />
        <FieldError message={fieldErrors.email} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          aria-invalid={Boolean(fieldErrors.password)}
        />
        <FieldError message={fieldErrors.password} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Re-enter your password"
          aria-invalid={Boolean(fieldErrors.confirmPassword)}
        />
        <FieldError message={fieldErrors.confirmPassword} />
      </div>

      <Button type="submit" size="lg" disabled={isPending} className="w-full">
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
            Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-destructive">{message}</p>;
}

"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

// Reads the pending state of the nearest enclosing <form>, so each form on the
// sign-in page (credentials, GitHub) disables only its own button.
export function SubmitButton({
  children,
  pendingLabel,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "default" | "outline";
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size="lg"
      disabled={pending}
      className={className}
    >
      {pending ? (
        <>
          <Loader2 className="animate-spin" />
          {pendingLabel ?? "Please wait..."}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

import Link from "next/link";
import { Layers } from "lucide-react";

// Shared chrome for the sign-in / register pages: centered column with the
// DevStash mark above the form card.
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 py-10">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <Layers className="size-5" />
        </div>
        <span className="text-xl font-semibold tracking-tight">DevStash</span>
      </Link>
      {children}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserAvatar } from "@/components/user/UserAvatar";

export const metadata: Metadata = {
  title: "Profile — DevStash",
};

// Placeholder destination for the sidebar avatar/settings links. Profile
// editing is not part of this feature — this just shows the signed-in account.
export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/sign-in?callbackUrl=%2Fprofile");

  const { user } = session;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your DevStash account.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <UserAvatar user={user} size="lg" />
          <div className="min-w-0">
            <p className="truncate font-medium">{user.name ?? "Unnamed"}</p>
            <p className="truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

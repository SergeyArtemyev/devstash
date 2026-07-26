"use client";

import Link from "next/link";
import { ChevronsUpDown, LogOut, Settings, User } from "lucide-react";

import { signOutAction } from "@/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserAvatar, type AvatarUser } from "@/components/user/UserAvatar";

export function SidebarUser({
  user,
  onNavigate,
}: {
  user: AvatarUser;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1 border-t border-sidebar-border p-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex min-w-0 flex-1 items-center gap-3 rounded-md p-1 text-left transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <UserAvatar user={user} size="lg" className="shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {user.name ?? "Account"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
          <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
        </DropdownMenuTrigger>

        {/* Opens upward — the trigger sits at the bottom of the sidebar. */}
        <DropdownMenuContent side="top" align="start" className="min-w-56">
          <DropdownMenuItem
            render={
              <Link href="/profile" onClick={onNavigate}>
                <User />
                Profile
              </Link>
            }
          />
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            // `closeOnClick: false` keeps the menu mounted while the sign-out
            // server action runs and redirects.
            closeOnClick={false}
            onClick={() => signOutAction()}
          >
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link
        href="/profile"
        onClick={onNavigate}
        aria-label="Profile settings"
        className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground"
      >
        <Settings className="size-4" />
      </Link>
    </div>
  );
}

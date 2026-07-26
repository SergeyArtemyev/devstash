"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  Code,
  File,
  Folder,
  Image,
  Layers,
  Link as LinkIcon,
  Sparkles,
  Star,
  StickyNote,
  Terminal,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { AvatarUser } from "@/components/user/UserAvatar";
import type { CollectionWithMeta } from "@/lib/db/collections";
import type { ItemTypeWithCount } from "@/lib/db/items";
import { SidebarUser } from "./SidebarUser";
import { useSidebar } from "./sidebar-provider";

// Types that are Pro-only features (file uploads / images).
const PRO_TYPE_NAMES = new Set(["Files", "Images"]);

const TYPE_ICONS: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
};

function CollapsibleGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-3 py-1.5 text-xs font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground"
      >
        <span>{label}</span>
        <ChevronDown
          className={cn("size-3.5 transition-transform", !open && "-rotate-90")}
        />
      </button>
      {open && <div className="mt-1 space-y-0.5">{children}</div>}
    </div>
  );
}

function SidebarBody({
  itemTypes,
  collections,
  user,
  onNavigate,
}: {
  itemTypes: ItemTypeWithCount[];
  collections: CollectionWithMeta[];
  user: AvatarUser;
  onNavigate?: () => void;
}) {
  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const recentCollections = collections.filter((c) => !c.isFavorite);

  return (
    <div className="flex h-full w-64 flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <Layers className="size-5" />
        </div>
        <span className="text-lg font-semibold tracking-tight">DevStash</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-4 overflow-y-auto px-2 py-2">
        <CollapsibleGroup label="Types">
          {itemTypes.map((type) => {
            const Icon = TYPE_ICONS[type.icon ?? ""] ?? File;
            return (
              <Link
                key={type.id}
                href={`/items/${type.name.toLowerCase()}`}
                onClick={onNavigate}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Icon
                  className="size-4 shrink-0"
                  style={type.color ? { color: type.color } : undefined}
                />
                <span className="flex-1 truncate">{type.name}</span>
                {PRO_TYPE_NAMES.has(type.name) && (
                  <Badge
                    variant="outline"
                    className="h-4 rounded px-1 text-[9px] font-semibold tracking-wider text-muted-foreground"
                  >
                    PRO
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {type.count}
                </span>
              </Link>
            );
          })}
        </CollapsibleGroup>

        <div className="border-t border-sidebar-border" />

        <CollapsibleGroup label="Collections">
          {favoriteCollections.length > 0 && (
            <>
              <p className="px-3 pt-1 pb-0.5 text-[10px] font-medium tracking-wider text-muted-foreground/70 uppercase">
                Favorites
              </p>
              {favoriteCollections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.id}`}
                  onClick={onNavigate}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Folder className="size-4 shrink-0 text-muted-foreground" />
                  <span className="flex-1 truncate">{col.name}</span>
                  <Star className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
                </Link>
              ))}
            </>
          )}

          {recentCollections.length > 0 && (
            <>
              <p className="px-3 pt-3 pb-0.5 text-[10px] font-medium tracking-wider text-muted-foreground/70 uppercase">
                Recent
              </p>
              {recentCollections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.id}`}
                  onClick={onNavigate}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <span
                    className={cn(
                      "size-2.5 shrink-0 rounded-full",
                      !col.accentColor && "border border-muted-foreground/40",
                    )}
                    style={
                      col.accentColor
                        ? { backgroundColor: col.accentColor }
                        : undefined
                    }
                    aria-hidden
                  />
                  <span className="flex-1 truncate">{col.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {col.itemCount}
                  </span>
                </Link>
              ))}
            </>
          )}

          <Link
            href="/collections"
            onClick={onNavigate}
            className="mt-1 block rounded-md px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            View all collections
          </Link>
        </CollapsibleGroup>
      </nav>

      <SidebarUser user={user} onNavigate={onNavigate} />
    </div>
  );
}

export function Sidebar({
  itemTypes,
  collections,
  user,
}: {
  itemTypes: ItemTypeWithCount[];
  collections: CollectionWithMeta[];
  user: AvatarUser;
}) {
  const { open, openMobile, setOpenMobile } = useSidebar();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden shrink-0 overflow-hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-in-out md:block",
          open ? "w-64" : "w-0 border-r-0",
        )}
      >
        <SidebarBody
          itemTypes={itemTypes}
          collections={collections}
          user={user}
        />
      </aside>

      {/* Mobile drawer */}
      {openMobile && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpenMobile(false)}
            aria-hidden
          />
          <aside className="absolute inset-y-0 left-0 border-r border-sidebar-border bg-sidebar shadow-xl">
            <SidebarBody
              itemTypes={itemTypes}
              collections={collections}
              user={user}
              onNavigate={() => setOpenMobile(false)}
            />
          </aside>
        </div>
      )}
    </>
  );
}

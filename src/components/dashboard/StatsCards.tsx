import { FolderHeart, FolderOpen, LayoutGrid, Star } from "lucide-react";

import type { CollectionWithMeta } from "@/lib/db/collections";
import type { ItemStats } from "@/lib/db/items";

export function StatsCards({
  collections,
  itemStats,
}: {
  collections: CollectionWithMeta[];
  itemStats: ItemStats;
}) {
  const stats = [
    {
      label: "Items",
      value: itemStats.total,
      icon: LayoutGrid,
      color: "#3b82f6",
    },
    {
      label: "Collections",
      value: collections.length,
      icon: FolderOpen,
      color: "#f97316",
    },
    {
      label: "Favorite Items",
      value: itemStats.favorites,
      icon: Star,
      color: "#fde047",
    },
    {
      label: "Favorite Collections",
      value: collections.filter((collection) => collection.isFavorite).length,
      icon: FolderHeart,
      color: "#8b5cf6",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="rounded-xl border bg-card p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm text-muted-foreground">
                {stat.label}
              </span>
              <Icon className="size-4 shrink-0" style={{ color: stat.color }} />
            </div>
            <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}

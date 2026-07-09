import { File, Pin, Star } from "lucide-react";

import type { MockItem } from "@/lib/mock-data";
import { getItemType, TYPE_ICONS } from "@/lib/item-types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function ItemRow({ item }: { item: MockItem }) {
  const type = getItemType(item.typeId);
  const Icon = (type?.icon && TYPE_ICONS[type.icon]) || File;

  return (
    <div className="flex gap-4 rounded-xl border bg-card p-4 transition-colors hover:bg-accent/40">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        <Icon className="size-5" style={{ color: type?.color }} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="min-w-0 truncate font-medium">{item.title}</h4>
          {item.isPinned && (
            <Pin className="size-3.5 shrink-0 text-muted-foreground" />
          )}
          {item.isFavorite && (
            <Star className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
          )}
          <span className="ml-auto shrink-0 text-xs text-muted-foreground">
            {formatDate(item.updatedAt)}
          </span>
        </div>

        {item.description && (
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {item.description}
          </p>
        )}

        {item.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

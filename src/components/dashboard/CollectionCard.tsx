import { File, MoreHorizontal, Star } from "lucide-react";

import type { CollectionWithMeta } from "@/lib/db/collections";
import { TYPE_ICONS } from "@/lib/item-types";

export function CollectionCard({
  collection,
}: {
  collection: CollectionWithMeta;
}) {
  return (
    <div
      className="rounded-xl border border-l-4 bg-card p-5 transition-colors hover:bg-accent/40"
      style={{ borderLeftColor: collection.accentColor ?? undefined }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <h3 className="truncate font-medium">{collection.name}</h3>
          {collection.isFavorite && (
            <Star className="size-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
          )}
        </div>
        <MoreHorizontal className="size-4 shrink-0 text-muted-foreground" />
      </div>

      <p className="mt-1 text-sm text-muted-foreground">
        {collection.itemCount} items
      </p>
      <p className="mt-3 truncate text-sm text-muted-foreground">
        {collection.description}
      </p>

      {collection.types.length > 0 && (
        <div className="mt-4 flex items-center gap-2.5">
          {collection.types.map((type) => {
            const Icon = (type.icon && TYPE_ICONS[type.icon]) || File;
            return (
              <Icon
                key={type.id}
                className="size-4"
                style={{ color: type.color ?? undefined }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

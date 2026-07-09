import { File, MoreHorizontal, Star } from "lucide-react";

import { items, type MockCollection } from "@/lib/mock-data";
import { getItemType, TYPE_ICONS } from "@/lib/item-types";
import { cn } from "@/lib/utils";

export function CollectionCard({
  collection,
}: {
  collection: MockCollection;
}) {
  const typeIds = [
    ...new Set(
      items
        .filter((item) => item.collectionId === collection.id)
        .map((item) => item.typeId),
    ),
  ];

  return (
    <div
      className={cn(
        "rounded-xl border border-l-4 bg-card p-5 transition-colors hover:bg-accent/40",
        collection.color,
      )}
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

      {typeIds.length > 0 && (
        <div className="mt-4 flex items-center gap-2.5">
          {typeIds.map((typeId) => {
            const type = getItemType(typeId);
            const Icon = (type?.icon && TYPE_ICONS[type.icon]) || File;
            return (
              <Icon
                key={typeId}
                className="size-4"
                style={{ color: type?.color }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

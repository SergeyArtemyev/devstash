import { prisma } from "@/lib/prisma";

// Auth is not wired up yet — scope dashboard data to the seeded demo user.
const DEMO_USER_EMAIL = "demo@devstash.io";

export interface CollectionType {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

export interface CollectionWithMeta {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  /** Distinct item types present in the collection, ordered by usage (desc). */
  types: CollectionType[];
  /** Color of the most-used item type, used for the card accent border. */
  accentColor: string | null;
}

/**
 * Fetch the current user's collections with per-collection item counts and the
 * set of item types they contain (ordered by how often each type is used).
 */
export async function getCollections(): Promise<CollectionWithMeta[]> {
  const collections = await prisma.collection.findMany({
    where: { user: { email: DEMO_USER_EMAIL } },
    orderBy: [{ isFavorite: "desc" }, { updatedAt: "desc" }],
    include: {
      items: {
        select: {
          type: { select: { id: true, name: true, icon: true, color: true } },
        },
      },
    },
  });

  return collections.map((collection) => {
    const counts = new Map<string, { type: CollectionType; count: number }>();
    for (const { type } of collection.items) {
      const entry = counts.get(type.id);
      if (entry) {
        entry.count += 1;
      } else {
        counts.set(type.id, { type, count: 1 });
      }
    }

    const sorted = [...counts.values()].sort((a, b) => b.count - a.count);

    return {
      id: collection.id,
      name: collection.name,
      description: collection.description,
      isFavorite: collection.isFavorite,
      itemCount: collection.items.length,
      types: sorted.map((entry) => entry.type),
      accentColor: sorted[0]?.type.color ?? null,
    };
  });
}
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

// Auth is not wired up yet — scope dashboard data to the seeded demo user.
const DEMO_USER_EMAIL = "demo@devstash.io";

export interface ItemTypeMeta {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
}

export interface ItemWithMeta {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  updatedAt: Date;
  /** The item's system/custom type, used for its icon and accent color. */
  type: ItemTypeMeta;
  /** Tag names attached to the item. */
  tags: string[];
}

export interface ItemStats {
  total: number;
  favorites: number;
}

export interface ItemTypeWithCount extends ItemTypeMeta {
  /** Number of the current user's items of this type. */
  count: number;
}

// Canonical display order for the built-in system types (ItemType has no
// timestamp/sort column, so define the order explicitly to match the UI).
const SYSTEM_TYPE_ORDER = [
  "type_snippet",
  "type_prompt",
  "type_command",
  "type_note",
  "type_file",
  "type_image",
  "type_link",
];

const itemSelect = {
  id: true,
  title: true,
  description: true,
  isFavorite: true,
  isPinned: true,
  updatedAt: true,
  type: { select: { id: true, name: true, icon: true, color: true } },
  tags: { select: { tag: { select: { name: true } } } },
} satisfies Prisma.ItemSelect;

type ItemRow = Prisma.ItemGetPayload<{ select: typeof itemSelect }>;

function toItemWithMeta(item: ItemRow): ItemWithMeta {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    updatedAt: item.updatedAt,
    type: item.type,
    tags: item.tags.map((t) => t.tag.name),
  };
}

/** Pinned items for the current user, most recently updated first. */
export async function getPinnedItems(): Promise<ItemWithMeta[]> {
  const items = await prisma.item.findMany({
    where: { user: { email: DEMO_USER_EMAIL }, isPinned: true },
    orderBy: { updatedAt: "desc" },
    select: itemSelect,
  });

  return items.map(toItemWithMeta);
}

/** The current user's most recently updated items. */
export async function getRecentItems(limit = 10): Promise<ItemWithMeta[]> {
  const items = await prisma.item.findMany({
    where: { user: { email: DEMO_USER_EMAIL } },
    orderBy: { updatedAt: "desc" },
    take: limit,
    select: itemSelect,
  });

  return items.map(toItemWithMeta);
}

/**
 * System item types with a per-type count of the current user's items, in the
 * canonical display order. Used by the sidebar Types list.
 */
export async function getItemTypes(): Promise<ItemTypeWithCount[]> {
  const types = await prisma.itemType.findMany({
    where: { isSystem: true },
    select: {
      id: true,
      name: true,
      icon: true,
      color: true,
      _count: {
        select: { items: { where: { user: { email: DEMO_USER_EMAIL } } } },
      },
    },
  });

  return types
    .map((type) => ({
      id: type.id,
      name: type.name,
      icon: type.icon,
      color: type.color,
      count: type._count.items,
    }))
    .sort(
      (a, b) =>
        SYSTEM_TYPE_ORDER.indexOf(a.id) - SYSTEM_TYPE_ORDER.indexOf(b.id),
    );
}

/** Total and favorite item counts for the current user. */
export async function getItemStats(): Promise<ItemStats> {
  const where = { user: { email: DEMO_USER_EMAIL } } satisfies Prisma.ItemWhereInput;

  const [total, favorites] = await Promise.all([
    prisma.item.count({ where }),
    prisma.item.count({ where: { ...where, isFavorite: true } }),
  ]);

  return { total, favorites };
}

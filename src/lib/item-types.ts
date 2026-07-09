import {
  Code,
  File,
  Image,
  Link,
  Sparkles,
  StickyNote,
  Terminal,
  type LucideIcon,
} from "lucide-react";

import { itemTypes, type MockItemTypes } from "./mock-data";

export const TYPE_ICONS: Record<string, LucideIcon> = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link,
};

const typeById = new Map(itemTypes.map((type) => [type.id, type]));

export function getItemType(typeId: string): MockItemTypes | undefined {
  return typeById.get(typeId);
}

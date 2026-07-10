// Seeds the built-in (system) item types. These are shared across all users
// (userId = null, isSystem = true) and must exist before items can be created.
//
// Idempotent: uses fixed ids + upsert, so it is safe to re-run.
// Run with: npx prisma db seed   (or: npx tsx prisma/seed.ts)
//
// dotenv/config must be imported FIRST so DATABASE_URL is populated before
// src/lib/prisma.ts reads it at module load time.
import "dotenv/config";

import { prisma } from "../src/lib/prisma";

// ids/names/icons/colors mirror src/lib/mock-data.ts so the database is a
// drop-in replacement for the mock item types the UI currently renders.
const SYSTEM_ITEM_TYPES = [
  { id: "type_snippet", name: "Snippets", icon: "Code", color: "#3b82f6" },
  { id: "type_prompt", name: "Prompts", icon: "Sparkles", color: "#8b5cf6" },
  { id: "type_command", name: "Commands", icon: "Terminal", color: "#f97316" },
  { id: "type_note", name: "Notes", icon: "StickyNote", color: "#fde047" },
  { id: "type_file", name: "Files", icon: "File", color: "#6b7280" },
  { id: "type_image", name: "Images", icon: "Image", color: "#ec4899" },
  { id: "type_link", name: "Links", icon: "Link", color: "#10b981" },
] as const;

async function main() {
  console.log("🌱 Seeding system item types...");

  for (const type of SYSTEM_ITEM_TYPES) {
    await prisma.itemType.upsert({
      where: { id: type.id },
      update: { name: type.name, icon: type.icon, color: type.color },
      create: {
        id: type.id,
        name: type.name,
        icon: type.icon,
        color: type.color,
        isSystem: true,
        userId: null,
      },
    });
    console.log(`  ✔ ${type.name}`);
  }

  const count = await prisma.itemType.count({ where: { isSystem: true } });
  console.log(`\n✅ Done. ${count} system item types in the database.`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

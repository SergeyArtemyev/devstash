// Standalone script to verify the database connection and schema.
// Run with: npx tsx scripts/test-db.ts
//
// dotenv/config must be imported FIRST so DATABASE_URL is populated before
// src/lib/prisma.ts reads it at module load time.
import "dotenv/config";

import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("🔌 Connecting to the database...");

  // A trivial query confirms the connection and adapter are working.
  await prisma.$queryRaw`SELECT 1`;
  console.log("✅ Connection successful.\n");

  // Count rows in each model to confirm the schema is migrated.
  const [users, items, itemTypes, collections, tags] = await Promise.all([
    prisma.user.count(),
    prisma.item.count(),
    prisma.itemType.count(),
    prisma.collection.count(),
    prisma.tag.count(),
  ]);

  console.log("📊 Row counts:");
  console.table({ users, items, itemTypes, collections, tags });
}

main()
  .then(() => {
    console.log("\n🎉 Database test completed.");
  })
  .catch((error) => {
    console.error("❌ Database test failed:");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

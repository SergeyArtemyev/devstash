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

  // Fetch and display the seeded demo data.
  const demo = await prisma.user.findUnique({
    where: { email: "demo@devstash.io" },
    include: {
      collections: {
        orderBy: { name: "asc" },
        include: {
          items: {
            orderBy: { title: "asc" },
            include: { type: { select: { name: true } } },
          },
        },
      },
    },
  });

  if (!demo) {
    console.log("\n⚠️  No demo user found. Run `npx prisma db seed` first.");
    return;
  }

  console.log("\n👤 Demo user:");
  console.table({
    name: demo.name,
    email: demo.email,
    isPro: demo.isPro,
    emailVerified: demo.emailVerified?.toISOString() ?? null,
    passwordHashed: Boolean(demo.password),
  });

  console.log(`\n📚 Collections (${demo.collections.length}):`);
  console.table(
    demo.collections.map((c) => ({
      collection: c.name,
      description: c.description,
      favorite: c.isFavorite,
      items: c.items.length,
    })),
  );

  console.log("\n🗂️  Items by collection:");
  for (const c of demo.collections) {
    console.log(`\n  ${c.name}`);
    for (const item of c.items) {
      console.log(`    • [${item.type.name}] ${item.title}`);
    }
  }
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

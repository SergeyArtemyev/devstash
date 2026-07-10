import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7 config. Environment variables are no longer auto-loaded, so we
// import "dotenv/config" above and read them via the `env()` helper.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});

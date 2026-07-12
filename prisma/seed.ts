// Seeds the database with sample data for development and demos:
//   - the built-in (system) item types (shared across users, userId = null)
//   - a demo user (demo@devstash.io / 12345678)
//   - sample collections and items owned by that demo user
//
// Idempotent: uses fixed ids + upsert, so it is safe to re-run.
// Run with: npx prisma db seed   (or: npx tsx prisma/seed.ts)
//
// dotenv/config must be imported FIRST so DATABASE_URL is populated before
// src/lib/prisma.ts reads it at module load time.
import "dotenv/config";

import bcrypt from "bcryptjs";

import { prisma } from "../src/lib/prisma";

// ids/names/icons/colors mirror src/lib/mock-data.ts so the database is a
// drop-in replacement for the mock item types the UI currently renders.
// (The spec lists lowercase singular names; we keep the plural labels the UI
// already renders and reuse the stable ids items reference below.)
const SYSTEM_ITEM_TYPES = [
  { id: "type_snippet", name: "Snippets", icon: "Code", color: "#3b82f6" },
  { id: "type_prompt", name: "Prompts", icon: "Sparkles", color: "#8b5cf6" },
  { id: "type_command", name: "Commands", icon: "Terminal", color: "#f97316" },
  { id: "type_note", name: "Notes", icon: "StickyNote", color: "#fde047" },
  { id: "type_file", name: "Files", icon: "File", color: "#6b7280" },
  { id: "type_image", name: "Images", icon: "Image", color: "#ec4899" },
  { id: "type_link", name: "Links", icon: "Link", color: "#10b981" },
] as const;

const DEMO_USER = {
  id: "user_demo",
  email: "demo@devstash.io",
  name: "Demo User",
  password: "12345678",
};

// Collections owned by the demo user.
const COLLECTIONS = [
  {
    id: "col_react_patterns",
    name: "React Patterns",
    description: "Reusable React patterns and hooks",
    isFavorite: true,
  },
  {
    id: "col_ai_workflows",
    name: "AI Workflows",
    description: "AI prompts and workflow automations",
    isFavorite: true,
  },
  {
    id: "col_devops",
    name: "DevOps",
    description: "Infrastructure and deployment resources",
    isFavorite: false,
  },
  {
    id: "col_terminal_commands",
    name: "Terminal Commands",
    description: "Useful shell commands for everyday development",
    isFavorite: false,
  },
  {
    id: "col_design_resources",
    name: "Design Resources",
    description: "UI/UX resources and references",
    isFavorite: false,
  },
] as const;

// Sample items. `typeId` references the system item types above and
// `collectionId` references the collections above.
type SeedItem = {
  id: string;
  title: string;
  typeId: string;
  collectionId: string;
  description: string;
  content?: string;
  language?: string;
  url?: string;
  isFavorite?: boolean;
  isPinned?: boolean;
};

const ITEMS: SeedItem[] = [
  // --- React Patterns: 3 TypeScript snippets ---
  {
    id: "item_use_debounce",
    title: "useDebounce Hook",
    typeId: "type_snippet",
    collectionId: "col_react_patterns",
    description: "Debounce a rapidly changing value (search inputs, resize, etc.)",
    language: "typescript",
    isFavorite: true,
    isPinned: true,
    content: `import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}`,
  },
  {
    id: "item_create_ctx",
    title: "Type-safe Context Provider",
    typeId: "type_snippet",
    collectionId: "col_react_patterns",
    description: "Factory for a context + hook that throws when used outside its provider",
    language: "typescript",
    content: `import { createContext, useContext } from "react";

export function createSafeContext<T>(name: string) {
  const Context = createContext<T | null>(null);

  function useSafeContext(): T {
    const ctx = useContext(Context);
    if (ctx === null) {
      throw new Error(\`use\${name} must be used within \${name}Provider\`);
    }
    return ctx;
  }

  return [Context.Provider, useSafeContext] as const;
}`,
  },
  {
    id: "item_cn_util",
    title: "cn() className Utility",
    typeId: "type_snippet",
    collectionId: "col_react_patterns",
    description: "Merge conditional Tailwind classes without conflicts",
    language: "typescript",
    content: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}`,
  },

  // --- AI Workflows: 3 prompts ---
  {
    id: "item_prompt_code_review",
    title: "Code Review Prompt",
    typeId: "type_prompt",
    collectionId: "col_ai_workflows",
    description: "Thorough, prioritized AI code review",
    isFavorite: true,
    content: `Review the following code as a senior engineer. Focus on correctness, security, and performance.

For each issue, provide:
- Severity (critical / high / medium / low)
- The specific line(s) affected
- Why it's a problem
- A concrete suggested fix

Ignore purely stylistic nitpicks unless they affect readability. End with a one-line overall verdict.`,
  },
  {
    id: "item_prompt_docs",
    title: "Documentation Generator Prompt",
    typeId: "type_prompt",
    collectionId: "col_ai_workflows",
    description: "Generate reference docs from a code module",
    content: `You are a technical writer. Given the code below, produce Markdown documentation with:

1. A one-paragraph summary of what the module does
2. An API reference for each exported function (signature, params, return, throws)
3. A minimal usage example
4. Any gotchas or edge cases

Write for a developer who has never seen this code before.`,
  },
  {
    id: "item_prompt_refactor",
    title: "Refactoring Assistant Prompt",
    typeId: "type_prompt",
    collectionId: "col_ai_workflows",
    description: "Refactor code while preserving behavior",
    content: `Refactor the following code to improve readability and maintainability WITHOUT changing its behavior.

Rules:
- Preserve the public API and all observable behavior
- Prefer small, named functions over deep nesting
- Explain each change in a short bullet list after the code
- Do not introduce new dependencies

Return the refactored code first, then the explanation.`,
  },

  // --- DevOps: 1 snippet, 1 command, 2 links ---
  {
    id: "item_devops_dockerfile",
    title: "Multi-stage Node Dockerfile",
    typeId: "type_snippet",
    collectionId: "col_devops",
    description: "Small production image for a Node app using multi-stage builds",
    language: "dockerfile",
    content: `# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`,
  },
  {
    id: "item_devops_deploy",
    title: "Zero-downtime deploy script",
    typeId: "type_command",
    collectionId: "col_devops",
    description: "Build, tag, and roll out a new container image",
    language: "bash",
    content: `docker build -t myapp:$(git rev-parse --short HEAD) . \\
  && docker tag myapp:$(git rev-parse --short HEAD) myapp:latest \\
  && docker compose up -d --no-deps --build web`,
  },
  {
    id: "item_devops_link_docker",
    title: "Docker Documentation",
    typeId: "type_link",
    collectionId: "col_devops",
    description: "Official Docker reference and guides",
    url: "https://docs.docker.com/",
  },
  {
    id: "item_devops_link_actions",
    title: "GitHub Actions Documentation",
    typeId: "type_link",
    collectionId: "col_devops",
    description: "Workflow syntax and CI/CD reference",
    url: "https://docs.github.com/en/actions",
  },

  // --- Terminal Commands: 4 commands ---
  {
    id: "item_cmd_git_undo",
    title: "Undo last commit (keep changes)",
    typeId: "type_command",
    collectionId: "col_terminal_commands",
    description: "Reset the last commit but keep the changes staged",
    language: "bash",
    isPinned: true,
    content: "git reset --soft HEAD~1",
  },
  {
    id: "item_cmd_docker_prune",
    title: "Remove all unused Docker data",
    typeId: "type_command",
    collectionId: "col_terminal_commands",
    description: "Reclaim disk space from stopped containers, networks, and images",
    language: "bash",
    content: "docker system prune -a --volumes",
  },
  {
    id: "item_cmd_kill_port",
    title: "Kill process on a port",
    typeId: "type_command",
    collectionId: "col_terminal_commands",
    description: "Find and kill whatever is listening on port 3000",
    language: "bash",
    content: "lsof -ti:3000 | xargs kill -9",
  },
  {
    id: "item_cmd_npm_outdated",
    title: "List outdated npm packages",
    typeId: "type_command",
    collectionId: "col_terminal_commands",
    description: "Show dependencies with newer versions available",
    language: "bash",
    content: "npm outdated --long",
  },

  // --- Design Resources: 4 links ---
  {
    id: "item_link_tailwind",
    title: "Tailwind CSS Docs",
    typeId: "type_link",
    collectionId: "col_design_resources",
    description: "Utility-first CSS framework reference",
    url: "https://tailwindcss.com/docs",
  },
  {
    id: "item_link_shadcn",
    title: "shadcn/ui",
    typeId: "type_link",
    collectionId: "col_design_resources",
    description: "Accessible, copy-paste React component library",
    url: "https://ui.shadcn.com/",
  },
  {
    id: "item_link_radix",
    title: "Radix Primitives",
    typeId: "type_link",
    collectionId: "col_design_resources",
    description: "Unstyled, accessible component primitives and design system",
    url: "https://www.radix-ui.com/primitives",
  },
  {
    id: "item_link_lucide",
    title: "Lucide Icons",
    typeId: "type_link",
    collectionId: "col_design_resources",
    description: "Open-source icon library used throughout DevStash",
    url: "https://lucide.dev/icons/",
  },
];

async function seedSystemItemTypes() {
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
}

async function seedDemoUser() {
  console.log("\n🌱 Seeding demo user...");

  const passwordHash = await bcrypt.hash(DEMO_USER.password, 12);
  const emailVerified = new Date();

  const user = await prisma.user.upsert({
    where: { email: DEMO_USER.email },
    update: { name: DEMO_USER.name, password: passwordHash, emailVerified },
    create: {
      id: DEMO_USER.id,
      email: DEMO_USER.email,
      name: DEMO_USER.name,
      password: passwordHash,
      isPro: false,
      emailVerified,
    },
  });

  console.log(`  ✔ ${user.email}`);
  return user;
}

async function seedCollections(userId: string) {
  console.log("\n🌱 Seeding collections...");

  for (const collection of COLLECTIONS) {
    await prisma.collection.upsert({
      where: { id: collection.id },
      update: {
        name: collection.name,
        description: collection.description,
        isFavorite: collection.isFavorite,
        userId,
      },
      create: {
        id: collection.id,
        name: collection.name,
        description: collection.description,
        isFavorite: collection.isFavorite,
        userId,
      },
    });
    console.log(`  ✔ ${collection.name}`);
  }
}

async function seedItems(userId: string) {
  console.log("\n🌱 Seeding items...");

  for (const item of ITEMS) {
    const data = {
      title: item.title,
      contentType: "text",
      content: item.content ?? null,
      url: item.url ?? null,
      description: item.description,
      language: item.language ?? null,
      isFavorite: item.isFavorite ?? false,
      isPinned: item.isPinned ?? false,
      userId,
      typeId: item.typeId,
      collectionId: item.collectionId,
    };

    await prisma.item.upsert({
      where: { id: item.id },
      update: data,
      create: { id: item.id, ...data },
    });
    console.log(`  ✔ ${item.title}`);
  }
}

async function main() {
  await seedSystemItemTypes();
  const user = await seedDemoUser();
  await seedCollections(user.id);
  await seedItems(user.id);

  const [typeCount, collectionCount, itemCount] = await Promise.all([
    prisma.itemType.count({ where: { isSystem: true } }),
    prisma.collection.count({ where: { userId: user.id } }),
    prisma.item.count({ where: { userId: user.id } }),
  ]);

  console.log(
    `\n✅ Done. ${typeCount} system item types, ${collectionCount} collections, ${itemCount} items.`,
  );
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

export interface MockUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  isPro: boolean;
}

export interface MockItemTypes {
  id: string;
  name: string;
  icon: string;
  color: string;
  count: number;
  isSystem: boolean;
}

export interface MockCollection {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  color: string; // tailwind border/accent color class
  isFavorite: boolean;
}

export interface MockItem {
  id: string;
  title: string;
  typeId: string;
  description: string;
  content: string | null;
  language: string | null;
  tags: string[];
  collectionId: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

export const currentUser: MockUser = {
  id: "user_1",
  name: "John Doe",
  email: "demo@devstash.io",
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-15'),
  isPro: true,
};

export const itemTypes: MockItemTypes[] = [
  { id: "type_snippet", name: "Snippets", icon: "Code", color: "#3b82f6", count: 24, isSystem: true },
  { id: "type_prompt", name: "Prompts", icon: "Sparkles", color: "#8b5cf6", count: 18, isSystem: true },
  { id: "type_command", name: "Commands", icon: "Terminal", color: "#f97316", count: 15, isSystem: true },
  { id: "type_note", name: "Notes", icon: "StickyNote", color: "#fde047", count: 12, isSystem: true },
  { id: "type_file", name: "Files", icon: "File", color: "#6b7280", count: 5, isSystem: true },
  { id: "type_image", name: "Images", icon: "Image", color: "#ec4899", count: 3, isSystem: true },
  { id: "type_link", name: "Links", icon: "Link", color: "#10b981", count: 8, isSystem: true },
];

export const collections: MockCollection[] = [
  {
    id: "col_react_patterns",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    itemCount: 12,
    color: "border-blue-500",
    isFavorite: true,
  },
  {
    id: "col_python_snippets",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    itemCount: 8,
    color: "border-cyan-500",
    isFavorite: false,
  },
  {
    id: "col_context_files",
    name: "Context Files",
    description: "AI context files for projects",
    itemCount: 5,
    color: "border-gray-500",
    isFavorite: true,
  },
  {
    id: "col_interview_prep",
    name: "Interview Prep",
    description: "Technical interview preparation",
    itemCount: 24,
    color: "border-yellow-500",
    isFavorite: false,
  },
  {
    id: "col_git_commands",
    name: "Git Commands",
    description: "Frequently used git commands",
    itemCount: 15,
    color: "border-orange-500",
    isFavorite: true,
  },
  {
    id: "col_ai_prompts",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    itemCount: 18,
    color: "border-purple-500",
    isFavorite: true,
  },
];

export const items: MockItem[] = [
  {
    id: "item_use_auth",
    title: "useAuth Hook",
    typeId: "type_snippet",
    description: "Custom authentication hook for React applications",
    content: `import { useContext } from 'react'
import { AuthContext } from './AuthContext'

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}`,
    language: "typescript",
    tags: ["react", "auth", "hooks"],
    collectionId: "col_react_patterns",
    isFavorite: true,
    isPinned: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "item_api_error_handling",
    title: "API Error Handling Pattern",
    typeId: "type_snippet",
    description: "Fetch wrapper with exponential backoff retry logic",
    content: `export async function fetchWithRetry(url, options = {}, retries = 3) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, options)
      if (!res.ok) throw new Error(\`HTTP \${res.status}\`)
      return await res.json()
    } catch (err) {
      if (attempt === retries - 1) throw err
      await new Promise((r) => setTimeout(r, 2 ** attempt * 1000))
    }
  }
}`,
    language: "typescript",
    tags: ["api", "fetch", "error-handling"],
    collectionId: "col_react_patterns",
    isFavorite: false,
    isPinned: true,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12",
  },
  {
    id: "item_git_undo_commit",
    title: "Undo Last Commit",
    typeId: "type_command",
    description: "Undo the last commit but keep the changes staged",
    content: "git reset --soft HEAD~1",
    language: "bash",
    tags: ["git", "reset"],
    collectionId: "col_git_commands",
    isFavorite: false,
    isPinned: false,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-10",
  },
  {
    id: "item_code_review_prompt",
    title: "Code Review Prompt",
    typeId: "type_prompt",
    description: "Prompt for thorough AI code reviews",
    content:
      "Review the following code for correctness, security, and performance. List concrete issues with severity and suggested fixes.",
    language: null,
    tags: ["ai", "review"],
    collectionId: "col_ai_prompts",
    isFavorite: true,
    isPinned: false,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-09",
  },
  {
    id: "item_list_comprehension",
    title: "Flatten a Nested List",
    typeId: "type_snippet",
    description: "Flatten a list of lists in Python",
    content: "flat = [x for row in matrix for x in row]",
    language: "python",
    tags: ["python", "list"],
    collectionId: "col_python_snippets",
    isFavorite: false,
    isPinned: false,
    createdAt: "2024-01-05",
    updatedAt: "2024-01-05",
  },
  {
    id: "item_project_context",
    title: "Project Context Template",
    typeId: "type_note",
    description: "Reusable context file for AI coding assistants",
    content:
      "# Project Context\n\n- Stack: Next.js, TypeScript, Prisma\n- Conventions: server components by default, Zod validation\n- Goals: ...",
    language: "markdown",
    tags: ["ai", "context"],
    collectionId: "col_context_files",
    isFavorite: false,
    isPinned: false,
    createdAt: "2024-01-03",
    updatedAt: "2024-01-04",
  },
];
import { Layers } from "lucide-react";

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-sidebar md:flex">
      <div className="flex h-16 shrink-0 items-center gap-2.5 px-5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <Layers className="size-5" />
        </div>
        <span className="text-lg font-semibold tracking-tight">DevStash</span>
      </div>
      <div className="flex-1 overflow-y-auto p-5">
        <h2 className="text-sm font-medium text-muted-foreground">Sidebar</h2>
      </div>
    </aside>
  );
}

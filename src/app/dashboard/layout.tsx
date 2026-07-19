import { Sidebar } from "@/components/dashboard/Sidebar";
import { SidebarProvider } from "@/components/dashboard/sidebar-provider";
import { Topbar } from "@/components/dashboard/Topbar";
import { getCollections } from "@/lib/db/collections";
import { getItemTypes } from "@/lib/db/items";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [itemTypes, collections] = await Promise.all([
    getItemTypes(),
    getCollections(),
  ]);

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar itemTypes={itemTypes} collections={collections} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

import { redirect } from "next/navigation";

import { auth } from "@/auth";
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
  const [session, itemTypes, collections] = await Promise.all([
    auth(),
    getItemTypes(),
    getCollections(),
  ]);

  // The proxy already gates this route; this is a defensive fallback that also
  // narrows `session.user` to non-null for the Sidebar props.
  if (!session?.user) redirect("/sign-in?callbackUrl=%2Fdashboard");

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar
          itemTypes={itemTypes}
          collections={collections}
          user={session.user}
        />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}

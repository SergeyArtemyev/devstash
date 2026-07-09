"use client";

import { createContext, useContext, useState } from "react";

import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarContextValue {
  /** Whether the sidebar is expanded on desktop. */
  open: boolean;
  toggleOpen: () => void;
  /** Whether the mobile drawer is open. */
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  toggleMobile: () => void;
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(true);
  const [openMobile, setOpenMobile] = useState(false);

  const value: SidebarContextValue = {
    open,
    toggleOpen: () => setOpen((prev) => !prev),
    openMobile,
    setOpenMobile,
    toggleMobile: () => setOpenMobile((prev) => !prev),
    isMobile,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

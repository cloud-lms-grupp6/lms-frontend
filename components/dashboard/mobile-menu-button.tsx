"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function MobileMenuButton() {
  const { setOpenMobile } = useSidebar();

  return (
    <button
      type="button"
      aria-label="Open menu"
      onClick={() => setOpenMobile(true)}
      className="fixed bottom-6 right-6 z-50 flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg active:bg-primary/95 transition-colors cursor-pointer md:hidden"
    >
      <Menu className="size-6 pointer-events-none" />
    </button>
  );
}

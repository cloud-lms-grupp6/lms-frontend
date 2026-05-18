"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function MobileMenuButton() {
  const { setOpenMobile } = useSidebar();

  return (
    <button
      type="button"
      aria-label="Open menu"
      onClick={() => {
        setTimeout(() => setOpenMobile(true), 0);
      }}
      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground touch-manipulation select-none sm:hidden"
    >
      <Menu className="size-5" />
    </button>
  );
}

"use client";

import React from "react";
import { Search, Bell, Mail, ChevronDown } from "lucide-react";

export function TopBar() {
  return (
    <div className="flex w-full items-center justify-between">
      {/* Left: Search Bar */}
      <div className="relative flex items-center max-w-xs sm:max-w-sm w-full">
        <Search className="absolute left-3 size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search courses, assignments, etc..."
          className="w-full h-9 pl-9 pr-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-transparent text-xs text-foreground placeholder:text-muted-foreground outline-hidden focus:ring-1 focus:ring-primary focus:border-primary transition-all"
        />
      </div>

      {/* Right: Actions & User Profile */}
      <div className="flex items-center gap-2">
        {/* Email Button */}
        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-transparent text-foreground hover:bg-slate-100 dark:hover:bg-slate-900/80 transition-all cursor-pointer"
        >
          <Mail className="size-4" />
        </button>

        {/* Notifications Bell */}
        <button
          type="button"
          className="relative flex size-9 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-transparent text-foreground hover:bg-slate-100 dark:hover:bg-slate-900/80 transition-all cursor-pointer"
        >
          <Bell className="size-4" />
          {/* Active notification indicator */}
          <span className="absolute top-2 right-2.5 flex size-2 rounded-full bg-primary ring-2 ring-card" />
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-border mx-1" />

        {/* User Profile */}
        <button
          type="button"
          className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900/40 p-1.5 rounded-xl transition-all cursor-pointer"
        >
          {/* Avatar */}
          <div className="size-8 rounded-full overflow-hidden border border-border bg-slate-100 shrink-0">
            <img
              src="/avatars/main.jpg"
              alt="Chad Musclé"
              className="size-full object-cover"
            />
          </div>

          {/* User Info (Hidden on very small screens) */}
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-foreground leading-none">Chad Musclé</span>
            <span className="text-[10px] text-muted-foreground leading-none mt-1">chad_the_man69@email.com</span>
          </div>

          <ChevronDown className="size-3 text-muted-foreground hidden sm:block" />
        </button>
      </div>
    </div>
  );
}

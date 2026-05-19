"use client";

import React, { useEffect, useState } from "react";
import { Search, Bell, Mail, ChevronDown, LogOut, User, Settings } from "lucide-react";
import { useAuth } from "@/lib/auth/hooks";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TopBar() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  async function handleSignOut() {
    await signOut();
    router.push("/sign-in");
  }

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
        {mounted && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900/40 p-1.5 rounded-xl transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {/* Avatar */}
                <Avatar className="size-8 border border-border">
                  <AvatarImage src="/avatars/main.jpg" alt={`${user.firstName} ${user.lastName}`} className="object-cover" />
                  <AvatarFallback className="bg-slate-100 text-xs text-muted-foreground">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>

                {/* User Info (Hidden on very small screens) */}
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-foreground leading-none">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-[10px] text-muted-foreground leading-none mt-1">
                    {user.email}
                  </span>
                </div>

                <ChevronDown className="size-3 text-muted-foreground hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 size-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 size-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                <LogOut className="mr-2 size-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2 p-1.5 w-32 h-11 animate-pulse bg-slate-50 dark:bg-slate-900/40 rounded-xl" />
        )}
      </div>
    </div>
  );
}

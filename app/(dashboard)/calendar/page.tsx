"use client";

import React from "react";
import { Calendar } from "lucide-react";

export default function CalendarPage() {
  return (
    <div className="flex flex-col gap-3 min-h-full">
      <div className="flex items-center justify-between rounded-card bg-card p-4 shadow-sm h-14">
        <h1 className="text-lg font-bold text-foreground">Calendar</h1>
      </div>

      <div className="flex-1 rounded-card bg-card p-6 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center max-w-sm text-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 text-muted-foreground border border-slate-200/50 dark:border-transparent">
            <Calendar className="size-6 text-muted-foreground" />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-foreground">No Events Scheduled</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your calendar is currently empty. Once event schedules are loaded from the APIs, they will appear here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

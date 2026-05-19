import React from "react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  onViewDetails?: () => void;
}

export function StatCard({ title, value, icon, onViewDetails }: StatCardProps) {
  return (
    <div className="rounded-card bg-card p-4 shadow-sm flex flex-col justify-between min-h-[135px]">
      <div className="flex flex-col gap-1">
        {/* Top Row: Icon and Value */}
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground shrink-0 [&>svg]:size-4">
              {icon}
            </div>
          )}
          <span className="text-3xl font-extrabold tracking-tight text-foreground leading-none">{value}</span>
        </div>
        
        {/* Second Row: Title */}
        <span className="text-sm font-bold text-foreground leading-none mt-1.5">{title}</span>
      </div>

      {/* Third Row: View Details link */}
      <button
        onClick={onViewDetails}
        className="text-xs font-semibold text-foreground/80 hover:text-foreground self-start cursor-pointer flex items-center gap-1 group mt-2"
      >
        <span className="underline decoration-foreground/40 underline-offset-2">View Details</span>
        <span className="no-underline transition-transform group-hover:translate-x-0.5">→</span>
      </button>
    </div>
  );
}

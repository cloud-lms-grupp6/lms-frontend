import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricSparklineCardProps {
  title: string;
  value: string;
  trend: "up" | "down";
  color: "green" | "orange";
}

export function MetricSparklineCard({ title, value, trend, color }: MetricSparklineCardProps) {
  // Predefined SVG paths for smooth bezier wave curves
  const wavePath =
    color === "green"
      ? "M 0,18 C 20,5 30,5 45,12 C 60,18 70,22 85,25 C 92,26 96,22 100,20"
      : "M 0,22 C 15,22 30,24 45,21 C 60,17 70,8 85,12 C 92,15 96,25 100,22";

  // Predefined gradient fill paths
  const fillPath = `${wavePath} L 100,35 L 0,35 Z`;

  // Color mappings
  const strokeColor = color === "green" ? "#22c55e" : "#ED5735";
  const gradientId = `grad-${color}-${title.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div className="flex flex-col justify-between w-[76px] h-[76px] rounded-xl bg-white/40 dark:bg-slate-800/40 shadow-none p-1.5 shrink-0 select-none">
      {/* Title */}
      <span className="text-[10.5px] font-semibold text-foreground leading-[1.15] tracking-tight block">
        {title}
      </span>

      {/* Sparkline Wave Area */}
      <div className="h-3.5 w-full relative">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.15} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          {/* Gradient Fill */}
          <path d={fillPath} fill={`url(#${gradientId})`} />
          {/* Wave Line */}
          <path d={wavePath} fill="none" stroke={strokeColor} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>

      {/* Footer Value and Trend Arrow */}
      <div className="flex items-center gap-0.5 text-[8.5px] font-bold text-foreground leading-none">
        <span>{value}</span>
        {trend === "up" ? (
          <ArrowUpRight className="size-2 text-emerald-500" strokeWidth={3.8} />
        ) : (
          <ArrowDownRight className="size-2 text-rose-500" strokeWidth={3.8} />
        )}
      </div>
    </div>
  );
}

"use client";

import { BookOpen, CheckCircle2, Clock, Play, Plus, ArrowUpRight } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { MetricSparklineCard } from "@/components/dashboard/metric-sparkline-card";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-3">
      {/* Row 1: 4 Cards on left (col-span-6) + "Continue to learn" card on right (col-span-6) */}
      <div className="grid gap-3 lg:grid-cols-12">
        {/* Column 1: 4 Cards Grid */}
        <div className="lg:col-span-6 grid gap-3 sm:grid-cols-2">
          <StatCard
            title="Total Course"
            value={35}
            icon={<BookOpen className="size-5" />}
            onViewDetails={() => alert("Total Course clicked")}
          />
          <StatCard
            title="Course Complete"
            value={27}
            icon={<CheckCircle2 className="size-5" />}
            onViewDetails={() => alert("Course Complete clicked")}
          />
          <StatCard
            title="Course In Progress"
            value={18}
            icon={<Clock className="size-5" />}
            onViewDetails={() => alert("Course In Progress clicked")}
          />
          <StatCard
            title="Upcoming Live Courses"
            value={10}
            icon={<Play className="size-5 fill-current" />}
            onViewDetails={() => alert("Upcoming Live Courses clicked")}
          />
        </div>

        {/* Column 2: Continue to learn new things every day card (fills height) */}
        <div className="lg:col-span-6 rounded-card bg-card p-4 shadow-sm flex flex-col justify-between min-h-[340px] relative overflow-hidden">
          {/* Left Side Content Stack (58% width to match bg image spacing) */}
          <div className="relative z-10 flex flex-col gap-4 w-[58%] max-w-[58%]">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
                Continue to learn new things every day
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Learning is a journey, not a destination. Every day brings an opportunity to gain new knowledge and discover better ways to think and create.
              </p>
            </div>

            <button className="flex items-center justify-between w-[170px] rounded-full bg-[#2c3545] text-white hover:bg-[#1e2430] pl-4.5 pr-1.5 py-1.5 text-xs font-medium text-left transition-all cursor-pointer">
              <span className="text-left flex-1">Join Community</span>
              <span className="flex size-5 items-center justify-center rounded-full bg-white text-slate-500 animate-pulse-subtle shrink-0">
                <Plus className="size-3" strokeWidth={3.5} />
              </span>
            </button>
          </div>
 
          {/* Floating Metrics Card (bottom-right) */}
          <div className="absolute bottom-4 right-32 z-20 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60 backdrop-blur-md p-1.5 flex gap-1.5 w-[170px] justify-between border border-slate-200/50 dark:border-transparent shadow-md">
            <MetricSparklineCard title="Average Response" value="15 min" trend="up" color="green" />
            <MetricSparklineCard title="Resolution Time" value="2 hr" trend="down" color="orange" />
          </div>

          {/* Absolute Background Image (bottom-right) */}
          <img
            src="/student_community_bg_image.png"
            alt="Student Community"
            className="absolute bottom-0 right-0 max-h-[85%] max-w-[42%] object-contain pointer-events-none select-none z-0"
          />
        </div>
      </div>

      {/* Row 2: 70% width card (col-span-7) + two stacked cards (col-span-3) */}
      <div className="grid gap-3 lg:grid-cols-10">
        {/* Column 1: 70% width card */}
        <div className="lg:col-span-7 rounded-card bg-card p-4 shadow-sm min-h-[350px] flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
            <h2 className="text-lg font-bold text-foreground">Your Assignments</h2>
            <button className="text-xs font-semibold text-primary hover:underline cursor-pointer">
              See All
            </button>
          </div>

          {/* Sub-header labels */}
          <div className="flex items-center justify-between px-1.5 py-1 text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
            <span>Course Name</span>
            <span className="mr-14">Status</span>
          </div>

          {/* List Items Stack */}
          <div className="flex flex-col gap-2 flex-1 mt-1">
            {/* Item 1: Design Accesibility */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-900/40 p-2 border border-slate-100/50 dark:border-transparent">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-xs shrink-0 text-sky-500">
                  <svg viewBox="0 0 24 24" className="size-5 fill-current">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-foreground">Design Accesibility</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">Advanced &bull; 12 Hours</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-primary/10 text-primary px-2.5 py-1.5 rounded-full text-[10px] font-bold">
                  In Progress
                </span>
                <button className="flex size-7 items-center justify-center rounded-full bg-[#2c3545] hover:bg-[#1e2430] text-white transition-all cursor-pointer">
                  <ArrowUpRight className="size-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Item 2: Figma for Beginner */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-900/40 p-2 border border-slate-100/50 dark:border-transparent">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-xs shrink-0">
                  <svg viewBox="0 0 36 54" className="size-4.5" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 9C18 4.029 13.971 0 9 0S0 4.029 0 9s4.029 9 9 9h9V9z" fill="#F24E1E"/>
                    <path d="M18 9c0-4.971 4.029-9 9-9s9 4.029 9 9-4.029 9-9 9h-9V9z" fill="#FF7262"/>
                    <path d="M18 27c0-4.971-4.029-9-9-9S0 22.029 0 27s4.029 9 9 9h9v-9z" fill="#A259FF"/>
                    <path d="M18 27c0 4.971 4.029 9 9 9s9-4.029 9-9-4.029-9-9-9h-9v9z" fill="#0ACF83"/>
                    <path d="M9 36c-4.971 0-9 4.029-9 9s4.029 9 9 9 9-4.029 9-9v-9H9z" fill="#1ABC9C"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-foreground">Figma for Beginner</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">Intermediate &bull; 16 Hours</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-primary/10 text-primary px-2.5 py-1.5 rounded-full text-[10px] font-bold">
                  In Progress
                </span>
                <button className="flex size-7 items-center justify-center rounded-full bg-[#2c3545] hover:bg-[#1e2430] text-white transition-all cursor-pointer">
                  <ArrowUpRight className="size-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Item 3: Framer Design */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-900/40 p-2 border border-slate-100/50 dark:border-transparent">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-xs shrink-0">
                  <svg viewBox="0 0 24 24" className="size-4.5 fill-sky-500" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 2h16v6L12 14h8v8H4v-6h8L4 8z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-foreground">Framer Design</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">Advanced &bull; 22 Hours</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-completed-bg text-completed px-2.5 py-1.5 rounded-full text-[10px] font-bold">
                  Completed
                </span>
                <button className="flex size-7 items-center justify-center rounded-full bg-[#2c3545] hover:bg-[#1e2430] text-white transition-all cursor-pointer">
                  <ArrowUpRight className="size-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Item 4: Frontend Development */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-900/40 p-2 border border-slate-100/50 dark:border-transparent">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-xs shrink-0 text-blue-500">
                  <svg viewBox="0 0 24 24" className="size-4.5 fill-none stroke-current" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 20L12 4L4 20" />
                    <path d="M7 14h10" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-foreground">Frontend Development</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">Intermediate &bull; 14 Hours</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-primary/10 text-primary px-2.5 py-1.5 rounded-full text-[10px] font-bold">
                  In Progress
                </span>
                <button className="flex size-7 items-center justify-center rounded-full bg-[#2c3545] hover:bg-[#1e2430] text-white transition-all cursor-pointer">
                  <ArrowUpRight className="size-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Item 5: Behance Case Study */}
            <div className="flex items-center justify-between rounded-2xl bg-slate-50 dark:bg-slate-900/40 p-2 border border-slate-100/50 dark:border-transparent">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-xs shrink-0 select-none">
                  <span className="text-blue-600 dark:text-blue-400 font-extrabold text-xs tracking-tighter">Bē</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs sm:text-sm font-bold text-foreground">Behance Case Study</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">Intermediate &bull; 18 Hours</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-primary/10 text-primary px-2.5 py-1.5 rounded-full text-[10px] font-bold">
                  In Progress
                </span>
                <button className="flex size-7 items-center justify-center rounded-full bg-[#2c3545] hover:bg-[#1e2430] text-white transition-all cursor-pointer">
                  <ArrowUpRight className="size-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Column 2: 2 cards stacked on each other */}
        <div className="lg:col-span-3 flex flex-col gap-3">
          {/* Stacked Card 1: Chats */}
          <div className="rounded-card bg-card p-4 shadow-sm flex flex-col justify-between min-h-[160px]">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-foreground">Chat</h2>
              <span className="text-xs text-muted-foreground mt-0.5">2 unread messages</span>
            </div>
            
            {/* 5 Overlapping Avatars Stack */}
            <div className="flex items-center -space-x-2 my-2.5">
              <div className="size-8 rounded-full border-2 border-card overflow-hidden bg-neutral-100 shrink-0">
                <img src="/avatars/main.jpg" alt="Avatar 1" className="w-full h-full object-cover" />
              </div>
              <div className="size-8 rounded-full border-2 border-card overflow-hidden bg-neutral-100 shrink-0">
                <img src="/avatars/person1.png" alt="Avatar 2" className="w-full h-full object-cover" />
              </div>
              <div className="size-8 rounded-full border-2 border-card overflow-hidden bg-neutral-100 shrink-0">
                <img src="/avatars/person2.png" alt="Avatar 3" className="w-full h-full object-cover" />
              </div>
              <div className="size-8 rounded-full border-2 border-card overflow-hidden bg-neutral-100 shrink-0">
                <img src="/avatars/person3.png" alt="Avatar 4" className="w-full h-full object-cover" />
              </div>
              <div className="size-8 rounded-full border-2 border-card overflow-hidden bg-neutral-100 shrink-0">
                <img src="/avatars/person4.png" alt="Avatar 5" className="w-full h-full object-cover" />
              </div>
            </div>

            <button className="text-xs font-bold text-foreground/80 hover:text-foreground hover:underline self-start cursor-pointer">
              All Messages →
            </button>
          </div>

          {/* Stacked Card 2: Community */}
          <div className="rounded-card bg-card p-4 shadow-sm flex flex-col gap-3 min-h-[185px]">
            <h2 className="text-lg font-bold text-foreground">Community</h2>
            
            {/* Sub-cards Container */}
            <div className="flex flex-col gap-2">
              {/* Slack Community Card */}
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 p-2 border border-slate-100/50 dark:border-transparent cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/60 transition-all">
                <div className="flex size-8 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-xs shrink-0">
                  <svg viewBox="0 0 24 24" className="size-4.5">
                    <path fill="#e01e5a" d="M5.04 15.12a2.52 2.52 0 1 1-2.52-2.52h2.52v2.52zm1.26 0a2.52 2.52 0 1 1 5.04 0v5.04a2.52 2.52 0 1 1-5.04 0v-5.04z"/>
                    <path fill="#36c5f0" d="M8.88 5.04a2.52 2.52 0 1 1 2.52-2.52v2.52H8.88zm0 1.26a2.52 2.52 0 1 1 0 5.04H3.84a2.52 2.52 0 1 1 0-5.04h5.04z"/>
                    <path fill="#2eb67d" d="M18.96 8.88a2.52 2.52 0 1 1 2.52 2.52h-2.52V8.88zm-1.26 0a2.52 2.52 0 1 1-5.04 0V3.84a2.52 2.52 0 1 1 5.04 0v5.04z"/>
                    <path fill="#ecb22e" d="M15.12 18.96a2.52 2.52 0 1 1-2.52 2.52v-2.52h2.52zm0-1.26a2.52 2.52 0 1 1 0-5.04h5.04a2.52 2.52 0 1 1 0 5.04h-5.04z"/>
                  </svg>
                </div>
                <span className="text-xs font-semibold text-foreground">Slack Community</span>
              </div>

              {/* Discord Helpline Card */}
              <div className="flex items-center gap-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 p-2 border border-slate-100/50 dark:border-transparent cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-900/60 transition-all">
                <div className="flex size-8 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-xs shrink-0">
                  <svg viewBox="0 0 24 24" className="size-4.5 fill-[#5865F2]">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
                  </svg>
                </div>
                <span className="text-xs font-semibold text-foreground">Discord Helpline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
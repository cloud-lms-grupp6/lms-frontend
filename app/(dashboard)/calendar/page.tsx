"use client";

import React from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useAuthStore } from "@/lib/auth/store";
import { getMyEnrollments, type Enrollment } from "@/lib/usercourses/api";
import { getCourseEvents, type ScheduleEvent } from "@/lib/schedule/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EventDetailSheet } from "@/components/dashboard/event-detail-sheet";
import { CreateEventSheet } from "@/components/dashboard/create-event-sheet";

type View = "month" | "week";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TYPE_COLORS: Record<string, string> = {
  Lesson: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Session: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  Deadline: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

function dateKey(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function isToday(d: Date) {
  return dateKey(d) === dateKey(new Date());
}

function isSameMonth(d: Date, year: number, month: number) {
  return d.getFullYear() === year && d.getMonth() === month;
}

function getMonthGridDays(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startOffset = (first.getDay() + 6) % 7;
  const days: Date[] = [];

  for (let i = startOffset - 1; i >= 0; i--) {
    days.push(new Date(year, month, -i));
  }
  for (let d = 1; d <= last.getDate(); d++) {
    days.push(new Date(year, month, d));
  }
  let extra = 1;
  while (days.length % 7 !== 0) {
    days.push(new Date(year, month + 1, extra++));
  }
  return days;
}

function getWeekDays(ref: Date): Date[] {
  const dow = (ref.getDay() + 6) % 7;
  const monday = new Date(ref);
  monday.setDate(ref.getDate() - dow);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function groupByDate(events: ScheduleEvent[]): Map<string, ScheduleEvent[]> {
  const map = new Map<string, ScheduleEvent[]>();
  for (const e of events) {
    const key = e.startsAt.slice(0, 10);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(e);
  }
  return map;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CalendarPage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.accessToken);

  const [view, setView] = React.useState<View>("month");
  const [currentDate, setCurrentDate] = React.useState(() => new Date());
  const [enrollments, setEnrollments] = React.useState<Enrollment[] | null>(null);
  const [events, setEvents] = React.useState<ScheduleEvent[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = React.useState(true);
  const [loadingEvents, setLoadingEvents] = React.useState(false);
  const [error, setError] = React.useState(false);

  const [selectedEvent, setSelectedEvent] = React.useState<ScheduleEvent | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState<ScheduleEvent | null>(null);

  const isInstructor = user?.role === "Instructor";

  React.useEffect(() => {
    if (!user || !token) return;
    let active = true;
    setLoadingEnrollments(true);
    (async () => {
      try {
        const data = await getMyEnrollments(user.id, token);
        if (active) setEnrollments(data.filter((e) => e.status === "Active"));
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoadingEnrollments(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [user, token]);

  React.useEffect(() => {
    if (!enrollments || !token || enrollments.length === 0) {
      setEvents([]);
      return;
    }

    let from: Date;
    let to: Date;
    if (view === "month") {
      from = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      to = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
    } else {
      const days = getWeekDays(currentDate);
      from = new Date(days[0]);
      from.setHours(0, 0, 0, 0);
      to = new Date(days[6]);
      to.setHours(23, 59, 59);
    }

    const courseIds = [...new Set(enrollments.map((e) => e.courseId))];
    let active = true;
    setLoadingEvents(true);
    (async () => {
      try {
        const results = await Promise.all(
          courseIds.map((id) => getCourseEvents(id, token, from, to))
        );
        if (active) {
          setEvents(
            results.flat().sort((a, b) => a.startsAt.localeCompare(b.startsAt))
          );
          setError(false);
        }
      } catch {
        if (active) setError(true);
      } finally {
        if (active) setLoadingEvents(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [enrollments, token, currentDate, view]);

  function goNext() {
    setCurrentDate((d) => {
      const n = new Date(d);
      if (view === "month") n.setMonth(d.getMonth() + 1);
      else n.setDate(d.getDate() + 7);
      return n;
    });
  }
  function goPrev() {
    setCurrentDate((d) => {
      const n = new Date(d);
      if (view === "month") n.setMonth(d.getMonth() - 1);
      else n.setDate(d.getDate() - 7);
      return n;
    });
  }
  function goToday() {
    setCurrentDate(new Date());
  }

  const eventsByDate = React.useMemo(() => groupByDate(events), [events]);
  const courseIds = [...new Set((enrollments ?? []).map((e) => e.courseId))];

  function openDetail(e: ScheduleEvent) {
    setSelectedEvent(e);
    setDetailOpen(true);
  }
  function openCreate() {
    setEditingEvent(null);
    setCreateOpen(true);
  }
  function openEdit(e: ScheduleEvent) {
    setEditingEvent(e);
    setCreateOpen(true);
  }
  function handleDeleted(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }
  function handleSaved(event: ScheduleEvent) {
    setEvents((prev) => {
      const idx = prev.findIndex((e) => e.id === event.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = event;
        return next.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
      }
      return [...prev, event].sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    });
  }

  const headerLabel =
    view === "month"
      ? currentDate.toLocaleString(undefined, { month: "long", year: "numeric" })
      : (() => {
          const days = getWeekDays(currentDate);
          return `${days[0].toLocaleDateString(undefined, { month: "short", day: "numeric" })} – ${days[6].toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`;
        })();

  const loading = loadingEnrollments || loadingEvents;

  function renderEventChip(e: ScheduleEvent) {
    return (
      <button
        key={e.id}
        onClick={() => openDetail(e)}
        className={`w-full truncate rounded px-1.5 py-0.5 text-left text-xs font-medium leading-tight ${TYPE_COLORS[e.type] ?? TYPE_COLORS.Lesson}`}
      >
        {formatTime(e.startsAt)} {e.title}
      </button>
    );
  }

  function renderMonthView() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = getMonthGridDays(year, month);
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <div className="grid grid-cols-7 border-b border-border">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-xs font-medium text-muted-foreground"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1">
          {days.map((day, i) => {
            const key = dateKey(day);
            const dayEvents = eventsByDate.get(key) ?? [];
            const inMonth = isSameMonth(day, year, month);
            const today = isToday(day);
            return (
              <div
                key={i}
                className={`min-h-[88px] border-b border-r border-border p-1 flex flex-col gap-0.5 ${
                  !inMonth ? "bg-muted/30" : ""
                }`}
              >
                <span
                  className={`text-xs font-medium leading-none w-6 h-6 flex items-center justify-center rounded-full mb-0.5 shrink-0 ${
                    today
                      ? "bg-primary text-primary-foreground"
                      : inMonth
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {day.getDate()}
                </span>
                {dayEvents.slice(0, 3).map(renderEventChip)}
                {dayEvents.length > 3 && (
                  <button
                    onClick={() => openDetail(dayEvents[3])}
                    className="text-left text-xs text-muted-foreground px-1"
                  >
                    +{dayEvents.length - 3} more
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  function renderWeekView() {
    const days = getWeekDays(currentDate);
    return (
      <div className="flex flex-col flex-1 min-h-0">
        <div className="grid grid-cols-7 border-b border-border">
          {days.map((day, i) => (
            <div
              key={i}
              className="py-2 text-center border-r last:border-r-0 border-border"
            >
              <p className="text-xs text-muted-foreground">{WEEKDAYS[i]}</p>
              <p
                className={`mx-auto mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold ${
                  isToday(day)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground"
                }`}
              >
                {day.getDate()}
              </p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1 overflow-y-auto">
          {days.map((day, i) => {
            const key = dateKey(day);
            const dayEvents = eventsByDate.get(key) ?? [];
            return (
              <div
                key={i}
                className="border-r last:border-r-0 border-border p-2 flex flex-col gap-1.5"
              >
                {dayEvents.length === 0 && (
                  <p className="mt-2 text-center text-xs text-muted-foreground/40">
                    —
                  </p>
                )}
                {dayEvents.map((e) => (
                  <button
                    key={e.id}
                    onClick={() => openDetail(e)}
                    className={`w-full rounded-lg p-2 text-left text-xs font-medium ${TYPE_COLORS[e.type] ?? TYPE_COLORS.Lesson}`}
                  >
                    <p className="truncate font-semibold leading-snug">{e.title}</p>
                    <p className="opacity-75 mt-0.5">
                      {formatTime(e.startsAt)}–{formatTime(e.endsAt)}
                    </p>
                    {e.location && (
                      <p className="opacity-75 truncate mt-0.5">📍 {e.location}</p>
                    )}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 min-h-full">
      {/* Top bar */}
      <div className="flex items-center justify-between rounded-card bg-card p-4 shadow-sm h-14">
        <h1 className="text-lg font-bold text-foreground">Calendar</h1>
        {isInstructor && (
          <Button size="sm" onClick={openCreate}>
            <Plus className="size-4" />
            New Event
          </Button>
        )}
      </div>

      {/* Calendar card */}
      <div className="flex-1 rounded-card bg-card shadow-sm flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" onClick={goPrev} aria-label="Previous">
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goToday}>
              Today
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={goNext} aria-label="Next">
              <ChevronRight className="size-4" />
            </Button>
          </div>

          <span className="font-semibold text-sm">{headerLabel}</span>

          <div className="flex items-center gap-1">
            <Button
              variant={view === "month" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("month")}
            >
              Month
            </Button>
            <Button
              variant={view === "week" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("week")}
            >
              Week
            </Button>
          </div>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="flex flex-col gap-2 p-4">
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 35 }).map((_, i) => (
                <Skeleton key={i} className="h-20 rounded-card" />
              ))}
            </div>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              Could not load calendar data. Please try again.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setError(false);
                setLoadingEnrollments(true);
              }}
            >
              Retry
            </Button>
          </div>
        )}

        {/* Empty state — no enrollments */}
        {!loading && !error && enrollments?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <div className="flex size-14 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200/50 dark:border-transparent">
              <CalendarDays className="size-6 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-1.5 text-center max-w-xs">
              <h2 className="text-base font-semibold text-foreground">
                No courses enrolled
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Enroll in a course to see its schedule here.
              </p>
            </div>
          </div>
        )}

        {/* Calendar views */}
        {!loading && !error && enrollments !== null && enrollments.length > 0 && (
          view === "month" ? renderMonthView() : renderWeekView()
        )}
      </div>

      {/* Type legend */}
      {!loading && !error && enrollments !== null && enrollments.length > 0 && (
        <div className="flex items-center gap-3 px-1">
          {Object.entries(TYPE_COLORS).map(([type, cls]) => (
            <span key={type} className="flex items-center gap-1.5">
              <span className={`inline-block size-2.5 rounded-full ${cls.split(" ")[0]}`} />
              <span className="text-xs text-muted-foreground">{type}</span>
            </span>
          ))}
        </div>
      )}

      {/* Sheets */}
      <EventDetailSheet
        event={selectedEvent}
        isInstructor={isInstructor}
        token={token ?? ""}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onEdit={openEdit}
        onDeleted={handleDeleted}
      />
      <CreateEventSheet
        open={createOpen}
        onOpenChange={setCreateOpen}
        token={token ?? ""}
        courseIds={courseIds}
        editingEvent={editingEvent}
        onSaved={handleSaved}
      />
    </div>
  );
}

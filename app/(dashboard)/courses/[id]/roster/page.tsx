"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Users } from "lucide-react";

import { useAuthStore } from "@/lib/auth/store";
import { Enrollment, getCourseParticipants } from "@/lib/usercourses/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function CourseRosterPage() {
  const params = useParams<{ id: string }>();
  const courseId = params.id;

  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.accessToken);
  const canView = user?.role === "Instructor" || user?.role === "Admin";

  const [participants, setParticipants] = React.useState<Enrollment[] | null>(null);
  const [error, setError] = React.useState(false);
  const [reloadKey, setReloadKey] = React.useState(0);

  React.useEffect(() => {
    if (!token || !canView) return;
    let active = true;
    (async () => {
      try {
        const data = await getCourseParticipants(courseId, token);
        if (active) {
          setParticipants(data);
          setError(false);
        }
      } catch {
        if (active) setError(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [token, canView, courseId, reloadKey]);

  return (
    <div className="flex flex-col gap-3 min-h-full">
      <div className="flex items-center justify-between rounded-card bg-card p-4 shadow-sm h-14">
        <h1 className="text-lg font-bold text-foreground">Course Participants</h1>
      </div>

      <div className="flex-1 rounded-card bg-card p-6 shadow-sm">
        {!canView && (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <h2 className="text-xl font-bold text-foreground">Not authorized</h2>
            <p className="text-xs text-muted-foreground">
              Only instructors can view the participant list.
            </p>
          </div>
        )}

        {canView && participants === null && !error && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-16 w-full rounded-card" />
            <Skeleton className="h-16 w-full rounded-card" />
          </div>
        )}

        {canView && error && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Could not load participants. Please try again.
            </p>
            <Button variant="outline" size="sm" onClick={() => setReloadKey((k) => k + 1)}>
              Retry
            </Button>
          </div>
        )}

        {canView && participants?.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 text-muted-foreground border border-slate-200/50 dark:border-transparent">
              <Users className="size-6 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              No one is enrolled in this course yet.
            </p>
          </div>
        )}

        {canView && participants && participants.length > 0 && (
          <ul className="flex flex-col gap-3">
            {participants.map((p) => (
              <li
                key={p.id}
                className="flex items-center justify-between gap-4 rounded-card border border-border p-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Users className="size-5" />
                  </span>
                  <span className="truncate text-sm font-medium text-foreground">
                    {p.userId}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {p.role} · {p.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

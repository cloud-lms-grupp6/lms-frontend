"use client";

import React from "react";
import { BookOpen, Loader2 } from "lucide-react";

import { useAuthStore } from "@/lib/auth/store";
import {
  Enrollment,
  getMyEnrollments,
  unenroll,
} from "@/lib/usercourses/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function CoursesPage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.accessToken);

  const [enrollments, setEnrollments] = React.useState<Enrollment[] | null>(null);
  const [error, setError] = React.useState(false);
  const [removingId, setRemovingId] = React.useState<string | null>(null);
  const [reloadKey, setReloadKey] = React.useState(0);

  React.useEffect(() => {
    if (!user || !token) return;
    let active = true;
    (async () => {
      try {
        const data = await getMyEnrollments(user.id, token);
        if (active) {
          setEnrollments(data);
          setError(false);
        }
      } catch {
        if (active) setError(true);
      }
    })();
    return () => {
      active = false;
    };
  }, [user, token, reloadKey]);

  async function handleUnenroll(id: string) {
    if (!token) return;
    setRemovingId(id);
    try {
      await unenroll(id, token);
      setEnrollments((prev) => prev?.filter((e) => e.id !== id) ?? null);
    } catch {
      setError(true);
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-3 min-h-full">
      <div className="flex items-center justify-between rounded-card bg-card p-4 shadow-sm h-14">
        <h1 className="text-lg font-bold text-foreground">My Courses</h1>
      </div>

      <div className="flex-1 rounded-card bg-card p-6 shadow-sm">
        {enrollments === null && !error && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-16 w-full rounded-card" />
            <Skeleton className="h-16 w-full rounded-card" />
            <Skeleton className="h-16 w-full rounded-card" />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-muted-foreground">
              Could not load your courses. Please try again.
            </p>
            <Button variant="outline" size="sm" onClick={() => setReloadKey((k) => k + 1)}>
              Retry
            </Button>
          </div>
        )}

        {enrollments?.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 text-muted-foreground border border-slate-200/50 dark:border-transparent">
              <BookOpen className="size-6 text-muted-foreground" />
            </div>
            <div className="flex flex-col gap-2 max-w-sm">
              <h2 className="text-xl font-bold text-foreground">No Courses Found</h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You aren&apos;t enrolled in any courses yet.
              </p>
            </div>
          </div>
        )}

        {enrollments && enrollments.length > 0 && (
          <ul className="flex flex-col gap-3">
            {enrollments.map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between gap-4 rounded-card border border-border p-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <BookOpen className="size-5" />
                  </span>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-sm font-medium text-foreground">
                      {e.courseId}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {e.role} · {e.status} · enrolled{" "}
                      {new Date(e.enrolledAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={removingId === e.id}
                  onClick={() => handleUnenroll(e.id)}
                >
                  {removingId === e.id && <Loader2 className="size-3.5 animate-spin" />}
                  Unenroll
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

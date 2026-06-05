"use client";

import React from "react";
import { ArrowUpRight, BookOpen, Clock, Loader2 } from "lucide-react";

import { useAuthStore } from "@/lib/auth/store";
import {
  Enrollment,
  enroll,
  getMyEnrollments,
  unenroll,
} from "@/lib/usercourses/api";
import { Course, listCourses } from "@/lib/courses/api";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Tab = "mine" | "catalog";

export default function CoursesPage() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.accessToken);

  const [tab, setTab] = React.useState<Tab>("mine");

  const [enrollments, setEnrollments] = React.useState<Enrollment[] | null>(null);
  const [enrollmentsError, setEnrollmentsError] = React.useState(false);
  const [removingId, setRemovingId] = React.useState<string | null>(null);
  const [reloadKey, setReloadKey] = React.useState(0);

  const [catalog, setCatalog] = React.useState<Course[] | null>(null);
  const [catalogError, setCatalogError] = React.useState(false);
  const [enrollingId, setEnrollingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!user || !token) return;
    let active = true;

    (async () => {
      try {
        const data = await getMyEnrollments(user.id, token);
        if (active) {
          setEnrollments(data);
          setEnrollmentsError(false);
        }
      } catch {
        if (active) setEnrollmentsError(true);
      }
    })();

    return () => {
      active = false;
    };
  }, [user, token, reloadKey]);

  React.useEffect(() => {
    if (!token) return;
    let active = true;

    (async () => {
      try {
        const data = await listCourses(token);
        if (active) {
          setCatalog(data);
          setCatalogError(false);
        }
      } catch {
        if (active) setCatalogError(true);
      }
    })();

    return () => {
      active = false;
    };
  }, [token]);

  const enrolledCourseIds = React.useMemo(
    () => new Set(enrollments?.map((e) => e.courseId) ?? []),
    [enrollments]
  );

  const courseTitles = React.useMemo(
    () => new Map(catalog?.map((c) => [c.id, c.title]) ?? []),
    [catalog]
  );

  async function handleUnenroll(id: string) {
    if (!token) return;

    setRemovingId(id);

    try {
      await unenroll(id, token);
      setEnrollments((prev) => prev?.filter((e) => e.id !== id) ?? null);
    } catch {
      setEnrollmentsError(true);
    } finally {
      setRemovingId(null);
    }
  }

  async function handleEnroll(courseId: string) {
    if (!token) return;

    setEnrollingId(courseId);

    try {
      const created = await enroll(courseId, token);
      setEnrollments((prev) => (prev ? [...prev, created] : [created]));
    } catch {
      setCatalogError(true);
    } finally {
      setEnrollingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-3 min-h-full">
      <div className="flex items-center gap-2 rounded-card bg-card p-4 shadow-sm h-14">
        <Button
          variant={tab === "mine" ? "default" : "ghost"}
          size="sm"
          onClick={() => setTab("mine")}
        >
          My Courses
        </Button>

        <Button
          variant={tab === "catalog" ? "default" : "ghost"}
          size="sm"
          onClick={() => setTab("catalog")}
        >
          Browse Catalog
        </Button>
      </div>

      <div className="flex-1 rounded-card bg-card p-6 shadow-sm">
        {tab === "mine" && (
          <MyCourses
            enrollments={enrollments}
            courseTitles={courseTitles}
            error={enrollmentsError}
            removingId={removingId}
            onRetry={() => setReloadKey((k) => k + 1)}
            onUnenroll={handleUnenroll}
          />
        )}

        {tab === "catalog" && (
          <Catalog
            catalog={catalog}
            error={catalogError}
            enrollingId={enrollingId}
            enrolledCourseIds={enrolledCourseIds}
            onEnroll={handleEnroll}
          />
        )}
      </div>
    </div>
  );
}

function MyCourses({
  enrollments,
  courseTitles,
  error,
  removingId,
  onRetry,
  onUnenroll,
}: {
  enrollments: Enrollment[] | null;
  courseTitles: Map<string, string>;
  error: boolean;
  removingId: string | null;
  onRetry: () => void;
  onUnenroll: (id: string) => void;
}) {
  if (enrollments === null && !error) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-16 w-full rounded-card" />
        <Skeleton className="h-16 w-full rounded-card" />
        <Skeleton className="h-16 w-full rounded-card" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm text-muted-foreground">
          Could not load your courses. Please try again.
        </p>

        <Button variant="outline" size="sm" onClick={onRetry}>
          Retry
        </Button>
      </div>
    );
  }

  if (enrollments?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-900 text-muted-foreground border border-slate-200/50 dark:border-transparent">
          <BookOpen className="size-6 text-muted-foreground" />
        </div>

        <div className="flex flex-col gap-2 max-w-sm">
          <h2 className="text-xl font-bold text-foreground">No Courses Found</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            You aren&apos;t enrolled in any courses yet. Browse the catalog to
            enroll.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {enrollments?.map((e) => (
        <li
          key={e.id}
          className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 p-2 border border-slate-100/50 dark:border-transparent"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-xs shrink-0 text-sky-500">
              <BookOpen className="size-5" />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="truncate text-xs sm:text-sm font-bold text-foreground">
                {courseTitles.get(e.courseId) ?? e.courseId}
              </span>

              <span className="text-[10px] text-muted-foreground mt-0.5">
                {e.role} &bull; {e.status} &bull; enrolled{" "}
                {new Date(e.enrolledAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <Button
            variant="destructive"
            size="sm"
            disabled={removingId === e.id}
            onClick={() => onUnenroll(e.id)}
          >
            {removingId === e.id && <Loader2 className="size-3.5 animate-spin" />}
            Unenroll
          </Button>
        </li>
      ))}
    </ul>
  );
}

function Catalog({
  catalog,
  error,
  enrollingId,
  enrolledCourseIds,
  onEnroll,
}: {
  catalog: Course[] | null;
  error: boolean;
  enrollingId: string | null;
  enrolledCourseIds: Set<string>;
  onEnroll: (courseId: string) => void;
}) {
  if (catalog === null && !error) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-24 w-full rounded-card" />
        <Skeleton className="h-24 w-full rounded-card" />
        <Skeleton className="h-24 w-full rounded-card" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <p className="text-sm text-muted-foreground">
          Could not load the catalog. Please try again.
        </p>
      </div>
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {catalog?.map((c, i) => {
        const enrolled = enrolledCourseIds.has(c.id);

        return (
          <li
            key={c.id}
            className="flex flex-col rounded-2xl bg-card p-3 shadow-sm border border-border"
          >
            <img
              src={`/courses/course0${(i % 6) + 1}.png`}
              alt={c.title}
              className="h-40 w-full rounded-xl object-cover"
            />

            <span className="mt-3 truncate text-sm font-bold text-foreground">
              {c.title}
            </span>

            <div className="mt-1.5 flex items-center gap-2 min-w-0">
              <span className="flex size-5 items-center justify-center rounded-full bg-muted text-muted-foreground shrink-0">
                <BookOpen className="size-3" />
              </span>

              <span className="truncate text-xs text-muted-foreground">
                {c.category}
              </span>

              <span className="ml-auto shrink-0 rounded-full bg-primary/10 text-primary px-2 py-0.5 text-[10px] font-bold">
                {c.level}
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="size-3" />
                {c.durationHours} hr
              </span>

              {enrolled ? (
                <span className="bg-completed-bg text-completed px-2.5 py-1.5 rounded-full text-[10px] font-bold">
                  Enrolled
                </span>
              ) : (
                <Button
                  size="sm"
                  className="rounded-full bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={enrollingId === c.id}
                  onClick={() => onEnroll(c.id)}
                >
                  {enrollingId === c.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
                  )}
                  Enroll
                </Button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
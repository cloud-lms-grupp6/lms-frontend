"use client";

import React from "react";
import { MapPin, Clock, BookOpen, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { type ScheduleEvent, deleteEvent } from "@/lib/schedule/api";

const TYPE_STYLES: Record<string, { label: string; className: string }> = {
  Lesson: { label: "Lesson", className: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" },
  Session: { label: "Session", className: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" },
  Deadline: { label: "Deadline", className: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300" },
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = {
  event: ScheduleEvent | null;
  isInstructor: boolean;
  token: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (event: ScheduleEvent) => void;
  onDeleted: (id: string) => void;
};

export function EventDetailSheet({
  event,
  isInstructor,
  token,
  open,
  onOpenChange,
  onEdit,
  onDeleted,
}: Props) {
  const [deleting, setDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState(false);

  async function handleDelete() {
    if (!event) return;
    setDeleting(true);
    setDeleteError(false);
    try {
      await deleteEvent(event.id, token);
      onDeleted(event.id);
      onOpenChange(false);
    } catch {
      setDeleteError(true);
    } finally {
      setDeleting(false);
    }
  }

  const typeStyle = event ? (TYPE_STYLES[event.type] ?? TYPE_STYLES.Lesson) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col gap-0 p-0">
        {event && (
          <>
            <SheetHeader className="p-6 pb-4">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeStyle?.className}`}
                >
                  {typeStyle?.label}
                </span>
              </div>
              <SheetTitle className="text-lg leading-snug">{event.title}</SheetTitle>
              {event.description && (
                <SheetDescription className="text-sm text-muted-foreground">
                  {event.description}
                </SheetDescription>
              )}
            </SheetHeader>

            <Separator />

            <div className="flex flex-col gap-4 px-6 py-4 flex-1">
              <div className="flex items-start gap-3">
                <Clock className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-medium text-foreground">
                    {formatDateTime(event.startsAt)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    → {formatDateTime(event.endsAt)}
                  </span>
                </div>
              </div>

              {event.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <span className="text-sm">{event.location}</span>
                </div>
              )}

              <div className="flex items-start gap-3">
                <BookOpen className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-mono truncate">
                  Course: {event.courseId}
                </span>
              </div>

              {deleteError && (
                <p className="text-xs text-destructive">Could not delete event. Try again.</p>
              )}
            </div>

            {isInstructor && (
              <>
                <Separator />
                <SheetFooter className="flex flex-row gap-2 p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      onOpenChange(false);
                      onEdit(event);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deleting}
                    onClick={handleDelete}
                  >
                    <Trash2 className="size-3.5" />
                    {deleting ? "Deleting…" : "Delete"}
                  </Button>
                </SheetFooter>
              </>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

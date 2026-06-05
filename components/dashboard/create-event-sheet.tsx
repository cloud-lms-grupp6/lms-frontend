"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  type ScheduleEvent,
  type CreateEventPayload,
  type UpdateEventPayload,
  type EventType,
  createEvent,
  updateEvent,
} from "@/lib/schedule/api";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string;
  courseIds: string[];
  editingEvent?: ScheduleEvent | null;
  onSaved: (event: ScheduleEvent) => void;
};

function toLocalDateTimeValue(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function toISOString(local: string) {
  return new Date(local).toISOString();
}

const EVENT_TYPES: EventType[] = ["Lesson", "Session", "Deadline"];

export function CreateEventSheet({
  open,
  onOpenChange,
  token,
  courseIds,
  editingEvent,
  onSaved,
}: Props) {
  const isEditing = !!editingEvent;

  const [courseId, setCourseId] = React.useState(editingEvent?.courseId ?? courseIds[0] ?? "");
  const [title, setTitle] = React.useState(editingEvent?.title ?? "");
  const [description, setDescription] = React.useState(editingEvent?.description ?? "");
  const [type, setType] = React.useState<EventType>(editingEvent?.type ?? "Lesson");
  const [startsAt, setStartsAt] = React.useState(
    editingEvent ? toLocalDateTimeValue(editingEvent.startsAt) : ""
  );
  const [endsAt, setEndsAt] = React.useState(
    editingEvent ? toLocalDateTimeValue(editingEvent.endsAt) : ""
  );
  const [location, setLocation] = React.useState(editingEvent?.location ?? "");
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setCourseId(editingEvent?.courseId ?? courseIds[0] ?? "");
      setTitle(editingEvent?.title ?? "");
      setDescription(editingEvent?.description ?? "");
      setType(editingEvent?.type ?? "Lesson");
      setStartsAt(editingEvent ? toLocalDateTimeValue(editingEvent.startsAt) : "");
      setEndsAt(editingEvent ? toLocalDateTimeValue(editingEvent.endsAt) : "");
      setLocation(editingEvent?.location ?? "");
      setError(null);
    }
  }, [open, editingEvent, courseIds]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!startsAt || !endsAt) {
      setError("Start and end time are required.");
      return;
    }
    if (new Date(endsAt) <= new Date(startsAt)) {
      setError("End time must be after start time.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      let saved: ScheduleEvent;
      if (isEditing && editingEvent) {
        const payload: UpdateEventPayload = {
          title,
          description: description || null,
          type,
          startsAt: toISOString(startsAt),
          endsAt: toISOString(endsAt),
          location: location || null,
        };
        saved = await updateEvent(editingEvent.id, payload, token);
      } else {
        const payload: CreateEventPayload = {
          courseId,
          title,
          description: description || null,
          type,
          startsAt: toISOString(startsAt),
          endsAt: toISOString(endsAt),
          location: location || null,
        };
        saved = await createEvent(payload, token);
      }
      onSaved(saved);
      onOpenChange(false);
    } catch {
      setError("Could not save event. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col gap-0 p-0">
        <SheetHeader className="p-6 pb-4">
          <SheetTitle>{isEditing ? "Edit Event" : "New Event"}</SheetTitle>
        </SheetHeader>

        <Separator />

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="flex flex-col gap-4 p-6">
            {!isEditing && courseIds.length > 1 && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="courseId">Course</Label>
                <select
                  id="courseId"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  required
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm text-foreground shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {courseIds.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm text-foreground shadow-xs focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lektion 1 – Introduktion"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Description (optional)</Label>
              <textarea
                id="description"
                value={description ?? ""}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Short description…"
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 resize-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="startsAt">Starts at</Label>
              <Input
                id="startsAt"
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="endsAt">Ends at</Label>
              <Input
                id="endsAt"
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="location">Location (optional)</Label>
              <Input
                id="location"
                value={location ?? ""}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Sal A"
              />
            </div>

            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <Separator />

          <SheetFooter className="p-4">
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Saving…" : isEditing ? "Save Changes" : "Create Event"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

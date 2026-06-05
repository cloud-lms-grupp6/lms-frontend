const API_URL =
  process.env.NEXT_PUBLIC_SCHEDULE_API_URL ??
  "https://schedule-api-lms.azurewebsites.net";

export type EventType = "Lesson" | "Session" | "Deadline";

export type ScheduleEvent = {
  id: string;
  courseId: string;
  title: string;
  description: string | null;
  type: EventType;
  startsAt: string;
  endsAt: string;
  location: string | null;
  createdBy: string;
  createdAt: string;
};

export type CreateEventPayload = {
  courseId: string;
  title: string;
  description?: string | null;
  type: EventType;
  startsAt: string;
  endsAt: string;
  location?: string | null;
};

export type UpdateEventPayload = {
  title: string;
  description?: string | null;
  type: EventType;
  startsAt: string;
  endsAt: string;
  location?: string | null;
};

export class ScheduleApiError extends Error {
  constructor(public status: number) {
    super(`schedule-api responded ${status}`);
  }
}

const eventTypes: EventType[] = ["Lesson", "Session", "Deadline"];
type RawEvent = Omit<ScheduleEvent, "type"> & { type: number };

function mapEvent(raw: RawEvent): ScheduleEvent {
  return { ...raw, type: eventTypes[raw.type] ?? "Lesson" };
}

async function apiFetch<T>(
  path: string,
  token: string,
  options?: RequestInit
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options?.headers,
      },
    });
  } catch {
    throw new ScheduleApiError(0);
  }
  if (!res.ok) throw new ScheduleApiError(res.status);
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function getCourseEvents(
  courseId: string,
  token: string,
  from?: Date,
  to?: Date
): Promise<ScheduleEvent[]> {
  const q = new URLSearchParams();
  if (from) q.set("from", from.toISOString());
  if (to) q.set("to", to.toISOString());
  const qs = q.toString() ? `?${q}` : "";
  const raw = await apiFetch<RawEvent[]>(`/courses/${courseId}/events${qs}`, token);
  return raw.map(mapEvent);
}

export async function createEvent(
  data: CreateEventPayload,
  token: string
): Promise<ScheduleEvent> {
  const raw = await apiFetch<RawEvent>("/events", token, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return mapEvent(raw);
}

export async function updateEvent(
  id: string,
  data: UpdateEventPayload,
  token: string
): Promise<ScheduleEvent> {
  const raw = await apiFetch<RawEvent>(`/events/${id}`, token, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return mapEvent(raw);
}

export async function deleteEvent(id: string, token: string): Promise<void> {
  await apiFetch<void>(`/events/${id}`, token, { method: "DELETE" });
}

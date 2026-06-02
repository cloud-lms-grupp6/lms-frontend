const API_URL =
  process.env.NEXT_PUBLIC_USERCOURSES_API_URL ??
  "https://usercourses-api-ax-a2ebbpf5ejcwcyby.polandcentral-01.azurewebsites.net";

export type EnrollmentRole = "Student" | "Instructor";
export type EnrollmentStatus = "Active" | "Withdrawn";

export type Enrollment = {
  id: string;
  userId: string;
  courseId: string;
  role: EnrollmentRole;
  status: EnrollmentStatus;
  enrolledAt: string;
};

export class UserCoursesApiError extends Error {
  constructor(public status: number) {
    super(`usercourses-api responded ${status}`);
  }
}

const roles: EnrollmentRole[] = ["Student", "Instructor"];
const statuses: EnrollmentStatus[] = ["Active", "Withdrawn"];

type RawEnrollment = {
  id: string;
  userId: string;
  courseId: string;
  role: number;
  status: number;
  enrolledAt: string;
};

function mapEnrollment(raw: RawEnrollment): Enrollment {
  return {
    id: raw.id,
    userId: raw.userId,
    courseId: raw.courseId,
    role: roles[raw.role] ?? "Student",
    status: statuses[raw.status] ?? "Active",
    enrolledAt: raw.enrolledAt,
  };
}

async function getJson<T>(path: string, token: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new UserCoursesApiError(0);
  }
  if (!res.ok) throw new UserCoursesApiError(res.status);
  return (await res.json()) as T;
}

export async function getMyEnrollments(userId: string, token: string): Promise<Enrollment[]> {
  const raw = await getJson<RawEnrollment[]>(`/users/${userId}/enrollments`, token);
  return raw.map(mapEnrollment);
}

export async function getCourseParticipants(courseId: string, token: string): Promise<Enrollment[]> {
  const raw = await getJson<RawEnrollment[]>(`/courses/${courseId}/enrollments`, token);
  return raw.map(mapEnrollment);
}

export async function unenroll(id: string, token: string): Promise<void> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/enrollments/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new UserCoursesApiError(0);
  }
  if (!res.ok) throw new UserCoursesApiError(res.status);
}

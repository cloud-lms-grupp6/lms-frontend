const API_URL =
  process.env.NEXT_PUBLIC_COURSES_API_URL ??
  "https://courses-api-ax.azurewebsites.net";

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export type Course = {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  category: string;
  level: CourseLevel;
  durationHours: number;
  isPublished: boolean;
};

export class CoursesApiError extends Error {
  constructor(public status: number) {
    super(`courses-api responded ${status}`);
  }
}

const levels: CourseLevel[] = ["Beginner", "Intermediate", "Advanced"];

type RawCourse = {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  category: string;
  level: number;
  durationHours: number;
  isPublished: boolean;
};

type RawList = {
  items: RawCourse[];
  total: number;
  page: number;
  pageSize: number;
};

function mapCourse(raw: RawCourse): Course {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description,
    instructorId: raw.instructorId,
    category: raw.category,
    level: levels[raw.level] ?? "Beginner",
    durationHours: raw.durationHours,
    isPublished: raw.isPublished,
  };
}

export async function listCourses(token: string): Promise<Course[]> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/courses?pageSize=100`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    throw new CoursesApiError(0);
  }
  if (!res.ok) throw new CoursesApiError(res.status);
  const data = (await res.json()) as RawList;
  return data.items.map(mapCourse);
}

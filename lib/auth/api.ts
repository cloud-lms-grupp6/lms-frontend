const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5145";

export type AuthError =
  | "invalid_credentials"
  | "email_taken"
  | "validation_failed"
  | "network_error"
  | "unauthorized";

export class AuthApiError extends Error {
  constructor(public code: AuthError, public status: number, message?: string) {
    super(message ?? code);
  }
}

export type LoginResponse = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  expiresUtc: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
  };
};

export type RegisterResponse = { id: string };

export type MeResponse = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
};

export type RequestVerificationResponse = {
  email: string;
  expiresInSeconds: number;
  code: string | null;
};

export type VerifyEmailResponse = { verified: boolean };

async function postJson<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new AuthApiError("network_error", 0, "Could not reach auth-api");
  }

  if (res.ok) return (await res.json()) as T;

  if (res.status === 401) throw new AuthApiError("invalid_credentials", 401);
  if (res.status === 409) throw new AuthApiError("email_taken", 409);
  if (res.status === 400) throw new AuthApiError("validation_failed", 400);
  throw new AuthApiError("network_error", res.status);
}

export function login(email: string, password: string) {
  return postJson<LoginResponse>("/auth/login", { email, password });
}

export function register(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) {
  return postJson<RegisterResponse>("/auth/register", input);
}

export function checkEmail(email: string) {
  return postJson<{ exists: boolean }>("/auth/check-email", { email });
}

export function requestVerification(email: string) {
  return postJson<RequestVerificationResponse>("/auth/verify-email/request", { email });
}

export function verifyEmail(email: string, code: string) {
  return postJson<VerifyEmailResponse>("/auth/verify-email/verify", { email, code });
}

export async function me(token: string): Promise<MeResponse> {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 401) throw new AuthApiError("unauthorized", 401);
  if (!res.ok) throw new AuthApiError("network_error", res.status);
  return (await res.json()) as MeResponse;
}

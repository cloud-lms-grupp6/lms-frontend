import { create } from "zustand";
import { persist } from "zustand/middleware";
import * as api from "./api";

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
};

type AuthActions = {
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => Promise<void>;
  verify: (email: string, code: string) => Promise<void>;
};

function setAuthCookie(token: string, expiresInSeconds: number) {
  document.cookie = `auth-token=${token}; path=/; max-age=${expiresInSeconds}; samesite=lax`;
}

function clearAuthCookie() {
  document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      signIn: async (email, password) => {
        const res = await api.login(email, password);
        setAuthCookie(res.accessToken, res.expiresIn);
        set({
          user: {
            id: res.user.id,
            email: res.user.email,
            firstName: res.user.firstName,
            lastName: res.user.lastName,
            role: res.user.roles[0] ?? "Student",
          },
          accessToken: res.accessToken,
          isAuthenticated: true,
        });
      },

      signOut: async () => {
        clearAuthCookie();
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      register: async (data) => {
        await api.register(data);
      },

      verify: async (email, code) => {
        await api.verifyEmail(email, code);
      },
    }),
    {
      name: "lms-auth",
    }
  )
);

import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  register: (data: any) => Promise<void>;
  verify: (code: string) => Promise<void>;
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      signIn: async (email, password) => {
        // ska koppla till backend Auth-Api när den finns
        await new Promise((resolve) => setTimeout(resolve, 500));

        const fakeToken = "mock-jwt-" + Date.now();
        // Sätt en cookie så att middleware.ts kan läsa den
        document.cookie = `auth-token=${fakeToken}; path=/; max-age=86400`;

        set({
          user: {
            id: "1",
            email,
            firstName: "Alexander",
            lastName: "Mock",
            role: "Student",
          },
          accessToken: fakeToken,
          isAuthenticated: true,
        });
      },

      signOut: async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        // Ta bort cookie
        document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        set({ user: null, accessToken: null, isAuthenticated: false });
      },

      register: async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
      },

      verify: async (code) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
      },
    }),
    {
      name: "lms-auth", // sparar allt i localStorage
    }
  )
);

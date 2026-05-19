import { useAuthStore } from "./store";

// Det här är bara en genväg för att slippa skriva useAuthStore i alla komponenter
export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const signIn = useAuthStore((state) => state.signIn);
  const signOut = useAuthStore((state) => state.signOut);
  const register = useAuthStore((state) => state.register);
  const verify = useAuthStore((state) => state.verify);

  return {
    user,
    isAuthenticated,
    signIn,
    signOut,
    register,
    verify,
  };
}

"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { login, AuthApiError } from "@/lib/auth/api";

export default function PasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") ?? "";
  const [password, setPassword] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError(null);

    try {
      setIsLoading(true);

      const res = await login(email, password);

      localStorage.setItem("token", res.accessToken);
      localStorage.setItem("user", JSON.stringify(res.user));

      router.push("/profile");
    } catch (err) {
      if (err instanceof AuthApiError && err.code === "invalid_credentials") {
        setSubmitError("Wrong email or password.");
      } else {
        setSubmitError("Could not log in. Try again.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-12">
      <header className="space-y-2 pb-7">
        <h1 className="text-5xl my-0">Welcome back</h1>
        <p className="text-sm text-muted-foreground">{email}</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2 pb-4">
          <label className="text-sm font-medium">Password</label>

          <input
            type="password"
            placeholder="Type your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
            required
          />
        </div>

        {submitError && (
          <p className="text-sm text-red-500" role="alert">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading || !email || !password}
          className="w-full rounded-lg bg-orange-500 px-5 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {isLoading ? "Logging in..." : "Log in"}
        </button>
      </form>
    </div>
  );
}
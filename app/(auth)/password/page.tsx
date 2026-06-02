"use client";

import { Lock, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth/hooks";
import { AuthApiError } from "@/lib/auth/api";
import { signInPasswordSchema, type SignInPasswordInput } from "@/lib/schemas/auth";
import { Suspense } from "react";

function PasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { signIn } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignInPasswordInput>({
    resolver: zodResolver(signInPasswordSchema),
    mode: "onTouched",
  });

  async function onSubmit(values: SignInPasswordInput) {
    setSubmitError(null);
    try {
      await signIn(email, values.password);
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof AuthApiError) {
        if (err.code === "invalid_credentials")
          setSubmitError("Wrong password. Try again.");
        else if (err.code === "network_error")
          setSubmitError("Could not reach the server. Is auth-api running?");
        else setSubmitError("Sign-in failed. Try again.");
      } else {
        setSubmitError("Unexpected error. Try again.");
      }
    }
  }

  return (
    <div className="space-y-12">
      <header className="space-y-2 pb-7">
        <h1 className="text-5xl my-0">Enter Password</h1>
        <p className="text-sm text-muted-foreground">
          Please enter your password to log in to your account.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <User
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="email"
              type="email"
              defaultValue={email}
              readOnly
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="password"
              type="password"
              placeholder="Type your password"
              className="pl-9"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <Label
                htmlFor="remember"
                className="text-xs text-muted-foreground"
              >
                Keep me logged in
              </Label>
            </div>
            <Link
              href="#"
              className="text-xs font-medium text-primary hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>

        {submitError && (
          <p className="text-sm text-destructive" role="alert">
            {submitError}
          </p>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !isValid}
        >
          {isSubmitting ? "Signing in…" : "Sign In"}
        </Button>
      </form>
    </div>
  );
}

export default function PasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PasswordForm />
    </Suspense>
  );
}

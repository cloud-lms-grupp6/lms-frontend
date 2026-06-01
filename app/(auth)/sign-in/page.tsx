"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signInEmailSchema, type SignInEmailInput } from "@/lib/schemas/auth";
import { checkEmail, AuthApiError } from "@/lib/auth/api";

export default function SignInPage() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignInEmailInput>({
    resolver: zodResolver(signInEmailSchema),
    mode: "onTouched",
  });

  async function onSubmit(values: SignInEmailInput) {
    setSubmitError(null);
    try {
      const res = await checkEmail(values.email);
      if (!res.exists) {
        setSubmitError("No account found for that email.");
        return;
      }
      router.push(`/password?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      if (err instanceof AuthApiError && err.code === "network_error")
        setSubmitError("Could not reach the server. Is auth-api running?");
      else setSubmitError("Something went wrong. Try again.");
    }
  }

  return (
    <div className="space-y-12">
      <header className="space-y-2 pb-7">
        <h1 className="text-5xl my-0">Welcome</h1>
        <p className="text-sm text-muted-foreground">
          Please log in to your account to continue.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="space-y-2 pb-4">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <User
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Type your email address"
              className="pl-9"
              aria-invalid={!!errors.email}
              {...register("email")}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
          <div className="flex justify-end">
            <Link
              href="/register"
              className="text-xs font-medium text-primary hover:underline"
            >
              Need an account? Register
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
          {isSubmitting ? "Checking…" : "Continue"}
        </Button>
      </form>

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-3 text-xs text-muted-foreground">
          or continue with
        </span>
      </div>

      <div className="flex justify-center">
        <Button
          type="button"
          variant="secondary"
          className="bg-background text-muted-foreground hover:bg-background/80"
        >
          <span className="mr-2 inline-block size-4 bg-[conic-gradient(at_50%_50%,#f25022_0_25%,#7fba00_0_50%,#00a4ef_0_75%,#ffb900_0)]" />
          Work or school account
        </Button>
      </div>
    </div>
  );
}

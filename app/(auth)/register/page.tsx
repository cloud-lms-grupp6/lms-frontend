"use client";

import { Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterInput } from "@/lib/schemas/auth";
import { useAuth } from "@/lib/auth/hooks";
import { AuthApiError } from "@/lib/auth/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const { register: authRegister } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
  });

  async function onSubmit(values: RegisterInput) {
    setSubmitError(null);
    try {
      await authRegister({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
      });
      router.push(`/verify?email=${encodeURIComponent(values.email)}`);
    } catch (err) {
      if (err instanceof AuthApiError) {
        if (err.code === "email_taken")
          setSubmitError("An account with that email already exists.");
        else if (err.code === "validation_failed")
          setSubmitError("Password does not meet requirements.");
        else if (err.code === "network_error")
          setSubmitError("Could not reach the server. Is auth-api running?");
        else setSubmitError("Registration failed. Try again.");
      } else {
        setSubmitError("Unexpected error. Try again.");
      }
    }
  }

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-5xl my-0">Almost There</h1>
        <p className="text-sm text-muted-foreground">
          Before you can sign in you need to verify your profile information and
          set a strong password. For security reasons, your password must be at
          least 8 characters long and include uppercase and lowercase letters,
          numbers, and special characters.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FieldWithIcon
          id="email"
          label="Email address"
          type="email"
          placeholder="Type your email address"
          icon={<Mail aria-hidden className="size-4" />}
          registration={register("email")}
          error={errors.email?.message}
        />
        <FieldWithIcon
          id="firstName"
          label="First name"
          placeholder="Type your first name"
          icon={<User aria-hidden className="size-4" />}
          registration={register("firstName")}
          error={errors.firstName?.message}
        />
        <FieldWithIcon
          id="lastName"
          label="Last name"
          placeholder="Type your last name"
          icon={<User aria-hidden className="size-4" />}
          registration={register("lastName")}
          error={errors.lastName?.message}
        />
        <div className="h-5" aria-hidden />
        <FieldWithIcon
          id="password"
          label="Password"
          type="password"
          placeholder="Type your password"
          icon={<Lock aria-hidden className="size-4" />}
          registration={register("password")}
          error={errors.password?.message}
        />
        <FieldWithIcon
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          icon={<Lock aria-hidden className="size-4" />}
          registration={register("confirmPassword")}
          error={errors.confirmPassword?.message}
        />

        <div className="flex items-center justify-start gap-2 pt-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms" className="text-xs text-muted-foreground">
            I agree with{" "}
            <Link href="#" className="text-primary hover:underline">
              terms and conditions
            </Link>
          </Label>
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
          {isSubmitting ? "Creating account..." : "Complete"}
        </Button>
      </form>
    </div>
  );
}

function FieldWithIcon({
  id,
  label,
  type = "text",
  placeholder,
  icon,
  registration,
  error,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon: React.ReactNode;
  registration: UseFormRegisterReturn;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          className="pl-9"
          aria-invalid={!!error}
          {...registration}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

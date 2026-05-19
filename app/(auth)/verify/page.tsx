"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { verifySchema, type VerifyInput } from "@/lib/schemas/auth";

export default function VerifyPage() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<VerifyInput>({
    resolver: zodResolver(verifySchema),
    mode: "onChange", // For OTP, onChange gives better immediate feedback
    defaultValues: {
      code: "",
    },
  });

  function onSubmit(values: VerifyInput) {
    console.log("verify code:", values);
    router.push("/register");
  }

  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h1 className="text-5xl my-0">Verification Needed</h1>
        <p className="text-sm text-muted-foreground">
          Please verify your account with the verification code that has been
          sent to your specified email address.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-15" noValidate>
        <div className="space-y-2">
          <Label htmlFor="otp">Enter verification code</Label>
          <Controller
            name="code"
            control={control}
            render={({ field }) => (
              <InputOTP
                maxLength={6}
                containerClassName="w-full"
                value={field.value}
                onChange={field.onChange}
              >
                <InputOTPGroup className="w-full justify-between gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="flex-1 aspect-square h-auto rounded-lg border text-lg"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            )}
          />
          {errors.code && (
            <p className="text-xs text-destructive">{errors.code.message}</p>
          )}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground">
              New code can be sent in 15 sec
            </span>
            <Link
              href="#"
              className="text-xs font-medium text-primary hover:underline"
            >
              Resend verification code
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting || !isValid}
        >
          Continue
        </Button>
      </form>
    </div>
  );
}

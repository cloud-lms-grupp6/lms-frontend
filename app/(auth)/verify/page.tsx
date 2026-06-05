"use client";

import { CheckCircle2, FlaskConical } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth/hooks";
import { AuthApiError, requestVerification } from "@/lib/auth/api";

type Phase = "requesting" | "typing" | "verifying" | "success" | "error";

function VerifyInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const { verify } = useAuth();

  const [code, setCode] = useState("");
  const [pocCode, setPocCode] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>(email ? "requesting" : "error");
  const [errorMsg, setErrorMsg] = useState<string | null>(
    email ? null : "Missing email in URL."
  );

  const requestedRef = useRef(false);

  useEffect(() => {
    if (phase !== "requesting") return;

    if (!email) {
      setErrorMsg("Missing email in URL.");
      setPhase("error");
      return;
    }

    if (requestedRef.current) return;
    requestedRef.current = true;

    async function run() {
      try {
        const res = await requestVerification(email);

        if (!res.code) {
          setErrorMsg("Server did not return a PoC code (not in dev mode).");
          setPhase("error");
          return;
        }

        setPocCode(res.code);
        setPhase("typing");
      } catch (err) {
        setErrorMsg(
          err instanceof AuthApiError && err.code === "network_error"
            ? "Could not reach the server."
            : "Failed to request verification code."
        );
        setPhase("error");
      }
    }

    run();
  }, [phase, email]);

  useEffect(() => {
    if (phase !== "typing" || !pocCode) return;

    let i = 0;
    let interval: ReturnType<typeof setInterval>;
    let done: ReturnType<typeof setTimeout>;

    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1;
        setCode(pocCode.slice(0, i));

        if (i >= pocCode.length) {
          clearInterval(interval);
          done = setTimeout(() => setPhase("verifying"), 1000);
        }
      }, 450);
    }, 1000);

    return () => {
      clearTimeout(start);
      clearInterval(interval);
      clearTimeout(done);
    };
  }, [phase, pocCode]);

  useEffect(() => {
    if (phase !== "verifying") return;

    let cancelled = false;

    async function run() {
      try {
        await verify(email, code);

        if (cancelled) return;

        setPhase("success");
      } catch (err) {
        if (cancelled) return;

        setErrorMsg(
          err instanceof AuthApiError
            ? "Verification failed. Code may be expired."
            : "Unexpected error during verification."
        );
        setPhase("error");
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [phase, code, email, verify]);

  useEffect(() => {
    if (phase !== "success") return;

    const timer = setTimeout(() => router.push("/sign-in"), 1500);
    return () => clearTimeout(timer);
  }, [phase, router]);

  return (
    <div className="space-y-10">
      <div
        className="flex items-center gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-300"
        role="note"
      >
        <FlaskConical className="size-4" aria-hidden />
        <span>
          <strong>PoC mode</strong> — code is auto-filled. Real email delivery
          via Azure Service Bus arrives in Phase 6.
        </span>
      </div>

      <header className="space-y-2">
        <h1 className="text-5xl my-0">
          {phase === "success" ? "Verified" : "Verification Needed"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {phase === "success" ? (
            <>Account verified for {email}. Redirecting to sign in…</>
          ) : (
            <>
              Please verify your account with the verification code that has
              been sent to {email}.
            </>
          )}
        </p>
      </header>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="space-y-15"
        noValidate
      >
        <div className="space-y-2">
          <Label htmlFor="otp">Enter verification code</Label>

          <InputOTP
            maxLength={6}
            containerClassName="w-full"
            value={code}
            onChange={() => {}}
            disabled
          >
            <InputOTPGroup className="w-full justify-between gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className={`flex-1 aspect-square h-auto rounded-lg border text-lg transition-transform duration-200 ${
                    phase === "success" ? "border-green-500 text-green-600" : ""
                  } ${
                    phase === "typing" && i === code.length - 1
                      ? "scale-125 border-primary z-10 shadow-md"
                      : ""
                  }`}
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground">
              {phase === "requesting" && "Requesting code…"}
              {phase === "typing" && "Auto-filling code…"}
              {phase === "verifying" && "Verifying…"}
              {phase === "success" && (
                <span className="inline-flex items-center gap-1 text-green-600">
                  <CheckCircle2 className="size-3.5" aria-hidden />
                  Verification successful
                </span>
              )}
              {phase === "error" && (
                <span className="text-destructive">{errorMsg}</span>
              )}
            </span>

            <Link
              href="#"
              className="pointer-events-none text-xs font-medium text-muted-foreground"
              aria-disabled
            >
              Resend verification code
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled>
          {phase === "success" ? "Verified" : "Continue"}
        </Button>
      </form>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyInner />
    </Suspense>
  );
}
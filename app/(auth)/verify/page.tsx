import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";

export default function VerifyPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-2">
        <h1 className="text-5xl my-0">Verification Needed</h1>
        <p className="text-sm text-muted-foreground">
          Please verify your account with the verification code that has been
          sent to your specified email address.
        </p>
      </header>

      <form className="space-y-15">
        <div className="space-y-2">
          <Label htmlFor="otp">Enter verification code</Label>
          <InputOTP id="otp" maxLength={7} containerClassName="w-full">
            <InputOTPGroup className="w-full justify-between gap-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="flex-1 aspect-square h-auto rounded-lg border text-lg"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
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

        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>
    </div>
  );
}

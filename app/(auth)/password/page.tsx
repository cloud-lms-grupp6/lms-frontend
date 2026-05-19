import { Lock, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PasswordPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-2 pb-7">
        <h1 className="text-5xl my-0">Enter Password</h1>
        <p className="text-sm text-muted-foreground">
          Please enter your password to log in to your account.
        </p>
      </header>

      <form className="space-y-6">
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
              defaultValue="example@domain.com"
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
            />
          </div>
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

        <Button type="submit" className="w-full">
          Sign In
        </Button>
      </form>
    </div>
  );
}

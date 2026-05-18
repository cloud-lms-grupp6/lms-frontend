import { Lock, User } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
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

      <form className="space-y-5">
        <FieldWithIcon
          id="firstName"
          label="First name"
          placeholder="Type your first name"
          icon={<User aria-hidden className="size-4" />}
        />
        <FieldWithIcon
          id="lastName"
          label="Last name"
          placeholder="Type your last name"
          icon={<User aria-hidden className="size-4" />}
        />
        <div className="h-5" aria-hidden />
        <FieldWithIcon
          id="password"
          label="Password"
          type="password"
          placeholder="Type your password"
          icon={<Lock aria-hidden className="size-4" />}
        />
        <FieldWithIcon
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="Confirm your password"
          icon={<Lock aria-hidden className="size-4" />}
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

        <Button type="submit" className="w-full">
          Complete
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
}: {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  icon: React.ReactNode;
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
        />
      </div>
    </div>
  );
}

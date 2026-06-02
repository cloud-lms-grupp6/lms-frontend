import { z } from "zod";

export const signInEmailSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});
export type SignInEmailInput = z.infer<typeof signInEmailSchema>;

export const signInPasswordSchema = z.object({
  password: z.string().min(1, "Password is required"),
});
export type SignInPasswordInput = z.infer<typeof signInPasswordSchema>;

export const verifySchema = z.object({
  code: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^\d{6}$/, "Digits only"),
});
export type VerifyInput = z.infer<typeof verifySchema>;

export const registerSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    firstName: z.string().min(1, "First name is required").max(50),
    lastName: z.string().min(1, "Last name is required").max(50),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "At least one uppercase letter")
      .regex(/[a-z]/, "At least one lowercase letter")
      .regex(/\d/, "At least one digit"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
export type RegisterInput = z.infer<typeof registerSchema>;

export const passwordResetSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});
export type PasswordResetInput = z.infer<typeof passwordResetSchema>;

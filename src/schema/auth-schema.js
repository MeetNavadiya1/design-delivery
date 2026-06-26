import * as z from "zod";

export const passwordSchema = z
    .string()
    .trim()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[!@#$%^&*(),.?":{}|<>]/, {
        message: "Password must contain at least one special character",
    });

const emailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: "Invalid email address" });

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, { message: "Password is required" }),
});

export const registerSchema = z.object({
    name: z.string().trim().min(2, { message: "Name must be at least 2 characters long" }),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const verifyOtpSchema = z.object({
    otp: z.string().regex(/^\d{6}$/, { message: "OTP must be exactly 6 digits" }),
});

export const forgotPasswordSchema = z.object({
    email: emailSchema,
});

import * as z from "zod";
import { isValidPhoneNumber } from "libphonenumber-js";

const emailSchema = z
  .string({ message: "Invalid email address" })
  .trim()
  .min(1, { message: "Email is required" })
  .email({ message: "Invalid email address" });

const nameSchema = z.string().trim().min(1, { message: "Name is required" });

const phoneSchema = z
  .string({ message: "Invalid phone" })
  .trim()
  .refine((val) => isValidPhoneNumber(val, "IN"), {
    message: "Invalid phone number"
  })

const clientFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
});

const taskFormSchema = z.object({
  name: nameSchema,
  employeeId: z
    .string()
    .min(1, { message: "Employee selection is required" }),
  description: z
    .string()
    .max(300, { message: "Description cannot exceed 300 characters" })
    .optional()
    .default(null),
});

const uploadTaskSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Name must be at least 2 characters" }),
  assetLink: z
    .string()
    .trim()
    .min(1, { message: "Asset link is required" })
    .url({ message: "Asset link must be a valid URL" }),
  comment: z.string().optional(),
});

const empFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
});

const projectSchema = z.object({
  name: nameSchema,
  clientId: nameSchema,
});

export {
  clientFormSchema,
  empFormSchema,
  projectSchema,
  taskFormSchema,
  uploadTaskSchema,
};

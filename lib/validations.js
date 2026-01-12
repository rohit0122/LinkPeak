import { z } from "zod";

// Link validation
export const linkSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  url: z.string().url("Please enter a valid URL").min(1, "URL is required"),
  icon: z.string().optional(),
  order: z.number().optional(),
  is_active: z.boolean().optional(),
});

// Bio page validation
export const bioPageSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(30, "Slug must be less than 30 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  title: z.string().max(60, "Title must be less than 60 characters").optional(),
  bio: z.string().max(200, "Bio must be less than 200 characters").optional(),
  profile_image: z.string().url().optional().or(z.literal("")),
});

// User profile validation
export const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email"),
});

// Auth validation
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be less than 100 characters"),
});

// Support ticket validation
export const supportTicketSchema = z.object({
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(100, "Subject must be less than 100 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

// Helper function to validate and return errors
export function validateData(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = {};
    result.error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return { success: false, errors };
  }
  return { success: true, data: result.data };
}

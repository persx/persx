import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

// Contact form validation schema
export const ContactFormSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message must be less than 5000 characters"),
  industry: z.string().optional(),
});

export type ContactFormData = z.infer<typeof ContactFormSchema>;

// Roadmap submission validation schema
export const RoadmapSubmissionSchema = z.object({
  industry: z.string().min(1, "Please select an industry"),
  industryOther: z.string().optional(),
  goals: z.array(z.string()).min(1, "Please select at least one goal"),
  goalOther: z.string().optional(),
  martechStack: z.array(z.string()).min(1, "Please select at least one martech tool"),
  martechOther: z.string().optional(),
  martechToolNames: z.record(z.string()).optional(),
  additionalDetails: z.string().optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  requestFullRoadmap: z.boolean().optional(),
});

export type RoadmapSubmissionData = z.infer<typeof RoadmapSubmissionSchema>;

// Content creation validation schema
export const ContentSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters"),
  slug: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(500, "Excerpt must be less than 500 characters").optional(),
  content_type: z.enum([
    "blog",
    "case_study",
    "implementation_guide",
    "test_result",
    "best_practice",
    "tool_guide",
    "news",
  ], { errorMap: () => ({ message: "Invalid content type" }) }),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  tags: z.array(z.string()).optional(),
  source_type: z.enum(["internal", "external"]).default("internal"),
  source_name: z.string().optional(),
  source_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  source_author: z.string().optional(),
  source_published_date: z.string().optional(),
  curator_notes: z.string().optional(),
  summary: z.string().optional(),
  external_sources: z.array(z.any()).optional(),
  persx_perspective: z.string().optional(),
  overall_summary: z.string().optional(),
});

export type ContentData = z.infer<typeof ContentSchema>;

// Password validation schema
export const PasswordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

// Admin user creation validation schema
export const AdminUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: PasswordSchema,
  name: z.string().optional(),
});

export type AdminUserData = z.infer<typeof AdminUserSchema>;

// Password reset validation schema
export const PasswordResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type PasswordResetData = z.infer<typeof PasswordResetSchema>;

// Password reset confirmation validation schema
export const PasswordResetConfirmSchema = z.object({
  token: z.string().uuid("Invalid reset token"),
  newPassword: PasswordSchema,
});

export type PasswordResetConfirmData = z.infer<typeof PasswordResetConfirmSchema>;

/**
 * Sanitize HTML content to prevent XSS attacks
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "a", "p", "br", "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}

/**
 * Sanitize plain text (removes all HTML)
 */
export function sanitizeText(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Validate and sanitize data against a schema
 */
export function validateAndSanitize<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  const result = schema.safeParse(data);

  if (!result.success) {
    return { success: false, errors: result.error };
  }

  return { success: true, data: result.data };
}

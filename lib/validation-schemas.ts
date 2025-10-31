/**
 * Validation Schemas
 *
 * Centralized Zod schemas for API endpoint validation.
 * Provides type-safe input validation and sanitization.
 */

import { z } from "zod";

/**
 * Contact Form Schema
 */
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long").optional(),
  email: z.string().email("Invalid email address").max(255, "Email is too long"),
  message: z.string().min(1, "Message is required").max(5000, "Message is too long"),
  industry: z.string().max(100, "Industry is too long").optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Roadmap Submission Schema
 */
export const roadmapSubmissionSchema = z.object({
  industry: z.string().min(1, "Industry is required").max(100, "Industry is too long"),
  industryOther: z.string().max(200, "Industry other is too long").optional(),
  goals: z.array(z.string().max(100)).min(1, "At least one goal is required").max(20, "Too many goals"),
  goalOther: z.string().max(200, "Goal other is too long").optional(),
  martechStack: z.array(z.string().max(100)).max(50, "Too many martech tools"),
  martechOther: z.string().max(200, "Martech other is too long").optional(),
  martechToolNames: z.record(z.string(), z.string().max(100)).optional(),
  additionalDetails: z.string().max(5000, "Additional details is too long").optional(),
  email: z.string().email("Invalid email address").max(255, "Email is too long").optional(),
  requestFullRoadmap: z.boolean().optional(),
});

export type RoadmapSubmissionData = z.infer<typeof roadmapSubmissionSchema>;

/**
 * Roadmap Update Schema (PATCH)
 */
export const roadmapUpdateSchema = z.object({
  id: z.string().uuid("Invalid submission ID"),
  email: z.string().email("Invalid email address").max(255, "Email is too long"),
  requestFullRoadmap: z.boolean().optional(),
});

export type RoadmapUpdateData = z.infer<typeof roadmapUpdateSchema>;

/**
 * Password Reset Request Schema
 */
export const passwordResetRequestSchema = z.object({
  email: z.string().email("Invalid email address").max(255, "Email is too long"),
});

export type PasswordResetRequestData = z.infer<typeof passwordResetRequestSchema>;

/**
 * Password Reset Confirm Schema
 */
export const passwordResetConfirmSchema = z.object({
  token: z.string().min(1, "Token is required").max(500, "Token is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export type PasswordResetConfirmData = z.infer<typeof passwordResetConfirmSchema>;

/**
 * Content Create/Update Schema
 */
export const contentSchema = z.object({
  title: z.string().min(1, "Title is required").max(500, "Title is too long"),
  content: z.string().max(100000, "Content is too long"),
  type: z.enum(["news", "documentation", "faq", "guide", "use_case", "integration", "best_practice", "general"]),
  tags: z.array(z.string().max(50)).max(20, "Too many tags").optional(),
  status: z.enum(["draft", "published"]).optional(),
  excerpt: z.string().max(1000, "Excerpt is too long").optional(),
});

export type ContentData = z.infer<typeof contentSchema>;

/**
 * Preview Token Request Schema
 */
export const previewTokenRequestSchema = z.object({
  contentId: z.string().uuid("Invalid content ID"),
});

export type PreviewTokenRequestData = z.infer<typeof previewTokenRequestSchema>;

/**
 * Fetch Metadata Schema
 */
export const fetchMetadataSchema = z.object({
  url: z.string().url("Invalid URL").max(2048, "URL is too long"),
});

export type FetchMetadataData = z.infer<typeof fetchMetadataSchema>;

/**
 * Generate Summary Schema
 */
export const generateSummarySchema = z.object({
  content: z.string().min(1, "Content is required").max(50000, "Content is too long"),
  maxLength: z.number().int().min(50).max(500).optional(),
});

export type GenerateSummaryData = z.infer<typeof generateSummarySchema>;

/**
 * Helper function to validate and parse request body
 * Returns either the parsed data or an error response
 */
export async function validateRequest<T>(
  request: Request,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string; details?: z.ZodError }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return {
        success: false,
        error: result.error.issues[0]?.message || "Validation failed",
        details: result.error,
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      error: "Invalid JSON in request body",
    };
  }
}

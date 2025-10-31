/**
 * Environment Variable Validation
 *
 * Validates required environment variables on startup to catch
 * configuration issues early and provide helpful error messages.
 */

import { z } from "zod";

/**
 * Environment variable schema
 * Defines all required and optional environment variables
 */
const envSchema = z.object({
  // Next.js
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
  NEXTAUTH_URL: z.string().url("NEXTAUTH_URL must be a valid URL").optional(),
  NEXTAUTH_SECRET: z.string().min(32, "NEXTAUTH_SECRET must be at least 32 characters"),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY is required"),

  // OpenAI (optional - only needed for AI features)
  OPENAI_API_KEY: z.string().optional(),

  // Resend (optional - only needed for email features)
  RESEND_API_KEY: z.string().optional(),

  // IndexNow (optional - only needed for search indexing)
  INDEXNOW_KEY: z.string().optional(),
});

export type EnvVariables = z.infer<typeof envSchema>;

/**
 * Validate environment variables
 * Call this early in the application startup
 */
export function validateEnv(): EnvVariables {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Invalid environment variables:");
    console.error(result.error.flatten().fieldErrors);

    // Build helpful error message
    const errors = result.error.flatten().fieldErrors;
    const errorMessages = Object.entries(errors)
      .map(([key, messages]) => `  - ${key}: ${messages?.join(", ")}`)
      .join("\n");

    throw new Error(
      `Environment validation failed:\n${errorMessages}\n\nPlease check your .env.local file and ensure all required variables are set correctly.`
    );
  }

  return result.data;
}

/**
 * Check if optional features are enabled based on environment variables
 */
export function checkOptionalFeatures() {
  const features = {
    aiFeatures: !!process.env.OPENAI_API_KEY,
    emailFeatures: !!process.env.RESEND_API_KEY,
    searchIndexing: !!process.env.INDEXNOW_KEY,
  };

  if (!features.aiFeatures) {
    console.warn("⚠️  AI features disabled: OPENAI_API_KEY not configured");
  }

  if (!features.emailFeatures) {
    console.warn("⚠️  Email features disabled: RESEND_API_KEY not configured");
  }

  if (!features.searchIndexing) {
    console.warn("⚠️  Search indexing disabled: INDEXNOW_KEY not configured");
  }

  return features;
}

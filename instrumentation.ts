/**
 * Instrumentation
 *
 * Runs once when the Next.js server starts.
 * Used for environment validation and startup checks.
 */

export async function register() {
  // Only run on server side
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateEnv, checkOptionalFeatures } = await import("./lib/env-validation");

    try {
      console.log("🔍 Validating environment variables...");
      validateEnv();
      console.log("✅ Environment variables validated successfully");

      console.log("\n📋 Checking optional features...");
      checkOptionalFeatures();
      console.log("");
    } catch (error) {
      console.error("\n❌ Environment validation failed:");
      console.error(error);
      // In production, we might want to exit the process
      // process.exit(1);
    }
  }
}

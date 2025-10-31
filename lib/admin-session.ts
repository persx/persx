/**
 * Admin Session Utility
 *
 * Server-side utilities for detecting admin sessions and reading
 * session-scoped personalization state.
 */

import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export interface PersonalizationState {
  industry?: string;
  tool?: string;
  goal?: string;
}

export interface AdminSessionState extends PersonalizationState {
  isAdminSession: boolean;
  hasPersonalization: boolean;
}

/**
 * Check if current session is an admin session
 * Uses NextAuth session to determine admin status
 */
async function checkIsAdminSession(): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);
    return !!session; // If authenticated with NextAuth, they're an admin
  } catch {
    return false;
  }
}

/**
 * Read personalization state from session cookies
 */
function readPersonalizationState(): PersonalizationState {
  const cookieStore = cookies();

  return {
    industry: cookieStore.get("persx_industry")?.value,
    tool: cookieStore.get("persx_tool")?.value,
    goal: cookieStore.get("persx_goal")?.value,
  };
}

/**
 * Get complete admin session state
 * Use this in server components to determine if/what to render
 */
export async function getAdminSessionState(): Promise<AdminSessionState> {
  const isAdminSession = await checkIsAdminSession();
  const personalization = readPersonalizationState();

  return {
    isAdminSession,
    ...personalization,
    hasPersonalization: !!(
      personalization.industry ||
      personalization.tool ||
      personalization.goal
    ),
  };
}

/**
 * Check if the Utility Bar feature is enabled
 * Uses environment variable for feature flag
 */
export function isUtilityBarEnabled(): boolean {
  // Default ON in non-production, configurable via env var
  const flagValue = process.env.NEXT_PUBLIC_FEATURE_UTILITY_BAR;

  if (flagValue === undefined) {
    // Default: enabled in development/staging, disabled in production
    return process.env.NODE_ENV !== "production";
  }

  return flagValue === "true" || flagValue === "1";
}

/**
 * Check if Utility Bar should be shown
 * Combines admin session check with feature flag
 */
export async function shouldShowUtilityBar(): Promise<boolean> {
  if (!isUtilityBarEnabled()) {
    return false;
  }

  return await checkIsAdminSession();
}

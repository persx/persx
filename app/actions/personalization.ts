/**
 * Personalization Server Actions
 *
 * Server actions for managing session-scoped personalization state.
 * These actions are admin-gated and handle clearing personalization.
 */

"use server";

import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

interface ActionResult {
  success: boolean;
  message: string;
}

/**
 * Verify admin session before executing action
 */
async function requireAdminSession(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return !!session;
}

/**
 * Clear industry from session
 */
export async function clearIndustry(): Promise<ActionResult> {
  const isAdmin = await requireAdminSession();

  if (!isAdmin) {
    return {
      success: false,
      message: "Unauthorized: Admin session required",
    };
  }

  const cookieStore = cookies();
  const hadIndustry = !!cookieStore.get("persx_industry");

  if (!hadIndustry) {
    return {
      success: true,
      message: "Nothing to clear.",
    };
  }

  // Clear industry cookie
  cookieStore.delete("persx_industry");

  // Revalidate current path to refresh content
  revalidatePath("/", "layout");

  return {
    success: true,
    message: "Industry cleared. Showing default content.",
  };
}

/**
 * Clear all personalization (industry, tool, goal)
 */
export async function clearAllPersonalization(): Promise<ActionResult> {
  const isAdmin = await requireAdminSession();

  if (!isAdmin) {
    return {
      success: false,
      message: "Unauthorized: Admin session required",
    };
  }

  const cookieStore = cookies();

  const hadAny =
    !!cookieStore.get("persx_industry") ||
    !!cookieStore.get("persx_tool") ||
    !!cookieStore.get("persx_goal");

  if (!hadAny) {
    return {
      success: true,
      message: "Nothing to clear.",
    };
  }

  // Clear all personalization cookies
  cookieStore.delete("persx_industry");
  cookieStore.delete("persx_tool");
  cookieStore.delete("persx_goal");

  // Revalidate current path to refresh content
  revalidatePath("/", "layout");

  return {
    success: true,
    message: "Personalization cleared. Showing default content.",
  };
}

/**
 * Set industry (for testing/admin purposes)
 */
export async function setIndustry(industry: string): Promise<ActionResult> {
  const isAdmin = await requireAdminSession();

  if (!isAdmin) {
    return {
      success: false,
      message: "Unauthorized: Admin session required",
    };
  }

  const cookieStore = cookies();

  // Set industry cookie with 7-day expiry
  cookieStore.set("persx_industry", industry, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    sameSite: "lax",
  });

  // Revalidate current path to refresh content
  revalidatePath("/", "layout");

  return {
    success: true,
    message: `Industry set to ${industry}`,
  };
}

/**
 * Set tool (for testing/admin purposes)
 */
export async function setTool(tool: string): Promise<ActionResult> {
  const isAdmin = await requireAdminSession();

  if (!isAdmin) {
    return {
      success: false,
      message: "Unauthorized: Admin session required",
    };
  }

  const cookieStore = cookies();

  cookieStore.set("persx_tool", tool, {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
  });

  revalidatePath("/", "layout");

  return {
    success: true,
    message: `Tool set to ${tool}`,
  };
}

/**
 * Set goal (for testing/admin purposes)
 */
export async function setGoal(goal: string): Promise<ActionResult> {
  const isAdmin = await requireAdminSession();

  if (!isAdmin) {
    return {
      success: false,
      message: "Unauthorized: Admin session required",
    };
  }

  const cookieStore = cookies();

  cookieStore.set("persx_goal", goal, {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
  });

  revalidatePath("/", "layout");

  return {
    success: true,
    message: `Goal set to ${goal}`,
  };
}

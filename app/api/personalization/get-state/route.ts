/**
 * API Route: Get Personalization State
 *
 * Public endpoint that returns the current personalization state from cookies
 */

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = cookies();

    const industry = cookieStore.get("persx_industry")?.value || null;
    const tool = cookieStore.get("persx_tool")?.value || null;
    const goal = cookieStore.get("persx_goal")?.value || null;

    return NextResponse.json({
      success: true,
      data: {
        industry,
        tool,
        goal,
      },
    });
  } catch (error) {
    console.error("Error reading personalization state:", error);
    return NextResponse.json(
      { success: false, message: "Failed to read personalization state" },
      { status: 500 }
    );
  }
}

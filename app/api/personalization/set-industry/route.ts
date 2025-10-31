/**
 * API Route: Set Industry Personalization Cookie
 *
 * Public endpoint that allows any visitor to personalize their session
 * by setting the industry cookie.
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { industry } = body;

    if (!industry || typeof industry !== "string") {
      return NextResponse.json(
        { success: false, message: "Industry is required" },
        { status: 400 }
      );
    }

    // Set industry cookie with 7-day expiry
    const cookieStore = cookies();
    cookieStore.set("persx_industry", industry, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    });

    return NextResponse.json({
      success: true,
      message: `Industry set to ${industry}`,
    });
  } catch (error) {
    console.error("Error setting industry cookie:", error);
    return NextResponse.json(
      { success: false, message: "Failed to set industry" },
      { status: 500 }
    );
  }
}

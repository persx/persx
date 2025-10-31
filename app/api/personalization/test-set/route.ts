/**
 * Test endpoint to manually set personalization cookies
 * Visit: /api/personalization/test-set?industry=Healthcare
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const industry = searchParams.get("industry") || "Healthcare";
  const tool = searchParams.get("tool") || "Optimizely";
  const goal = searchParams.get("goal") || "Increase Conversion";

  const cookieStore = cookies();

  // Set all personalization cookies
  cookieStore.set("persx_industry", industry, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
    sameSite: "lax",
  });

  cookieStore.set("persx_tool", tool, {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
  });

  cookieStore.set("persx_goal", goal, {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "lax",
  });

  return NextResponse.json({
    success: true,
    message: "Personalization cookies set",
    data: {
      industry,
      tool,
      goal,
    },
  });
}

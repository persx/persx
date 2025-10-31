import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getServerSession } from "next-auth";
import { randomBytes } from "crypto";
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rate-limiter";

/**
 * Generate a cryptographically secure random token for preview URLs
 * Uses crypto.randomBytes instead of Math.random() for security
 */
function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

/**
 * POST /api/content/preview-token
 * Generate a shareable preview token for draft content
 */
export async function POST(request: NextRequest) {
  // Rate limiting
  const identifier = getClientIdentifier(request);
  const rateLimit = checkRateLimit(identifier, RATE_LIMITS.API);

  if (rateLimit.limited) {
    return NextResponse.json(
      { error: RATE_LIMITS.API.message },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": RATE_LIMITS.API.maxRequests.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": new Date(rateLimit.resetTime).toISOString(),
        },
      }
    );
  }

  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contentId } = await request.json();

    if (!contentId) {
      return NextResponse.json(
        { error: "Content ID is required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Verify content exists
    const { data: content, error: contentError } = await supabase
      .from("knowledge_base_content")
      .select("id, title, status")
      .eq("id", contentId)
      .single();

    if (contentError || !content) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    // Generate token
    const token = generateToken();

    // Set expiration to 24 hours from now
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Check if token already exists for this content and delete it
    const { error: deleteError } = await supabase
      .from("content_preview_tokens")
      .delete()
      .eq("content_id", contentId);

    if (deleteError) {
      console.error("Error deleting old preview token:", deleteError);
    }

    // Insert new token
    const { data: tokenData, error: tokenError } = await supabase
      .from("content_preview_tokens")
      .insert({
        content_id: contentId,
        token: token,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (tokenError) {
      console.error("Error creating preview token:", tokenError);
      return NextResponse.json(
        { error: "Failed to create preview token" },
        { status: 500 }
      );
    }

    // Construct preview URL
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";
    const previewUrl = `${baseUrl}/preview/${token}`;

    return NextResponse.json({
      token: token,
      previewUrl: previewUrl,
      expiresAt: expiresAt.toISOString(),
      contentTitle: content.title,
    });
  } catch (error) {
    console.error("Error in preview token generation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/content/preview-token?token=xxx
 * Delete a preview token
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Delete token
    const { error } = await supabase
      .from("content_preview_tokens")
      .delete()
      .eq("token", token);

    if (error) {
      console.error("Error deleting preview token:", error);
      return NextResponse.json(
        { error: "Failed to delete preview token" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in preview token deletion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

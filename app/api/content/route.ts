import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase-server";
import { verifyCsrfToken, createCsrfErrorResponse } from "@/lib/csrf";

export async function POST(request: NextRequest) {
  try {
    // CSRF protection
    if (!verifyCsrfToken(request)) {
      return createCsrfErrorResponse();
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rawData = await request.json();

    // Validate input
    const { ContentSchema, sanitizeHtml } = await import("@/lib/validation");
    const validation = ContentSchema.safeParse(rawData);

    if (!validation.success) {
      const errors = validation.error.format();
      return NextResponse.json(
        {
          error: "Validation failed",
          details: errors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;
    const supabase = createAdminClient();

    // Sanitize HTML content
    const sanitizedContent = sanitizeHtml(data.content);

    // Use provided slug or generate from title
    const slug = data.slug || (
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        + "-" + Date.now()
    );

    // Insert content
    const { data: content, error } = await supabase
      .from("knowledge_base_content")
      .insert({
        title: data.title,
        slug: slug,
        content: sanitizedContent,
        excerpt: data.excerpt || null,
        content_type: data.content_type,
        status: data.status || "draft",
        tags: data.tags || [],
        // External content fields (single source)
        source_type: data.source_type || "internal",
        source_name: data.source_name || null,
        source_url: data.source_url || null,
        source_author: data.source_author || null,
        source_published_date: data.source_published_date || null,
        curator_notes: data.curator_notes || null,
        summary: data.summary || null,
        // Multi-source support
        external_sources: data.external_sources || [],
        persx_perspective: data.persx_perspective || null,
        overall_summary: data.overall_summary || null,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating content:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        {
          error: "Failed to create content",
          details: error.message,
          hint: error.hint
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ content }, { status: 201 });
  } catch (error) {
    console.error("Content creation error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

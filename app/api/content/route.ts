import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase-server";
import { submitContentToIndexNow } from "@/lib/indexnow";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.content || !data.content_type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Use provided slug or generate from title (limited to 5 words)
    const slug = data.slug || (
      data.title
        .toLowerCase()
        .split(/\s+/)
        .slice(0, 5)
        .join("-")
        .replace(/[^a-z0-9-]+/g, "")
        .replace(/(^-|-$)/g, "")
    );

    // Insert content
    const { data: content, error } = await supabase
      .from("knowledge_base_content")
      .insert({
        title: data.title,
        slug: slug,
        content: data.content,
        excerpt: data.excerpt || null,
        content_type: data.content_type,
        status: data.status || "draft",
        industry: data.industry || "General",
        tags: data.tags || [],
        // Page Management fields (for static_page content type)
        page_type: data.page_type || "content",
        navigation_group: data.navigation_group || null,
        navigation_order: data.navigation_order || 0,
        show_in_navigation: data.show_in_navigation || false,
        parent_page_id: data.parent_page_id || null,
        page_template: data.page_template || "default",
        // SEO fields
        meta_title: data.meta_title || null,
        meta_description: data.meta_description || null,
        focus_keyword: data.focus_keyword || null,
        canonical_url: data.canonical_url || null,
        // Open Graph
        og_title: data.og_title || null,
        og_description: data.og_description || null,
        og_image_url: data.og_image_url || null,
        // Twitter Card
        twitter_title: data.twitter_title || null,
        twitter_description: data.twitter_description || null,
        twitter_image_url: data.twitter_image_url || null,
        // Structured Data
        article_schema: data.article_schema || null,
        breadcrumb_schema: data.breadcrumb_schema || null,
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
        // Content blocks for block-based pages
        content_blocks: data.content_blocks || null,
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

    // Submit to IndexNow if published
    if (content.status === "published" && content.slug) {
      // Submit asynchronously, don't wait for response
      submitContentToIndexNow(content.content_type, content.slug).catch((err) => {
        console.error("IndexNow submission failed:", err);
        // Don't fail the request if IndexNow fails
      });
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

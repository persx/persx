import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase-server";

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

    // Insert content
    const { data: content, error } = await supabase
      .from("knowledge_base_content")
      .insert({
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || null,
        content_type: data.content_type,
        status: data.status || "draft",
        industries: data.industries || [],
        tool_categories: data.tool_categories || [],
        tags: data.tags || [],
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating content:", error);
      return NextResponse.json(
        { error: "Failed to create content" },
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

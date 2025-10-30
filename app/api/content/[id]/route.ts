import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase-server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();
    const supabase = createAdminClient();

    // Update content
    const { data: content, error } = await supabase
      .from("knowledge_base_content")
      .update({
        title: data.title,
        content: data.content,
        excerpt: data.excerpt || null,
        content_type: data.content_type,
        status: data.status,
        industries: data.industries || [],
        tool_categories: data.tool_categories || [],
        tags: data.tags || [],
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating content:", error);
      return NextResponse.json(
        { error: "Failed to update content" },
        { status: 500 }
      );
    }

    return NextResponse.json({ content }, { status: 200 });
  } catch (error) {
    console.error("Content update error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    // Delete content
    const { error } = await supabase
      .from("knowledge_base_content")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error("Error deleting content:", error);
      return NextResponse.json(
        { error: "Failed to delete content" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "Content deleted" }, { status: 200 });
  } catch (error) {
    console.error("Content deletion error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

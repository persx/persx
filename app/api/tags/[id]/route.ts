import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * PUT /api/tags/[id]
 * Update a tag (admin only)
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, category, description, color } = body;

    // Validation
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Check if tag exists
    const { data: existing } = await supabase
      .from("tags")
      .select("id")
      .eq("id", params.id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    // Check if another tag with same name exists
    const { data: duplicate } = await supabase
      .from("tags")
      .select("id")
      .eq("name", name.trim())
      .neq("id", params.id)
      .single();

    if (duplicate) {
      return NextResponse.json(
        { error: "Another tag with this name already exists" },
        { status: 409 }
      );
    }

    // Update tag
    const { data, error } = await supabase
      .from("tags")
      .update({
        name: name.trim(),
        category: category || null,
        description: description || null,
        color: color || null,
      })
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating tag:", error);
      return NextResponse.json(
        { error: "Failed to update tag" },
        { status: 500 }
      );
    }

    return NextResponse.json({ tag: data });
  } catch (error) {
    console.error("Error in PUT /api/tags/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tags/[id]
 * Delete a tag (admin only)
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient();

    // Check if tag exists
    const { data: existing } = await supabase
      .from("tags")
      .select("id, name, usage_count")
      .eq("id", params.id)
      .single();

    if (!existing) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    // Warn if tag is in use (but still allow deletion)
    if (existing.usage_count && existing.usage_count > 0) {
      console.warn(
        `Deleting tag "${existing.name}" which is used by ${existing.usage_count} content items`
      );
    }

    // Delete tag
    const { error } = await supabase
      .from("tags")
      .delete()
      .eq("id", params.id);

    if (error) {
      console.error("Error deleting tag:", error);
      return NextResponse.json(
        { error: "Failed to delete tag" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/tags/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

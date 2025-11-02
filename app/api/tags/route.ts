import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * GET /api/tags
 * List all tags with optional filtering by category
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const supabase = createClient();

    let query = supabase
      .from("tags")
      .select("*")
      .order("usage_count", { ascending: false })
      .order("name", { ascending: true });

    // Filter by category if provided
    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching tags:", error);
      return NextResponse.json(
        { error: "Failed to fetch tags" },
        { status: 500 }
      );
    }

    return NextResponse.json({ tags: data });
  } catch (error) {
    console.error("Error in GET /api/tags:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tags
 * Create a new tag (admin only)
 */
export async function POST(request: Request) {
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

    // Check if tag with same name already exists
    const { data: existing } = await supabase
      .from("tags")
      .select("id")
      .eq("name", name.trim())
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Tag with this name already exists" },
        { status: 409 }
      );
    }

    // Create tag
    const { data, error } = await supabase
      .from("tags")
      .insert({
        name: name.trim(),
        category: category || null,
        description: description || null,
        color: color || null,
        usage_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating tag:", error);
      return NextResponse.json(
        { error: "Failed to create tag" },
        { status: 500 }
      );
    }

    return NextResponse.json({ tag: data }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/tags:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

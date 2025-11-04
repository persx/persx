import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createClient();

    // Fetch all published pages that should appear in navigation
    const { data: pages, error } = await supabase
      .from("knowledge_base_content")
      .select("id, title, slug, content_type, navigation_group, navigation_order")
      .eq("status", "published")
      .eq("show_in_navigation", true)
      .order("navigation_order", { ascending: true });

    if (error) {
      console.error("Error fetching navigation:", error);
      return NextResponse.json(
        { error: "Failed to fetch navigation" },
        { status: 500 }
      );
    }

    // Group pages by navigation_group
    const grouped = {
      insights: [] as any[],
      company: [] as any[],
      resources: [] as any[],
    };

    pages?.forEach((page) => {
      if (page.navigation_group && page.navigation_group in grouped) {
        grouped[page.navigation_group as keyof typeof grouped].push({
          id: page.id,
          title: page.title,
          slug: page.slug,
          content_type: page.content_type,
        });
      }
    });

    return NextResponse.json({ navigation: grouped }, { status: 200 });
  } catch (error) {
    console.error("Navigation API error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

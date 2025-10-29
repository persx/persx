import { NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  try {
    // Check if Supabase is configured
    const envStatus = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
      isConfigured: isSupabaseConfigured,
    };

    // Try to fetch from Supabase
    const { data, error, count } = await supabase
      .from("roadmap_submissions")
      .select("*", { count: "exact" })
      .limit(5);

    if (error) {
      return NextResponse.json(
        {
          status: "error",
          environment: envStatus,
          error: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        status: "success",
        environment: envStatus,
        totalRecords: count,
        recentSubmissions: data,
        message: "Supabase connection successful!",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

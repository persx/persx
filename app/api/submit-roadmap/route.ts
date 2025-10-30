import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { RoadmapSubmission } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Get IP address and location from headers (Vercel provides these)
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ||
               request.headers.get("x-real-ip") ||
               "unknown";

    const city = request.headers.get("x-vercel-ip-city") || null;
    const region = request.headers.get("x-vercel-ip-country-region") || null;
    const country = request.headers.get("x-vercel-ip-country") || null;

    // Determine environment (production or local)
    const host = request.headers.get("host") || "";
    const environment = host.includes("localhost") || host.includes("127.0.0.1")
      ? "local"
      : "production";

    // Log the form submission data for debugging
    console.log("=== New Roadmap Submission ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Environment:", environment);
    console.log("IP Address:", ip);
    if (city || region || country) {
      console.log("Location:", [city, region, country].filter(Boolean).join(", "));
    }
    console.log("Industry:", data.industry);
    if (data.industryOther) {
      console.log("Industry (Other):", data.industryOther);
    }
    console.log("Goals:", data.goals.join(", "));
    if (data.goalOther) {
      console.log("Goal (Other):", data.goalOther);
    }
    console.log("Martech Stack:", data.martechStack.join(", "));
    if (data.martechOther) {
      console.log("Martech Stack (Other):", data.martechOther);
    }
    if (data.martechToolNames && Object.keys(data.martechToolNames).length > 0) {
      console.log("Martech Tool Names:", JSON.stringify(data.martechToolNames, null, 2));
    }
    console.log("Additional Details:", data.additionalDetails);
    if (data.email) {
      console.log("Email:", data.email);
      console.log("Full Roadmap Requested:", data.requestFullRoadmap || false);
    }

    let insertedData = null;

    // Only attempt to save to Supabase if it's configured
    if (isSupabaseConfigured) {
      // Prepare data for Supabase
      const submissionData: RoadmapSubmission = {
        industry: data.industry,
        industry_other: data.industryOther || null,
        goals: data.goals,
        goal_other: data.goalOther || null,
        martech_stack: data.martechStack,
        martech_other: data.martechOther || null,
        martech_tool_names: data.martechToolNames || null,
        additional_details: data.additionalDetails || null,
        email: data.email || null,
        request_full_roadmap: data.requestFullRoadmap || false,
        ip_address: ip,
        city,
        region,
        country,
        environment,
      };

      // Insert into Supabase
      const { data: result, error } = await supabase
        .from("roadmap_submissions")
        .insert([submissionData])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      insertedData = result;
      console.log("Successfully saved to Supabase:", insertedData);
    } else {
      console.warn("Supabase not configured. Data logged to console only.");
    }

    console.log("=============================\n");

    return NextResponse.json(
      {
        success: true,
        message: "Form submitted successfully",
        data: insertedData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing roadmap submission:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error processing submission",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

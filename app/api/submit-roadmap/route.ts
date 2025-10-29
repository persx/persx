import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Log the form submission data
    console.log("=== New Roadmap Submission ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Industry:", data.industry);
    if (data.industryOther) {
      console.log("Industry (Other):", data.industryOther);
    }
    console.log("Goal:", data.goal);
    console.log("Martech Stack:", data.martechStack.join(", "));
    if (data.martechOther) {
      console.log("Martech Stack (Other):", data.martechOther);
    }
    console.log("Additional Details:", data.additionalDetails);
    if (data.email) {
      console.log("Email:", data.email);
      console.log("Full Roadmap Requested:", data.requestFullRoadmap || false);
    }
    console.log("=============================\n");

    // In a production environment, you would:
    // 1. Save this data to a database (e.g., PostgreSQL, MongoDB)
    // 2. Send email notifications
    // 3. Trigger marketing automation
    // 4. Generate and send the full roadmap PDF

    // Example with a hypothetical database:
    // await db.roadmapSubmissions.create({
    //   data: {
    //     industry: data.industry,
    //     industryOther: data.industryOther,
    //     goal: data.goal,
    //     martechStack: data.martechStack,
    //     martechOther: data.martechOther,
    //     additionalDetails: data.additionalDetails,
    //     email: data.email,
    //     requestFullRoadmap: data.requestFullRoadmap,
    //     createdAt: new Date(),
    //   },
    // });

    return NextResponse.json(
      {
        success: true,
        message: "Form submitted successfully"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing roadmap submission:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error processing submission"
      },
      { status: 500 }
    );
  }
}

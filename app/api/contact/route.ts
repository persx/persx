import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rate-limiter";

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  // Rate limiting - strict limits for contact form to prevent spam
  const identifier = getClientIdentifier(request);
  const rateLimit = checkRateLimit(identifier, RATE_LIMITS.CONTACT);

  if (rateLimit.limited) {
    return NextResponse.json(
      {
        success: false,
        message: RATE_LIMITS.CONTACT.message,
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": RATE_LIMITS.CONTACT.maxRequests.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": new Date(rateLimit.resetTime).toISOString(),
        },
      }
    );
  }

  try {
    const data = await request.json();
    const { name, email, message, industry } = data;

    // Validate required fields
    if (!email || !message) {
      return NextResponse.json(
        { success: false, message: "Email and message are required" },
        { status: 400 }
      );
    }

    // Log the contact form submission
    console.log("=== New Contact Form Submission ===");
    console.log("Timestamp:", new Date().toISOString());
    console.log("Name:", name || "Not provided");
    console.log("Email:", email);
    console.log("Industry:", industry);
    console.log("Message:", message);
    console.log("===================================\n");

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: "PersX.ai Contact Form <onboarding@resend.dev>", // This will be replaced with your domain
      to: "persx@alexdesigns.com",
      subject: `New Contact Form Submission from ${name || email}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name || "Not provided"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Industry:</strong> ${industry}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Submitted on ${new Date().toLocaleString()}</p>
      `,
    });

    console.log("Email sent successfully:", emailResult);

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error sending message",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

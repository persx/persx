import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { formRateLimiter, getIdentifier } from "@/lib/rate-limit";
import { verifyCsrfToken, createCsrfErrorResponse } from "@/lib/csrf";

// Initialize Resend with API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  // CSRF protection
  if (!verifyCsrfToken(request)) {
    return createCsrfErrorResponse();
  }

  // Rate limiting
  const identifier = getIdentifier(request);
  const rateLimitResult = formRateLimiter.check(identifier);

  if (!rateLimitResult.success) {
    const resetDate = new Date(rateLimitResult.reset);
    return NextResponse.json(
      {
        success: false,
        message: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rateLimitResult.reset - Date.now()) / 1000)),
          "X-RateLimit-Limit": "3",
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          "X-RateLimit-Reset": resetDate.toISOString(),
        }
      }
    );
  }

  try {
    const data = await request.json();

    // Validate and sanitize input
    const { ContactFormSchema, sanitizeText } = await import("@/lib/validation");
    const validation = ContactFormSchema.safeParse(data);

    if (!validation.success) {
      const errors = validation.error.format();
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: errors,
        },
        { status: 400 }
      );
    }

    const { name, email, message, industry } = validation.data;

    // Sanitize text inputs to prevent XSS
    const sanitizedName = name ? sanitizeText(name) : undefined;
    const sanitizedMessage = sanitizeText(message);
    const sanitizedIndustry = industry ? sanitizeText(industry) : undefined;

    // Log the contact form submission (only in development)
    if (process.env.NODE_ENV !== "production") {
      console.log("=== New Contact Form Submission ===");
      console.log("Timestamp:", new Date().toISOString());
      console.log("Name:", sanitizedName || "Not provided");
      console.log("Industry:", sanitizedIndustry);
      console.log("===================================\n");
    }

    // Send email using Resend
    const emailResult = await resend.emails.send({
      from: "PersX.ai Contact Form <onboarding@resend.dev>", // This will be replaced with your domain
      to: "persx@alexdesigns.com",
      subject: `New Contact Form Submission from ${sanitizedName || email}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${sanitizedName || "Not provided"}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Industry:</strong> ${sanitizedIndustry || "Not provided"}</p>
        <p><strong>Message:</strong></p>
        <p>${sanitizedMessage.replace(/\n/g, "<br>")}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Submitted on ${new Date().toLocaleString()}</p>
      `,
    });

    if (process.env.NODE_ENV !== "production") {
      console.log("Email sent successfully:", emailResult);
    }

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

import { NextRequest, NextResponse } from "next/server";
import { createPasswordResetToken } from "@/lib/auth";
import { Resend } from "resend";
import { checkRateLimit, getClientIdentifier, RATE_LIMITS } from "@/lib/rate-limiter";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  // Rate limiting - strict limits for password reset to prevent abuse
  const identifier = getClientIdentifier(request);
  const rateLimit = checkRateLimit(identifier, RATE_LIMITS.AUTH);

  if (rateLimit.limited) {
    return NextResponse.json(
      { error: RATE_LIMITS.AUTH.message },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": RATE_LIMITS.AUTH.maxRequests.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
          "X-RateLimit-Reset": new Date(rateLimit.resetTime).toISOString(),
        },
      }
    );
  }

  try {
    // Validate request body with Zod
    const { validateRequest, passwordResetRequestSchema } = await import("@/lib/validation-schemas");
    const validation = await validateRequest(request, passwordResetRequestSchema);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Fix user enumeration: Always return success regardless of whether email exists
    // This prevents attackers from determining which emails are registered
    try {
      // Create reset token (this will silently fail if email doesn't exist)
      const { token } = await createPasswordResetToken(email);

      // Generate reset link
      const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/go/reset?token=${token}`;

      // Send email
      await resend.emails.send({
        from: "PersX.ai <onboarding@resend.dev>",
        to: email,
        subject: "Reset Your PersX.ai Admin Password",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #3b82f6;">Reset Your Password</h1>
            <p>You requested to reset your password for the PersX.ai admin panel.</p>
            <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
            <div style="margin: 30px 0;">
              <a href="${resetUrl}"
                 style="background: linear-gradient(to right, #3b82f6, #9333ea);
                        color: white;
                        padding: 12px 24px;
                        text-decoration: none;
                        border-radius: 8px;
                        display: inline-block;
                        font-weight: 600;">
                Reset Password
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              Or copy and paste this link into your browser:<br/>
              <a href="${resetUrl}" style="color: #3b82f6;">${resetUrl}</a>
            </p>
            <p style="color: #6b7280; font-size: 14px;">
              If you didn't request this password reset, you can safely ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px;">
              PersX.ai - AI Strategist for Personalization & Experimentation
            </p>
          </div>
        `,
      });
    } catch (error) {
      // Silently catch errors to prevent user enumeration
      console.error("Password reset error (hidden from user):", error);
    }

    // Always return success, even if email doesn't exist
    // This prevents attackers from determining which emails are registered
    return NextResponse.json(
      {
        message: "If an account exists with that email, a password reset link has been sent",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to send password reset email" },
      { status: 500 }
    );
  }
}

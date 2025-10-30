import { NextRequest, NextResponse } from "next/server";
import { createPasswordResetToken } from "@/lib/auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Create reset token
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

    return NextResponse.json(
      { message: "Password reset email sent" },
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

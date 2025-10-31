import { NextRequest, NextResponse } from 'next/server';
import { subscribeToNewsletter } from '@/lib/convertkit';

/**
 * POST /api/newsletter/subscribe
 *
 * Subscribe email to newsletter via ConvertKit
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName } = body;

    // Validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Subscribe via ConvertKit
    const result = await subscribeToNewsletter(email, firstName);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing! Check your inbox for confirmation.',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}

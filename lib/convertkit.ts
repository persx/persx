/**
 * ConvertKit API Integration
 *
 * Documentation: https://developers.convertkit.com/
 */

const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY;
const CONVERTKIT_API_SECRET = process.env.CONVERTKIT_API_SECRET;
const CONVERTKIT_BASE_URL = 'https://api.convertkit.com/v3';

// Form IDs from ConvertKit
const CONVERTKIT_NEWSLETTER_FORM_ID = process.env.CONVERTKIT_NEWSLETTER_FORM_ID;
const CONVERTKIT_ROADMAP_FORM_ID = process.env.CONVERTKIT_ROADMAP_FORM_ID;

// Tag IDs (optional - use for segmentation)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _CONVERTKIT_NEWSLETTER_TAG_ID = process.env.CONVERTKIT_NEWSLETTER_TAG_ID;
const CONVERTKIT_ROADMAP_TAG_ID = process.env.CONVERTKIT_ROADMAP_TAG_ID;

interface ConvertKitSubscriber {
  email: string;
  first_name?: string;
  fields?: Record<string, string>;
  tags?: number[];
}

interface ConvertKitResponse {
  subscription?: {
    id: number;
    state: string;
    subscriber: {
      id: number;
      email_address: string;
    };
  };
  error?: string;
  message?: string;
}

/**
 * Subscribe email to newsletter form
 */
export async function subscribeToNewsletter(
  email: string,
  firstName?: string
): Promise<{ success: boolean; message: string; data?: any }> {
  if (!CONVERTKIT_API_KEY || !CONVERTKIT_NEWSLETTER_FORM_ID) {
    console.error('ConvertKit API key or newsletter form ID not configured');
    return {
      success: false,
      message: 'Newsletter subscription not configured',
    };
  }

  try {
    const response = await fetch(
      `${CONVERTKIT_BASE_URL}/forms/${CONVERTKIT_NEWSLETTER_FORM_ID}/subscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: CONVERTKIT_API_KEY,
          email,
          first_name: firstName || '',
        }),
      }
    );

    const data: ConvertKitResponse = await response.json();

    if (!response.ok) {
      console.error('ConvertKit newsletter subscription failed:', data);
      return {
        success: false,
        message: data.error || data.message || 'Subscription failed',
      };
    }

    return {
      success: true,
      message: 'Successfully subscribed to newsletter',
      data,
    };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
}

/**
 * Subscribe email to roadmap form and send automation
 */
export async function subscribeToRoadmap(
  email: string,
  formData: {
    industry?: string;
    goals?: string[];
    martechStack?: string[];
    firstName?: string;
  }
): Promise<{ success: boolean; message: string; data?: any }> {
  if (!CONVERTKIT_API_KEY || !CONVERTKIT_ROADMAP_FORM_ID) {
    console.error('ConvertKit API key or roadmap form ID not configured');
    return {
      success: false,
      message: 'Roadmap delivery not configured',
    };
  }

  try {
    // Build custom fields for ConvertKit
    const fields: Record<string, string> = {};

    if (formData.industry) {
      fields.industry = formData.industry;
    }

    if (formData.goals && formData.goals.length > 0) {
      fields.goals = formData.goals.join(', ');
    }

    if (formData.martechStack && formData.martechStack.length > 0) {
      fields.martech_stack = formData.martechStack.join(', ');
    }

    const response = await fetch(
      `${CONVERTKIT_BASE_URL}/forms/${CONVERTKIT_ROADMAP_FORM_ID}/subscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: CONVERTKIT_API_KEY,
          email,
          first_name: formData.firstName || '',
          fields,
          tags: CONVERTKIT_ROADMAP_TAG_ID ? [Number(CONVERTKIT_ROADMAP_TAG_ID)] : undefined,
        }),
      }
    );

    const data: ConvertKitResponse = await response.json();

    if (!response.ok) {
      console.error('ConvertKit roadmap subscription failed:', data);
      return {
        success: false,
        message: data.error || data.message || 'Roadmap delivery failed',
      };
    }

    return {
      success: true,
      message: 'Roadmap will be sent to your email shortly',
      data,
    };
  } catch (error) {
    console.error('Error subscribing to roadmap:', error);
    return {
      success: false,
      message: 'Network error. Please try again.',
    };
  }
}

/**
 * Add tags to existing subscriber (for segmentation)
 */
export async function tagSubscriber(
  email: string,
  tagId: number
): Promise<{ success: boolean; message: string }> {
  if (!CONVERTKIT_API_SECRET) {
    console.error('ConvertKit API secret not configured');
    return {
      success: false,
      message: 'Tagging not configured',
    };
  }

  try {
    const response = await fetch(
      `${CONVERTKIT_BASE_URL}/tags/${tagId}/subscribe`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_secret: CONVERTKIT_API_SECRET,
          email,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('ConvertKit tagging failed:', data);
      return {
        success: false,
        message: data.error || data.message || 'Tagging failed',
      };
    }

    return {
      success: true,
      message: 'Successfully tagged subscriber',
    };
  } catch (error) {
    console.error('Error tagging subscriber:', error);
    return {
      success: false,
      message: 'Network error',
    };
  }
}

/**
 * Update subscriber custom fields
 */
export async function updateSubscriberFields(
  subscriberId: number,
  fields: Record<string, string>
): Promise<{ success: boolean; message: string }> {
  if (!CONVERTKIT_API_SECRET) {
    console.error('ConvertKit API secret not configured');
    return {
      success: false,
      message: 'Update not configured',
    };
  }

  try {
    const response = await fetch(
      `${CONVERTKIT_BASE_URL}/subscribers/${subscriberId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_secret: CONVERTKIT_API_SECRET,
          fields,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('ConvertKit update failed:', data);
      return {
        success: false,
        message: data.error || data.message || 'Update failed',
      };
    }

    return {
      success: true,
      message: 'Successfully updated subscriber',
    };
  } catch (error) {
    console.error('Error updating subscriber:', error);
    return {
      success: false,
      message: 'Network error',
    };
  }
}

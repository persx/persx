# ConvertKit Integration Setup

This guide walks you through setting up ConvertKit for newsletter subscriptions and roadmap delivery.

## Overview

The site uses ConvertKit for:
1. **Newsletter subscriptions** - From newsletter forms across the site
2. **Full 90-Day Roadmap delivery** - When users complete the /start form and request the full roadmap

## Prerequisites

1. A ConvertKit account ([sign up here](https://convertkit.com))
2. Access to your ConvertKit API credentials

## Step 1: Get Your API Credentials

### API Key (Public)
1. Go to ConvertKit Settings: https://app.convertkit.com/account_settings/advanced_settings
2. Under "API Secret", click "Show"
3. Copy your **API Key** (this is your public key)

### API Secret (Private)
1. In the same settings page
2. Copy your **API Secret**

⚠️ **Important**: The API Secret is sensitive and should only be used server-side.

## Step 2: Create Forms in ConvertKit

### Newsletter Form
1. Go to https://app.convertkit.com/forms
2. Click "Create Form" → Choose a template or start blank
3. Name it: "Newsletter Subscription"
4. After creating, note the **Form ID** from the URL or settings
   - Example: `https://app.convertkit.com/forms/12345678/edit`
   - The Form ID is `12345678`

### Roadmap Form
1. Create another form
2. Name it: "90-Day Roadmap Request"
3. Note the **Form ID**

## Step 3: Create Custom Fields (Optional but Recommended)

To track user data for segmentation:

1. Go to https://app.convertkit.com/subscribers/custom_fields
2. Create these fields:
   - `industry` (Text)
   - `goals` (Text)
   - `martech_stack` (Text)

These will be populated automatically when users subscribe.

## Step 4: Set Up Automations

### Newsletter Automation
1. Go to Automations → Create Visual Automation
2. Trigger: "Subscribes to a form" → Select your Newsletter Form
3. Add actions:
   - Wait 1 minute
   - Send email: "Welcome to PersX.ai Newsletter"
4. Activate the automation

### Roadmap Automation
1. Create another Visual Automation
2. Trigger: "Subscribes to a form" → Select your Roadmap Form
3. Add actions:
   - Wait 1 minute
   - Send email: "Your Full 90-Day Roadmap"
   - Attach or link to the roadmap PDF/document
4. Activate the automation

## Step 5: Create Welcome Emails

### Newsletter Welcome Email
Create an email template that includes:
- Welcome message
- What subscribers can expect
- Link to manage preferences

### Roadmap Email
Create an email that includes:
- Thank you message
- The full 90-day personalization roadmap
- Next steps or CTA

## Step 6: Add Environment Variables

Add these to your `.env.local` file:

```bash
# ConvertKit API Credentials
CONVERTKIT_API_KEY="your_api_key_here"
CONVERTKIT_API_SECRET="your_api_secret_here"

# ConvertKit Form IDs
CONVERTKIT_NEWSLETTER_FORM_ID="12345678"  # Replace with your Newsletter Form ID
CONVERTKIT_ROADMAP_FORM_ID="87654321"     # Replace with your Roadmap Form ID

# Optional: ConvertKit Tag IDs (for advanced segmentation)
CONVERTKIT_NEWSLETTER_TAG_ID="111111"
CONVERTKIT_ROADMAP_TAG_ID="222222"
```

### For Production (Vercel)

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add each variable above
4. Redeploy your site

## Step 7: Test the Integration

### Test Newsletter Subscription
1. Visit your site
2. Find a newsletter form
3. Enter your email
4. Check ConvertKit → Subscribers
5. Verify you received the welcome email

### Test Roadmap Delivery
1. Visit `/start` on your site
2. Complete the form
3. Request the full roadmap
4. Check ConvertKit → Subscribers
5. Verify you received the roadmap email
6. Check that custom fields (industry, goals, martech_stack) are populated

## Troubleshooting

### Newsletter subscription not working
- Check browser console for errors
- Verify `CONVERTKIT_API_KEY` is set correctly
- Verify `CONVERTKIT_NEWSLETTER_FORM_ID` is correct
- Check ConvertKit form is not archived

### Roadmap not sending
- Verify `CONVERTKIT_ROADMAP_FORM_ID` is correct
- Check that the automation is activated
- Verify custom fields exist in ConvertKit
- Check server logs for ConvertKit API errors

### Testing locally
If testing locally, make sure `.env.local` is in your `.gitignore` and properly configured.

## API Endpoints

The integration uses these endpoints:

- `POST /api/newsletter/subscribe` - Newsletter subscriptions
- `PATCH /api/submit-roadmap` - Roadmap delivery (triggered when user requests full roadmap)

## Code References

- ConvertKit utilities: `lib/convertkit.ts`
- Newsletter API: `app/api/newsletter/subscribe/route.ts`
- Roadmap API: `app/api/submit-roadmap/route.ts`
- Newsletter component: `components/NewsletterSubscription.tsx`

## Support

- ConvertKit Documentation: https://developers.convertkit.com/
- ConvertKit Support: https://help.convertkit.com/

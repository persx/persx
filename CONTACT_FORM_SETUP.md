# Contact Form Email Setup

The contact form sends emails to `persx@alexdesigns.com` using Resend.

## Setup Instructions

### 1. Get a Resend API Key

1. Go to [https://resend.com](https://resend.com) and sign up for a free account
2. Navigate to API Keys section: [https://resend.com/api-keys](https://resend.com/api-keys)
3. Create a new API key
4. Copy the API key (it will only be shown once)

### 2. Add API Key to Environment Variables

#### For Local Development:

Add to `.env.local`:
```
RESEND_API_KEY=re_your_actual_api_key_here
```

#### For Production (Vercel):

1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add a new variable:
   - Name: `RESEND_API_KEY`
   - Value: Your Resend API key
   - Environment: Production (and Preview if needed)

### 3. Verify Setup

1. Run the development server: `npm run dev`
2. Go to the contact page
3. Fill out and submit the form
4. Check the terminal logs for confirmation
5. Check your email inbox at persx@alexdesigns.com

## Features

- ✅ Email field is required
- ✅ Subject field removed (auto-generated)
- ✅ Sends to: persx@alexdesigns.com
- ✅ Includes user's name, email, message, and selected industry
- ✅ Privacy notice below submit button
- ✅ Success/error feedback messages
- ✅ Form resets after successful submission
- ✅ Loading state during submission

## Email Content

Each submission includes:
- User's name (if provided)
- User's email address
- Selected industry from the start form (if available)
- Message content
- Timestamp

## Notes

- Resend's free tier includes 3,000 emails per month
- The default "from" address is `onboarding@resend.dev`
- To use a custom domain (e.g., `contact@persx.ai`), you need to verify your domain in Resend

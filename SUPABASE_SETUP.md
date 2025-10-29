# Supabase Database Setup Guide

This guide will walk you through setting up Supabase as the database for persx.ai roadmap form submissions.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- The persx.ai codebase with Supabase dependencies installed

## Step 1: Create a Supabase Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in the details:
   - **Name**: persx-ai (or your preferred name)
   - **Database Password**: Choose a secure password (save this!)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait 2-3 minutes for the project to be provisioned

## Step 2: Create the Database Table

1. In your Supabase project dashboard, click on the **SQL Editor** in the left sidebar
2. Click "New Query"
3. Copy the entire contents of `supabase-schema.sql` from this repository
4. Paste it into the SQL editor
5. Click "Run" or press `Cmd/Ctrl + Enter`
6. You should see "Success. No rows returned" message

This creates:
- ✅ `roadmap_submissions` table with all required columns
- ✅ Indexes for performance optimization
- ✅ Row Level Security (RLS) policies
- ✅ Analytics view for reporting

## Step 3: Get Your API Credentials

1. In your Supabase project, click on the **Settings** gear icon (bottom left)
2. Click **API** in the settings menu
3. You'll see two important values:

   **Project URL**
   ```
   https://your-project-id.supabase.co
   ```

   **anon public key** (under "Project API keys")
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. Copy both values - you'll need them in the next step

## Step 4: Configure Environment Variables

### For Local Development

1. In your project root, copy the example file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Save the file

### For Vercel Deployment

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add two new variables:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project-id.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1...` |

4. Make sure to add them for all environments (Production, Preview, Development)
5. Click "Save"
6. Redeploy your application

## Step 5: Test the Integration

### Local Testing

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:3000/start
3. Fill out the roadmap form completely
4. Click through all 4 steps
5. Submit the form

### Verify in Supabase

1. Go to your Supabase project
2. Click **Table Editor** in the left sidebar
3. Select the `roadmap_submissions` table
4. You should see your test submission!

### Check the Console

Look for this output in your terminal:
```
=== New Roadmap Submission ===
Timestamp: 2025-10-29T...
Industry: eCommerce
Goal: Improve AOV
Successfully saved to Supabase: [...]
=============================
```

## Step 6: Verify Database Structure

Run this query in the SQL Editor to verify the table:

```sql
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'roadmap_submissions'
ORDER BY ordinal_position;
```

Expected columns:
- `id` (uuid)
- `industry` (text)
- `industry_other` (text)
- `goal` (text)
- `martech_stack` (text[])
- `martech_other` (text)
- `additional_details` (text)
- `email` (text)
- `request_full_roadmap` (boolean)
- `created_at` (timestamp with time zone)

## Viewing Your Data

### Table Editor (GUI)

1. Click **Table Editor** in Supabase
2. Select `roadmap_submissions`
3. Browse, filter, and export data

### SQL Editor (Advanced)

Get all submissions from the last 7 days:
```sql
SELECT * FROM roadmap_submissions
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

View analytics by industry:
```sql
SELECT
  industry,
  COUNT(*) as total_submissions,
  COUNT(email) as with_email,
  COUNT(CASE WHEN request_full_roadmap THEN 1 END) as full_roadmap_requests
FROM roadmap_submissions
GROUP BY industry
ORDER BY total_submissions DESC;
```

## Security & Privacy

### Row Level Security (RLS)

The table has RLS enabled with these policies:

1. **Anonymous inserts**: Anyone can submit the form (required for public form)
2. **Authenticated reads**: Only authenticated users (admins) can view submissions

### Managing Access

To give someone admin access to view submissions:

1. Invite them to your Supabase project
2. They can then view data in the Table Editor or via SQL queries

### Data Export

Export submissions for analysis:

1. Go to **Table Editor** → `roadmap_submissions`
2. Click the three dots menu
3. Select "Download as CSV"

## Troubleshooting

### Error: "Invalid API credentials"

**Solution**: Double-check your environment variables
```bash
# Verify they are set
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Error: "relation 'roadmap_submissions' does not exist"

**Solution**: The table wasn't created. Run the schema SQL again:
1. Open SQL Editor in Supabase
2. Paste contents of `supabase-schema.sql`
3. Run the query

### Error: "new row violates row-level security policy"

**Solution**: RLS policies might be incorrect. Run this:
```sql
-- Allow inserts for anonymous users
CREATE POLICY "Allow anonymous inserts"
ON public.roadmap_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
```

### Data not showing up

**Checklist**:
- ✅ Environment variables are set correctly
- ✅ Table exists in Supabase
- ✅ RLS policies are configured
- ✅ No errors in browser console
- ✅ No errors in terminal/Vercel logs

## Advanced: Setting Up Webhooks

To trigger actions when new submissions arrive:

1. Go to **Database** → **Webhooks** in Supabase
2. Click "Create a new hook"
3. Configure:
   - **Table**: `roadmap_submissions`
   - **Events**: `INSERT`
   - **Type**: HTTP Request
   - **URL**: Your webhook endpoint
4. This can trigger:
   - Email notifications
   - Slack alerts
   - CRM updates
   - Marketing automation

## Next Steps

Now that your database is set up:

1. ✅ Test form submissions
2. ✅ Set up email notifications (SendGrid, etc.)
3. ✅ Create admin dashboard to view submissions
4. ✅ Add analytics tracking
5. ✅ Export data regularly for analysis

## Support

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Community**: [discord.supabase.com](https://discord.supabase.com)
- **Status**: [status.supabase.com](https://status.supabase.com)

## Database Backup

Supabase automatically backs up your database, but you can also:

1. Go to **Settings** → **Database**
2. Download a backup manually
3. Set up automated backups to your own storage

---

Your Supabase database is now ready to collect roadmap submissions! 🎉

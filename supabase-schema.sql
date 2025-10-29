-- Supabase Database Schema for persx.ai Roadmap Submissions
-- Run this SQL in your Supabase SQL Editor to create the table

-- Create the roadmap_submissions table
CREATE TABLE IF NOT EXISTS public.roadmap_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  industry TEXT NOT NULL,
  industry_other TEXT,
  goal TEXT NOT NULL,
  martech_stack TEXT[] NOT NULL,
  martech_other TEXT,
  additional_details TEXT,
  email TEXT,
  request_full_roadmap BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create an index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_roadmap_submissions_created_at
ON public.roadmap_submissions(created_at DESC);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_roadmap_submissions_email
ON public.roadmap_submissions(email);

-- Create an index on industry for analytics
CREATE INDEX IF NOT EXISTS idx_roadmap_submissions_industry
ON public.roadmap_submissions(industry);

-- Enable Row Level Security (RLS)
ALTER TABLE public.roadmap_submissions ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows INSERT for all users (anonymous submissions)
CREATE POLICY "Allow anonymous inserts"
ON public.roadmap_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Create a policy that allows SELECT only for authenticated users (admin access)
CREATE POLICY "Allow authenticated users to view all submissions"
ON public.roadmap_submissions
FOR SELECT
TO authenticated
USING (true);

-- Optional: Create a view for analytics
CREATE OR REPLACE VIEW public.roadmap_submissions_analytics AS
SELECT
  industry,
  goal,
  COUNT(*) as submission_count,
  COUNT(DISTINCT email) as unique_emails,
  COUNT(CASE WHEN request_full_roadmap = true THEN 1 END) as full_roadmap_requests,
  DATE_TRUNC('day', created_at) as submission_date
FROM public.roadmap_submissions
GROUP BY industry, goal, DATE_TRUNC('day', created_at)
ORDER BY submission_date DESC, submission_count DESC;

-- Grant access to the view
GRANT SELECT ON public.roadmap_submissions_analytics TO authenticated;

-- Add comments for documentation
COMMENT ON TABLE public.roadmap_submissions IS 'Stores user submissions from the roadmap form on persx.ai';
COMMENT ON COLUMN public.roadmap_submissions.industry IS 'User selected industry (eCommerce, Healthcare, etc.)';
COMMENT ON COLUMN public.roadmap_submissions.industry_other IS 'Custom industry if user selected Other';
COMMENT ON COLUMN public.roadmap_submissions.goal IS 'Primary business goal selected by user';
COMMENT ON COLUMN public.roadmap_submissions.martech_stack IS 'Array of selected martech tools';
COMMENT ON COLUMN public.roadmap_submissions.martech_other IS 'Custom martech tools if user selected Other';
COMMENT ON COLUMN public.roadmap_submissions.additional_details IS 'Additional context provided by user';
COMMENT ON COLUMN public.roadmap_submissions.email IS 'User email for full roadmap delivery';
COMMENT ON COLUMN public.roadmap_submissions.request_full_roadmap IS 'Whether user requested the full 90-day roadmap';

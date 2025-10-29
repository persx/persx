-- Migration: Update roadmap_submissions table to handle multiple goals
-- Run this in Supabase SQL Editor

-- Add new columns
ALTER TABLE public.roadmap_submissions
ADD COLUMN IF NOT EXISTS goals TEXT[],
ADD COLUMN IF NOT EXISTS goal_other TEXT;

-- Migrate existing data (convert single goal to array)
UPDATE public.roadmap_submissions
SET goals = ARRAY[goal]
WHERE goal IS NOT NULL AND goals IS NULL;

-- Drop old goal column after migration (OPTIONAL - only after confirming data is migrated)
-- ALTER TABLE public.roadmap_submissions DROP COLUMN goal;

-- Add index for goals array for better query performance
CREATE INDEX IF NOT EXISTS idx_roadmap_submissions_goals
ON public.roadmap_submissions USING GIN(goals);

-- Update comments
COMMENT ON COLUMN public.roadmap_submissions.goals IS 'Array of selected business goals';
COMMENT ON COLUMN public.roadmap_submissions.goal_other IS 'Custom goal if user selected Other';

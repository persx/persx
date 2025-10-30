-- Add martech_tool_names column to roadmap_submissions table
-- This stores the specific tool names users enter for each martech category

ALTER TABLE roadmap_submissions
ADD COLUMN IF NOT EXISTS martech_tool_names JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN roadmap_submissions.martech_tool_names IS 'Stores specific tool names entered by user, mapped by category (e.g., {"A/B Testing or Feature Experimentation": "Optimizely"})';

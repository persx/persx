-- Add IP address and location tracking to roadmap_submissions table
ALTER TABLE roadmap_submissions
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS region TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS environment TEXT DEFAULT 'local';

-- Add index for environment filtering
CREATE INDEX IF NOT EXISTS idx_roadmap_submissions_environment ON roadmap_submissions(environment);

-- Add index for location lookups
CREATE INDEX IF NOT EXISTS idx_roadmap_submissions_country ON roadmap_submissions(country);

-- Comments
COMMENT ON COLUMN roadmap_submissions.ip_address IS 'IP address of the submission';
COMMENT ON COLUMN roadmap_submissions.city IS 'City where submission originated';
COMMENT ON COLUMN roadmap_submissions.region IS 'State/Region where submission originated';
COMMENT ON COLUMN roadmap_submissions.country IS 'Country where submission originated';
COMMENT ON COLUMN roadmap_submissions.environment IS 'Environment where submission was created (production/local)';

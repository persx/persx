-- Add support for multiple external sources and PersX perspective
-- This allows creating news roundups that reference multiple articles

ALTER TABLE knowledge_base_content
ADD COLUMN IF NOT EXISTS external_sources JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS persx_perspective TEXT,
ADD COLUMN IF NOT EXISTS overall_summary TEXT;

-- Create an index on external_sources for faster queries
CREATE INDEX IF NOT EXISTS idx_knowledge_base_content_external_sources ON knowledge_base_content USING GIN (external_sources);

-- Add a comment explaining the structure
COMMENT ON COLUMN knowledge_base_content.external_sources IS
'Array of external source objects. Each object should have: url (required), name, author, published_date, summary';

COMMENT ON COLUMN knowledge_base_content.persx_perspective IS
'PersX.ai perspective, analysis, or commentary on the curated content';

COMMENT ON COLUMN knowledge_base_content.overall_summary IS
'High-level summary of all the external sources combined';

-- ============================================
-- ADD EXTERNAL CONTENT FIELDS
-- ============================================

-- Add source type enum
DO $$ BEGIN
  CREATE TYPE source_type AS ENUM ('internal', 'external_curated', 'external_referenced');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Add external content fields to knowledge_base_content
ALTER TABLE knowledge_base_content
ADD COLUMN IF NOT EXISTS source_type source_type DEFAULT 'internal',
ADD COLUMN IF NOT EXISTS source_name TEXT,
ADD COLUMN IF NOT EXISTS source_url TEXT,
ADD COLUMN IF NOT EXISTS source_author TEXT,
ADD COLUMN IF NOT EXISTS source_published_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS curator_notes TEXT,
ADD COLUMN IF NOT EXISTS summary TEXT;

-- Add indexes for external content
CREATE INDEX IF NOT EXISTS idx_kb_source_type ON knowledge_base_content(source_type);
CREATE INDEX IF NOT EXISTS idx_kb_source_published_date ON knowledge_base_content(source_published_date DESC);

-- Add comments for documentation
COMMENT ON COLUMN knowledge_base_content.source_type IS 'Type of content source: internal (created by us), external_curated (summarized from external), external_referenced (linked only)';
COMMENT ON COLUMN knowledge_base_content.source_name IS 'Original publisher name (e.g., MarketingDive, Optimizely Blog)';
COMMENT ON COLUMN knowledge_base_content.source_url IS 'URL to original article for attribution';
COMMENT ON COLUMN knowledge_base_content.source_author IS 'Original article author name';
COMMENT ON COLUMN knowledge_base_content.source_published_date IS 'When the original article was published';
COMMENT ON COLUMN knowledge_base_content.curator_notes IS 'Internal notes about why this content was curated';
COMMENT ON COLUMN knowledge_base_content.summary IS 'AI-generated or manual summary distinct from excerpt';

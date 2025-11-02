-- Migration: Add SEO and structured data fields for Phase 1
-- This migration adds fields needed for SEO optimization and Article schema
-- Designed to be extended with Phase 2 and Phase 3 fields later

-- ============================================
-- ADD SEO FIELDS TO knowledge_base_content
-- ============================================

-- Add SEO-related fields
ALTER TABLE knowledge_base_content
ADD COLUMN IF NOT EXISTS focus_keyword TEXT,
ADD COLUMN IF NOT EXISTS canonical_url TEXT,
ADD COLUMN IF NOT EXISTS og_title TEXT,
ADD COLUMN IF NOT EXISTS og_description TEXT,
ADD COLUMN IF NOT EXISTS og_image_url TEXT,
ADD COLUMN IF NOT EXISTS twitter_title TEXT,
ADD COLUMN IF NOT EXISTS twitter_description TEXT,
ADD COLUMN IF NOT EXISTS twitter_image_url TEXT;

-- ============================================
-- ADD ARTICLE SCHEMA FIELDS (AEO/Structured Data)
-- ============================================

-- Article schema for structured data (Schema.org)
-- Stored as JSONB for flexibility
ALTER TABLE knowledge_base_content
ADD COLUMN IF NOT EXISTS article_schema JSONB DEFAULT '{}'::jsonb;

-- Comment on the article_schema column
COMMENT ON COLUMN knowledge_base_content.article_schema IS 'Structured data for Article schema (headline, author, datePublished, etc.)';

-- Breadcrumb schema for navigation hierarchy
ALTER TABLE knowledge_base_content
ADD COLUMN IF NOT EXISTS breadcrumb_schema JSONB DEFAULT '{}'::jsonb;

-- Comment on the breadcrumb_schema column
COMMENT ON COLUMN knowledge_base_content.breadcrumb_schema IS 'BreadcrumbList structured data for navigation hierarchy';

-- ============================================
-- ENHANCE TAGS TABLE
-- ============================================

-- Add usage count for tags (helpful for UI)
ALTER TABLE tags
ADD COLUMN IF NOT EXISTS usage_count INTEGER DEFAULT 0;

-- Add color field for visual categorization
ALTER TABLE tags
ADD COLUMN IF NOT EXISTS color TEXT;

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_tags_category ON tags(category);

-- Replace "optimization" tag with "experimentation" tag
UPDATE tags SET name = 'experimentation' WHERE LOWER(name) = 'optimization';

-- ============================================
-- CREATE FUNCTION TO UPDATE TAG USAGE COUNT
-- ============================================

-- Function to update tag usage count
CREATE OR REPLACE FUNCTION update_tag_usage_counts()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE tags
  SET usage_count = (
    SELECT COUNT(*)
    FROM knowledge_base_content
    WHERE tags @> ARRAY[tags.name]
  );
END;
$$;

-- ============================================
-- INDEXES FOR NEW FIELDS
-- ============================================

-- Index for focus keyword (for SEO analysis)
CREATE INDEX IF NOT EXISTS idx_kb_focus_keyword ON knowledge_base_content(focus_keyword);

-- GIN index for article_schema JSONB (for querying structured data)
CREATE INDEX IF NOT EXISTS idx_kb_article_schema ON knowledge_base_content USING GIN(article_schema);

-- GIN index for breadcrumb_schema JSONB (for querying navigation data)
CREATE INDEX IF NOT EXISTS idx_kb_breadcrumb_schema ON knowledge_base_content USING GIN(breadcrumb_schema);

-- ============================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON COLUMN knowledge_base_content.focus_keyword IS 'Primary SEO keyword/phrase for this content';
COMMENT ON COLUMN knowledge_base_content.canonical_url IS 'Canonical URL to prevent duplicate content issues';
COMMENT ON COLUMN knowledge_base_content.og_title IS 'Open Graph title for social sharing (Facebook, LinkedIn)';
COMMENT ON COLUMN knowledge_base_content.og_description IS 'Open Graph description for social sharing';
COMMENT ON COLUMN knowledge_base_content.og_image_url IS 'Open Graph image URL for social sharing';
COMMENT ON COLUMN knowledge_base_content.twitter_title IS 'Twitter Card title';
COMMENT ON COLUMN knowledge_base_content.twitter_description IS 'Twitter Card description';
COMMENT ON COLUMN knowledge_base_content.twitter_image_url IS 'Twitter Card image URL';

-- ============================================
-- SAMPLE ARTICLE SCHEMA STRUCTURE
-- ============================================

-- Example of article_schema structure (for reference):
-- {
--   "headline": "Article Title",
--   "alternativeHeadline": "Alternative Title",
--   "author": {
--     "type": "Person",
--     "name": "Author Name"
--   },
--   "publisher": {
--     "type": "Organization",
--     "name": "PersX.ai",
--     "logo": "https://persx.ai/logo.png"
--   },
--   "datePublished": "2025-02-01T00:00:00Z",
--   "dateModified": "2025-02-01T00:00:00Z",
--   "image": "https://persx.ai/featured-image.jpg",
--   "articleSection": "Category",
--   "keywords": ["keyword1", "keyword2"],
--   "wordCount": 1500
-- }

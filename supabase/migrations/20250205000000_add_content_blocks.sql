-- Add content_blocks field for block-based page editing
-- This enables CMS editing of existing pages while preserving all styles and components

ALTER TABLE knowledge_base_content
ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN knowledge_base_content.content_blocks IS
'JSON array of content blocks for block-based page editing. Each block has type, order, and data properties. Used for static pages with custom components and styles.';

-- Create index for faster queries on pages with blocks
CREATE INDEX IF NOT EXISTS idx_kb_content_blocks
ON knowledge_base_content USING GIN (content_blocks)
WHERE content_blocks IS NOT NULL;

-- Migration complete!
-- Pages can now use either markdown content OR content blocks

-- ============================================
-- ADD STATIC PAGE SUPPORT TO CMS
-- ============================================
-- This migration enables the CMS to manage static pages (About, How It Works, etc.)
-- in addition to content (blog posts, news articles)

-- Add 'static_page' to content_type enum
ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'static_page';

-- ============================================
-- ADD PAGE MANAGEMENT COLUMNS
-- ============================================

-- Page type: distinguishes between content (blog/news) and pages (about/how-it-works)
ALTER TABLE knowledge_base_content
ADD COLUMN IF NOT EXISTS page_type TEXT DEFAULT 'content';
-- Values: 'content' (blog/news), 'company' (about, how-it-works), 'utility' (contact, privacy)

-- Navigation fields for dynamic menu generation
ALTER TABLE knowledge_base_content
ADD COLUMN IF NOT EXISTS navigation_group TEXT,
ADD COLUMN IF NOT EXISTS navigation_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS show_in_navigation BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS parent_page_id UUID REFERENCES knowledge_base_content(id) ON DELETE SET NULL;

-- Page template field for different layouts
ALTER TABLE knowledge_base_content
ADD COLUMN IF NOT EXISTS page_template TEXT DEFAULT 'default';
-- Values: 'default', 'full_width', 'sidebar', 'landing'

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================

-- Index for page type queries
CREATE INDEX IF NOT EXISTS idx_kb_page_type
ON knowledge_base_content(page_type);

-- Index for navigation queries (only for visible navigation items)
CREATE INDEX IF NOT EXISTS idx_kb_navigation
ON knowledge_base_content(navigation_group, navigation_order)
WHERE show_in_navigation = true AND status = 'published';

-- Index for parent-child page relationships
CREATE INDEX IF NOT EXISTS idx_kb_parent_page
ON knowledge_base_content(parent_page_id)
WHERE parent_page_id IS NOT NULL;

-- Index for static pages by slug (for fast page lookups)
-- Note: Removed WHERE clause to avoid enum transaction issue
CREATE INDEX IF NOT EXISTS idx_kb_static_page_slug
ON knowledge_base_content(slug, content_type, status)
WHERE status = 'published';

-- ============================================
-- ADD COLUMN COMMENTS FOR DOCUMENTATION
-- ============================================

COMMENT ON COLUMN knowledge_base_content.page_type IS
'Distinguishes content (blog/news) from pages (about/how-it-works). Values: content, company, utility';

COMMENT ON COLUMN knowledge_base_content.navigation_group IS
'Groups pages in navigation menu (insights, company, resources). NULL = hidden from navigation';

COMMENT ON COLUMN knowledge_base_content.navigation_order IS
'Sort order within navigation group. Lower numbers appear first';

COMMENT ON COLUMN knowledge_base_content.show_in_navigation IS
'Whether this page should appear in the main navigation menu';

COMMENT ON COLUMN knowledge_base_content.parent_page_id IS
'Optional parent page for hierarchical navigation (breadcrumbs, sub-pages)';

COMMENT ON COLUMN knowledge_base_content.page_template IS
'Layout template for rendering page. Values: default, full_width, sidebar, landing';

-- ============================================
-- UPDATE EXISTING CONTENT
-- ============================================

-- Set page_type for existing content types
UPDATE knowledge_base_content
SET page_type = 'content'
WHERE content_type IN ('blog', 'news', 'case_study', 'implementation_guide', 'test_result', 'best_practice', 'tool_guide')
AND page_type = 'content'; -- Only update if still default value

-- ============================================
-- ADD CHECK CONSTRAINTS
-- ============================================

-- Ensure page_type has valid values
ALTER TABLE knowledge_base_content
ADD CONSTRAINT check_page_type
CHECK (page_type IN ('content', 'company', 'utility'));

-- Ensure page_template has valid values
ALTER TABLE knowledge_base_content
ADD CONSTRAINT check_page_template
CHECK (page_template IN ('default', 'full_width', 'sidebar', 'landing'));

-- Ensure navigation_group has valid values or is NULL
ALTER TABLE knowledge_base_content
ADD CONSTRAINT check_navigation_group
CHECK (navigation_group IS NULL OR navigation_group IN ('insights', 'company', 'resources'));

-- Ensure navigation items have a group assigned
ALTER TABLE knowledge_base_content
ADD CONSTRAINT check_nav_group_required
CHECK (
  (show_in_navigation = false) OR
  (show_in_navigation = true AND navigation_group IS NOT NULL)
);

-- ============================================
-- GRANTS (if using RLS)
-- ============================================

-- Allow public read access to published static pages
-- (Existing RLS policies should already cover this, but being explicit)

-- Migration complete!
-- Static pages can now be managed through the CMS

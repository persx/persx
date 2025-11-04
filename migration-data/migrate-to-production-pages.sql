-- ============================================
-- MIGRATE BLOCK PAGES TO PRODUCTION
-- ============================================
-- This script makes the block-based pages the main pages
-- Run this in Supabase SQL Editor

-- STEP 1: Archive existing database pages (if any exist)
-- Update any existing pages with these slugs to have -old suffix
UPDATE knowledge_base_content
SET slug = slug || '-old'
WHERE slug IN ('about', 'contact')
  AND slug NOT LIKE '%-old';

-- STEP 2: Update block pages to be the main pages
-- Change about-blocks -> about
UPDATE knowledge_base_content
SET
  slug = 'about',
  title = 'About',
  show_in_navigation = true,
  navigation_group = 'company',
  navigation_order = 1
WHERE slug = 'about-blocks';

-- Change contact-blocks -> contact
UPDATE knowledge_base_content
SET
  slug = 'contact',
  title = 'Contact',
  show_in_navigation = true,
  navigation_group = NULL
WHERE slug = 'contact-blocks';

-- STEP 3: For homepage, we'll keep home-blocks as is for now
-- The homepage will be updated separately in the code

-- Verify the changes
SELECT
  slug,
  title,
  content_type,
  show_in_navigation,
  navigation_group,
  jsonb_array_length(content_blocks) as block_count
FROM knowledge_base_content
WHERE slug IN ('about', 'contact', 'home-blocks')
   OR slug LIKE '%-old'
ORDER BY slug;

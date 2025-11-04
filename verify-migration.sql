-- Verify Static Page Migration Status
-- Run this in Supabase SQL Editor to confirm all columns were added

SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'knowledge_base_content'
AND column_name IN (
  'page_type',
  'navigation_group',
  'navigation_order',
  'show_in_navigation',
  'parent_page_id',
  'page_template'
)
ORDER BY column_name;

-- Expected results:
-- page_type | text | YES | 'content'::text
-- navigation_group | text | YES | NULL
-- navigation_order | integer | YES | 0
-- show_in_navigation | boolean | YES | false
-- parent_page_id | uuid | YES | NULL
-- page_template | text | YES | 'default'::text

-- If you see 6 rows returned, the migration was successful!

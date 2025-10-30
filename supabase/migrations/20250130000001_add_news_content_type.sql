-- Add 'news' to content_type enum

ALTER TYPE content_type ADD VALUE IF NOT EXISTS 'news';

-- Add comment for documentation
COMMENT ON TYPE content_type IS 'Types of knowledge base content: blog, case_study, implementation_guide, test_result, best_practice, tool_guide, news';

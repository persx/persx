-- Enable pgvector extension for vector embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Content types enum
CREATE TYPE content_type AS ENUM (
  'blog',
  'case_study',
  'implementation_guide',
  'test_result',
  'best_practice',
  'tool_guide'
);

-- Content status enum
CREATE TYPE content_status AS ENUM (
  'draft',
  'published',
  'archived'
);

-- Industry enum (matching our existing industries)
CREATE TYPE industry_type AS ENUM (
  'eCommerce',
  'Healthcare',
  'Financial Services',
  'Education',
  'B2B/SaaS',
  'General'
);

-- ============================================
-- KNOWLEDGE BASE CONTENT TABLE
-- ============================================
CREATE TABLE knowledge_base_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL, -- Full content in markdown
  content_type content_type NOT NULL,
  status content_status DEFAULT 'draft',

  -- Categorization
  industry industry_type DEFAULT 'General',
  goals TEXT[], -- Array of goal names this content relates to
  martech_tools TEXT[], -- Array of martech tools/categories covered
  tags TEXT[], -- Additional freeform tags

  -- Metadata
  author TEXT,
  featured_image_url TEXT,
  estimated_read_time INTEGER, -- minutes

  -- SEO
  meta_title TEXT,
  meta_description TEXT,

  -- Timestamps
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Full text search
  search_vector tsvector GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(content, '')), 'C')
  ) STORED
);

-- Indexes for knowledge_base_content
CREATE INDEX idx_kb_content_type ON knowledge_base_content(content_type);
CREATE INDEX idx_kb_status ON knowledge_base_content(status);
CREATE INDEX idx_kb_industry ON knowledge_base_content(industry);
CREATE INDEX idx_kb_published_at ON knowledge_base_content(published_at DESC);
CREATE INDEX idx_kb_search_vector ON knowledge_base_content USING GIN(search_vector);
CREATE INDEX idx_kb_goals ON knowledge_base_content USING GIN(goals);
CREATE INDEX idx_kb_martech_tools ON knowledge_base_content USING GIN(martech_tools);
CREATE INDEX idx_kb_tags ON knowledge_base_content USING GIN(tags);

-- ============================================
-- CONTENT EMBEDDINGS TABLE (for vector search)
-- ============================================
CREATE TABLE content_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES knowledge_base_content(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL, -- The actual text chunk
  chunk_index INTEGER NOT NULL, -- Order of chunks within the content
  embedding vector(1536), -- OpenAI ada-002 / Claude embeddings dimension
  token_count INTEGER,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(content_id, chunk_index)
);

-- Index for vector similarity search
CREATE INDEX idx_embeddings_content_id ON content_embeddings(content_id);
CREATE INDEX idx_embeddings_vector ON content_embeddings USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100); -- Adjust lists based on dataset size

-- ============================================
-- TAGS TABLE (for organized categorization)
-- ============================================
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT, -- 'tactic', 'tool', 'industry', 'goal', 'channel', etc.
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_tags_category ON tags(category);

-- ============================================
-- CONTENT ANALYTICS TABLE (track usefulness)
-- ============================================
CREATE TABLE content_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES knowledge_base_content(id) ON DELETE CASCADE,
  roadmap_id UUID, -- Links to roadmap_submissions if applicable

  -- Engagement metrics
  view_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  usefulness_score INTEGER, -- 1-5 rating if user provides feedback

  -- Context
  user_industry industry_type,
  user_goals TEXT[],
  user_martech_tools TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_content_id ON content_analytics(content_id);
CREATE INDEX idx_analytics_roadmap_id ON content_analytics(roadmap_id);
CREATE INDEX idx_analytics_created_at ON content_analytics(created_at DESC);

-- ============================================
-- CONTENT RELATIONSHIPS (related articles, prerequisites, etc.)
-- ============================================
CREATE TABLE content_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_content_id UUID NOT NULL REFERENCES knowledge_base_content(id) ON DELETE CASCADE,
  related_content_id UUID NOT NULL REFERENCES knowledge_base_content(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL, -- 'related', 'prerequisite', 'next_step', 'case_study'
  weight INTEGER DEFAULT 1, -- For ranking related content

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(source_content_id, related_content_id, relationship_type)
);

CREATE INDEX idx_relationships_source ON content_relationships(source_content_id);
CREATE INDEX idx_relationships_related ON content_relationships(related_content_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for knowledge_base_content
CREATE TRIGGER update_kb_content_updated_at
  BEFORE UPDATE ON knowledge_base_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for content_analytics
CREATE TRIGGER update_analytics_updated_at
  BEFORE UPDATE ON content_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function for similarity search
CREATE OR REPLACE FUNCTION match_content_embeddings(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10,
  filter_industry industry_type DEFAULT NULL,
  filter_goals text[] DEFAULT NULL,
  filter_tools text[] DEFAULT NULL
)
RETURNS TABLE (
  content_id UUID,
  title TEXT,
  excerpt TEXT,
  content_type content_type,
  similarity float,
  chunk_text TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kbc.id,
    kbc.title,
    kbc.excerpt,
    kbc.content_type,
    1 - (ce.embedding <=> query_embedding) AS similarity,
    ce.chunk_text
  FROM content_embeddings ce
  JOIN knowledge_base_content kbc ON ce.content_id = kbc.id
  WHERE
    kbc.status = 'published'
    AND (1 - (ce.embedding <=> query_embedding)) > match_threshold
    AND (filter_industry IS NULL OR kbc.industry = filter_industry OR kbc.industry = 'General')
    AND (filter_goals IS NULL OR kbc.goals && filter_goals)
    AND (filter_tools IS NULL OR kbc.martech_tools && filter_tools)
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE knowledge_base_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_relationships ENABLE ROW LEVEL SECURITY;

-- Public read access to published content
CREATE POLICY "Public can view published content"
  ON knowledge_base_content FOR SELECT
  USING (status = 'published');

-- Public read access to embeddings of published content
CREATE POLICY "Public can view embeddings of published content"
  ON content_embeddings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM knowledge_base_content
      WHERE id = content_embeddings.content_id
      AND status = 'published'
    )
  );

-- Public read access to tags
CREATE POLICY "Public can view tags"
  ON tags FOR SELECT
  USING (true);

-- Public can create analytics (tracking)
CREATE POLICY "Public can create analytics"
  ON content_analytics FOR INSERT
  WITH CHECK (true);

-- Public can view relationships for published content
CREATE POLICY "Public can view content relationships"
  ON content_relationships FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM knowledge_base_content
      WHERE id = content_relationships.source_content_id
      AND status = 'published'
    )
  );

-- ============================================
-- SAMPLE DATA COMMENTS
-- ============================================

COMMENT ON TABLE knowledge_base_content IS 'Stores all knowledge base content including blogs, case studies, implementation guides, and test results';
COMMENT ON TABLE content_embeddings IS 'Stores vector embeddings for semantic search of content chunks';
COMMENT ON TABLE tags IS 'Organized tagging system for categorizing content';
COMMENT ON TABLE content_analytics IS 'Tracks content usage and usefulness to improve recommendations';
COMMENT ON TABLE content_relationships IS 'Maps relationships between related content pieces';

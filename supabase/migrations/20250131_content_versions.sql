-- Create content_versions table for tracking content history
CREATE TABLE IF NOT EXISTS content_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES knowledge_base_content(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  content_type TEXT NOT NULL,
  status TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',

  -- Track what changed
  change_summary TEXT,
  changed_by TEXT, -- Email of the person who made the change

  -- Copy of external fields at this version
  source_type TEXT,
  source_name TEXT,
  source_url TEXT,
  source_author TEXT,
  source_published_date DATE,
  curator_notes TEXT,
  summary TEXT,
  external_sources JSONB,
  persx_perspective TEXT,
  overall_summary TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure version numbers are unique per content
  UNIQUE(content_id, version_number)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_content_versions_content_id ON content_versions(content_id);
CREATE INDEX IF NOT EXISTS idx_content_versions_created_at ON content_versions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_versions_version_number ON content_versions(content_id, version_number DESC);

-- Add RLS policies
ALTER TABLE content_versions ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read versions
CREATE POLICY "Allow authenticated users to read content versions"
  ON content_versions
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert versions
CREATE POLICY "Allow authenticated users to insert content versions"
  ON content_versions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Add comment to table
COMMENT ON TABLE content_versions IS 'Version history for knowledge base content';

-- Function to automatically create a version when content is updated
CREATE OR REPLACE FUNCTION create_content_version()
RETURNS TRIGGER AS $$
DECLARE
  next_version INTEGER;
BEGIN
  -- Get the next version number
  SELECT COALESCE(MAX(version_number), 0) + 1 INTO next_version
  FROM content_versions
  WHERE content_id = NEW.id;

  -- Insert the new version
  INSERT INTO content_versions (
    content_id,
    version_number,
    title,
    content,
    excerpt,
    content_type,
    status,
    tags,
    source_type,
    source_name,
    source_url,
    source_author,
    source_published_date,
    curator_notes,
    summary,
    external_sources,
    persx_perspective,
    overall_summary,
    change_summary,
    changed_by
  ) VALUES (
    NEW.id,
    next_version,
    NEW.title,
    NEW.content,
    NEW.excerpt,
    NEW.content_type,
    NEW.status,
    NEW.tags,
    NEW.source_type,
    NEW.source_name,
    NEW.source_url,
    NEW.source_author,
    NEW.source_published_date,
    NEW.curator_notes,
    NEW.summary,
    NEW.external_sources,
    NEW.persx_perspective,
    NEW.overall_summary,
    'Content updated',
    NULL -- Can be populated by application
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically version content on updates
CREATE TRIGGER trigger_create_content_version
  AFTER UPDATE ON knowledge_base_content
  FOR EACH ROW
  WHEN (
    OLD.title IS DISTINCT FROM NEW.title OR
    OLD.content IS DISTINCT FROM NEW.content OR
    OLD.excerpt IS DISTINCT FROM NEW.excerpt OR
    OLD.status IS DISTINCT FROM NEW.status OR
    OLD.content_type IS DISTINCT FROM NEW.content_type
  )
  EXECUTE FUNCTION create_content_version();

-- Create initial version for existing content (one-time migration)
INSERT INTO content_versions (
  content_id,
  version_number,
  title,
  content,
  excerpt,
  content_type,
  status,
  tags,
  source_type,
  source_name,
  source_url,
  source_author,
  source_published_date,
  curator_notes,
  summary,
  external_sources,
  persx_perspective,
  overall_summary,
  change_summary,
  changed_by
)
SELECT
  id,
  1,
  title,
  content,
  excerpt,
  content_type,
  status,
  tags,
  source_type,
  source_name,
  source_url,
  source_author,
  source_published_date,
  curator_notes,
  summary,
  external_sources,
  persx_perspective,
  overall_summary,
  'Initial version',
  NULL
FROM knowledge_base_content
WHERE NOT EXISTS (
  SELECT 1 FROM content_versions WHERE content_versions.content_id = knowledge_base_content.id
);

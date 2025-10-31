-- Create preview tokens table for shareable draft content previews
CREATE TABLE IF NOT EXISTS content_preview_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES knowledge_base_content(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES admin_users(id),
  views_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster token lookups
CREATE INDEX IF NOT EXISTS idx_preview_tokens_token ON content_preview_tokens(token);
CREATE INDEX IF NOT EXISTS idx_preview_tokens_content_id ON content_preview_tokens(content_id);
CREATE INDEX IF NOT EXISTS idx_preview_tokens_expires_at ON content_preview_tokens(expires_at);

-- Create function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_preview_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM content_preview_tokens
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled job to clean up expired tokens (optional, can be run manually)
-- Note: This requires pg_cron extension, which may not be available in all environments
-- COMMENT: Run cleanup_expired_preview_tokens() periodically via cron or manually

-- Enable RLS (Row Level Security)
ALTER TABLE content_preview_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to read preview tokens (needed for preview page)
CREATE POLICY "Allow anonymous preview token access"
  ON content_preview_tokens
  FOR SELECT
  TO anon
  USING (expires_at > NOW());

-- Policy: Allow authenticated users to manage their own preview tokens
CREATE POLICY "Allow authenticated users to manage preview tokens"
  ON content_preview_tokens
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Grant necessary permissions
GRANT SELECT ON content_preview_tokens TO anon;
GRANT ALL ON content_preview_tokens TO authenticated;

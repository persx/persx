-- ============================================
-- NEWSLETTER SUBSCRIPTION SYSTEM
-- ============================================

-- Subscriber status enum
DO $$ BEGIN
  CREATE TYPE subscriber_status AS ENUM ('pending', 'active', 'unsubscribed', 'bounced');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Subscriber activity action enum
DO $$ BEGIN
  CREATE TYPE subscriber_action_type AS ENUM ('subscribed', 'verified', 'opened', 'clicked', 'unsubscribed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  status subscriber_status DEFAULT 'pending',

  -- Subscription preferences stored as JSONB
  -- Example: {"frequency": "weekly", "topics": ["ai", "personalization"], "content_types": ["news", "blog"], "industries": ["eCommerce"]}
  preferences JSONB DEFAULT '{}'::jsonb,

  -- Metadata
  subscription_source TEXT, -- Where they signed up: 'news_page', 'roadmap_form', 'footer', 'popup'
  verification_token TEXT UNIQUE,
  verified_at TIMESTAMP WITH TIME ZONE,

  -- Timestamps
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  last_email_sent_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for subscribers
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON newsletter_subscribers(status);
CREATE INDEX IF NOT EXISTS idx_subscribers_verification_token ON newsletter_subscribers(verification_token);
CREATE INDEX IF NOT EXISTS idx_subscribers_preferences ON newsletter_subscribers USING GIN(preferences);

-- ============================================
-- NEWSLETTER SENDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS newsletter_sends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Email content
  subject TEXT NOT NULL,
  preview_text TEXT, -- Email preview/preheader text
  content_html TEXT NOT NULL,
  content_text TEXT, -- Plain text version

  -- Metadata
  content_items JSONB, -- Array of content IDs included: [{"content_id": "uuid", "title": "...", "url": "..."}]
  send_type TEXT DEFAULT 'newsletter', -- 'newsletter', 'digest', 'alert', 'transactional'

  -- Sending information
  sent_at TIMESTAMP WITH TIME ZONE,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'sending', 'sent', 'failed'

  -- Analytics
  recipient_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  unique_open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  unique_click_count INTEGER DEFAULT 0,
  bounce_count INTEGER DEFAULT 0,
  unsubscribe_count INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for newsletter sends
CREATE INDEX IF NOT EXISTS idx_newsletter_sends_sent_at ON newsletter_sends(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_sends_status ON newsletter_sends(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_sends_send_type ON newsletter_sends(send_type);

-- ============================================
-- SUBSCRIBER ACTIVITY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscriber_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  subscriber_id UUID NOT NULL REFERENCES newsletter_subscribers(id) ON DELETE CASCADE,
  newsletter_send_id UUID REFERENCES newsletter_sends(id) ON DELETE SET NULL,

  action_type subscriber_action_type NOT NULL,

  -- Additional context
  clicked_url TEXT, -- For 'clicked' actions
  user_agent TEXT, -- Browser/email client info
  ip_address TEXT, -- For tracking (anonymized after 30 days for privacy)

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for subscriber activity
CREATE INDEX IF NOT EXISTS idx_activity_subscriber_id ON subscriber_activity(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_activity_newsletter_send_id ON subscriber_activity(newsletter_send_id);
CREATE INDEX IF NOT EXISTS idx_activity_action_type ON subscriber_activity(action_type);
CREATE INDEX IF NOT EXISTS idx_activity_created_at ON subscriber_activity(created_at DESC);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at for subscribers
DROP TRIGGER IF EXISTS update_subscribers_updated_at ON newsletter_subscribers;
CREATE TRIGGER update_subscribers_updated_at
  BEFORE UPDATE ON newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update updated_at for newsletter sends
DROP TRIGGER IF EXISTS update_newsletter_sends_updated_at ON newsletter_sends;
CREATE TRIGGER update_newsletter_sends_updated_at
  BEFORE UPDATE ON newsletter_sends
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_sends ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriber_activity ENABLE ROW LEVEL SECURITY;

-- Public can insert subscriptions (sign up)
DROP POLICY IF EXISTS "Public can create subscriptions" ON newsletter_subscribers;
CREATE POLICY "Public can create subscriptions"
  ON newsletter_subscribers FOR INSERT
  WITH CHECK (true);

-- Public can update their own subscription via token
DROP POLICY IF EXISTS "Subscribers can update via token" ON newsletter_subscribers;
CREATE POLICY "Subscribers can update via token"
  ON newsletter_subscribers FOR UPDATE
  USING (verification_token IS NOT NULL);

-- Public can view active newsletter sends (for web view)
DROP POLICY IF EXISTS "Public can view sent newsletters" ON newsletter_sends;
CREATE POLICY "Public can view sent newsletters"
  ON newsletter_sends FOR SELECT
  USING (status = 'sent');

-- Public can create activity (tracking opens/clicks)
DROP POLICY IF EXISTS "Public can create activity" ON subscriber_activity;
CREATE POLICY "Public can create activity"
  ON subscriber_activity FOR INSERT
  WITH CHECK (true);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE newsletter_subscribers IS 'Stores email subscribers and their preferences';
COMMENT ON TABLE newsletter_sends IS 'Stores sent and scheduled newsletter campaigns';
COMMENT ON TABLE subscriber_activity IS 'Tracks subscriber engagement with newsletters';

COMMENT ON COLUMN newsletter_subscribers.preferences IS 'JSONB storing frequency, topics, content_types, and industry preferences';
COMMENT ON COLUMN newsletter_sends.content_items IS 'JSONB array of content IDs and metadata included in this send';
COMMENT ON COLUMN subscriber_activity.ip_address IS 'IP address for tracking (should be anonymized after 30 days for privacy compliance)';

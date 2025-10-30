import { createClient } from '@supabase/supabase-js';

// Supabase client configuration
// Make sure to set these environment variables in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if real credentials are provided
export const isSupabaseConfigured =
  process.env.NEXT_PUBLIC_SUPABASE_URL !== undefined &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== undefined;

if (!isSupabaseConfigured) {
  console.warn('Supabase environment variables are not set. Database features will not work.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database tables
export interface RoadmapSubmission {
  id?: string;
  industry: string;
  industry_other?: string | null;
  goals: string[];
  goal_other?: string | null;
  martech_stack: string[];
  martech_other?: string | null;
  martech_tool_names?: Record<string, string> | null; // Maps martech category to specific tool name
  additional_details?: string | null;
  email?: string | null;
  request_full_roadmap?: boolean;
  ip_address?: string | null;
  city?: string | null;
  region?: string | null;
  country?: string | null;
  environment?: string | null;
  created_at?: string;
}

// Newsletter subscriber preferences
export interface SubscriberPreferences {
  frequency?: 'daily' | 'weekly' | 'monthly' | 'real_time';
  topics?: string[];
  content_types?: ('news' | 'blog' | 'case_study' | 'implementation_guide')[];
  industries?: string[];
  martech_tools?: string[];
}

export interface NewsletterSubscriber {
  id?: string;
  email: string;
  status: 'pending' | 'active' | 'unsubscribed' | 'bounced';
  preferences: SubscriberPreferences;
  subscription_source?: string | null;
  verification_token?: string | null;
  verified_at?: string | null;
  subscribed_at?: string;
  unsubscribed_at?: string | null;
  last_email_sent_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface NewsletterSend {
  id?: string;
  subject: string;
  preview_text?: string | null;
  content_html: string;
  content_text?: string | null;
  content_items?: Array<{
    content_id: string;
    title: string;
    url: string;
    excerpt?: string;
  }>;
  send_type?: string;
  sent_at?: string | null;
  scheduled_for?: string | null;
  status?: 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed';
  recipient_count?: number;
  open_count?: number;
  unique_open_count?: number;
  click_count?: number;
  unique_click_count?: number;
  bounce_count?: number;
  unsubscribe_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SubscriberActivity {
  id?: string;
  subscriber_id: string;
  newsletter_send_id?: string | null;
  action_type: 'subscribed' | 'verified' | 'opened' | 'clicked' | 'unsubscribed';
  clicked_url?: string | null;
  user_agent?: string | null;
  ip_address?: string | null;
  created_at?: string;
}

// External source for multi-source content
export interface ExternalSource {
  url: string;
  name?: string | null;
  author?: string | null;
  published_date?: string | null;
  summary?: string | null;
}

// Knowledge base content with external source fields
export interface KnowledgeBaseContent {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content: string;
  content_type: 'blog' | 'case_study' | 'implementation_guide' | 'test_result' | 'best_practice' | 'tool_guide' | 'news';
  status: 'draft' | 'published' | 'archived';

  // External content fields (single source - backward compatibility)
  source_type: 'internal' | 'external_curated' | 'external_referenced';
  source_name?: string | null;
  source_url?: string | null;
  source_author?: string | null;
  source_published_date?: string | null;
  curator_notes?: string | null;
  summary?: string | null;

  // Multi-source support (for news roundups)
  external_sources?: ExternalSource[];
  persx_perspective?: string | null;
  overall_summary?: string | null;

  // Categorization
  industry?: string | null;
  goals?: string[];
  martech_tools?: string[];
  tags?: string[];

  // Metadata
  author?: string | null;
  featured_image_url?: string | null;
  estimated_read_time?: number | null;

  // SEO
  meta_title?: string | null;
  meta_description?: string | null;

  // Timestamps
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

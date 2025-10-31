// Knowledge Base Types - matches Supabase schema

export type ContentType =
  | 'blog'
  | 'case_study'
  | 'implementation_guide'
  | 'test_result'
  | 'best_practice'
  | 'tool_guide'
  | 'news';

export type ContentStatus = 'draft' | 'published' | 'archived';

export type IndustryType =
  | 'eCommerce'
  | 'Healthcare'
  | 'Financial Services'
  | 'Education'
  | 'B2B/SaaS'
  | 'General';

export interface ExternalSource {
  url: string;
  name?: string;
  author?: string;
  published_date?: string;
  summary?: string;
}

export interface KnowledgeBaseContent {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string; // Markdown content
  content_type: ContentType;
  status: ContentStatus;

  // Categorization
  industry: IndustryType;
  goals: string[] | null;
  martech_tools: string[] | null;
  tags: string[] | null;

  // Metadata
  author: string | null;
  featured_image_url: string | null;
  estimated_read_time: number | null;

  // SEO
  meta_title: string | null;
  meta_description: string | null;

  // Multi-source news support
  external_sources?: ExternalSource[] | null;
  persx_perspective?: string | null;
  overall_summary?: string | null;
  source_type?: 'internal' | 'external_curated' | 'external_referenced';
  source_name?: string | null;
  source_url?: string | null;
  source_author?: string | null;
  source_published_date?: string | null;
  curator_notes?: string | null;
  summary?: string | null;

  // Timestamps
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentEmbedding {
  id: string;
  content_id: string;
  chunk_text: string;
  chunk_index: number;
  embedding: number[]; // Vector array
  token_count: number | null;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  category: string | null; // 'tactic', 'tool', 'industry', 'goal', 'channel', etc.
  description: string | null;
  created_at: string;
}

export interface ContentAnalytics {
  id: string;
  content_id: string;
  roadmap_id: string | null;

  // Engagement metrics
  view_count: number;
  click_count: number;
  usefulness_score: number | null; // 1-5 rating

  // Context
  user_industry: IndustryType | null;
  user_goals: string[] | null;
  user_martech_tools: string[] | null;

  created_at: string;
  updated_at: string;
}

export interface ContentRelationship {
  id: string;
  source_content_id: string;
  related_content_id: string;
  relationship_type: 'related' | 'prerequisite' | 'next_step' | 'case_study';
  weight: number;
  created_at: string;
}

// API Response types
export interface SimilaritySearchResult {
  content_id: string;
  title: string;
  excerpt: string | null;
  content_type: ContentType;
  similarity: number;
  chunk_text: string;
}

export interface SimilaritySearchParams {
  query_embedding: number[];
  match_threshold?: number;
  match_count?: number;
  filter_industry?: IndustryType;
  filter_goals?: string[];
  filter_tools?: string[];
}

// Form types for creating/editing content
export interface CreateContentInput {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  content_type: ContentType;
  industry?: IndustryType;
  goals?: string[];
  martech_tools?: string[];
  tags?: string[];
  author?: string;
  featured_image_url?: string;
  estimated_read_time?: number;
  meta_title?: string;
  meta_description?: string;
}

export interface UpdateContentInput extends Partial<CreateContentInput> {
  status?: ContentStatus;
  published_at?: string;
}

// Enriched content with relationships
export interface EnrichedContent extends KnowledgeBaseContent {
  related_content?: KnowledgeBaseContent[];
  analytics?: ContentAnalytics;
}

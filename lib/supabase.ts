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
  additional_details?: string | null;
  email?: string | null;
  request_full_roadmap?: boolean;
  created_at?: string;
}

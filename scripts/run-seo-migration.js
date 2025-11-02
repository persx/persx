#!/usr/bin/env node

/**
 * Run SEO Migration via Supabase REST API
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

async function runMigration() {
  console.log('📦 Running migration: Add SEO and schema fields...\n');

  // Read migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/20250202000000_add_seo_and_schema_fields.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

  try {
    // Use Supabase's REST API to execute SQL
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({ query: migrationSQL }),
    });

    if (!response.ok) {
      // If that doesn't work, try direct query endpoint
      console.log('⚠️  First method failed, trying alternative...\n');

      const response2 = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({ query: migrationSQL }),
      });

      if (!response2.ok) {
        throw new Error(`HTTP ${response2.status}: ${await response2.text()}`);
      }
    }

    console.log('✅ Migration completed successfully!\n');
    console.log('Added:');
    console.log('  ✓ SEO fields (focus_keyword, canonical_url, og_*, twitter_*)');
    console.log('  ✓ Article schema (article_schema JSONB)');
    console.log('  ✓ Tag enhancements (usage_count, color)');
    console.log('  ✓ Replaced "optimization" tag with "experimentation"');
    console.log('  ✓ Indexes for performance');
    console.log('  ✓ Helper function to update tag usage counts\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📋 Manual migration required:');
    console.log('1. Go to: https://supabase.com/dashboard/project/lzpbpymjejwqutfpfwwu/editor');
    console.log('2. Click "SQL Editor"');
    console.log('3. Click "+ New Query"');
    console.log('4. Copy from: supabase/migrations/20250202000000_add_seo_and_schema_fields.sql');
    console.log('5. Paste and click "Run"\n');
    process.exit(1);
  }
}

runMigration();

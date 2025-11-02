/**
 * Run Database Migration
 * Executes the SEO and schema fields migration
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

async function runMigration() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  // Create Supabase client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Read migration file
  const migrationPath = path.join(__dirname, '../supabase/migrations/20250202000000_add_seo_and_schema_fields.sql');
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

  console.log('📦 Running migration: Add SEO and schema fields...\n');

  try {
    // Execute migration
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL }).select();

    if (error) {
      // If exec_sql doesn't exist, try direct SQL execution
      console.log('⚠️  Using alternative method...');

      // Split into individual statements and execute
      const statements = migrationSQL
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        if (statement) {
          console.log(`Executing: ${statement.substring(0, 60)}...`);
          const result = await supabase.from('_migrations').select().limit(1); // Dummy query to test connection

          // Note: Direct SQL execution requires database connection
          console.log('⚠️  Cannot execute raw SQL via Supabase client.');
          console.log('');
          console.log('Please use one of these methods instead:');
          console.log('1. Copy the SQL from: supabase/migrations/20250202000000_add_seo_and_schema_fields.sql');
          console.log('2. Paste it into Supabase Studio SQL Editor');
          console.log('3. Or use psql with your DATABASE_URL');
          process.exit(1);
        }
      }
    }

    console.log('✅ Migration completed successfully!\n');
    console.log('Added fields:');
    console.log('  - SEO fields (focus_keyword, canonical_url, og_*, twitter_*)');
    console.log('  - Article schema (article_schema JSONB)');
    console.log('  - Tag enhancements (usage_count, color)');
    console.log('  - Replaced "optimization" tag with "experimentation"');
    console.log('');

  } catch (err) {
    console.error('❌ Error running migration:', err.message);
    console.log('');
    console.log('Manual migration required:');
    console.log('1. Go to Supabase Studio: https://supabase.com/dashboard/project/YOUR_PROJECT/editor');
    console.log('2. Open SQL Editor');
    console.log('3. Copy content from: supabase/migrations/20250202000000_add_seo_and_schema_fields.sql');
    console.log('4. Paste and run');
    process.exit(1);
  }
}

runMigration();

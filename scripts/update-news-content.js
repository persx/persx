/**
 * Script to fetch and analyze existing news content
 * This will help us understand what content needs to be reformatted
 */

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lzpbpymjejwqutfpfwwu.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cGJweW1qZWp3cXV0ZnBmd3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjcxOCwiZXhwIjoyMDc3MzA4NzE4fQ.ymG2zCWzwpuCHIbs14ptFWcbnXSaCBG21L35CqK9-tQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchNewsContent() {
  console.log('📡 Fetching news content from Supabase...\n');

  const { data, error } = await supabase
    .from('knowledge_base_content')
    .select('*')
    .eq('content_type', 'news')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching content:', error);
    return [];
  }

  return data || [];
}

async function analyzeContent() {
  const articles = await fetchNewsContent();

  if (articles.length === 0) {
    console.log('ℹ️  No news articles found in the database.\n');
    return;
  }

  console.log(`✅ Found ${articles.length} news article(s)\n`);
  console.log('─'.repeat(80));

  articles.forEach((article, index) => {
    console.log(`\n${index + 1}. ${article.title}`);
    console.log(`   Slug: ${article.slug}`);
    console.log(`   Status: ${article.status}`);
    console.log(`   Published: ${article.published_at || 'Not published'}`);
    console.log(`   Author: ${article.author || 'Not set'}`);

    // Analyze structure
    const hasOverallSummary = article.overall_summary ? '✓' : '✗';
    const hasExternalSources = article.external_sources?.length > 0 ? `✓ (${article.external_sources.length})` : '✗';
    const hasPersPerspective = article.persx_perspective ? '✓' : '✗';
    const hasTags = article.tags?.length > 0 ? `✓ (${article.tags.length})` : '✗';
    const hasMetaDescription = article.meta_description ? '✓' : '✗';

    console.log(`\n   Editorial Fields:`);
    console.log(`   - TL;DR (overall_summary): ${hasOverallSummary}`);
    console.log(`   - External Sources: ${hasExternalSources}`);
    console.log(`   - PersX Perspective: ${hasPersPerspective}`);
    console.log(`   - Tags: ${hasTags}`);
    console.log(`   - Meta Description: ${hasMetaDescription}`);

    // Show content preview
    if (article.content) {
      const contentPreview = article.content.substring(0, 200).replace(/\n/g, ' ');
      console.log(`\n   Content Preview: ${contentPreview}...`);
      console.log(`   Content Length: ${article.content.length} characters`);
    } else {
      console.log(`\n   Content: None`);
    }

    console.log(`\n   URL: https://www.persx.ai/news/${article.slug}`);
    console.log('─'.repeat(80));
  });

  // Summary
  console.log('\n\n📊 SUMMARY\n');
  const needsOverallSummary = articles.filter(a => !a.overall_summary).length;
  const needsExternalSources = articles.filter(a => !a.external_sources || a.external_sources.length === 0).length;
  const needsTags = articles.filter(a => !a.tags || a.tags.length === 0).length;
  const needsMetaDescription = articles.filter(a => !a.meta_description).length;

  console.log(`Articles needing TL;DR (overall_summary): ${needsOverallSummary}`);
  console.log(`Articles needing external sources: ${needsExternalSources}`);
  console.log(`Articles needing tags: ${needsTags}`);
  console.log(`Articles needing meta descriptions: ${needsMetaDescription}`);

  return articles;
}

// Run the analysis
analyzeContent().catch(console.error);

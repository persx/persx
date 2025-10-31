/**
 * Script to fetch a specific article's full content
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://lzpbpymjejwqutfpfwwu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cGJweW1qZWp3cXV0ZnBmd3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjcxOCwiZXhwIjoyMDc3MzA4NzE4fQ.ymG2zCWzwpuCHIbs14ptFWcbnXSaCBG21L35CqK9-tQ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchArticle(slug) {
  const { data, error } = await supabase
    .from('knowledge_base_content')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error:', error);
    return null;
  }

  return data;
}

async function main() {
  const slug = process.argv[2] || 'experimentation-ai-emerging-trends';
  console.log(`Fetching article: ${slug}\n`);

  const article = await fetchArticle(slug);

  if (!article) {
    console.log('Article not found');
    return;
  }

  // Save to file for review
  const output = {
    metadata: {
      id: article.id,
      title: article.title,
      slug: article.slug,
      status: article.status,
      author: article.author,
      tags: article.tags,
      overall_summary: article.overall_summary,
      meta_description: article.meta_description,
      published_at: article.published_at,
    },
    external_sources: article.external_sources,
    persx_perspective: article.persx_perspective,
    content: article.content,
  };

  fs.writeFileSync('article-data.json', JSON.stringify(output, null, 2));
  console.log('✅ Article saved to article-data.json');

  console.log('\n=== METADATA ===');
  console.log(`Title: ${article.title}`);
  console.log(`Slug: ${article.slug}`);
  console.log(`Status: ${article.status}`);
  console.log(`Tags: ${article.tags?.join(', ')}`);
  console.log(`\nTL;DR: ${article.overall_summary}`);

  console.log('\n=== EXTERNAL SOURCES ===');
  if (article.external_sources) {
    article.external_sources.forEach((source, i) => {
      console.log(`${i + 1}. ${source.name || source.url}`);
      console.log(`   URL: ${source.url}`);
      if (source.summary) console.log(`   Summary: ${source.summary.substring(0, 100)}...`);
    });
  }

  console.log('\n=== CURRENT CONTENT ===');
  console.log(article.content);

  console.log('\n=== PERSX PERSPECTIVE ===');
  console.log(article.persx_perspective);
}

main().catch(console.error);

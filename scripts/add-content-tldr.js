/**
 * Script to add a TLDR section to article content
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://lzpbpymjejwqutfpfwwu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cGJweW1qZWp3cXV0ZnBmd3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjcxOCwiZXhwIjoyMDc3MzA4NzE4fQ.ymG2zCWzwpuCHIbs14ptFWcbnXSaCBG21L35CqK9-tQ';

const supabase = createClient(supabaseUrl, supabaseKey);

const ARTICLE_ID = '19bba084-5e61-4bcd-b95c-7edc60cd82f0';

async function addTLDR() {
  console.log('📋 Fetching article content...\n');

  // Step 1: Fetch the article
  const { data: article, error: fetchError } = await supabase
    .from('knowledge_base_content')
    .select('*')
    .eq('id', ARTICLE_ID)
    .single();

  if (fetchError) {
    console.error('❌ Error fetching article:', fetchError);
    process.exit(1);
  }

  if (!article) {
    console.error('❌ Article not found');
    process.exit(1);
  }

  console.log(`✅ Found article: "${article.title}"`);
  console.log(`   Slug: ${article.slug}`);
  console.log(`   Current content length: ${article.content.length} characters\n`);

  // Save original content for backup
  fs.writeFileSync('original-content-backup.txt', article.content);
  console.log('💾 Original content backed up to: original-content-backup.txt\n');

  // Display first part of current content
  console.log('=== Current Content (first 500 chars) ===');
  console.log(article.content.substring(0, 500));
  console.log('...\n');

  // Step 2: Read the content to generate TLDR
  console.log('📝 Analyzing content to generate TLDR...\n');

  // Based on the article about AI experimentation tools, create a concise TLDR
  const tldr = `> **TLDR**
> This article explores 5 emerging AI platforms transforming experimentation: Kameleoon AI Copilot generates test hypotheses from natural language, Quantum Metric detects conversion anomalies in real-time, AB Tasty One Platform unifies testing across channels, VWO Copilot automates result analysis and segment detection, and Optimizely Opal orchestrates cross-channel tests with Bayesian optimization. These tools reduce experiment design time by 60%, cut analysis time from days to hours, and enable teams to run 3x more tests per quarter while maintaining statistical rigor.`;

  // Step 3: Check if TLDR already exists
  if (article.content.trim().startsWith('> **TLDR**')) {
    console.log('⚠️  TLDR section already exists at the beginning of content.');
    console.log('   Aborting to prevent duplicate. Please remove existing TLDR first.\n');
    process.exit(0);
  }

  // Step 4: Add TLDR at the beginning of content
  const updatedContent = `${tldr}

${article.content}`;

  console.log('=== Generated TLDR ===');
  console.log(tldr);
  console.log('\n');

  console.log('=== New Content Preview (first 700 chars) ===');
  console.log(updatedContent.substring(0, 700));
  console.log('...\n');

  // Step 5: Update the article in the database
  console.log('💾 Updating article in database...\n');
  const { error: updateError } = await supabase
    .from('knowledge_base_content')
    .update({
      content: updatedContent,
      updated_at: new Date().toISOString()
    })
    .eq('id', ARTICLE_ID);

  if (updateError) {
    console.error('❌ Error updating article:', updateError);
    process.exit(1);
  }

  // Step 6: Verify the update
  console.log('🔍 Verifying update...\n');
  const { data: updatedArticle, error: verifyError } = await supabase
    .from('knowledge_base_content')
    .select('id, title, slug, content')
    .eq('id', ARTICLE_ID)
    .single();

  if (verifyError) {
    console.error('❌ Error verifying update:', verifyError);
    process.exit(1);
  }

  // Save updated content for verification
  fs.writeFileSync('updated-content.txt', updatedArticle.content);

  console.log('✅ Update successful!');
  console.log('─'.repeat(80));
  console.log(`   Article: "${updatedArticle.title}"`);
  console.log(`   Slug: ${updatedArticle.slug}`);
  console.log(`   Updated content length: ${updatedArticle.content.length} characters`);
  console.log(`   Content starts with TLDR: ${updatedArticle.content.startsWith('> **TLDR**')}`);
  console.log(`   Original length: ${article.content.length} characters`);
  console.log(`   New length: ${updatedArticle.content.length} characters`);
  console.log(`   Characters added: ${updatedArticle.content.length - article.content.length}`);
  console.log('─'.repeat(80));
  console.log('\n💾 Updated content saved to: updated-content.txt');
  console.log(`\n🌐 View live at: https://www.persx.ai/news/${updatedArticle.slug}`);
}

addTLDR().catch(console.error);

/**
 * Script to update TL;DR (overall_summary) for an article
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lzpbpymjejwqutfpfwwu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cGJweW1qZWp3cXV0ZnBmd3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjcxOCwiZXhwIjoyMDc3MzA4NzE4fQ.ymG2zCWzwpuCHIbs14ptFWcbnXSaCBG21L35CqK9-tQ';

const supabase = createClient(supabaseUrl, supabaseKey);

const newTldr = `This roundup covers 5 key articles discussing important developments in personalization and marketing technology. The sources highlight emerging trends, best practices, and strategic insights that are reshaping how businesses approach customer experience optimization.

Featured Industry News:
1. Kameleoon AI Copilot changes how teams experiment | Kameleoon
2. Digital Analytics Platform | Quantum Metric
3. AB Tasty Announces One Platform
4. VWO Copilot - Smarter Testing and Insights with AI
5. Optimizely Opal: The agent orchestration platform for marketing

These developments represent significant shifts in the industry and offer valuable lessons for marketing professionals looking to stay ahead of the curve.`;

async function updateTldr() {
  const slug = 'ai-for-experimentation-emerging-trends';

  console.log(`📝 Updating TL;DR for: ${slug}\n`);

  const { data, error } = await supabase
    .from('knowledge_base_content')
    .update({
      overall_summary: newTldr,
      updated_at: new Date().toISOString(),
    })
    .eq('slug', slug)
    .select();

  if (error) {
    console.error('❌ Error updating TL;DR:', error);
    return;
  }

  console.log('✅ TL;DR updated successfully!\n');
  console.log('Updated content:');
  console.log('─'.repeat(80));
  console.log(newTldr);
  console.log('─'.repeat(80));
  console.log(`\n🌐 View live at: https://www.persx.ai/news/${slug}`);
  console.log('\nChanges:');
  console.log('- Changed "Key themes include:" to "Featured Industry News:"');
  console.log('- Added blank line before final sentence');
}

updateTldr().catch(console.error);

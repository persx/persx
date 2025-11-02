const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lzpbpymjejwqutfpfwwu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cGJweW1qZWp3cXV0ZnBmd3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjcxOCwiZXhwIjoyMDc3MzA4NzE4fQ.ymG2zCWzwpuCHIbs14ptFWcbnXSaCBG21L35CqK9-tQ';

const supabase = createClient(supabaseUrl, supabaseKey);

const shortTldr = 'Five AI-powered experimentation platforms now automate test design, traffic allocation, and insight generation—reducing setup time while improving statistical rigor.';

async function updateShortTldr() {
  const slug = 'ai-for-experimentation-emerging-trends';

  console.log('📝 Replacing long TL;DR with short 1-2 sentence version...\n');

  const { data, error } = await supabase
    .from('knowledge_base_content')
    .update({
      overall_summary: shortTldr,
      updated_at: new Date().toISOString(),
    })
    .eq('slug', slug)
    .select();

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('✅ TL;DR updated to short version!\n');
  console.log('New TL;DR:');
  console.log('─'.repeat(80));
  console.log(shortTldr);
  console.log('─'.repeat(80));
  console.log('\n🌐 View at: http://localhost:3000/news/' + slug);
}

updateShortTldr().catch(console.error);

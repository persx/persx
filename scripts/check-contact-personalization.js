const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lzpbpymjejwqutfpfwwu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cGJweW1qZWp3cXV0ZnBmd3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjcxOCwiZXhwIjoyMDc3MzA4NzE4fQ.ymG2zCWzwpuCHIbs14ptFWcbnXSaCBG21L35CqK9-tQ'
);

(async () => {
  const { data, error } = await supabase
    .from('knowledge_base_content')
    .select('content_blocks')
    .eq('slug', 'contact')
    .single();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log(JSON.stringify(data.content_blocks, null, 2));
  }
})();

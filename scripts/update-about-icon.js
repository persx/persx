const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lzpbpymjejwqutfpfwwu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cGJweW1qZWp3cXV0ZnBmd3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjcxOCwiZXhwIjoyMDc3MzA4NzE4fQ.ymG2zCWzwpuCHIbs14ptFWcbnXSaCBG21L35CqK9-tQ'
);

(async () => {
  console.log('Updating About page icon to match production...\n');

  // First get the current content blocks
  const { data: currentData, error: fetchError } = await supabase
    .from('knowledge_base_content')
    .select('content_blocks')
    .eq('slug', 'about')
    .single();

  if (fetchError) {
    console.error('❌ Error fetching about page:', fetchError);
    return;
  }

  // Update the icon in the first block (callout)
  const updatedBlocks = currentData.content_blocks.map(block => {
    if (block.id === 'callout-1' && block.type === 'callout') {
      return {
        ...block,
        data: {
          ...block.data,
          icon: '👋'
        }
      };
    }
    return block;
  });

  // Update the database
  const { data, error } = await supabase
    .from('knowledge_base_content')
    .update({ content_blocks: updatedBlocks })
    .eq('slug', 'about')
    .select();

  if (error) {
    console.error('❌ Error updating about page:', error);
  } else {
    console.log('✅ About page icon updated successfully!');
    console.log('   Changed from ℹ️ to 👋 wave emoji\n');
  }
})();

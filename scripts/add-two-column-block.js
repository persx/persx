const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1]] = match[2];
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY
);

const pageId = '95d0d0c7-6cd3-44d3-a83d-159badcae230';

async function addTwoColumnBlock() {
  console.log('Fetching page...');

  // Get the page
  const { data: page, error: fetchError } = await supabase
    .from('knowledge_base_content')
    .select('*')
    .eq('id', pageId)
    .single();

  if (fetchError) {
    console.error('Error fetching page:', fetchError);
    return;
  }

  console.log('Current blocks:', JSON.stringify(page.content_blocks, null, 2));

  // Get current blocks or initialize empty array
  const currentBlocks = page.content_blocks || [];

  // Create a new two-column block
  const newTwoColumnBlock = {
    id: `two_column_${Date.now()}`,
    type: 'two_column',
    order: currentBlocks.length,
    data: {
      leftColumn: {
        type: 'text',
        content: '<h2>Left Column Heading</h2><p>Add your content for the left column here.</p>'
      },
      rightColumn: {
        type: 'text',
        content: '<h2>Right Column Heading</h2><p>Add your content for the right column here.</p>'
      },
      variant: 'equal',
      background: 'default'
    }
  };

  // Add the new block to the array
  const updatedBlocks = [...currentBlocks, newTwoColumnBlock];

  console.log('Adding two-column block...');

  // Update the page
  const { data: updatedPage, error: updateError } = await supabase
    .from('knowledge_base_content')
    .update({
      content_blocks: updatedBlocks,
      updated_at: new Date().toISOString()
    })
    .eq('id', pageId)
    .select()
    .single();

  if (updateError) {
    console.error('Error updating page:', updateError);
    return;
  }

  console.log('✅ Two-column block added successfully!');
  console.log('Block ID:', newTwoColumnBlock.id);
  console.log('Total blocks:', updatedBlocks.length);
}

addTwoColumnBlock();

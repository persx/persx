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

const pageId = '7f9ef63f-6ec8-481f-bf30-741fd68faefe';

async function addHeroBlock() {
  console.log('Fetching How It Works page...');

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

  console.log('Current blocks:', page.content_blocks ? page.content_blocks.length : 0);

  // Get current blocks or initialize empty array
  const currentBlocks = page.content_blocks || [];

  // Create a new hero block with the content from the screenshot
  const newHeroBlock = {
    id: `hero_${Date.now()}`,
    type: 'hero',
    order: 0, // Place it at the top
    data: {
      title: 'Built for modern marketing leaders',
      subtitle: 'PersX.ai helps growth marketers, product teams and executives who want clarity and actionability. If you need to accelerate personalization, improve conversion rates or optimize onboarding without adding more tools to your stack, PersX.ai gives you the strategic insights to get there—fast.',
      buttons: [
        {
          text: 'Schedule a Consultation',
          href: '/contact',
          variant: 'primary'
        },
        {
          text: 'See Your Custom Roadmap',
          href: '/start',
          variant: 'secondary'
        }
      ],
      alignment: 'left'
    }
  };

  // Add the new block at the beginning and update order of existing blocks
  const updatedBlocks = [
    newHeroBlock,
    ...currentBlocks.map(block => ({
      ...block,
      order: block.order + 1
    }))
  ];

  console.log('Adding hero block to How It Works page...');

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

  console.log('✅ Hero block added successfully!');
  console.log('Block ID:', newHeroBlock.id);
  console.log('Total blocks:', updatedBlocks.length);
  console.log('\nYou can view it at: http://localhost:3000/how-it-works');
  console.log('Edit it at: http://localhost:3000/go/cm/content/7f9ef63f-6ec8-481f-bf30-741fd68faefe');
}

addHeroBlock();

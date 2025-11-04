const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lzpbpymjejwqutfpfwwu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cGJweW1qZWp3cXV0ZnBmd3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjcxOCwiZXhwIjoyMDc3MzA4NzE4fQ.ymG2zCWzwpuCHIbs14ptFWcbnXSaCBG21L35CqK9-tQ'
);

async function updatePersonalNote() {
  try {
    // Fetch the about page
    const { data: page, error: fetchError } = await supabase
      .from('knowledge_base_content')
      .select('*')
      .eq('slug', 'about')
      .single();

    if (fetchError || !page) {
      console.error('Error fetching about page:', fetchError);
      return;
    }

    // Find the personal note callout block
    const blocks = page.content_blocks || [];
    const calloutBlockIndex = blocks.findIndex(block =>
      block.id === 'callout-1' ||
      (block.type === 'callout' && block.data?.title === 'A Personal Note About This Project')
    );

    if (calloutBlockIndex === -1) {
      console.log('No personal note callout found. Available blocks:');
      blocks.forEach((block, i) => {
        console.log(`  ${i}: ${block.type} - ${block.data?.title || 'no title'}`);
      });
      return;
    }

    console.log(`Found personal note callout at index ${calloutBlockIndex}`);

    // Create new callout block with updated content
    const newCalloutBlock = {
      ...blocks[calloutBlockIndex],
      type: 'callout',
      data: {
        icon: '👋',
        color: 'blue',
        title: 'A Personal Note About This Project',
        variant: 'info',
        content: `<p>PersX.ai is more than a recommendation engine—it's a <em>learning laboratory</em> where I'm pushing the boundaries of AI-driven personalization and experimentation strategy.</p>

<p>This project serves three purposes:</p>

<ul>
<li><strong>Continuously improve my AI skills</strong> and stay on the cutting edge of experience optimization</li>
<li><strong>Provide actionable personalization and experimentation recommendations</strong> drawn from 20+ years of hands-on expertise</li>
<li><strong>Build a RAG (Retrieval Augmented Generation) system</strong> that learns from accumulated knowledge—blogs, case studies, implementation guides—to deliver increasingly sophisticated and contextual recommendations</li>
</ul>

<p>As I add more content about advanced tactics, tool integrations, and industry-specific strategies, the system gets smarter. Every blog post, case study, and test result feeds the engine, making your roadmap more precise and actionable.</p>

<p><em>Think of it as an evolving brain for experience optimization—constantly learning, adapting, and improving with each new insight.</em></p>`
      }
    };

    // Update the blocks array
    const updatedBlocks = [...blocks];
    updatedBlocks[calloutBlockIndex] = newCalloutBlock;

    // Update the database
    const { error: updateError } = await supabase
      .from('knowledge_base_content')
      .update({ content_blocks: updatedBlocks })
      .eq('id', page.id);

    if (updateError) {
      console.error('Error updating about page:', updateError);
      return;
    }

    console.log('✅ Successfully updated "A Personal Note About This Project" section!');
    console.log('\nNew content preview:');
    console.log('Title:', newCalloutBlock.data.title);
    console.log('Icon:', newCalloutBlock.data.icon);
    console.log('Color:', newCalloutBlock.data.color);

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

updatePersonalNote();

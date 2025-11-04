const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lzpbpymjejwqutfpfwwu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cGJweW1qZWp3cXV0ZnBmd3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjcxOCwiZXhwIjoyMDc3MzA4NzE4fQ.ymG2zCWzwpuCHIbs14ptFWcbnXSaCBG21L35CqK9-tQ'
);

async function updateHowItWorks() {
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

    console.log('Current content blocks:', JSON.stringify(page.content_blocks, null, 2));

    // Find the "How it works" section (steps block)
    const blocks = page.content_blocks || [];
    const stepsBlockIndex = blocks.findIndex(block =>
      block.type === 'steps' ||
      (block.data?.title && block.data.title.toLowerCase().includes('how it works'))
    );

    if (stepsBlockIndex === -1) {
      console.log('No "How it works" section found. Available blocks:');
      blocks.forEach((block, i) => {
        console.log(`  ${i}: ${block.type} - ${block.data?.title || 'no title'}`);
      });
      return;
    }

    console.log(`Found "How it works" section at index ${stepsBlockIndex}`);

    // Create new steps block with updated content
    const newStepsBlock = {
      ...blocks[stepsBlockIndex],
      type: 'steps',
      data: {
        title: 'How it works: a five‑step optimization loop',
        subtitle: 'PersX.ai guides you through a proven methodology that turns insights into growth',
        steps: [
          {
            number: '1',
            title: 'Discovery',
            description: 'Aggregate evidence and audit the entire journey. Quantify where visitors stall and capture "why" using voice‑of‑customer feedback. PersX.ai clusters patterns and proposes opportunities ranked by impact and effort.'
          },
          {
            number: '2',
            title: 'Hypothesis',
            description: 'Craft test hypotheses such as: "For [audience], changing [thing] from [state] to [state] will increase [metric] because [insight]." Each hypothesis includes success criteria, guardrails, and sample‑size/stop‑rules to ensure valid results.'
          },
          {
            number: '3',
            title: 'Execution',
            description: 'Generate copy, layout and offer variants with PersX.ai. Implement these in your CMS or app and launch targeted A/B/n or multi‑armed bandit tests. All changes are logged with unique IDs to enable clean analysis.'
          },
          {
            number: '4',
            title: 'Review',
            description: 'Look beyond the primary metric. Evaluate average order value (AOV), downstream retention and fairness across segments to avoid harmful regressions. Capture learnings in a living playbook that evolves with each experiment.'
          },
          {
            number: '5',
            title: 'Scale',
            description: 'Turn wins into reusable patterns, components or templates. Roll them out to adjacent journeys and channels (email, ads, in‑app), monitor for drift, and keep iterating.'
          }
        ]
      }
    };

    // Update the blocks array
    const updatedBlocks = [...blocks];
    updatedBlocks[stepsBlockIndex] = newStepsBlock;

    // Update the database
    const { error: updateError } = await supabase
      .from('knowledge_base_content')
      .update({ content_blocks: updatedBlocks })
      .eq('id', page.id);

    if (updateError) {
      console.error('Error updating about page:', updateError);
      return;
    }

    console.log('✅ Successfully updated "How it works" section on about page!');
    console.log('\nNew content:');
    console.log('Title:', newStepsBlock.data.title);
    console.log('Subtitle:', newStepsBlock.data.subtitle);
    console.log('\nSteps:');
    newStepsBlock.data.steps.forEach(step => {
      console.log(`\n${step.number}. ${step.title}`);
      console.log(`   ${step.description}`);
    });

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

updateHowItWorks();

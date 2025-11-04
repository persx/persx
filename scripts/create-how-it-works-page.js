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

async function createHowItWorksPage() {
  console.log('Fetching about page...');

  // Get the about page
  const { data: aboutPage, error: fetchError } = await supabase
    .from('knowledge_base_content')
    .select('*')
    .eq('slug', 'about')
    .single();

  if (fetchError) {
    console.error('Error fetching about page:', fetchError);
    return;
  }

  console.log('About page found, creating How It Works page...');

  // Create the How It Works page by duplicating the about page
  const howItWorksPage = {
    title: 'How It Works',
    slug: 'how-it-works',
    content_type: 'static_page',
    status: 'published',
    excerpt: aboutPage.excerpt || 'Learn how PersX.ai helps you build personalized experiences',
    content: aboutPage.content,
    content_blocks: aboutPage.content_blocks,
    meta_title: 'How It Works - PersX.ai',
    meta_description: aboutPage.meta_description || 'Discover how PersX.ai helps you create personalized experiences and optimize your conversion funnel.',
    focus_keyword: 'how it works',
    canonical_url: 'https://www.persx.ai/how-it-works',
    tags: aboutPage.tags || [],
    author: aboutPage.author,
    featured_image_url: aboutPage.featured_image_url,
    published_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: newPage, error: createError } = await supabase
    .from('knowledge_base_content')
    .insert(howItWorksPage)
    .select()
    .single();

  if (createError) {
    console.error('Error creating How It Works page:', createError);
    return;
  }

  console.log('✅ How It Works page created successfully!');
  console.log('Page ID:', newPage.id);
  console.log('URL: /how-it-works');

  // Now add it to navigation
  console.log('\nAdding to navigation...');

  const { data: navItem, error: navError } = await supabase
    .from('navigation')
    .insert({
      title: 'How It Works',
      slug: 'how-it-works',
      content_type: 'static_page',
      category: 'company',
      order_index: 1
    })
    .select()
    .single();

  if (navError) {
    console.error('Error adding to navigation:', navError);
    return;
  }

  console.log('✅ Added to company navigation!');
  console.log('Navigation item ID:', navItem.id);
}

createHowItWorksPage();

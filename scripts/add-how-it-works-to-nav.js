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

async function addToNavigation() {
  console.log('Updating How It Works page navigation settings...');

  const { data, error } = await supabase
    .from('knowledge_base_content')
    .update({
      show_in_navigation: true,
      navigation_group: 'company',
      navigation_order: 2  // After About (which is presumably 1)
    })
    .eq('slug', 'how-it-works')
    .select();

  if (error) {
    console.error('Error updating page:', error);
    return;
  }

  console.log('✅ How It Works page updated successfully!');
  console.log('Navigation group: company');
  console.log('Navigation order: 2');
  console.log('\nThe page will now appear in the Company dropdown menu.');
}

addToNavigation();

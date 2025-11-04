/**
 * Load test pages with content blocks
 * This script creates test versions of your existing pages using the block system
 *
 * Run with: node scripts/load-block-pages.js
 */

const fs = require('fs');
const path = require('path');

// Read JSON files
const homepageBlocks = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../migration-data/homepage-blocks.json'), 'utf8')
);

const aboutBlocks = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../migration-data/about-blocks.json'), 'utf8')
);

const contactBlocks = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../migration-data/contact-blocks.json'), 'utf8')
);

// Page configurations
const pages = [
  {
    title: 'Home (Blocks)',
    slug: 'home-blocks',
    excerpt: 'AI Strategist for Personalization & Experimentation - Test page using content blocks',
    content_type: 'static_page',
    status: 'published',
    content_blocks: homepageBlocks,
    page_type: 'content',
    navigation_group: null,
    show_in_navigation: false,
    page_template: 'default',
    meta_title: 'PersX.ai - AI Strategist for Personalization & Experimentation',
    meta_description: 'Discover your ideal personas, journeys, and build an actionable roadmap in minutes.',
  },
  {
    title: 'About (Blocks)',
    slug: 'about-blocks',
    excerpt: 'Your strategy engine for experience optimization',
    content_type: 'static_page',
    status: 'published',
    content_blocks: aboutBlocks,
    page_type: 'company',
    navigation_group: 'company',
    navigation_order: 1,
    show_in_navigation: true,
    page_template: 'default',
    meta_title: 'About PersX.ai - Strategy Engine for Experience Optimization',
    meta_description: 'Learn about PersX.ai and our five-step optimization loop backed by 20+ years of expertise.',
  },
  {
    title: 'Contact (Blocks)',
    slug: 'contact-blocks',
    excerpt: 'Ready to transform your personalization strategy? Get in touch.',
    content_type: 'static_page',
    status: 'published',
    content_blocks: contactBlocks,
    page_type: 'utility',
    navigation_group: null,
    show_in_navigation: true,
    page_template: 'default',
    meta_title: 'Contact PersX.ai - Get Your Free Roadmap',
    meta_description: 'Contact our experience optimization experts to get a personalized roadmap.',
  },
];

async function createPage(pageData) {
  try {
    const response = await fetch('http://localhost:3000/api/content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Note: In production, you'd need authentication
        // For local testing, we'll assume you're logged in
      },
      body: JSON.stringify({
        ...pageData,
        content: '', // Empty content since we're using blocks
        industry: 'General',
        tags: ['static-page', 'blocks', 'test'],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to create page: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error creating page "${pageData.title}":`, error.message);
    throw error;
  }
}

async function loadAllPages() {
  console.log('🚀 Loading test pages with content blocks...\n');

  for (const page of pages) {
    try {
      console.log(`Creating: ${page.title} (/${page.slug})`);
      const result = await createPage(page);
      console.log(`✅ Created successfully! ID: ${result.content.id}`);
      console.log(`   View at: http://localhost:3000/${page.slug}\n`);
    } catch (error) {
      console.error(`❌ Failed to create ${page.title}\n`);
    }
  }

  console.log('✅ Done! Test pages created.\n');
  console.log('📝 Next steps:');
  console.log('   1. Visit http://localhost:3000/home-blocks to see the homepage');
  console.log('   2. Visit http://localhost:3000/about-blocks to see the about page');
  console.log('   3. Visit http://localhost:3000/contact-blocks to see the contact page');
  console.log('\n💡 These are test pages. Once verified, you can:');
  console.log('   - Update slugs to replace original pages');
  console.log('   - Edit via CMS at /go/cm/content');
  console.log('   - Add/remove/reorder blocks as needed');
}

// Check if server is running
async function checkServer() {
  try {
    const response = await fetch('http://localhost:3000/api/test-supabase');
    if (!response.ok) {
      throw new Error('Server responded with error');
    }
    return true;
  } catch (error) {
    console.error('❌ Error: Dev server is not running on http://localhost:3000');
    console.error('   Please start the dev server with: npm run dev');
    process.exit(1);
  }
}

// Main execution
(async () => {
  try {
    await checkServer();
    await loadAllPages();
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
})();

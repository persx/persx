/**
 * Check if block pages exist in the database
 */

async function checkPages() {
  try {
    const response = await fetch('http://localhost:3000/api/content');
    const data = await response.json();

    const blockPages = data.content.filter(page =>
      page.slug && page.slug.includes('-blocks')
    );

    console.log(`\nFound ${blockPages.length} block pages:\n`);

    blockPages.forEach(page => {
      console.log(`📄 ${page.title} (/${page.slug})`);
      console.log(`   Content Type: ${page.content_type}`);
      console.log(`   Has content_blocks: ${!!page.content_blocks}`);
      console.log(`   Block count: ${page.content_blocks?.length || 0}`);
      if (page.content_blocks && page.content_blocks.length > 0) {
        console.log(`   Block types: ${page.content_blocks.map(b => b.type).join(', ')}`);
      }
      console.log('');
    });

    if (blockPages.length === 0) {
      console.log('❌ No block pages found! You need to run the SQL insert script.');
      console.log('   See: /migration-data/insert-test-pages.sql\n');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkPages();

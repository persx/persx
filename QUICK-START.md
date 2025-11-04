# Quick Start: Test Content Blocks System

## Step 1: Apply Database Migration

Go to your **Supabase Dashboard** → **SQL Editor** and run:

```sql
ALTER TABLE knowledge_base_content
ADD COLUMN IF NOT EXISTS content_blocks JSONB DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_kb_content_blocks
ON knowledge_base_content USING GIN (content_blocks)
WHERE content_blocks IS NOT NULL;
```

Click **Run** to apply the migration.

## Step 2: Insert Test Pages

Still in the **SQL Editor**, copy and paste the entire contents of:

`/migration-data/insert-test-pages.sql`

Then click **Run**.

This will create 3 test pages:
- `home-blocks` - Homepage using blocks
- `about-blocks` - About page using blocks
- `contact-blocks` - Contact page using blocks

You should see output confirming 3 rows were created.

## Step 3: View Your Block-Based Pages!

Visit these URLs:

1. **Homepage**: http://localhost:3000/home-blocks
2. **About**: http://localhost:3000/about-blocks
3. **Contact**: http://localhost:3000/contact-blocks

You should see your pages rendered with the exact same styles as the originals, but now powered by the content block system!

## What You Should See

✅ **Homepage** - Hero, Features, Martech logos, CTA banner
✅ **About** - Personal note callout, hero, CTAs, trust cards, steps
✅ **Contact** - Contact form with personalized reasons, callout

All with:
- ✅ Exact same colors, gradients, spacing
- ✅ Dark mode working
- ✅ Responsive design intact
- ✅ Industry personalization ready (for homepage features)
- ✅ Contact form functional

## Next Steps

### Edit via CMS
1. Go to http://localhost:3000/go/cm/content
2. Find your test pages
3. Click to edit
4. See the `content_blocks` field with JSON data

### Replace Original Pages
Once you verify everything works:

1. **Update the slugs** in the database:
   ```sql
   -- Backup originals first!
   UPDATE knowledge_base_content
   SET slug = 'home-old'
   WHERE slug = 'home';

   -- Make block version the main one
   UPDATE knowledge_base_content
   SET slug = 'home'
   WHERE slug = 'home-blocks';
   ```

2. **Update navigation** to point to block-based pages

3. **Archive old page files** (keep as backup)

### Build Block Editor UI (Optional)
Create a visual editor in `/go/cm/content/[id]` to:
- Add/remove/reorder blocks visually
- Edit block content inline
- Preview changes live

## Troubleshooting

**Pages not showing?**
- Check Supabase SQL Editor for any errors
- Verify pages were created: `SELECT * FROM knowledge_base_content WHERE slug LIKE '%-blocks'`

**Styles look different?**
- Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
- Check browser console for errors
- Verify dev server is running

**Want to modify block content?**
- Edit the JSON in `/migration-data/*.json` files
- Delete test pages and re-run insert SQL
- Or edit directly in Supabase SQL Editor

## Files Reference

- **Migration**: `/supabase/migrations/20250205000000_add_content_blocks.sql`
- **Test Data**: `/migration-data/insert-test-pages.sql`
- **Block Configs**: `/migration-data/*.json`
- **Components**: `/app/components/blocks/`
- **Documentation**: `/CONTENT-BLOCKS-README.md`

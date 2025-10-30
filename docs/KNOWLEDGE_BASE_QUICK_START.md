# Knowledge Base Quick Start Guide

## What We Built

A **RAG (Retrieval Augmented Generation) system** that makes PersX.ai smarter over time by learning from:
- Blog posts about tactics
- Case studies by industry
- Implementation guides for tools
- Test results and best practices

## Schema Overview

```
📊 5 Tables + Vector Search
├── knowledge_base_content (main content storage)
├── content_embeddings (vector search via pgvector)
├── tags (organized categorization)
├── content_analytics (track what works)
└── content_relationships (connect related content)
```

## Quick Start Steps

### 1. Apply the Migration

**Option A: Supabase Dashboard**
- Go to SQL Editor in Supabase dashboard
- Copy/paste: `supabase/migrations/20250130000000_create_knowledge_base_schema.sql`
- Click Run

**Option B: Supabase CLI** (recommended)
```bash
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

### 2. Add Your First Content

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);

await supabase.from('knowledge_base_content').insert({
  title: 'How to Optimize Cart Abandonment Emails',
  slug: 'optimize-cart-abandonment-emails',
  excerpt: 'Recover 15-25% of abandoned carts with these proven email tactics',
  content: `
## Introduction
Cart abandonment emails are one of the highest-ROI tactics...

## Best Practices
1. Send first email within 1 hour
2. Personalize with cart contents
3. Offer incentive at 24 hours
...
  `,
  content_type: 'blog',
  industry: 'eCommerce',
  goals: ['Cart‑abandonment rate', 'Revenue per visitor (RPV)'],
  martech_tools: ['Email Service Provider or Marketing Automation'],
  tags: ['email-marketing', 'cart-recovery', 'automation'],
  status: 'published',
  published_at: new Date().toISOString()
});
```

### 3. Generate Embeddings (Coming Soon)

We'll create an API endpoint that:
1. Takes new content
2. Splits into chunks
3. Generates embeddings via Claude/OpenAI
4. Stores in `content_embeddings` table

### 4. Semantic Search (Coming Soon)

```typescript
// Find content relevant to user's roadmap
const { data } = await supabase.rpc('match_content_embeddings', {
  query_embedding: await embedText('cart abandonment strategies'),
  match_threshold: 0.75,
  match_count: 5,
  filter_industry: 'eCommerce',
  filter_goals: ['Cart‑abandonment rate']
});
```

## Content Types

| Type | Purpose | Example |
|------|---------|---------|
| `blog` | Educational content | "10 A/B Testing Mistakes to Avoid" |
| `case_study` | Real-world results | "How Acme increased conversions 32%" |
| `implementation_guide` | Step-by-step how-tos | "Setting up Optimizely with Segment" |
| `test_result` | Documented experiments | "Product page layout test results" |
| `best_practice` | Proven tactics | "Email subject line formulas" |
| `tool_guide` | Tool-specific docs | "Marketo automation workflows" |
| `news` | Industry news & updates | "Google announces new GA4 features" |

## Industry Categories

- `eCommerce` - Online retail
- `Healthcare` - Patient engagement
- `Financial Services` - Lead gen & retention
- `Education` - Enrollment & engagement
- `B2B/SaaS` - Enterprise sales
- `General` - Applies to all industries

## How It Improves Recommendations

### Today (Rule-Based)
```typescript
// Hard-coded test ideas
const testIdeas = [
  "A/B test trust badges on product pages",
  "Implement cart recovery emails"
];
```

### Tomorrow (RAG-Enhanced)
```typescript
// AI-generated using your accumulated knowledge
const testIdeas = await generateRecommendations({
  industry: 'eCommerce',
  goals: ['Cart abandonment'],
  tools: ['Marketo'],
  knowledgeBase: relevantContent // ← Retrieved via semantic search
});

// Result: More specific, proven tactics from your case studies
"Based on 3 eCommerce case studies, implement a 3-email cart recovery
sequence via Marketo with 1-hour, 24-hour, and 72-hour timing.
Case study X showed 23% recovery rate using this approach."
```

## Next Actions

1. ✅ **Schema Created** - Database tables ready
2. ⏳ **Apply Migration** - Run SQL in Supabase
3. ⏳ **Create Admin Panel** - UI to add/edit content
4. ⏳ **Add Sample Content** - 5-10 blog posts to start
5. ⏳ **Integrate AI** - Generate embeddings
6. ⏳ **Update Roadmap** - Include relevant content in recommendations

## File Reference

- **Migration**: `supabase/migrations/20250130000000_create_knowledge_base_schema.sql`
- **Types**: `types/knowledge-base.ts`
- **Full Docs**: `docs/KNOWLEDGE_BASE_SCHEMA.md`
- **This Guide**: `docs/KNOWLEDGE_BASE_QUICK_START.md`

## Questions?

See full documentation: `docs/KNOWLEDGE_BASE_SCHEMA.md`

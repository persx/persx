# Knowledge Base Schema Documentation

## Overview

The PersX.ai knowledge base is built as a **RAG (Retrieval Augmented Generation) system** that learns from accumulated content to provide increasingly sophisticated personalization and experimentation recommendations.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Knowledge Base System                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Content Creation → Embeddings → Vector Search → AI Recs    │
│                                                               │
│  1. Add content (blogs, case studies, guides)                │
│  2. Generate embeddings for semantic search                  │
│  3. Match user context to relevant content                   │
│  4. Generate personalized recommendations                    │
│  5. Track what works → Improve system                        │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Database Tables

### 1. `knowledge_base_content`
**Purpose**: Stores all knowledge base content

**Key Fields**:
- `title`, `slug`, `excerpt`, `content` - Core content
- `content_type` - blog | case_study | implementation_guide | test_result | best_practice | tool_guide
- `status` - draft | published | archived
- `industry` - eCommerce | Healthcare | Financial Services | Education | B2B/SaaS | General
- `goals[]` - Array of goals this content relates to
- `martech_tools[]` - Tools covered in this content
- `tags[]` - Additional categorization
- `search_vector` - Full-text search (auto-generated)

**Use Cases**:
- Store blog posts about advanced tactics
- Document case studies by industry
- Create implementation guides for specific tools
- Archive test results and learnings

### 2. `content_embeddings`
**Purpose**: Vector embeddings for semantic search using pgvector

**Key Fields**:
- `content_id` - References knowledge_base_content
- `chunk_text` - Text chunk (content is split for better embeddings)
- `chunk_index` - Order of chunks
- `embedding` - 1536-dimension vector (OpenAI ada-002 or Claude)
- `token_count` - For tracking API costs

**Use Cases**:
- Semantic search: "Find content about cart abandonment email sequences"
- Context-aware recommendations based on user selections
- Similar content discovery

### 3. `tags`
**Purpose**: Organized categorization system

**Key Fields**:
- `name` - Tag name
- `category` - tactic | tool | industry | goal | channel
- `description` - What this tag represents

**Use Cases**:
- Filter content by tactic type (A/B testing, personalization, segmentation)
- Find all content related to a specific tool (Optimizely, Segment)
- Browse by industry or goal

### 4. `content_analytics`
**Purpose**: Track content usefulness and engagement

**Key Fields**:
- `content_id` - Which content was accessed
- `roadmap_id` - Context: which roadmap used this content
- `view_count`, `click_count` - Engagement
- `usefulness_score` - User feedback (1-5)
- `user_industry`, `user_goals`, `user_martech_tools` - Context

**Use Cases**:
- Identify most helpful content
- A/B test different recommendations
- Improve recommendation algorithm over time

### 5. `content_relationships`
**Purpose**: Map connections between content

**Key Fields**:
- `source_content_id`, `related_content_id` - The relationship
- `relationship_type` - related | prerequisite | next_step | case_study
- `weight` - For ranking

**Use Cases**:
- "Read this first" prerequisites
- "Next steps" progression paths
- Related articles sidebar
- Case studies that demonstrate concepts

## Key Functions

### `match_content_embeddings()`
Performs semantic similarity search using vector embeddings.

**Parameters**:
```sql
match_content_embeddings(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10,
  filter_industry industry_type DEFAULT NULL,
  filter_goals text[] DEFAULT NULL,
  filter_tools text[] DEFAULT NULL
)
```

**Returns**: Top matching content with similarity scores

**Example Use**:
```typescript
// Find content about cart abandonment for eCommerce
const results = await supabase.rpc('match_content_embeddings', {
  query_embedding: embedQueryText("cart abandonment email strategies"),
  match_threshold: 0.75,
  match_count: 5,
  filter_industry: 'eCommerce',
  filter_goals: ['Cart‑abandonment rate']
});
```

## How the RAG System Works

### Phase 1: Content Ingestion
1. Add new blog post, case study, or guide to `knowledge_base_content`
2. Split content into chunks (~500 tokens each)
3. Generate embeddings for each chunk using Claude/OpenAI
4. Store in `content_embeddings` table

### Phase 2: Semantic Search
1. User fills out start form (industry, goals, tools)
2. System creates query: "How to improve {goal} for {industry} using {tools}"
3. Generate embedding for query
4. Search `content_embeddings` using vector similarity
5. Return top N most relevant content pieces

### Phase 3: AI Generation
1. Retrieve relevant content chunks
2. Pass to Claude API as context
3. Generate personalized recommendations
4. Combine with existing rule-based recommendations
5. Return enhanced roadmap

### Phase 4: Learning Loop
1. Track which recommendations users engage with
2. Collect usefulness feedback
3. Update recommendation weights
4. Improve content based on gaps
5. Iterate and improve

## Migration Instructions

### Apply Migration to Supabase

1. **Via Supabase Dashboard**:
   - Go to SQL Editor
   - Copy contents of `supabase/migrations/20250130000000_create_knowledge_base_schema.sql`
   - Run the script
   - Verify tables are created

2. **Via Supabase CLI** (recommended):
   ```bash
   # Install Supabase CLI if not already installed
   npm install -g supabase

   # Link to your project
   supabase link --project-ref YOUR_PROJECT_REF

   # Push migration
   supabase db push

   # Or apply specific migration
   supabase migration up
   ```

3. **Verify Installation**:
   ```sql
   -- Check tables exist
   SELECT table_name FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name LIKE '%content%';

   -- Check pgvector extension
   SELECT * FROM pg_extension WHERE extname = 'vector';

   -- Test similarity search function
   SELECT * FROM match_content_embeddings(
     ARRAY[]::vector(1536),
     0.5,
     1
   );
   ```

## Next Steps

### Immediate (Phase 1)
- [ ] Apply migration to Supabase
- [ ] Create admin panel to add/edit content
- [ ] Add 5-10 sample blog posts about key tactics
- [ ] Test content retrieval and display

### Short Term (Phase 2)
- [ ] Integrate Claude API for embeddings generation
- [ ] Create API endpoint to generate embeddings on content save
- [ ] Build semantic search functionality
- [ ] Update roadmap generator to include relevant content

### Medium Term (Phase 3)
- [ ] Implement analytics tracking
- [ ] Add user feedback mechanism (was this helpful?)
- [ ] Create content recommendation algorithm
- [ ] Build admin dashboard for insights

### Long Term (Phase 4)
- [ ] A/B test different recommendation strategies
- [ ] Build automated content gap analysis
- [ ] Implement personalized learning paths
- [ ] Create content effectiveness scoring

## Example Queries

### Insert Content
```sql
INSERT INTO knowledge_base_content (
  title,
  slug,
  excerpt,
  content,
  content_type,
  industry,
  goals,
  martech_tools,
  tags,
  status
) VALUES (
  'Cart Abandonment Email Sequences That Convert',
  'cart-abandonment-email-sequences',
  'Learn how to recover 15-25% of abandoned carts with strategic email sequences',
  '## Introduction\n\nCart abandonment is...',
  'blog',
  'eCommerce',
  ARRAY['Cart‑abandonment rate', 'Revenue per visitor (RPV)'],
  ARRAY['Email Service Provider or Marketing Automation', 'CDP or Customer Engagement Platform'],
  ARRAY['email-marketing', 'cart-recovery', 'automation'],
  'published'
);
```

### Find Related Content
```sql
-- Find all blog posts about eCommerce conversion optimization
SELECT * FROM knowledge_base_content
WHERE content_type = 'blog'
  AND industry = 'eCommerce'
  AND 'Purchase conversion rate' = ANY(goals)
  AND status = 'published'
ORDER BY published_at DESC;
```

### Track Content Usage
```sql
INSERT INTO content_analytics (
  content_id,
  roadmap_id,
  view_count,
  user_industry,
  user_goals,
  user_martech_tools
) VALUES (
  'content-uuid',
  'roadmap-uuid',
  1,
  'eCommerce',
  ARRAY['Cart‑abandonment rate'],
  ARRAY['Marketo', 'Segment']
);
```

## Security Notes

- **Row Level Security (RLS)** is enabled on all tables
- Public users can:
  - Read published content
  - Read embeddings of published content
  - View tags
  - Create analytics entries (for tracking)
- Admin access required for:
  - Creating/editing content
  - Changing content status
  - Managing tags
  - Viewing full analytics

## Performance Considerations

- **Vector search** is optimized with IVFFlat index (adjust `lists` parameter based on dataset size)
- **Full-text search** uses generated tsvector with weighted columns (title > excerpt > content)
- **Array searches** (goals, tools, tags) use GIN indexes
- **Chunk size**: ~500 tokens optimal for embedding quality vs. specificity

## Cost Estimates

### Embedding Generation
- OpenAI ada-002: ~$0.0001 per 1K tokens
- Claude embeddings: TBD pricing
- Example: 100 blog posts × 2000 words × 1.3 tokens/word = ~260K tokens = **~$0.03**

### Storage
- Vector embeddings: ~6KB per embedding
- 1000 content pieces × 4 chunks × 6KB = ~24MB embeddings
- Minimal cost on most hosting plans

### API Calls
- Supabase: Free tier includes generous limits
- Claude API for generation: Pay per token (context + generation)

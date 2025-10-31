# PersX.ai Content Editorial Guide

## Overview

This guide defines the content structure and formatting standards for PersX.ai news articles and vendor roundups. Follow these guidelines to create scannable, action-oriented content optimized for growth marketers and AI-powered search.

## Content Objectives

- **Scannable**: Clear headings, short paragraphs, and bullets
- **Action-oriented**: Specific, testable guidance over generic advice
- **AI-SEO friendly**: Consistent structure, clear entities, semantic HTML
- **Non-repetitive**: Consolidate cross-article advice into checklists
- **Executive-friendly**: Neutral, practical tone focused on "why" over "what"

## Database Fields

When creating content in the CMS, you'll work with these key fields:

### Required Fields
- **title**: Page title (becomes H1) - Use format "PersX.ai Perspective: [Topic]"
- **slug**: URL-friendly identifier (auto-generated)
- **content**: Main markdown content (see structure below)
- **content_type**: Set to `news`
- **status**: `draft` or `published`

### Recommended Fields
- **overall_summary**: Single-sentence TL;DR (150-160 characters)
- **tags**: Array of topics (e.g., `["personalization", "ai", "experimentation"]`)
- **meta_description**: SEO description (150-160 characters)
- **external_sources**: Array of source objects (see below)

### External Sources Format

```json
[
  {
    "url": "https://www.vendor.com/product",
    "name": "Vendor Product Name",
    "author": "Author Name (optional)",
    "published_date": "2025-01-15",
    "summary": "Brief description (optional)"
  }
]
```

## Markdown Content Structure

### Complete Template

```markdown
## Highlights by Vendor

### Vendor A Name

**Product Name** combines AI-driven experimentation with real-time personalization for enterprise marketers.

**Why it matters:**
- Reduces test design time by 60% using natural language hypothesis generation
- Auto-flags statistical significance issues before launch

**Try this next:**
1. Map one customer journey with 3+ decision points
2. Define success as +5% conversion or -10% bounce rate

### Vendor B Name

**Tool Name** is a unified platform for A/B testing, feature flags, and web personalization.

**Why it matters:**
- Single SDK deployment across web, mobile, and server-side
- Built-in guardrail metrics prevent revenue-impacting bugs

**Try this next:**
1. Start with homepage hero test; measure click-through to product pages
2. Set up Slack alerts for p-value < 0.05 or sample ratio mismatch

### Vendor C Name

**Platform Name** offers AI-powered experiment orchestration with automatic traffic allocation.

**Why it matters:**
- Eliminates manual traffic splitting; reallocates to winning variants hourly
- Integrates with existing CDPs (Segment, mParticle, Tealium)

**Try this next:**
1. Identify your highest-traffic page with lowest conversion
2. Test 2 variants: simplified form vs. social proof banner

## Cross-Vendor Checklist

Before launching any experimentation program:

- **Data foundation**: Verify clean event tracking; test 3 sample events end-to-end
- **Hypothesis quality**: Write testable predictions (e.g., "Adding trust badges increases checkout completion by 8%")
- **Guardrail metrics**: Define what would make a winning test unacceptable (e.g., increased support tickets)
- **Targeting rules**: Start with 100% traffic on low-risk pages; segment by device/location later
- **Governance**: Document who can launch tests, approval thresholds, and rollback procedures

## Internal Links

Explore related resources:
- [PersX Experiment Playbook](#) - Step-by-step framework for test design
- [Personalization Readiness Audit](#) - Self-assessment for data and tech stack maturity

## Meta Description

Concise roundup of AI-driven experimentation tools: compare Optimizely, VWO, Kameleoon, and AB Tasty for personalization and testing programs.

## Automated Schema Plan

The system automatically generates structured data from this page content. The following schema types and fields are extracted:

**Article Schema:**
- `headline`: Pulled from page title (H1)
- `description`: Pulled from TL;DR / overall_summary field
- `author`: Set to "PersX.ai" (Organization type)
- `datePublished`: From published_at timestamp
- `dateModified`: From updated_at timestamp
- `about`: Array of topics extracted from tags field
- `mentions`: Array of vendor names/products extracted from H3 headings and external_sources

**Breadcrumb Schema:**
- Levels derived from site navigation: Insights → News → [Current Page Title]
- Labels and URLs constructed from site IA

**Organization Schema:**
- Referenced globally site-wide (name: "PersX.ai", url: "https://www.persx.ai")
- Not duplicated per page

**FAQ Schema (optional):**
- If the page includes a "Frequently Asked Questions" section, questions and answers are extracted
- Not present on standard vendor roundups

**Note:** Schema markup is generated automatically during build/render. Do not include schema code in the markdown content.
```

## Formatting Rules

### Headings
- **H1**: Reserved for page title (handled by template)
- **H2**: Section headings (Highlights by Vendor, Cross-Vendor Checklist, Internal Links, etc.)
- **H3**: Individual vendor/product names
- **H4**: Subsections within vendor entries (rarely needed)

### Paragraphs
- Max 3 sentences per paragraph
- Use short, declarative sentences
- Bold product names and key features on first mention only

### Lists
- **Unordered (bullets)**: For "Why it matters" takeaways
- **Ordered (numbered)**: For "Try this next" action steps
- Keep bullets parallel and specific
- Aim for 2-3 bullets per list; max 6

### Text Formatting
- **Bold**: Product names, feature labels (first mention only)
- *Italic*: Rare; use for emphasis on metrics or thresholds
- `Code`: Technical terms, API names, specific UI labels
- ~~Strikethrough~~: Not recommended for standard content

### Links
- Use descriptive anchor text that reflects user intent
- Example: [PersX Experiment Playbook](#) NOT [Click here](#)
- Open external links in new tabs (handled automatically)

## Writing Style

### DO
- Start with user benefit: "Reduces test design time by 60%"
- Use specific metrics: "+5% conversion" NOT "better results"
- Write testable actions: "Map one customer journey with 3+ decision points"
- Focus on "why it matters" over feature descriptions
- Use active voice: "Define success as..." NOT "Success should be defined as..."

### DON'T
- Repeat boilerplate across vendors ("requires a strategic approach")
- Use vague qualifiers: "industry-leading", "world-class", "cutting-edge"
- Include geographic content or location-based recommendations
- Add emojis or decorative elements
- Write generic advice: "experiment with different approaches"

## Length Guidelines

- **Total article**: 450-650 words (excluding H1 title)
- **TL;DR**: 1 sentence, 150-160 characters
- **Vendor entry**: 3 components (What/Why/Try) totaling 80-120 words
- **Cross-Vendor Checklist**: 4-6 bullets
- **Meta description**: 150-160 characters

## AI-SEO Best Practices

### Target Concepts
Include these topical terms naturally throughout content:
- AI-driven experimentation
- Personalization strategy
- Experience optimization
- Experimentation program management
- A/B testing platform
- Customer journey optimization

### Entity Clarity
- Mention vendor names (Optimizely, VWO, Kameleoon, AB Tasty) in H3 headings
- Include product names bolded on first mention
- Reference tool categories consistently (e.g., "A/B testing platform", "personalization engine")

### Internal Linking
- Include 2-3 internal link prompts using descriptive anchor text
- Link to related playbooks, audits, case studies, or tool guides
- Place links where they add contextual value, not just at the end

### Semantic Structure
- Use proper heading hierarchy (H2 → H3, never skip levels)
- Group related content under clear section headings
- Use semantic HTML through markdown (lists, emphasis, links)

## Quality Checklist

Before publishing, verify:

- [ ] TL;DR is one sentence, ≤160 characters
- [ ] Each vendor has exactly 3 parts (What/Why/Try)
- [ ] No repeated boilerplate sentences across vendors
- [ ] Product names bolded on first mention only
- [ ] Bullets are specific and parallel; actions are testable
- [ ] Cross-Vendor Checklist has 4-6 concrete items
- [ ] 2-3 internal link prompts with descriptive anchor text
- [ ] Meta description present and within 150-160 characters
- [ ] "Automated Schema Plan" section describes fields without code
- [ ] Sources listed with clean titles and domains
- [ ] No generic advice; all guidance is actionable
- [ ] Total length 450-650 words
- [ ] All external_sources in database have valid URLs

## Example: Well-Formatted Vendor Entry

```markdown
### Optimizely Opal

**Optimizely Opal** orchestrates experiments across web, mobile, and feature flags with AI-powered traffic allocation.

**Why it matters:**
- Automatically reallocates traffic to winning variants every 4 hours based on Bayesian statistics
- Prevents flicker on client-side tests using edge-side rendering

**Try this next:**
1. Audit your 5 highest-traffic pages; rank by conversion gap vs. benchmark
2. Run a hero image test on #1 page; measure click-through to product detail
```

## Common Mistakes to Avoid

1. **Repetitive perspective sections**: Don't copy-paste the same "strategic approach" paragraph for each vendor
2. **Missing action steps**: "Try this next" must have specific, numbered steps
3. **Vague bullets**: "Improves performance" → "Reduces test design time by 60%"
4. **Too many adjectives**: "powerful, innovative solution" → "AI-driven testing platform"
5. **Feature dumps**: Focus on 2-3 key differentiators, not a complete feature list
6. **Long paragraphs**: Break any paragraph over 3 sentences

## Working with the CMS

### Quick Add Workflow
1. Go to `/go/cm/content/quick-add`
2. Enter title (H1 format: "PersX.ai Perspective: [Topic]")
3. Write TL;DR in `overall_summary` field
4. Paste structured markdown in `content` field
5. Add `external_sources` JSON array
6. Add tags (3-5 relevant topics)
7. Set `content_type` to `news`
8. Set `status` to `draft` for review, `published` to go live

### Updating Existing Content
1. Go to `/go/cm/content`
2. Find article in list view
3. Click to edit
4. Make changes following this guide
5. Save and verify on live URL: `/news/[slug]`

## Technical Notes

### Schema Generation
- Schema.org markup is auto-generated by `NewsTemplate.tsx` component
- Do NOT include `<script type="application/ld+json">` in markdown
- Schema pulls from: title, overall_summary, tags, external_sources, published_at

### Markdown Rendering
- Uses ReactMarkdown with GitHub Flavored Markdown (GFM)
- Supports: tables, task lists, strikethrough, autolinks
- Syntax highlighting for code blocks (specify language: ```typescript)
- HTML tags allowed via rehype-raw plugin (use sparingly)

### URL Structure
- Slugs auto-generated from first 5 words of title
- Format: lowercase, hyphenated, no special characters
- Example: "PersX.ai Perspective: AI Experimentation Trends" → `/news/persx-ai-perspective-ai-experimentation`

---

**Version**: 1.0
**Last Updated**: October 31, 2025
**Maintained By**: PersX.ai Editorial Team

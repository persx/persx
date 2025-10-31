# PersX.ai Content Editorial Guide

## Overview

This guide defines the content structure and formatting standards for PersX.ai news articles and vendor roundups. Follow these guidelines to create scannable, action-oriented content optimized for growth marketers and AI-powered search.

---

## SYSTEM MESSAGE (for Claude)

You are an editor for PersX.ai. Transform rough vendor notes into a single, scannable brief for growth marketers.

**Goals**: readable, non-repetitive, action-oriented, and AI-SEO friendly.

**Length**: 1,000–2,500 words.

**No code**. Use plain text and markdown-style headings only.

### Formatting rules
- Use H1 for page title, H2 for sections, H3 for each vendor.
- Keep paragraphs short (≤ 3 sentences) and sentences concise.
- Use bold on first mention of product names, features, and key outcomes.
- Use unordered lists for "Why it matters" and ordered lists for "Try this next".
- Add horizontal dividers (---) between major sections and between vendors for visual clarity.
- Add callout boxes as short titled blocks or quotes using blockquote formatting (no code).
- Eliminate repeated boilerplate; consolidate shared advice into one short Cross-Vendor Checklist.
- Place source links immediately beneath each vendor entry (not just at the end).
- Include a Meta Description sentence (150–160 characters) in plain text.
- Include an Automated Schema Plan (describe what to generate; no code).

### AI-SEO guidance (text-only)
- Make H1 reflect intent (e.g., "PersX.ai Perspective: AI-Driven Experimentation & Personalization Roundup").
- Naturally mention core entities (Optimizely, VWO, Kameleoon, etc.) and topics (AI-driven experimentation, personalization strategy, experience optimization).
- Use descriptive subheadings and consistent structure so search and AI assistants can parse the page.
- Suggest 2 internal link prompts with meaningful anchor text (e.g., "PersX Experiment Playbook", "Personalization Readiness Audit").
- Avoid keyword stuffing; prioritize clarity and usefulness.

---

## USER MESSAGE (paste this with your raw notes)

**Task**: Rewrite and format the following vendor blurbs into a single page using the template and rules below.

**Audience**: Growth marketers and experimentation leaders.

**Objective**: Skimmable analysis with clear actions, minimal repetition, and AI-SEO-ready structure.

**Length**: 1,000–2,500 words.

**Raw content to clean up**:
[PASTE YOUR VENDOR NOTES HERE]

---

## Output Structure Template

Use exactly this layout:

### PersX.ai Perspective: Vendor Roundup — [Week / Month]

**TL;DR**: [One-sentence summary of the most important theme or shift and why it matters now.]

---

### Highlights by Vendor

#### [Vendor Name] — [Article or Announcement Title]

- **What it is**: [1–2 sentences that plainly summarize the news or idea.]
- **Why it matters**:
  - [Specific impact on experimentation/personalization/journey orchestration.]
  - [Concrete benefit or risk relevant to growth teams and program management.]
- **Try this next**:
  1. [Action with a measurable outcome or KPI.]
  2. [Action focused on workflow/tool alignment or enablement.]

**PersX.ai Perspective**

[Relatable insight in 2–4 sentences: Is this a genuine industry shift, notable innovation, or a practical lever teams can pull to hit business goals? Tie to common obstacles—data quality, experiment velocity, governance, content supply—and explain how teams can capitalize.]

> **Callout — Fast Win**
>
> [One short, punchy recommendation or benchmark (e.g., "Run a 2-arm holdout with a 10% control for the next release to validate incremental lift").]

**Source**: [Clean title] — [domain.com/slug]

---

#### [Vendor Name] — [Article or Announcement Title]

- **What it is**: […]
- **Why it matters**:
  - […]
  - […]
- **Try this next**:
  1. […]
  2. […]

**PersX.ai Perspective**

[Relatable insight as above—how to leverage this change to meet real KPIs.]

> **Quote**
>
> "[Short quote from the article or a concise pull-quote you craft to reinforce the insight.]"

**Source**: [Clean title] — [domain.com/slug]

---

#### [Vendor Name] — [Article or Announcement Title]

- **What it is**: […]
- **Why it matters**:
  - […]
  - […]
- **Try this next**:
  1. […]
  2. […]

**PersX.ai Perspective**

[Relatable insight.]

> **Callout — Watch-Out**
>
> [One risk or caveat (e.g., "Avoid over-targeting; keep a 10–15% holdout until stability is proven").]

**Source**: [Clean title] — [domain.com/slug]

---

**Note**: Repeat the entire vendor block above for each item (usually 4–10 total). Keep spacing and dividers for readability.

---

### Cross-Vendor Checklist

Keep it short and non-repetitive:

- **Data & identity**: make sure events, user IDs, and KPIs are clean and mapped before testing or personalizing.
- **Hypotheses that matter**: tie each test to a known friction or opportunity (segment, journey step, device).
- **Stat guardrails**: use appropriate guardrails (e.g., sequential approaches, holdouts) to curb false positives.
- **Personalization scope**: start with 1–2 high-value segments; measure incrementality and monitor fatigue.
- **Change management**: implement naming conventions, rollback plans, documentation, and privacy notices.
- **Content supply**: ensure variant creation is resourced (briefs, on-brand assets, governance of AI-assisted content).

---

### Internal Links

- [PersX Experiment Playbook](#) — [One sentence on when to use it.]
- [Personalization Readiness Audit](#) — [One sentence on what it assesses.]

---

### Meta Description

[One sentence, 150–160 characters, naturally mentioning AI-driven experimentation/personalization.]

---

### Automated Schema Plan (Text Only — No Code)

Describe what your site should auto-generate based on this page's content and metadata.

**Article**
- Headline: use H1.
- Description: use TL;DR.
- Author: "PersX.ai".
- DatePublished/Modified: from CMS timestamps.
- About: list major topics surfaced (AI-driven experimentation, personalization strategy, experience optimization).
- Mentions: vendor and product names from each H3 block.

**Breadcrumb**
- Positions/labels: follow site IA (e.g., Insights → Vendor Roundups → [This Title]).

**Organization**
- Use site-wide org entity (name, URL) referenced globally; do not duplicate details here.

**FAQ (optional)**
- If a short Q&A is present, list the questions/answers to extract from an FAQ section.

**Instruction**
- Generate schema automatically from these fields; do not display code on the page.

---

### Sources (Optional master list if you also want all links at the end)

- [Vendor Name] — [Clean article title] (domain.com)
- [Vendor Name] — [Clean article title] (domain.com)

---

## Style Guardrails

Claude should self-check before finishing:

- [ ] Target length 1,000–2,500 words; remove boilerplate or duplicate advice.
- [ ] Each vendor includes: What it is / Why it matters / Try this next / PersX.ai Perspective / Source.
- [ ] Use bold once per key term; keep bullets parallel and actions measurable.
- [ ] Maintain clear spacing with blank lines and --- dividers; include at least one callout or quote per vendor.
- [ ] Keep tone neutral and specific; avoid vague phrases ("robust," "best-in-class," "leverage synergies").
- [ ] Ensure sources sit directly under each vendor entry.

---

## Database Fields

When creating content in the CMS, you'll work with these key fields:

### Required Fields
- **title**: Page title (becomes H1) - Use format "PersX.ai Perspective: [Topic]"
- **slug**: URL-friendly identifier (auto-generated)
- **content**: Main markdown content (see structure above)
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

---

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

---

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

---

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

**Version**: 2.0
**Last Updated**: October 31, 2025
**Maintained By**: PersX.ai Editorial Team

---

**Use this template as your starting point every time.**

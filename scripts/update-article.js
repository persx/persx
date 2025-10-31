/**
 * Script to update an article in the database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://lzpbpymjejwqutfpfwwu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cGJweW1qZWp3cXV0ZnBmd3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjcxOCwiZXhwIjoyMDc3MzA4NzE4fQ.ymG2zCWzwpuCHIbs14ptFWcbnXSaCBG21L35CqK9-tQ';

const supabase = createClient(supabaseUrl, supabaseKey);

// New content for experimentation-ai-emerging-trends
const newContent = `## Highlights by Vendor

### Kameleoon AI Copilot

**Kameleoon AI Copilot** uses natural language processing to generate test hypotheses and flag statistical issues before launch.

**Why it matters:**
- Reduces experiment design time by translating business questions into testable hypotheses automatically
- Pre-launch validation catches sample ratio mismatches and underpowered tests

**Try this next:**
1. Identify your top conversion bottleneck (checkout, signup, or product page)
2. Describe the problem in plain language; let AI Copilot suggest 3 test variants

### Quantum Metric Analytics Platform

**Quantum Metric** combines session replay with AI-powered anomaly detection to surface friction points that warrant experimentation.

**Why it matters:**
- Auto-detects drops in conversion rates or spikes in rage clicks across customer segments
- Links behavioral data directly to experimentation tools for hypothesis generation

**Try this next:**
1. Run a 7-day baseline analysis on your highest-traffic user flow
2. Prioritize the top 2 friction points by revenue impact; design A/B tests to address them

### AB Tasty One Platform

**AB Tasty One Platform** unifies A/B testing, feature flags, and web personalization under a single SDK deployment.

**Why it matters:**
- Single integration supports client-side, server-side, and edge testing without multiple vendors
- Built-in audience segmentation syncs with CDPs (Segment, mParticle) for consistent targeting

**Try this next:**
1. Map your current testing stack; identify redundant tools or integration gaps
2. Run a side-by-side pilot: test homepage hero on AB Tasty vs. your legacy tool

### VWO Copilot

**VWO Copilot** delivers AI-generated test summaries and automatically surfaces statistically significant insights from running experiments.

**Why it matters:**
- Summarizes weeks of test data into executive-friendly briefs in seconds
- Flags interactions between audience segments (e.g., mobile vs. desktop performance divergence)

**Try this next:**
1. Export your last 5 completed tests; compare manual analysis time vs. VWO Copilot output
2. Set up Slack alerts for tests reaching statistical significance (p < 0.05)

### Optimizely Opal

**Optimizely Opal** orchestrates multi-channel experiments and reallocates traffic dynamically using Bayesian optimization.

**Why it matters:**
- Shifts traffic to winning variants every 4 hours instead of waiting for manual analysis
- Coordinates tests across web, mobile app, and email to prevent conflicting experiences

**Try this next:**
1. Audit your 3 highest-traffic channels; document current cross-channel testing conflicts
2. Run a coordinated campaign test (web + email) with unified success metrics

## Cross-Vendor Checklist

Before adopting AI-driven experimentation tools:

- **Data foundation**: Verify event tracking accuracy; test 5 sample events end-to-end from trigger to dashboard
- **Hypothesis rigor**: Write falsifiable predictions with numeric targets (e.g., "Adding trust badges increases checkout completion by 8%")
- **Guardrail metrics**: Define failure conditions that override wins (e.g., support ticket spike > 15%, page load time > 3s)
- **Targeting maturity**: Start with 100% traffic on low-risk pages; add device/geo segmentation only after validating baseline setup
- **Governance framework**: Document who approves tests, minimum sample size thresholds, and rollback procedures
- **Statistical literacy**: Train stakeholders on p-values, confidence intervals, and why "trending positive" isn't launch-ready

## Internal Links

Explore related resources:
- **PersX Experiment Playbook** — Step-by-step framework for hypothesis generation and test design
- **Personalization Readiness Audit** — Self-assessment for data infrastructure and martech stack maturity

## Automated Schema Plan

The system automatically generates structured data for this page without manual coding:

**Article Schema:**
- \`headline\`: Pulled from H1 page title ("Industry Insights: Experimentation AI Emerging trends")
- \`description\`: Pulled from TL;DR / overall_summary field
- \`author\`: Organization type, name "PersX.ai"
- \`datePublished\`: From published_at timestamp
- \`dateModified\`: From updated_at timestamp
- \`about\`: Array of topics from tags field (personalization, marketing, ai, optimization, strategy)
- \`mentions\`: Vendor names extracted from H3 headings and external_sources (Kameleoon, Quantum Metric, AB Tasty, VWO, Optimizely)

**Breadcrumb Schema:**
- Constructed from site navigation hierarchy: Insights → News → "Industry Insights: Experimentation AI Emerging trends"
- Labels and URLs derived from site information architecture

**Organization Schema:**
- Referenced globally (name: "PersX.ai", url: "https://www.persx.ai")
- Not duplicated on individual pages

**FAQ Schema:**
- Not applicable to this vendor roundup format
- Reserved for how-to guides or Q&A content types

---

**Note:** Schema markup is generated automatically during page render. Do not include schema code in markdown content.`;

async function updateArticle() {
  const slug = 'experimentation-ai-emerging-trends';

  console.log(`📝 Updating article: ${slug}\n`);

  const updates = {
    content: newContent,
    overall_summary: 'Five AI-powered experimentation platforms now automate test design, traffic allocation, and insight generation—reducing setup time while improving statistical rigor.',
    meta_description: 'AI experimentation tools from Kameleoon, Quantum Metric, AB Tasty, VWO, and Optimizely automate testing workflows and accelerate personalization programs.',
    author: 'PersX.ai',
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('knowledge_base_content')
    .update(updates)
    .eq('slug', slug)
    .select();

  if (error) {
    console.error('❌ Error updating article:', error);
    return;
  }

  console.log('✅ Article updated successfully!');
  console.log('\nUpdated fields:');
  console.log('- content (reformatted to editorial guidelines)');
  console.log('- overall_summary (concise TL;DR)');
  console.log('- meta_description (SEO optimized)');
  console.log('- author (set to PersX.ai)');
  console.log('- updated_at (current timestamp)');

  console.log('\n📊 New content structure:');
  console.log('- Highlights by Vendor (5 vendors with What/Why/Try format)');
  console.log('- Cross-Vendor Checklist (6 items)');
  console.log('- Internal Links (2 resources)');
  console.log('- Automated Schema Plan (described)');

  console.log(`\n🌐 View updated article at: https://www.persx.ai/news/${slug}`);
}

updateArticle().catch(console.error);

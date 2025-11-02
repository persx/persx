/**
 * Apply editorial guide formatting to ai-for-experimentation-emerging-trends
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lzpbpymjejwqutfpfwwu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cGJweW1qZWp3cXV0ZnBmd3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjcxOCwiZXhwIjoyMDc3MzA4NzE4fQ.ymG2zCWzwpuCHIbs14ptFWcbnXSaCBG21L35CqK9-tQ';

const supabase = createClient(supabaseUrl, supabaseKey);

// Reformatted content following editorial guide from GitHub
const reformattedContent = `## Highlights by Vendor

### Kameleoon AI Copilot

**Kameleoon AI Copilot** uses natural language processing to generate test hypotheses and automatically flag statistical issues before experiments go live.

**Why it matters:**
- Translates business questions into structured test designs without requiring statistical expertise
- Pre-launch validation catches sample ratio mismatches and underpowered tests that waste traffic

**Try this next:**
1. Identify your top conversion bottleneck (cart abandonment, form drop-off, or landing page bounce)
2. Describe the problem in plain language; let AI Copilot suggest 3 hypothesis-driven test variants

### Quantum Metric Digital Analytics

**Quantum Metric** won the ISG Software AI Innovation Award for combining session replay with AI-powered anomaly detection to surface experimentation opportunities.

**Why it matters:**
- Automatically flags unexpected drops in conversion or spikes in error rates across user segments
- Links behavioral insights directly to experiment tools, reducing time from discovery to test launch

**Try this next:**
1. Set up a 7-day baseline monitor on your highest-revenue user journey
2. Configure alerts for conversion drops >10% or rage click increases >15%; investigate top 3 triggers

### AB Tasty One Platform

**AB Tasty One Platform** unifies client-side, server-side, and edge testing with feature flags and personalization under a single SDK.

**Why it matters:**
- Single integration replaces multiple A/B testing and personalization tools, eliminating vendor sprawl
- Built-in CDP connectors (Segment, mParticle, Tealium) ensure consistent audience targeting across channels

**Try this next:**
1. Audit your current testing stack; list all tools, SDK loads, and monthly costs
2. Run a parallel pilot on your homepage hero: compare setup time between AB Tasty and your legacy tool

### VWO Copilot

**VWO Copilot** generates executive-ready test summaries and automatically surfaces hidden insights like segment-specific performance divergence.

**Why it matters:**
- Condenses weeks of multi-variant data into scannable briefs in seconds, saving hours of manual analysis
- Detects interactions that manual reviews miss (e.g., Variant A wins on mobile but loses on desktop)

**Try this next:**
1. Pull your last 5 experiment reports; time how long manual analysis took vs. AI-generated summaries
2. Enable auto-alerts for tests reaching 95% confidence or detecting significant segment splits

### Optimizely Opal

**Optimizely Opal** orchestrates cross-channel experiments and reallocates traffic to winning variants every 4 hours using Bayesian optimization.

**Why it matters:**
- Eliminates manual traffic adjustments; algorithm maximizes conversions while tests run
- Coordinates experiments across web, mobile, email, and in-app to prevent conflicting experiences

**Try this next:**
1. Map your top 3 customer touchpoints; document any current cross-channel testing conflicts
2. Design one coordinated test (email subject line + landing page hero) with unified success metrics

## Cross-Vendor Checklist

Before launching an AI-driven experimentation program:

- **Data foundation**: Verify event tracking accuracy; test 5 sample events end-to-end from trigger through dashboard
- **Hypothesis quality**: Write falsifiable predictions with numeric targets (e.g., "Removing form fields 4-6 increases completion by 12%")
- **Guardrail metrics**: Define failure conditions that override wins (support tickets >15%, page load >3.5s, cart errors >2%)
- **Targeting maturity**: Start with 100% traffic on low-risk pages; add device/geo segmentation only after validating baseline setup
- **Governance framework**: Document who can launch tests, minimum sample size thresholds, and rollback procedures
- **Statistical literacy**: Train stakeholders on p-values, confidence intervals, and why "trending positive at Day 3" doesn't justify early rollout

## Internal Links

Explore related resources:
- **PersX Experiment Playbook** — Step-by-step framework for hypothesis generation and test design
- **Personalization Readiness Audit** — Self-assessment for data infrastructure and martech stack maturity

## Meta Description

AI-powered experimentation platforms from Kameleoon, Quantum Metric, AB Tasty, VWO, and Optimizely automate test design and accelerate optimization programs.

## Automated Schema Plan

The system automatically generates structured data for this page without manual coding:

**Article Schema:**
- \`headline\`: Pulled from H1 page title
- \`description\`: Pulled from TL;DR / overall_summary field
- \`author\`: Organization type, name "PersX.ai"
- \`datePublished\`: From published_at timestamp
- \`dateModified\`: From updated_at timestamp
- \`about\`: Array of topics from tags field
- \`mentions\`: Vendor names extracted from H3 headings and external_sources

**Breadcrumb Schema:**
- Constructed from site navigation hierarchy: Insights → News → Article Title
- Labels and URLs derived from site information architecture

**Organization Schema:**
- Referenced globally (name: "PersX.ai", url: "https://www.persx.ai")
- Not duplicated on individual pages

**Note:** Schema markup is generated automatically during page render. Do not include schema code in markdown content.`;

const metaDescription = 'AI-powered experimentation platforms from Kameleoon, Quantum Metric, AB Tasty, VWO, and Optimizely automate test design and accelerate optimization programs.';

async function applyEditorialFormat() {
  const slug = 'ai-for-experimentation-emerging-trends';

  console.log('📝 Applying editorial guide format to article...\n');
  console.log('Following structure from: docs/CONTENT_EDITORIAL_GUIDE.md\n');

  const updates = {
    content: reformattedContent,
    meta_description: metaDescription,
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

  console.log('✅ Article reformatted successfully!\n');
  console.log('📊 Applied changes:');
  console.log('─'.repeat(80));
  console.log('✓ Highlights by Vendor (H2)');
  console.log('  ├─ Kameleoon AI Copilot (H3) - What/Why/Try format');
  console.log('  ├─ Quantum Metric Digital Analytics (H3) - What/Why/Try format');
  console.log('  ├─ AB Tasty One Platform (H3) - What/Why/Try format');
  console.log('  ├─ VWO Copilot (H3) - What/Why/Try format');
  console.log('  └─ Optimizely Opal (H3) - What/Why/Try format');
  console.log('✓ Cross-Vendor Checklist (6 items)');
  console.log('✓ Internal Links (2 resources)');
  console.log('✓ Meta Description');
  console.log('✓ Automated Schema Plan');
  console.log('─'.repeat(80));
  console.log('\n📏 Content stats:');
  console.log(`   Words: ~625`);
  console.log(`   Vendors: 5`);
  console.log(`   Actionable steps: 10 (2 per vendor)`);
  console.log(`   Bullets: 10 (2 per vendor)`);
  console.log('\n🌐 View locally at: http://localhost:3000/news/${slug}');
  console.log('🌐 View live at: https://www.persx.ai/news/${slug}');
}

applyEditorialFormat().catch(console.error);

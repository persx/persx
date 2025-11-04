const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lzpbpymjejwqutfpfwwu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cGJweW1qZWp3cXV0ZnBmd3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjcxOCwiZXhwIjoyMDc3MzA4NzE4fQ.ymG2zCWzwpuCHIbs14ptFWcbnXSaCBG21L35CqK9-tQ'
);

const contentBlocks = [
  // Block 1: Callout - A Personal Note
  {
    id: "callout-1",
    type: "callout",
    order: 1,
    data: {
      icon: "ℹ️",
      title: "A Personal Note About This Project",
      content: `<p>PersX.ai is more than a recommendation engine—it's a <em>learning laboratory</em>.</p>

<p>It serves three purposes:</p>

<ul>
<li>Continuously improve AI skills in experience optimization</li>
<li>Provide actionable recommendations from 20+ years expertise</li>
<li>Build a RAG (Retrieval Augmented Generation) system that learns from accumulated knowledge</li>
</ul>

<p><em>Think of it as an evolving brain for experience optimization—constantly learning, adapting, and improving.</em></p>`,
      variant: "info",
      color: "blue"
    }
  },

  // Block 2: Hero - Meet PersX.ai
  {
    id: "hero-1",
    type: "hero",
    order: 2,
    data: {
      title: "Meet PersX.ai",
      subtitle: "Your strategy engine for experience optimization",
      buttons: [
        { text: "Get Your Free Roadmap", href: "/start", variant: "primary" },
        { text: "Speak with an Expert", href: "/contact", variant: "secondary" }
      ],
      alignment: "center"
    }
  },

  // Block 3: Feature Grid - Main value prop
  {
    id: "feature-grid-1",
    type: "feature_grid",
    order: 3,
    data: {
      heading: "PersX.ai isn't another execution platform—it's the intelligence layer that uncovers hidden opportunities",
      features: [
        {
          icon: "🎯",
          title: "Aligns opportunities to personas",
          description: "Maps customer journey friction points to behavioral segments"
        },
        {
          icon: "🧪",
          title: "Proposes measurable tests",
          description: "Generate hypotheses with success criteria and sample-size requirements"
        },
        {
          icon: "🔄",
          title: "Maps integration across channels",
          description: "Coordinate experiences across web, mobile, and email"
        }
      ]
    }
  },

  // Block 4: Trust Cards - Why trust PersX.ai?
  {
    id: "trust-cards-1",
    type: "trust_cards",
    order: 4,
    data: {
      heading: "Why trust PersX.ai?",
      cards: [
        {
          title: "Expertise + AI",
          description: "20+ years across eCommerce, healthcare, financial services, education, B2B/SaaS",
          color: "blue"
        },
        {
          title: "Fast, actionable insights",
          description: "Go from raw data to test‑ready ideas in minutes",
          color: "purple"
        },
        {
          title: "Works with your stack",
          description: "Integrates with Optimizely, Segment, Salesforce, Marketo, Microsoft Dynamics",
          color: "green"
        },
        {
          title: "Industry-specific guidance",
          description: "Tailored personas and experiments by vertical",
          color: "pink"
        }
      ]
    }
  },

  // Block 5: Steps - How it works
  {
    id: "steps-1",
    type: "steps",
    order: 5,
    data: {
      heading: "How it works: a five‑step optimization loop",
      subheading: "",
      steps: [
        {
          title: "Discovery",
          description: "Audit journey, quantify stalls, capture voice-of-customer feedback",
          color: "blue"
        },
        {
          title: "Hypothesis",
          description: "Craft test hypotheses with success criteria and sample-size requirements",
          color: "purple"
        },
        {
          title: "Execution",
          description: "Generate variants, implement A/B/n tests with clean tracking",
          color: "green"
        },
        {
          title: "Review",
          description: "Evaluate AOV, retention, segment fairness to avoid regressions",
          color: "pink"
        },
        {
          title: "Scale",
          description: "Turn wins into reusable patterns; roll out across channels",
          color: "indigo"
        }
      ],
      structuredData: true
    }
  },

  // Block 6: Two Column - Built for Modern Marketing Leaders
  {
    id: "two-column-1",
    type: "two_column",
    order: 6,
    data: {
      leftColumn: {
        type: "text",
        content: `<h2 class="text-3xl font-bold mb-4">Built for Modern Marketing Leaders</h2>
<p class="text-lg text-gray-600 dark:text-gray-400 mb-4">Growth marketers, product teams, and executives who want to:</p>
<ul class="space-y-2 text-gray-600 dark:text-gray-400">
<li>✓ Accelerate personalization without adding tools</li>
<li>✓ Improve conversion rates with data-driven tests</li>
<li>✓ Scale winning strategies across channels</li>
</ul>`
      },
      rightColumn: {
        type: "text",
        content: `<div class="flex flex-col gap-4 justify-center h-full">
<a href="/contact" class="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center text-lg">Schedule a Consultation</a>
<a href="/start" class="px-8 py-4 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-center text-lg">See Your Custom Roadmap</a>
</div>`
      },
      variant: "equal",
      background: "gradient"
    }
  },

  // Block 7: CTA Banner - Final CTA
  {
    id: "cta-1",
    type: "cta_banner",
    order: 7,
    data: {
      heading: "Let's optimize your growth together",
      description: "Our experience optimization experts are ready to help you discover hidden opportunities",
      button: {
        text: "Connect with an Expert",
        href: "/contact"
      },
      gradient: "blue-purple"
    }
  }
];

(async () => {
  console.log('Updating About page to match production...\n');

  const { data, error } = await supabase
    .from('knowledge_base_content')
    .update({ content_blocks: contentBlocks })
    .eq('slug', 'about')
    .select();

  if (error) {
    console.error('❌ Error updating about page:', error);
  } else {
    console.log('✅ About page successfully updated!\n');
    console.log('Updated blocks:');
    contentBlocks.forEach((block, i) => {
      console.log(`  ${i + 1}. ${block.type} - ${block.id}`);
    });
    console.log('\nAll content now matches production! 🎉');
  }
})();

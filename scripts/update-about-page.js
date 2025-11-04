const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  'https://lzpbpymjejwqutfpfwwu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cGJweW1qZWp3cXV0ZnBmd3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjcxOCwiZXhwIjoyMDc3MzA4NzE4fQ.ymG2zCWzwpuCHIbs14ptFWcbnXSaCBG21L35CqK9-tQ'
);

const contentBlocks = [
  {
    id: "callout-1",
    type: "callout",
    order: 1,
    data: {
      icon: "👋",
      title: "A Personal Note About This Project",
      content: "<p>PersX.ai is more than a recommendation engine—it's a learning laboratory where I'm pushing the boundaries of AI-driven personalization and experimentation strategy.</p><p><strong>Three purposes guide this project:</strong></p><ul><li>Improving my AI skills and exploring the possibilities of intelligent systems</li><li>Providing actionable recommendations drawn from 20+ years of experience in optimization, personalization, and martech</li><li>Building a RAG (retrieval-augmented generation) system that gets smarter over time</li></ul><p>Everything I write here feeds the system, making the recommendations more precise and actionable. Think of it as an evolving brain for experience optimization.</p>",
      variant: "warning",
      color: "amber"
    }
  },
  {
    id: "hero-1",
    type: "hero",
    order: 2,
    data: {
      title: "Meet PersX.ai",
      subtitle: "Your strategy engine for experience optimization\n\nPersX.ai is an intelligence layer—not an execution platform—that uncovers opportunities, aligns them to personas, proposes tests, and maps integrations across web, mobile, and email.\n\nBacked by two decades of marketing and martech expertise.",
      buttons: [
        {
          text: "Get Your Free Roadmap",
          href: "/start",
          variant: "primary"
        },
        {
          text: "Speak with an Expert",
          href: "/contact",
          variant: "secondary"
        }
      ],
      alignment: "center"
    }
  },
  {
    id: "feature-grid-1",
    type: "feature_grid",
    order: 3,
    data: {
      heading: "Why Trust PersX.ai?",
      features: [
        {
          icon: "🎯",
          title: "Expertise + AI",
          description: "20+ years across eCommerce, healthcare, financial services, education, B2B/SaaS"
        },
        {
          icon: "⚡",
          title: "Fast insights",
          description: "Minutes from data to test-ready ideas"
        },
        {
          icon: "🔗",
          title: "Stack integration",
          description: "Works with Optimizely, Segment, Salesforce, Marketo, Microsoft Dynamics"
        },
        {
          icon: "📊",
          title: "Industry guidance",
          description: "Tailored personas and experiments by vertical"
        }
      ]
    }
  },
  {
    id: "steps-1",
    type: "steps",
    order: 4,
    data: {
      heading: "Five-Step Optimization Loop",
      subheading: "A proven process for continuous improvement",
      steps: [
        {
          title: "Discovery",
          description: "Audit journeys, identify stalls, gather voice-of-customer feedback",
          color: "blue"
        },
        {
          title: "Hypothesis",
          description: "Craft test hypotheses with success criteria and sample-size rules",
          color: "purple"
        },
        {
          title: "Execution",
          description: "Generate variants, launch A/B/n tests, log changes",
          color: "green"
        },
        {
          title: "Review",
          description: "Evaluate beyond primary metrics (AOV, retention, fairness)",
          color: "pink"
        },
        {
          title: "Scale",
          description: "Turn wins into reusable patterns across channels",
          color: "indigo"
        }
      ],
      structuredData: true
    }
  },
  {
    id: "two-column-1",
    type: "two_column",
    order: 5,
    data: {
      leftColumn: {
        type: "text",
        content: '<h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Built for Modern Marketing Leaders</h2>'
      },
      rightColumn: {
        type: "text",
        content: '<p class="text-lg text-gray-700 dark:text-gray-300">Growth marketers, product teams, and executives seeking clarity and actionable insights without adding more tools to their stack.</p>'
      },
      variant: "equal",
      background: "default"
    }
  },
  {
    id: "cta-1",
    type: "cta_banner",
    order: 6,
    data: {
      heading: "Ready to transform your optimization strategy?",
      description: "Get a personalized roadmap tailored to your industry and goals",
      button: {
        text: "Schedule a Consultation",
        href: "/contact"
      },
      gradient: "blue-purple"
    }
  }
];

(async () => {
  const { data, error } = await supabase
    .from('knowledge_base_content')
    .update({ content_blocks: contentBlocks })
    .eq('slug', 'about')
    .select();

  if (error) {
    console.error('Error updating about page:', error);
  } else {
    console.log('Successfully updated about page!');
    console.log('Blocks added:', contentBlocks.length);
  }
})();

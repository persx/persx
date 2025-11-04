const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lzpbpymjejwqutfpfwwu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6cGJweW1qZWp3cXV0ZnBmd3d1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTczMjcxOCwiZXhwIjoyMDc3MzA4NzE4fQ.ymG2zCWzwpuCHIbs14ptFWcbnXSaCBG21L35CqK9-tQ'
);

const contentBlocks = [
  {
    id: "contact-form-1",
    type: "contact_form",
    order: 1,
    data: {
      heading: "Contact Us",
      subheading: "Ready to transform your personalization strategy?",
      reasons: [
        {
          title: "High-impact opportunities",
          description: "PersX.ai analyzes your behavior data to surface friction points and growth opportunities"
        },
        {
          title: "Persona-driven personalization",
          description: "Segments based on actions rather than demographics for better engagement"
        },
        {
          title: "Actionable experiment roadmaps",
          description: "Delivers 6–12 week test plans with clear hypotheses"
        },
        {
          title: "Cross-channel journey design",
          description: "Creates coordinated experiences across web, mobile, and email"
        },
        {
          title: "Measurable results",
          description: "Defines KPIs and measurement windows upfront"
        }
      ],
      personalization: {
        enabled: true,
        industryVariants: {
          "eCommerce": {
            headline: "Ready to drive more revenue through personalization?",
            reasons: [
              {
                title: "Conversion rate optimization",
                description: "Identify cart abandonment triggers and personalize product recommendations to boost sales"
              },
              {
                title: "Customer lifetime value",
                description: "Build retention strategies with personalized post-purchase journeys"
              },
              {
                title: "Product discovery",
                description: "Test AI-driven merchandising and dynamic category pages"
              },
              {
                title: "Cross-sell & upsell",
                description: "Deliver contextual product bundles based on browsing behavior"
              },
              {
                title: "Mobile commerce",
                description: "Optimize checkout flows and one-tap purchasing for mobile shoppers"
              }
            ]
          },
          "Healthcare": {
            headline: "Ready to improve patient engagement and outcomes?",
            reasons: [
              {
                title: "Patient journey optimization",
                description: "Personalize appointment scheduling and pre-visit communications"
              },
              {
                title: "Medication adherence",
                description: "Test reminder strategies and educational content for better compliance"
              },
              {
                title: "Telehealth engagement",
                description: "Optimize virtual visit booking and follow-up care coordination"
              },
              {
                title: "Health literacy",
                description: "Deliver condition-specific education tailored to patient understanding"
              },
              {
                title: "HIPAA-compliant personalization",
                description: "Secure, privacy-first strategies that respect patient data"
              }
            ]
          },
          "Financial Services": {
            headline: "Ready to build trust and drive financial product adoption?",
            reasons: [
              {
                title: "Product recommendations",
                description: "Match customers with relevant financial products based on life stage and goals"
              },
              {
                title: "Onboarding optimization",
                description: "Reduce drop-off in account opening and identity verification flows"
              },
              {
                title: "Financial literacy",
                description: "Deliver personalized education to build confidence in product usage"
              },
              {
                title: "Cross-sell strategies",
                description: "Test contextual offers for loans, credit cards, and investment products"
              },
              {
                title: "Fraud prevention",
                description: "Balance security with user experience through adaptive authentication"
              }
            ]
          },
          "Education": {
            headline: "Ready to increase enrollment and student success?",
            reasons: [
              {
                title: "Enrollment conversion",
                description: "Personalize program recommendations and application support"
              },
              {
                title: "Student retention",
                description: "Identify at-risk students and deliver targeted support resources"
              },
              {
                title: "Learning pathways",
                description: "Recommend courses and content based on career goals and learning style"
              },
              {
                title: "Engagement strategies",
                description: "Test communication cadences and content formats for different learner personas"
              },
              {
                title: "Alumni relationships",
                description: "Build lifetime engagement through personalized giving and career services"
              }
            ]
          },
          "B2B/SaaS": {
            headline: "Ready to accelerate pipeline and reduce churn?",
            reasons: [
              {
                title: "Lead qualification",
                description: "Score and route leads with behavioral signals and firmographic data"
              },
              {
                title: "Product-led growth",
                description: "Optimize free trial experiences and in-app upgrade prompts"
              },
              {
                title: "Onboarding velocity",
                description: "Personalize time-to-value with role-based walkthroughs and tutorials"
              },
              {
                title: "Expansion revenue",
                description: "Identify upsell opportunities through usage patterns and feature adoption"
              },
              {
                title: "Retention strategies",
                description: "Detect churn risk and deliver proactive support and value reminders"
              }
            ]
          }
        }
      },
      formConfig: {
        nameField: true,
        emailField: true,
        messageField: true,
        submitText: "Send Message",
        successMessage: "Thank you! Your message has been sent successfully.",
        errorMessage: "There was an error sending your message. Please try again."
      }
    }
  }
];

(async () => {
  const { data, error } = await supabase
    .from('knowledge_base_content')
    .update({ content_blocks: contentBlocks })
    .eq('slug', 'contact')
    .select();

  if (error) {
    console.error('Error updating contact page:', error);
  } else {
    console.log('✅ Contact page personalization enabled!');
    console.log('Added industry variants for:');
    console.log('  - eCommerce');
    console.log('  - Healthcare');
    console.log('  - Financial Services');
    console.log('  - Education');
    console.log('  - B2B/SaaS');
  }
})();

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
    console.log('Successfully updated contact page!');
    console.log('Reasons updated with full descriptions');
  }
})();

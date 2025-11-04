-- ============================================
-- INSERT TEST PAGES WITH CONTENT BLOCKS
-- ============================================
-- Run this in Supabase SQL Editor to create test versions of your pages

-- First, ensure the migration is applied
-- (Run the migration from /supabase/migrations/20250205000000_add_content_blocks.sql first)

-- ============================================
-- Homepage (as blocks)
-- ============================================
INSERT INTO knowledge_base_content (
  title,
  slug,
  excerpt,
  content,
  content_type,
  status,
  page_type,
  navigation_group,
  navigation_order,
  show_in_navigation,
  page_template,
  industry,
  tags,
  meta_title,
  meta_description,
  content_blocks
) VALUES (
  'Home (Blocks)',
  'home-blocks',
  'AI Strategist for Personalization & Experimentation - Test page using content blocks',
  '',
  'static_page',
  'published',
  'content',
  NULL,
  0,
  false,
  'default',
  'General',
  ARRAY['static-page', 'blocks', 'test'],
  'PersX.ai - AI Strategist for Personalization & Experimentation',
  'Discover your ideal personas, journeys, and build an actionable roadmap in minutes.',
  '[
    {
      "id": "hero-1",
      "type": "hero",
      "order": 1,
      "data": {
        "title": "AI Strategist for Personalization & Experimentation",
        "subtitle": "Discover your ideal personas, journeys, and build an actionable roadmap in minutes.",
        "buttons": [
          {"text": "Get Started", "href": "/start", "variant": "primary"},
          {"text": "Learn More", "href": "/about", "variant": "secondary"}
        ],
        "alignment": "center"
      }
    },
    {
      "id": "features-1",
      "type": "feature_grid",
      "order": 2,
      "data": {
        "heading": "Why Choose PersX.ai?",
        "features": [
          {
            "icon": "💡",
            "title": "Instant Insight from Experts",
            "description": "Get rapid access to growth strategies distilled by subject‑matter specialists, without wading through endless data."
          },
          {
            "icon": "⚡",
            "title": "Actionable Ideas in Minutes",
            "description": "PersX.ai turns your raw behavior signals into ready‑to‑test experiments so you can act immediately."
          },
          {
            "icon": "🎯",
            "title": "Effortless Opportunity Discovery",
            "description": "With automated persona modeling and journey design, uncover new revenue opportunities and friction points faster than ever."
          }
        ]
      }
    },
    {
      "id": "martech-1",
      "type": "martech_integrations",
      "order": 3,
      "data": {
        "heading": "Works with Any Marketing Technology",
        "subheading": "Maximize the ROI from your marketing technology and uncover hidden insights",
        "integrations": [
          {"name": "Optimizely", "color": "blue-600", "fontSize": "text-3xl"},
          {"name": "Segment", "color": "green-600", "fontSize": "text-3xl"},
          {"name": "Salesforce", "color": "blue-500", "fontSize": "text-3xl"},
          {"name": "Marketo", "color": "purple-600", "fontSize": "text-3xl"},
          {"name": "Microsoft Dynamics", "color": "gray-700", "fontSize": "text-2xl"}
        ],
        "columns": 5
      }
    },
    {
      "id": "cta-1",
      "type": "cta_banner",
      "order": 4,
      "data": {
        "heading": "Ready to Transform Your Business?",
        "description": "Join thousands of companies already using PersX.ai to power their personalization initiatives",
        "button": {"text": "Get Your Free Roadmap", "href": "/start"},
        "gradient": "blue-purple"
      }
    }
  ]'::jsonb
);

-- ============================================
-- About Page (as blocks)
-- ============================================
INSERT INTO knowledge_base_content (
  title,
  slug,
  excerpt,
  content,
  content_type,
  status,
  page_type,
  navigation_group,
  navigation_order,
  show_in_navigation,
  page_template,
  industry,
  tags,
  meta_title,
  meta_description,
  content_blocks
) VALUES (
  'About (Blocks)',
  'about-blocks',
  'Your strategy engine for experience optimization',
  '',
  'static_page',
  'published',
  'company',
  'company',
  1,
  true,
  'default',
  'General',
  ARRAY['static-page', 'blocks', 'test'],
  'About PersX.ai - Strategy Engine for Experience Optimization',
  'Learn about PersX.ai and our five-step optimization loop backed by 20+ years of expertise.',
  '[
    {
      "id": "callout-1",
      "type": "callout",
      "order": 1,
      "data": {
        "icon": "👋",
        "title": "A Personal Note About This Project",
        "content": "<p>PersX.ai is more than a recommendation engine—it''s a learning laboratory where I''m pushing the boundaries of AI-driven personalization and experimentation strategy.</p>",
        "variant": "warning",
        "color": "amber"
      }
    },
    {
      "id": "hero-1",
      "type": "hero",
      "order": 2,
      "data": {
        "title": "Meet PersX.ai",
        "subtitle": "Your strategy engine for experience optimization",
        "buttons": [
          {"text": "Get Your Free Roadmap", "href": "/start", "variant": "primary"},
          {"text": "Speak with an Expert", "href": "/contact", "variant": "secondary"}
        ],
        "alignment": "left"
      }
    },
    {
      "id": "cta-1",
      "type": "cta_banner",
      "order": 3,
      "data": {
        "heading": "Ready to transform your optimization strategy?",
        "description": "Get a personalized roadmap tailored to your industry and goals",
        "button": {"text": "Start Now", "href": "/start"},
        "gradient": "blue-purple"
      }
    }
  ]'::jsonb
);

-- ============================================
-- Contact Page (as blocks)
-- ============================================
INSERT INTO knowledge_base_content (
  title,
  slug,
  excerpt,
  content,
  content_type,
  status,
  page_type,
  navigation_group,
  navigation_order,
  show_in_navigation,
  page_template,
  industry,
  tags,
  meta_title,
  meta_description,
  content_blocks
) VALUES (
  'Contact (Blocks)',
  'contact-blocks',
  'Ready to transform your personalization strategy? Get in touch.',
  '',
  'static_page',
  'published',
  'utility',
  NULL,
  0,
  false,
  'default',
  'General',
  ARRAY['static-page', 'blocks', 'test'],
  'Contact PersX.ai - Get Your Free Roadmap',
  'Contact our experience optimization experts to get a personalized roadmap.',
  '[
    {
      "id": "contact-form-1",
      "type": "contact_form",
      "order": 1,
      "data": {
        "heading": "Contact Us",
        "subheading": "Ready to transform your personalization strategy?",
        "reasons": [
          "Uncover high‑impact opportunities",
          "Persona‑driven personalization",
          "Actionable experiment roadmaps",
          "Cross‑channel journey design",
          "Measurable results"
        ],
        "formConfig": {
          "nameField": true,
          "emailField": true,
          "messageField": true,
          "submitText": "Send Message",
          "successMessage": "Thank you! Your message has been sent successfully.",
          "errorMessage": "There was an error sending your message. Please try again."
        }
      }
    }
  ]'::jsonb
);

-- ============================================
-- Verify the inserts
-- ============================================
SELECT
  id,
  title,
  slug,
  content_type,
  status,
  jsonb_array_length(content_blocks) as block_count
FROM knowledge_base_content
WHERE slug IN ('home-blocks', 'about-blocks', 'contact-blocks')
ORDER BY created_at DESC;

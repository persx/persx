"use client";

import { useState } from "react";
import Link from "next/link";

interface FormData {
  industry: string;
  industryOther: string;
  goals: string[];
  goalOther: string;
  martechStack: string[];
  martechOther: string;
  additionalDetails: string;
  email?: string;
}

export default function StartPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    industry: "",
    industryOther: "",
    goals: [],
    goalOther: "",
    martechStack: [],
    martechOther: "",
    additionalDetails: "",
  });

  const industries = [
    "eCommerce",
    "Healthcare",
    "Financial Services",
    "Education",
    "B2B/SaaS",
    "Other",
  ];

  // Industry-specific goals mapping
  const industryGoals: Record<string, string[]> = {
    "eCommerce": [
      "Purchase conversion rate",
      "Average order value (AOV)",
      "Revenue per visitor (RPV)",
      "Cart‑abandonment rate",
      "Time to Order",
    ],
    "Healthcare": [
      "Appointment bookings",
      "Form submissions / consultation requests",
      "Phone call conversions",
      "Find a doctor engagement",
      "Rate / Review a doctor",
    ],
    "Financial Services": [
      "Lead form conversion rate",
      "Qualified lead rate",
      "Member / Account sign up rate",
      "Customer churn rate",
      "Improve credibility and key differentiators",
    ],
    "Education": [
      "Learn more about degree / career program types",
      "Information‑request form completions",
      "Campus visit registrations",
      "Application completions",
      "Financial aid submissions",
    ],
    "B2B/SaaS": [
      "Qualified leads (MQLs) generated",
      "Demo or trial requests",
      "Demo/trial‑to‑customer conversion",
      "Commerce or membership new purchases",
      "Revenue retention / churn",
      "Customer lifetime value",
    ],
    "Other": [
      "Increase Website Conversion Rate",
      "Decrease Bounce Rate",
      "Improve customer lifetime values",
      "Drive Leads and Enhance Customer Experience",
    ],
  };

  // Get goals for current industry
  const currentGoals = formData.industry ? industryGoals[formData.industry] || [] : [];

  const martechOptions = [
    "Optimizely",
    "Segment",
    "Salesforce",
    "Marketo",
    "Microsoft Dynamics",
    "Other",
  ];

  const handleIndustryChange = (value: string) => {
    setFormData({ ...formData, industry: value, goals: [], goalOther: "" });
    // Store industry in sessionStorage for use on contact page
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('userIndustry', value);
    }
  };

  const handleGoalToggle = (value: string) => {
    const updatedGoals = formData.goals.includes(value)
      ? formData.goals.filter((item) => item !== value)
      : [...formData.goals, value];
    setFormData({ ...formData, goals: updatedGoals });
  };

  const handleMartechToggle = (value: string) => {
    const updatedStack = formData.martechStack.includes(value)
      ? formData.martechStack.filter((item) => item !== value)
      : [...formData.martechStack, value];
    setFormData({ ...formData, martechStack: updatedStack });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.industry && (formData.industry !== "Other" || formData.industryOther);
      case 2:
        return formData.goals.length > 0 && (!formData.goals.includes("Other") || formData.goalOther);
      case 3:
        return formData.martechStack.length > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit form data and show preview
      handleSubmitForm();
      setShowPreview(true);
    }
  };

  const handleSubmitForm = async () => {
    try {
      // Send form data to API
      const response = await fetch("/api/submit-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Form submission failed:", result);
        alert(`Submission failed: ${result.message || "Unknown error"}`);
        return;
      }

      console.log("Form submitted successfully:", result);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Network error: Could not submit form. Please try again.");
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Submit email for full roadmap
      await fetch("/api/submit-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, requestFullRoadmap: true }),
      });
      alert("Thank you! We'll send your full 90-day roadmap to your email shortly.");
      setShowEmailCapture(false);
    } catch (error) {
      console.error("Error submitting email:", error);
    }
  };

  // Industry-specific personas
  const industryPersonas: Record<string, Array<{ name: string; description: string; color: string }>> = {
    "eCommerce": [
      {
        name: "Deal-Seeker Dad",
        description: "A budget-conscious shopper who scours the site for sales and coupon codes. He compares prices across retailers, looks for free shipping, and responds well to personalized discounts or loyalty offers that make him feel he's getting the best value.",
        color: "blue"
      },
      {
        name: "Brand-Loyal Fashionista",
        description: "A repeat customer who regularly buys from specific labels. She follows brands on social media, engages with new-arrival emails and expects a seamless mobile experience. Personalized product recommendations and early access to launches help her stay loyal.",
        color: "purple"
      },
      {
        name: "Impulse Mobile Buyer",
        description: "An on-the-go shopper who makes quick purchases from her phone. She values speed and convenience over deep research, often buying based on social proof, user reviews or 'trending now' sections. Optimized checkout and one-click payment options reduce friction.",
        color: "pink"
      }
    ],
    "Healthcare": [
      {
        name: "New Patient Researcher",
        description: "A prospective patient comparing providers. He reads educational content, checks clinician bios and reviews, and wants easy access to appointment booking. Transparency and trust-building content influence his decision.",
        color: "blue"
      },
      {
        name: "Chronic-Care Manager",
        description: "A returning patient managing a long-term condition. She tracks appointments, lab results and follow-up care through the portal. Helpful reminders and personalized health content improve her adherence and satisfaction.",
        color: "purple"
      },
      {
        name: "Caregiver Coordinator",
        description: "A family member booking appointments or requesting information for an elderly relative. He values clear navigation, phone and chat support, and wants to minimize time spent on forms. Clear instructions and flexible scheduling options are key.",
        color: "pink"
      }
    ],
    "Financial Services": [
      {
        name: "First-Time Investor",
        description: "A young professional exploring investment products. He seeks educational resources, calculators and comparative tools to understand risk and return. Personalized guidance and easy account setup increase his confidence.",
        color: "blue"
      },
      {
        name: "Credit Optimizer",
        description: "An individual looking to consolidate debt or improve her credit score. She compares loan products and rates, reads blogs on financial health and wants a quick pre-qualification process. Secure handling of personal data and transparency about fees are critical.",
        color: "purple"
      },
      {
        name: "Wealth Manager",
        description: "A high net-worth client seeking tailored investment and estate planning advice. He values one-on-one consultations, detailed performance reporting and seamless integration with existing financial tools. Personalized outreach and a white-glove experience build loyalty.",
        color: "pink"
      }
    ],
    "Education": [
      {
        name: "Prospective Undergraduate",
        description: "A high-school senior researching programs and campus life. She attends virtual tours, downloads brochures and follows university social media. Timely follow-up on inquiries and clear financial aid information influence her application decision.",
        color: "blue"
      },
      {
        name: "Career-Changer Adult Learner",
        description: "A working professional considering a return to school for upskilling. He values flexible scheduling, online course options and clear ROI. Targeted content about career outcomes and simplified application processes resonate.",
        color: "purple"
      },
      {
        name: "International Applicant",
        description: "A student from abroad navigating admissions requirements and visa processes. She needs localized information, multilingual support and reassurance about housing and student services. Responsive communication helps build trust.",
        color: "pink"
      }
    ],
    "B2B/SaaS": [
      {
        name: "Technical Evaluator",
        description: "An IT or developer lead assessing product fit and integration complexity. He reviews documentation, trials APIs and attends webinars. Access to technical resources and responsive support accelerate his buy-in.",
        color: "blue"
      },
      {
        name: "Business Champion",
        description: "A mid-level manager who identifies the need and champions adoption internally. She seeks case studies and ROI calculators to build a business case. Tailored demos and proof-of-concept offers help her secure stakeholder approval.",
        color: "purple"
      },
      {
        name: "Executive Sponsor",
        description: "A C-suite or VP-level decision maker focused on strategic outcomes. He is less concerned with features and more with cost savings, scalability and vendor reliability. High-level dashboards and clear value propositions influence his signing authority.",
        color: "pink"
      }
    ]
  };

  // Default personas for "Other" industry
  const defaultPersonas = [
    {
      name: "The Decision Maker",
      description: "Senior executive focused on ROI and strategic outcomes",
      color: "blue"
    },
    {
      name: "The Practitioner",
      description: "Hands-on user seeking efficiency and ease of use",
      color: "purple"
    },
    {
      name: "The Researcher",
      description: "Information gatherer comparing multiple solutions",
      color: "pink"
    }
  ];

  const personas = industryPersonas[formData.industry] || defaultPersonas;

  // Generate goal-specific test ideas
  const getGoalSpecificTestIdeas = (): string[] => {
    const testIdeas: string[] = [];

    // Test ideas mapped by industry and goal
    const testMappings: Record<string, Record<string, string[]>> = {
      "eCommerce": {
        "Purchase conversion rate": [
          "A/B test dynamic trust badges (security seals, money-back guarantees) on product pages to reduce purchase anxiety and increase conversions",
          "Test personalized urgency messaging ('Only 3 left in stock for customers in your area') based on inventory levels and browsing behavior",
          "Implement one-click checkout for returning customers using Segment identity resolution to reduce friction at final purchase step"
        ],
        "Average order value (AOV)": [
          "Test AI-powered 'Complete the Look' product bundles on cart page, showing complementary items that increase basket size by 15-25%",
          "A/B test progressive discount tiers ('Spend $25 more to save 10%') prominently displayed in cart to incentivize larger purchases",
          "Personalize free shipping thresholds by customer segment—show loyal customers a lower threshold to encourage immediate purchase"
        ],
        "Revenue per visitor (RPV)": [
          "Test dynamic homepage hero that showcases highest-margin products to first-time visitors vs. personalized recommendations for returning customers",
          "Implement cross-sell recommendations in checkout using purchase history data to increase per-transaction value by 18-30%",
          "A/B test category landing pages with curated 'Best Sellers' vs. 'New Arrivals' to drive visitors toward higher-value product discovery"
        ],
        "Cart‑abandonment rate": [
          "Test exit-intent popup offering limited-time discount code (10% off) to cart abandoners before they leave the site",
          "Implement email recovery sequence via Marketo/Salesforce that sends personalized cart reminder within 1 hour, then offer incentive at 24 hours",
          "A/B test simplified checkout flow: reduce form fields from 12 to 6, add guest checkout option, and test impact on abandonment rates"
        ],
        "Time to Order": [
          "Test persistent mini-cart widget in corner that shows item count and subtotal, allowing customers to checkout from any page without navigating",
          "Implement predictive search with instant product previews and 'Quick Add to Cart' buttons directly in search dropdown to accelerate purchase path",
          "A/B test mobile-first checkout with auto-fill for shipping/billing, Apple Pay/Google Pay integration to reduce time from cart to confirmation"
        ]
      },
      "Healthcare": {
        "Appointment bookings": [
          "A/B test real-time appointment availability calendar on provider bio pages vs. 'Request Appointment' form—measure which drives more completed bookings",
          "Test personalized appointment reminders via SMS and email (via Marketo) sent 48 hours before, reducing no-shows and opening rebooking opportunities",
          "Implement dynamic 'Next Available' messaging that shows earliest appointment slots above the fold on Find a Doctor results"
        ],
        "Form submissions / consultation requests": [
          "Test progressive form design: show only 3 required fields initially, then conditionally reveal additional questions to reduce form abandonment by 25-40%",
          "A/B test trust-building elements above consultation form—patient testimonials, provider credentials, privacy assurances—to increase submission confidence",
          "Implement smart form validation using real-time feedback (green checkmarks, inline error correction) to guide users toward successful completion"
        ],
        "Phone call conversions": [
          "Test prominent click-to-call buttons (mobile-optimized) on service pages with A/B test of different CTA copy: 'Call Now' vs. 'Speak to a Care Coordinator'",
          "Implement dynamic phone number insertion via Segment that displays local/regional numbers to increase trust and call likelihood",
          "A/B test callback request widget that appears after 30 seconds of browsing: 'Prefer we call you? Leave your number' to capture phone-averse users"
        ],
        "Find a doctor engagement": [
          "Test enhanced provider profiles with video introductions, patient reviews, and 'Why I Chose Medicine' stories to increase profile engagement by 35-50%",
          "Implement smart filters that remember user preferences (insurance, location, specialty) across sessions using Segment to streamline repeat searches",
          "A/B test provider listing layouts: grid view with photos vs. list view with detailed credentials—measure which drives more profile clicks"
        ],
        "Rate / Review a doctor": [
          "Test post-appointment email campaign (via Marketo) with one-click review links sent 3 days after visit—timing optimized to capture satisfied patients",
          "Implement in-portal review prompts after patients view test results or complete follow-up tasks, capitalizing on positive care moments",
          "A/B test review incentives: entry into monthly prize drawing vs. altruistic messaging ('Help other patients') to increase review submission rates"
        ]
      },
      "Financial Services": {
        "Lead form conversion rate": [
          "A/B test micro-commitments: start with email-only capture, then progressively request phone and financial details to increase initial form completions",
          "Test social proof above lead forms—'Join 50,000+ customers who saved an average of $1,200'—with rotating testimonials to build credibility",
          "Implement multi-step form with progress indicator: break 15-field application into 3 steps (Contact Info → Financial Profile → Submit) to reduce abandonment"
        ],
        "Qualified lead rate": [
          "Test lead scoring qualification questions embedded in form: 'What's your credit score range?' to pre-qualify leads before sales outreach",
          "Implement real-time eligibility indicators—'Based on your profile, you pre-qualify for our Premium Card'—to set expectations and improve lead quality",
          "A/B test gated vs. ungated calculators: require email before showing personalized loan estimates to ensure lead capture while providing value"
        ],
        "Member / Account sign up rate": [
          "Test expedited account creation with social login (Google/LinkedIn OAuth) vs. traditional email/password signup to reduce signup friction by 40%",
          "Implement dynamic benefit showcases during signup flow: 'As a new member, you'll get...' with personalized perks based on account type selection",
          "A/B test identity verification methods: instant online verification via Plaid vs. document upload to balance security with signup completion rates"
        ],
        "Customer churn rate": [
          "Test proactive retention offers triggered by Segment behavioral signals (reduced login frequency, decreased transaction volume) with personalized win-back campaigns",
          "Implement in-app satisfaction surveys after key interactions (loan approval, account changes) to identify at-risk customers before they churn",
          "A/B test re-engagement email series (via Salesforce) with educational content, product updates, and exclusive offers to dormant account holders"
        ],
        "Improve credibility and key differentiators": [
          "Test trust badge placement: security certifications (FDIC, SSL) in header vs. footer vs. near CTAs to determine optimal credibility signaling",
          "Implement comparison tables on product pages: 'How We Stack Up' showing rates, fees, and benefits vs. competitors to highlight differentiation",
          "A/B test founder/leadership messaging on About page: personal story + credentials vs. company milestones to build emotional connection and trust"
        ]
      },
      "Education": {
        "Learn more about degree / career program types": [
          "Test interactive program explorers: 'Find Your Program' quiz that recommends degrees based on career goals, learning style, and schedule preferences",
          "Implement rich program pages with video walkthroughs, curriculum samples, and career outcome data (avg. salary, employment rate) to inform decision-making",
          "A/B test program comparison tools: allow prospective students to compare 2-3 programs side-by-side on cost, duration, and outcomes"
        ],
        "Information‑request form completions": [
          "Test value proposition above inquiry forms: 'Get a Free Program Guide + Scholarship Info' vs. 'Speak with an Enrollment Advisor' to increase perceived value",
          "Implement conditional form logic: if user selects 'Online Programs', show online-specific questions to create personalized follow-up opportunities",
          "A/B test mobile-optimized forms with reduced fields (Name, Email, Program Interest only) vs. comprehensive forms to maximize mobile completions"
        ],
        "Campus visit registrations": [
          "Test virtual tour embeds on homepage + program pages with inline 'Schedule In-Person Visit' CTAs to create seamless visit-booking journey",
          "Implement personalized visit invitations via Marketo triggered by engagement milestones (viewed 5+ pages, downloaded brochure) with available dates",
          "A/B test visit registration incentives: 'Tour Campus + Get Free Lunch' vs. 'Meet Current Students' to determine which value prop drives more signups"
        ],
        "Application completions": [
          "Test saved application progress: auto-save every field and send email reminders to incomplete applicants with direct resume links to reduce dropout",
          "Implement application support chat: proactive live chat or AI assistant offering help when user pauses on application for 60+ seconds",
          "A/B test application fee waivers for qualified prospects: test messaging timing (upfront vs. after fee screen) and eligibility criteria to boost completions"
        ],
        "Financial aid submissions": [
          "Test simplified FAFSA guidance: step-by-step video walkthrough + FAQ accordion on financial aid page to demystify process and increase submissions",
          "Implement net price calculator with instant scholarship estimates: 'Students like you typically receive $X in aid' to make cost more tangible",
          "A/B test financial aid deadline messaging: countdown timers vs. deadline dates vs. 'Apply Early for Maximum Aid' urgency copy to drive timely submissions"
        ]
      },
      "B2B/SaaS": {
        "Qualified leads (MQLs) generated": [
          "Test gated vs. ungated content: require form completion for whitepapers/case studies vs. open access with strategically placed CTAs to optimize lead volume and quality",
          "Implement progressive profiling: ask for company size and use case on first download, then job title and budget on second interaction to build lead profiles over time",
          "A/B test lead magnet offers: 'Get Free ROI Calculator' vs. 'Download Industry Benchmark Report' to determine which generates higher-quality MQLs"
        ],
        "Demo or trial requests": [
          "Test interactive product demos: self-guided interactive walkthrough vs. 'Book Live Demo with Expert' to offer multiple paths based on buyer readiness",
          "Implement smart demo scheduling: integrate Calendly with Segment to pre-populate attendee info and show available times based on user timezone",
          "A/B test trial signup friction: no-credit-card trial with email-only signup vs. credit-card-required trial to balance acquisition volume with qualification"
        ],
        "Demo/trial‑to‑customer conversion": [
          "Test personalized trial onboarding emails via Marketo: Day 1 welcome + setup guide, Day 3 feature spotlight, Day 7 success story, Day 12 conversion offer",
          "Implement in-app engagement tracking via Segment: trigger sales outreach when trial users hit key activation milestones (invited team, completed setup, ran first report)",
          "A/B test trial-to-paid conversion incentives: '20% off first year' vs. 'Free onboarding consultation' vs. 'Extended trial' to find optimal conversion driver"
        ],
        "Commerce or membership new purchases": [
          "Test pricing page layouts: feature comparison table vs. value-based messaging vs. annual-vs-monthly toggle to clarify plan differences and drive purchase decisions",
          "Implement real-time pricing: show volume discounts or team pricing dynamically based on company size data from Segment/Salesforce enrichment",
          "A/B test checkout optimizations: single-page checkout vs. multi-step with upsells (add users, add features) to maximize initial contract value"
        ],
        "Revenue retention / churn": [
          "Test proactive customer success outreach: Salesforce-triggered check-ins when usage drops 30% to address issues before cancellation consideration",
          "Implement in-app health scoring: monitor feature adoption, login frequency, and support tickets to identify at-risk accounts for retention campaigns",
          "A/B test win-back offers for churned customers: 'Come back with 3 months free' vs. 'See what's new since you left' re-engagement messaging via email"
        ],
        "Customer lifetime value": [
          "Test upsell messaging in-app: show ROI of premium features to customers at 80%+ usage on current plan to drive timely upgrade conversations",
          "Implement cross-sell campaigns via Marketo: recommend complementary products based on current usage patterns and industry benchmarks",
          "A/B test customer advocacy programs: 'Refer a colleague and get 1 month free' vs. case study participation incentives to increase LTV through referrals"
        ]
      }
    };

    // Get test ideas for selected industry and goals
    const industryTests = testMappings[formData.industry] || {};

    // Collect test ideas based on selected goals
    formData.goals.forEach(goal => {
      if (goal !== "Other" && industryTests[goal]) {
        // Add a subset of tests for each goal (to avoid too many test ideas)
        const goalsTests = industryTests[goal];
        testIdeas.push(...goalsTests.slice(0, 2)); // Take first 2 tests per goal
      }
    });

    // If we have more than 6, take the first 6
    // If we have fewer than 6, add some generic but still industry-relevant tests
    if (testIdeas.length < 6) {
      const fallbackTests: Record<string, string[]> = {
        "eCommerce": [
          "Test personalized email campaigns using browsing behavior data from Segment to drive repeat purchases",
          "Implement A/B testing on product page layouts via Optimizely to find optimal image-to-description ratio for conversions"
        ],
        "Healthcare": [
          "Test patient portal engagement: personalized health content recommendations based on conditions and visit history",
          "Implement accessibility improvements (WCAG 2.1 AA compliance) on forms and booking flows to expand patient reach"
        ],
        "Financial Services": [
          "Test educational content journey: multi-touch email series via Salesforce educating prospects from awareness to application",
          "Implement dynamic rate displays that update in real-time based on market conditions to build urgency"
        ],
        "Education": [
          "Test alumni success stories: showcase career outcomes and testimonials prominently on program pages to build program credibility",
          "Implement chatbot for admissions questions: AI-powered assistant answering common queries to support inquiry-to-application conversion"
        ],
        "B2B/SaaS": [
          "Test social proof strategies: customer logos, case study snippets, and G2 ratings on homepage to build trust with enterprise visitors",
          "Implement product-led growth: offer freemium tier or free tools to generate bottom-up adoption and expand market reach"
        ]
      };

      const fallback = fallbackTests[formData.industry] || [];
      testIdeas.push(...fallback);
    }

    // Return exactly 6 test ideas
    return testIdeas.slice(0, 6);
  };

  const testIdeas = getGoalSpecificTestIdeas();

  // Generate industry-specific customer journey
  const getCustomerJourney = () => {
    const journeyMappings: Record<string, Array<{ stage: string; description: string; touchpoints: string; optimization: string }>> = {
      "eCommerce": [
        {
          stage: "Awareness",
          description: "Shoppers discover your store through ads, social media, search engines, or referrals",
          touchpoints: "Google Ads, Facebook/Instagram ads, influencer partnerships, SEO content, email campaigns via Marketo",
          optimization: "Test personalized ad creative by audience segment, optimize landing page headlines for traffic sources using Optimizely"
        },
        {
          stage: "Consideration",
          description: "Visitors browse products, compare options, read reviews, and add items to cart",
          touchpoints: "Product pages, search & filter tools, reviews/ratings, comparison features, personalized recommendations via Segment",
          optimization: "Implement dynamic product recommendations based on browsing behavior, test urgency messaging (low stock alerts), optimize product imagery"
        },
        {
          stage: "Decision",
          description: "Customers proceed to checkout, enter payment details, and complete purchase",
          touchpoints: "Shopping cart, checkout flow, payment gateway, order confirmation, cart abandonment emails via Salesforce/Marketo",
          optimization: "Test streamlined checkout (guest vs. account required), add trust badges at payment step, implement exit-intent offers for cart abandoners"
        },
        {
          stage: "Retention",
          description: "Post-purchase engagement to drive repeat purchases, reviews, and referrals",
          touchpoints: "Order tracking emails, product review requests, loyalty programs, replenishment reminders, win-back campaigns via Marketo",
          optimization: "Test personalized product recommendations in post-purchase emails, implement loyalty point system, optimize review request timing"
        }
      ],
      "Healthcare": [
        {
          stage: "Awareness",
          description: "Prospective patients discover your healthcare organization through search, referrals, or community outreach",
          touchpoints: "Google search results, physician referrals, health insurance directories, local advertising, educational blog content",
          optimization: "Test SEO content around common conditions, optimize 'Find a Doctor' visibility, implement local search optimization for geographic reach"
        },
        {
          stage: "Consideration",
          description: "Patients research providers, read reviews, compare services, and evaluate appointment availability",
          touchpoints: "Provider bio pages, patient reviews, service line descriptions, online scheduling tools, live chat via Salesforce",
          optimization: "Test enhanced provider profiles with video introductions, implement smart appointment availability displays, optimize form design for consultation requests"
        },
        {
          stage: "Decision",
          description: "Patients book appointments, complete intake forms, and prepare for their first visit",
          touchpoints: "Online appointment booking, patient portal registration, pre-visit forms, appointment confirmations via Marketo",
          optimization: "Test real-time appointment booking vs. request forms, streamline intake paperwork, send automated appointment prep instructions"
        },
        {
          stage: "Retention",
          description: "Ongoing patient engagement through follow-up care, portal usage, and health maintenance",
          touchpoints: "Patient portal for test results, appointment reminders, care plan follow-ups, health education content via Segment",
          optimization: "Test personalized health content recommendations, implement proactive appointment reminder sequences, optimize portal engagement features"
        }
      ],
      "Financial Services": [
        {
          stage: "Awareness",
          description: "Prospects discover your financial products through advertising, search, or word-of-mouth",
          touchpoints: "Search ads, content marketing, financial comparison sites, calculator tools, educational webinars",
          optimization: "Test value prop messaging in ads ('Save $X on average'), optimize landing page trust signals, implement targeted content by financial need"
        },
        {
          stage: "Consideration",
          description: "Prospects compare rates, use calculators, read reviews, and assess credibility",
          touchpoints: "Product comparison pages, rate calculators, customer testimonials, security/compliance badges, FAQ content via Marketo",
          optimization: "Test transparent rate displays vs. personalized quotes, implement comparison tables highlighting differentiators, optimize trust badge placement"
        },
        {
          stage: "Decision",
          description: "Qualified leads complete applications, undergo verification, and sign agreements",
          touchpoints: "Application forms, identity verification, credit checks, e-signature tools, application status updates via Salesforce",
          optimization: "Test progressive form design to reduce abandonment, implement real-time eligibility feedback, streamline identity verification process"
        },
        {
          stage: "Retention",
          description: "Customer engagement through account management, cross-sell opportunities, and satisfaction monitoring",
          touchpoints: "Account dashboard, product recommendations, financial education, customer support, quarterly reviews via Microsoft Dynamics",
          optimization: "Test proactive cross-sell messaging based on life events tracked in Segment, implement satisfaction surveys, optimize account management touchpoints"
        }
      ],
      "Education": [
        {
          stage: "Awareness",
          description: "Prospective students discover your institution through search, social media, or college fairs",
          touchpoints: "Google search, social media presence, virtual college fairs, high school partnerships, targeted ads",
          optimization: "Test program-specific landing pages for paid search, optimize virtual tour visibility, implement remarketing for site visitors"
        },
        {
          stage: "Consideration",
          description: "Prospects explore programs, attend virtual tours, request information, and evaluate fit",
          touchpoints: "Program pages, virtual tours, inquiry forms, webinars, chatbot for admissions questions, email nurture via Marketo",
          optimization: "Test interactive program finders, implement personalized email sequences based on program interest tracked in Segment, optimize campus visit registration"
        },
        {
          stage: "Decision",
          description: "Students complete applications, submit financial aid forms, and make enrollment decisions",
          touchpoints: "Application portal, FAFSA/financial aid forms, acceptance letters, enrollment deposits, admissions counselor outreach via Salesforce",
          optimization: "Test saved application progress features, implement application support chat, optimize financial aid calculator visibility and timing"
        },
        {
          stage: "Retention",
          description: "Student success through ongoing engagement, support services, and alumni relations",
          touchpoints: "Student portal, academic advising, career services, student success programs, alumni network communications",
          optimization: "Test personalized academic resource recommendations, implement early-warning systems for at-risk students, optimize graduation pathway communications"
        }
      ],
      "B2B/SaaS": [
        {
          stage: "Awareness",
          description: "Prospects discover your solution through content marketing, search, or industry events",
          touchpoints: "Blog content, SEO, LinkedIn ads, webinars, industry conferences, partner referrals",
          optimization: "Test gated vs. ungated content for lead gen, optimize bottom-of-funnel content for high-intent keywords, implement ABM campaigns via Marketo"
        },
        {
          stage: "Consideration",
          description: "Prospects evaluate features, consume content, and compare against competitors",
          touchpoints: "Product pages, case studies, ROI calculators, comparison pages, demo videos, email nurture via Salesforce",
          optimization: "Test interactive product demos vs. video walkthroughs, implement progressive profiling to build lead intelligence in Segment, optimize case study layout"
        },
        {
          stage: "Decision",
          description: "Qualified leads request demos, start trials, and undergo procurement evaluation",
          touchpoints: "Demo calls, free trial signup, product documentation, pricing discussions, sales engagement via Microsoft Dynamics",
          optimization: "Test no-credit-card trials, implement in-trial engagement tracking via Segment to trigger sales outreach, optimize trial onboarding sequences"
        },
        {
          stage: "Retention",
          description: "Customer success through adoption, expansion, and advocacy development",
          touchpoints: "Onboarding programs, customer success check-ins, feature adoption tracking, upsell opportunities, referral programs",
          optimization: "Test proactive CSM outreach based on usage data from Segment, implement health scoring for churn prediction, optimize expansion campaign timing"
        }
      ]
    };

    const defaultJourney = [
      {
        stage: "Awareness",
        description: "Prospects discover your brand through marketing channels and word-of-mouth",
        touchpoints: "Digital advertising, content marketing, social media, search engines, referrals",
        optimization: "Test messaging variations, optimize landing pages for conversion, implement retargeting campaigns"
      },
      {
        stage: "Consideration",
        description: "Prospects evaluate your offerings and compare against alternatives",
        touchpoints: "Website content, product/service pages, testimonials, comparison tools, email communications",
        optimization: "Test social proof placement, implement personalized content recommendations, optimize navigation flows"
      },
      {
        stage: "Decision",
        description: "Qualified leads take action to become customers",
        touchpoints: "Forms, checkout/signup processes, sales conversations, contracts/agreements",
        optimization: "Test form design and length, implement trust signals, streamline conversion process"
      },
      {
        stage: "Retention",
        description: "Ongoing engagement to maximize customer lifetime value",
        touchpoints: "Email communications, customer portal, support channels, loyalty programs, renewal processes",
        optimization: "Test re-engagement campaigns, implement personalized recommendations, optimize satisfaction touchpoints"
      }
    ];

    return journeyMappings[formData.industry] || defaultJourney;
  };

  const customerJourney = getCustomerJourney();

  if (showPreview) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Personalized Experience Optimization Preview
          </h1>

          {/* Sample Output */}
          <div className="space-y-8 mb-12">
            {/* Personas */}
            <section className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                Ideal Customer Personas for {formData.industry}
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {personas.map((persona, idx) => {
                  const colorClasses = {
                    blue: "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800",
                    purple: "bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800",
                    pink: "bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800"
                  };
                  return (
                    <div key={idx} className={`p-4 rounded-lg ${colorClasses[persona.color as keyof typeof colorClasses]}`}>
                      <h3 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">{persona.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {persona.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* 4-Stage Journey */}
            <section className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                4-Stage Customer Journey for {formData.industry}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Industry-specific touchpoints and optimization strategies mapped to your martech stack
              </p>
              <div className="space-y-4">
                {customerJourney.map((journey, idx) => (
                  <div key={journey.stage} className="p-5 rounded-lg bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold text-lg">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">{journey.stage}</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                          {journey.description}
                        </p>
                        <div className="space-y-2">
                          <div className="text-xs">
                            <span className="font-semibold text-blue-700 dark:text-blue-400">Key Touchpoints: </span>
                            <span className="text-gray-600 dark:text-gray-400">{journey.touchpoints}</span>
                          </div>
                          <div className="text-xs">
                            <span className="font-semibold text-purple-700 dark:text-purple-400">Optimization Ideas: </span>
                            <span className="text-gray-600 dark:text-gray-400">{journey.optimization}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6 Test Ideas */}
            <section className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                6 High-Impact Test Ideas for Your Goals
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Tailored recommendations based on your {formData.industry} industry and selected goals
              </p>
              <div className="space-y-3">
                {testIdeas.map((test, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-100 dark:border-blue-900">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{test}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Email Capture CTA */}
          {!showEmailCapture && (
            <div className="text-center mb-8">
              <button
                onClick={() => setShowEmailCapture(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-bold text-lg hover:shadow-lg transition-shadow"
              >
                Get the Full 90-Day Roadmap
              </button>
            </div>
          )}

          {/* Email Capture Form */}
          {showEmailCapture && (
            <div className="mb-8 p-6 rounded-lg border-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20">
              <h3 className="text-xl font-bold mb-4 text-center">
                Enter Your Email to Receive Your Complete Roadmap
              </h3>
              <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="your.email@company.com"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Send Roadmap
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Consultation CTA */}
          <div className="p-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Take the Next Step?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Schedule a free consultation with a personalization and experimentation expert
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Schedule Free Consultation
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Build Your Custom Roadmap
          </h1>
          <span className="px-3 py-1 text-sm font-bold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
            BETA
          </span>
        </div>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Answer a few questions to get your personalized 90-day experience optimization roadmap
        </p>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full mx-1 ${
                  step <= currentStep ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Step {currentStep} of 4
          </p>
        </div>

        {/* Form Steps */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-lg border border-gray-200 dark:border-gray-800">
          {/* Step 1: Industry */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">What's your industry?</h2>
              <div className="space-y-3">
                {industries.map((industry) => (
                  <div key={industry}>
                    <label className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <input
                        type="radio"
                        name="industry"
                        value={industry}
                        checked={formData.industry === industry}
                        onChange={(e) => handleIndustryChange(e.target.value)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-3 font-medium">{industry}</span>
                    </label>
                    {industry === "Other" && formData.industry === "Other" && (
                      <input
                        type="text"
                        placeholder="Please specify your industry"
                        value={formData.industryOther}
                        onChange={(e) => setFormData({ ...formData, industryOther: e.target.value })}
                        className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Goals */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {formData.industry === "Other"
                  ? "What are your primary goals?"
                  : `What are your primary goals for ${formData.industry}?`}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Select all that apply</p>
              <div className="space-y-3">
                {currentGoals.map((goal) => (
                  <label
                    key={goal}
                    className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.goals.includes(goal)}
                      onChange={() => handleGoalToggle(goal)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 font-medium">{goal}</span>
                  </label>
                ))}

                {/* Other option */}
                <div>
                  <label className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.goals.includes("Other")}
                      onChange={() => handleGoalToggle("Other")}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3 font-medium">Other</span>
                  </label>
                  {formData.goals.includes("Other") && (
                    <input
                      type="text"
                      placeholder="Please specify your goal"
                      value={formData.goalOther}
                      onChange={(e) => setFormData({ ...formData, goalOther: e.target.value })}
                      className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Martech Stack */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">What tools are in your martech stack?</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Select all that apply</p>
              <div className="space-y-3">
                {martechOptions.map((tech) => (
                  <div key={tech}>
                    <label className="flex items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.martechStack.includes(tech)}
                        onChange={() => handleMartechToggle(tech)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-3 font-medium">{tech}</span>
                    </label>
                    {tech === "Other" && formData.martechStack.includes("Other") && (
                      <input
                        type="text"
                        placeholder="Please specify other tools"
                        value={formData.martechOther}
                        onChange={(e) => setFormData({ ...formData, martechOther: e.target.value })}
                        className="mt-2 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Additional Details */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Additional Information</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                What other details would you like to provide to make this roadmap more valuable and
                actionable for your business goals?
              </p>
              <textarea
                value={formData.additionalDetails}
                onChange={(e) => setFormData({ ...formData, additionalDetails: e.target.value })}
                rows={6}
                placeholder="Share any specific challenges, goals, or context about your business..."
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentStep === 4 ? "See Your Sample Output" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

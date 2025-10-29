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
                4-Stage Customer Journey
              </h2>
              <div className="space-y-4">
                {["Awareness", "Consideration", "Decision", "Retention"].map((stage, idx) => (
                  <div key={stage} className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{stage}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Key touchpoints and optimization opportunities at the {stage.toLowerCase()} stage
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6 Test Ideas */}
            <section className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                6 High-Impact Test Ideas
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  "Personalized hero messaging by industry",
                  "Dynamic social proof based on company size",
                  "Optimized CTA button copy for different personas",
                  "Customized navigation for returning visitors",
                  "AI-powered product recommendations",
                  "Progressive form optimization",
                ].map((test, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold">
                        {idx + 1}
                      </div>
                      <p className="text-sm font-medium">{test}</p>
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

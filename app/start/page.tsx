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
                Ideal Customer Personas
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <h3 className="font-semibold mb-2">Persona 1: The Decision Maker</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Senior executive focused on ROI and strategic outcomes
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <h3 className="font-semibold mb-2">Persona 2: The Practitioner</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Hands-on user seeking efficiency and ease of use
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-pink-50 dark:bg-pink-900/20">
                  <h3 className="font-semibold mb-2">Persona 3: The Researcher</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Information gatherer comparing multiple solutions
                  </p>
                </div>
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
        <h1 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Build Your Custom Roadmap
        </h1>
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

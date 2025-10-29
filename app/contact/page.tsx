"use client";

import { useEffect, useState, FormEvent } from "react";

export default function Contact() {
  const [userIndustry, setUserIndustry] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    // Get stored industry from sessionStorage
    if (typeof window !== 'undefined') {
      const storedIndustry = sessionStorage.getItem('userIndustry') || "";
      setUserIndustry(storedIndustry);
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
      industry: userIndustry || "Not specified",
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Industry-specific headline
  const getHeadline = () => {
    const headlinesByIndustry: Record<string, string> = {
      "eCommerce": "Ready to boost your conversion rates and drive more revenue?",
      "Healthcare": "Ready to increase patient engagement and appointment bookings?",
      "Financial Services": "Ready to generate more qualified leads and improve retention?",
      "Education": "Ready to increase enrollments and application completions?",
      "B2B/SaaS": "Ready to accelerate your pipeline and boost demo conversions?",
    };

    return headlinesByIndustry[userIndustry] || "Ready to transform your personalization strategy?";
  };

  // Industry-specific reasons to contact us
  const getReasons = () => {
    const reasonsByIndustry: Record<string, string[]> = {
      "eCommerce": [
        "Reduce cart abandonment and increase AOV with data-driven personalization strategies",
        "Target shoppers based on buying behavior, not just demographics, for higher engagement",
        "Get 6–12 week test plans designed to boost purchase conversion and revenue per visitor",
        "Create seamless shopping experiences across web, mobile, and email to maximize lifetime value",
        "Track impact on revenue metrics and conversion rates with clear KPIs from day one"
      ],
      "Healthcare": [
        "Increase appointment bookings and reduce form abandonment with targeted interventions",
        "Engage patients based on their healthcare journey and needs, not generic demographics",
        "Get test plans to improve consultation requests, phone conversions, and patient engagement",
        "Guide patients from initial research to booking appointments across all touchpoints",
        "Track appointment rates, form completions, and patient satisfaction metrics"
      ],
      "Financial Services": [
        "Improve lead quality and reduce customer churn with behavior-based personalization",
        "Target prospects based on financial goals and buying signals, not just firmographics",
        "Get plans to increase qualified leads, account sign-ups, and member retention",
        "Build trust and credibility with coordinated messaging across all customer channels",
        "Track lead conversion rates, sign-up velocity, and customer lifetime value"
      ],
      "Education": [
        "Increase application completions and campus visit registrations with personalized journeys",
        "Engage prospective students based on program interests and enrollment stage",
        "Get test plans to boost information requests, financial aid submissions, and applications",
        "Guide students from discovery to enrollment with seamless cross-channel experiences",
        "Track application rates, visit bookings, and enrollment conversions"
      ],
      "B2B/SaaS": [
        "Generate more qualified MQLs and improve demo-to-customer conversion rates",
        "Target prospects based on company size, role, and buying signals for better engagement",
        "Get plans to increase trial sign-ups, demo requests, and product adoption",
        "Create coordinated journeys that nurture leads from awareness to purchase",
        "Track MQL generation, demo requests, trial conversions, and customer lifetime value"
      ],
    };

    // Default reasons if no industry or "Other"
    const defaultReasons = [
      "Uncover high‑impact opportunities: PersX.ai analyzes your behavior data to surface friction points and growth opportunities you may not have considered",
      "Persona‑driven personalization: It infers audience segments based on actions, not demographics, ensuring more relevant experiences and higher engagement",
      "Actionable experiment roadmaps: The platform delivers 6–12 week test plans with clear hypotheses, so your team knows exactly what to try next",
      "Cross‑channel journey design: It creates coordinated journeys across web, mobile, and email, boosting conversion rates and customer lifetime value",
      "Measurable results: It defines KPIs and measurement windows up front, helping you track impact and iterate fast"
    ];

    return reasonsByIndustry[userIndustry] || defaultReasons;
  };

  const reasons = getReasons();
  const headline = getHeadline();

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Contact Us
        </h1>
        <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          {headline}
        </h2>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Reasons To Contact Us */}
          <div className="space-y-6">
            <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
                Reasons To Contact Us
              </h2>
              <ul className="space-y-4">
                {reasons.map((reason, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-bold mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                      {reason}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            {submitStatus === "success" && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-800 dark:text-green-200 text-sm">
                  Thank you! Your message has been sent successfully.
                </p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-200 text-sm">
                  There was an error sending your message. Please try again.
                </p>
              </div>
            )}

            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">
              Send Us a Message
            </h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>

              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Your privacy is important to us and we do not spam
              </p>
            </form>
          </div>
        </div>

        {/* Additional Info */}
        <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-200">
            Need Immediate Assistance?
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            For urgent inquiries or technical support, please reach out to our support team
            at support@persx.ai
          </p>
        </div>
      </div>
    </div>
  );
}

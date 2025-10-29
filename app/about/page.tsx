import Link from "next/link";
import StructuredData from "@/components/StructuredData";

export default function About() {
  // Structured data for About page
  const aboutPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About PersX.ai",
    "description": "PersX.ai is your strategy engine for experience optimization. Learn about our 5-step optimization loop and 20+ years of expertise.",
    "mainEntity": {
      "@type": "Organization",
      "name": "PersX.ai",
      "description": "Strategy engine for experience optimization backed by 20+ years of marketing and martech expertise",
      "foundingDate": "2023",
      "founders": [
        {
          "@type": "Person",
          "jobTitle": "Experience Optimization Expert"
        }
      ],
      "knowsAbout": [
        "Personalization",
        "A/B Testing",
        "Conversion Rate Optimization",
        "Marketing Technology",
        "Behavioral Segmentation",
        "Cross-channel Marketing"
      ]
    }
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Five-Step Optimization Loop",
    "description": "PersX.ai's proven methodology for turning insights into growth",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Discovery",
        "text": "Aggregate evidence and audit the entire journey. Quantify where visitors stall and capture why using voice-of-customer feedback.",
        "position": 1
      },
      {
        "@type": "HowToStep",
        "name": "Hypothesis",
        "text": "Craft test hypotheses with success criteria, guardrails, and sample-size requirements to ensure valid results.",
        "position": 2
      },
      {
        "@type": "HowToStep",
        "name": "Execution",
        "text": "Generate copy, layout and offer variants. Implement and launch targeted A/B/n tests with clean analysis tracking.",
        "position": 3
      },
      {
        "@type": "HowToStep",
        "name": "Review",
        "text": "Evaluate metrics beyond primary goals including AOV, retention and fairness across segments to avoid regressions.",
        "position": 4
      },
      {
        "@type": "HowToStep",
        "name": "Scale",
        "text": "Turn wins into reusable patterns and roll them out to adjacent journeys and channels while monitoring for drift.",
        "position": 5
      }
    ]
  };

  return (
    <>
      <StructuredData data={aboutPageSchema} />
      <StructuredData data={howToSchema} />

    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <section className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Meet PersX.ai
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-gray-900 dark:text-gray-100">
            Your strategy engine for experience optimization
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
            PersX.ai isn't another execution platform—it's the intelligence layer that uncovers hidden opportunities, aligns them to your audience personas, proposes measurable tests, and maps the cleanest integration path across web, mobile and email. Backed by two decades of marketing and martech expertise, PersX.ai helps you skip the guesswork and get straight to data‑backed growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Link
              href="/start"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
            >
              Get Your Free Roadmap
            </Link>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-center"
            >
              Speak with an Expert
            </Link>
          </div>
        </section>

        {/* Why Trust Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">
            Why trust PersX.ai?
          </h2>
          <div className="space-y-6">
            <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Expertise + AI
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Our founders bring 20+ years of hands‑on experience across eCommerce, healthcare, financial services, education and B2B/SaaS. We've captured the best practices and automated them with AI.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Fast, actionable insights
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Go from raw data to test‑ready ideas in minutes—no more months‑long consulting engagements.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Works with your stack
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Integrates seamlessly with Optimizely, Segment, Salesforce, Marketo, Microsoft Dynamics and other major martech tools.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800">
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Industry‑specific guidance
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Tailored personas, journeys and experiments built for your vertical's unique challenges and KPIs.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-16 p-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to transform your optimization strategy?
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Get a personalized roadmap tailored to your industry and goals
          </p>
          <Link
            href="/start"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Start Now
          </Link>
        </section>

        {/* How It Works Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            How it works: a five‑step optimization loop
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            PersX.ai guides you through a proven methodology that turns insights into growth
          </p>

          <div className="space-y-8">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  Discovery
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Aggregate evidence and audit the entire journey. Quantify where visitors stall and capture "why" using voice‑of‑customer feedback. PersX.ai clusters patterns and proposes opportunities ranked by impact and effort.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  Hypothesis
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Craft test hypotheses such as: "For [audience], changing [thing] from [state] to [state] will increase [metric] because [insight]." Each hypothesis includes success criteria, guardrails, and sample‑size/stop‑rules to ensure valid results.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  Execution
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Generate copy, layout and offer variants with PersX.ai. Implement these in your CMS or app and launch targeted A/B/n or multi‑armed bandit tests. All changes are logged with unique IDs to enable clean analysis.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  Review
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Look beyond the primary metric. Evaluate average order value (AOV), downstream retention and fairness across segments to avoid harmful regressions. Capture learnings in a living playbook that evolves with each experiment.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">
                5
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  Scale
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Turn wins into reusable patterns, components or templates. Roll them out to adjacent journeys and channels (email, ads, in‑app), monitor for drift, and keep iterating.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Built For Section */}
        <section className="mb-16 p-8 rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            Built for modern marketing leaders
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            PersX.ai helps growth marketers, product teams and executives who want clarity and actionability. If you need to accelerate personalization, improve conversion rates or optimize onboarding without adding more tools to your stack, PersX.ai gives you the strategic insights to get there—fast.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
            >
              Schedule a Consultation
            </Link>
            <Link
              href="/start"
              className="inline-block px-8 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-center"
            >
              See Your Custom Roadmap
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center p-8 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Let's optimize your growth together
          </h2>
          <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
            Our experience optimization experts are ready to help you discover hidden opportunities and build a winning experimentation strategy
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Connect with an Expert
          </Link>
        </section>
      </div>
    </div>
    </>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [userIndustry, setUserIndustry] = useState<string>("");

  useEffect(() => {
    // Get stored industry from sessionStorage
    if (typeof window !== 'undefined') {
      const storedIndustry = sessionStorage.getItem('userIndustry') || "";
      setUserIndustry(storedIndustry);
    }
  }, []);

  // Industry-specific callouts
  const getCallouts = () => {
    const calloutsByIndustry: Record<string, Array<{ icon: string; title: string; description: string }>> = {
      "eCommerce": [
        {
          icon: "💡",
          title: "Instant Insight from Experts",
          description: "Get rapid access to eCommerce growth strategies—cart recovery, AOV boosters, and product recommendation tactics—distilled by subject‑matter specialists, without wading through endless data."
        },
        {
          icon: "⚡",
          title: "Actionable Ideas in Minutes",
          description: "PersX.ai turns your shopping behavior signals into ready‑to‑test experiments targeting cart abandoners, repeat buyers, and high-value segments so you can act immediately."
        },
        {
          icon: "🎯",
          title: "Effortless Opportunity Discovery",
          description: "With automated persona modeling and journey design, uncover new revenue opportunities—cross-sell moments, checkout friction points, and browse-to-buy gaps—faster than ever."
        }
      ],
      "Healthcare": [
        {
          icon: "💡",
          title: "Instant Insight from Experts",
          description: "Get rapid access to patient engagement strategies—appointment booking flows, telehealth adoption, and trust-building tactics—distilled by healthcare marketing specialists."
        },
        {
          icon: "⚡",
          title: "Actionable Ideas in Minutes",
          description: "PersX.ai turns your patient journey signals into ready‑to‑test experiments targeting appointment seekers, service researchers, and follow-up completers so you can act immediately."
        },
        {
          icon: "🎯",
          title: "Effortless Opportunity Discovery",
          description: "With automated persona modeling and journey design, uncover new conversion opportunities—form abandonment points, service discovery gaps, and consultation barriers—faster than ever."
        }
      ],
      "Financial Services": [
        {
          icon: "💡",
          title: "Instant Insight from Experts",
          description: "Get rapid access to financial services growth strategies—lead qualification paths, account sign-up optimization, and trust-building tactics—distilled by FinTech specialists."
        },
        {
          icon: "⚡",
          title: "Actionable Ideas in Minutes",
          description: "PersX.ai turns your prospect behavior signals into ready‑to‑test experiments targeting qualified leads, comparison shoppers, and high-intent visitors so you can act immediately."
        },
        {
          icon: "🎯",
          title: "Effortless Opportunity Discovery",
          description: "With automated persona modeling and journey design, uncover new conversion opportunities—application drop-off points, education gaps, and credibility barriers—faster than ever."
        }
      ],
      "Education": [
        {
          icon: "💡",
          title: "Instant Insight from Experts",
          description: "Get rapid access to enrollment strategies—application completion flows, campus visit optimization, and program discovery tactics—distilled by higher education marketing specialists."
        },
        {
          icon: "⚡",
          title: "Actionable Ideas in Minutes",
          description: "PersX.ai turns your prospective student signals into ready‑to‑test experiments targeting program researchers, application starters, and campus visit prospects so you can act immediately."
        },
        {
          icon: "🎯",
          title: "Effortless Opportunity Discovery",
          description: "With automated persona modeling and journey design, uncover new enrollment opportunities—application friction points, financial aid questions, and decision-stage barriers—faster than ever."
        }
      ],
      "B2B/SaaS": [
        {
          icon: "💡",
          title: "Instant Insight from Experts",
          description: "Get rapid access to SaaS growth strategies—trial conversion paths, demo request optimization, and product adoption tactics—distilled by B2B marketing specialists."
        },
        {
          icon: "⚡",
          title: "Actionable Ideas in Minutes",
          description: "PersX.ai turns your buyer behavior signals into ready‑to‑test experiments targeting MQLs, trial users, and demo prospects so you can act immediately."
        },
        {
          icon: "🎯",
          title: "Effortless Opportunity Discovery",
          description: "With automated persona modeling and journey design, uncover new pipeline opportunities—signup friction, feature discovery gaps, and time-to-value barriers—faster than ever."
        }
      ]
    };

    // Default callouts if no industry or "Other"
    const defaultCallouts = [
      {
        icon: "💡",
        title: "Instant Insight from Experts",
        description: "Get rapid access to growth strategies distilled by subject‑matter specialists, without wading through endless data."
      },
      {
        icon: "⚡",
        title: "Actionable Ideas in Minutes",
        description: "PersX.ai turns your raw behavior signals into ready‑to‑test experiments so you can act immediately."
      },
      {
        icon: "🎯",
        title: "Effortless Opportunity Discovery",
        description: "With automated persona modeling and journey design, uncover new revenue opportunities and friction points faster than ever."
      }
    ];

    return calloutsByIndustry[userIndustry] || defaultCallouts;
  };

  const callouts = getCallouts();

  return (
    <div className="container mx-auto px-4 md:px-6">
      {/* Hero Section */}
      <section className="py-20 md:py-32 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          AI Strategist for Personalization & Experimentation
        </h1>
        <h2 className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
          Discover your ideal personas, journeys, and build an actionable roadmap in minutes.
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/start" className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Get Started
          </Link>
          <button className="px-8 py-3 border border-gray-300 dark:border-gray-700 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Choose PersX.ai?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {callouts.map((callout, index) => (
            <div key={index} className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{callout.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{callout.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {callout.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Martech Integration Section */}
      <section className="py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          Works with Any Marketing Technology
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          Seamlessly integrate with your existing martech stack
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center max-w-5xl mx-auto">
          <div className="flex items-center justify-center p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">Optimizely</div>
            </div>
          </div>
          <div className="flex items-center justify-center p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">Segment</div>
            </div>
          </div>
          <div className="flex items-center justify-center p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">Salesforce</div>
            </div>
          </div>
          <div className="flex items-center justify-center p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">Marketo</div>
            </div>
          </div>
          <div className="flex items-center justify-center p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow col-span-2 md:col-span-1">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">Microsoft Dynamics</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto p-8 md:p-12 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Business?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of companies already using PersX.ai to power their personalization initiatives
          </p>
          <Link href="/start" className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Get Your Free Roadmap
          </Link>
        </div>
      </section>
    </div>
  );
}

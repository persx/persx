"use client";

import Link from "next/link";
import type { HeroBlock as HeroBlockType } from "@/types/content-blocks";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface HeroBlockProps {
  block: HeroBlockType;
}

// Personalization logic for subtitle based on industry
function personalizeSubtitle(subtitle: string, industry: string): string {
  // Define industry-specific variations
  const industryVariations: Record<string, string> = {
    "E-commerce / Retail": "Discover your ideal customer personas, shopping journeys, and build an actionable experimentation roadmap for e-commerce in minutes.",
    "SaaS / Technology": "Discover your ideal user personas, product journeys, and build an actionable growth roadmap for SaaS in minutes.",
    "Financial Services / Banking": "Discover your ideal customer personas, financial journeys, and build an actionable personalization roadmap for financial services in minutes.",
    "Healthcare / Life Sciences": "Discover your ideal patient personas, care journeys, and build an actionable optimization roadmap for healthcare in minutes.",
    "Travel / Hospitality": "Discover your ideal traveler personas, booking journeys, and build an actionable experimentation roadmap for travel in minutes.",
    "Media / Publishing": "Discover your ideal reader personas, content journeys, and build an actionable engagement roadmap for media in minutes.",
    "Education / E-learning": "Discover your ideal learner personas, educational journeys, and build an actionable optimization roadmap for education in minutes.",
    "Telecommunications": "Discover your ideal customer personas, service journeys, and build an actionable personalization roadmap for telecom in minutes.",
    "Automotive": "Discover your ideal buyer personas, purchase journeys, and build an actionable experimentation roadmap for automotive in minutes.",
    "Real Estate": "Discover your ideal buyer personas, property journeys, and build an actionable conversion roadmap for real estate in minutes.",
    "Insurance": "Discover your ideal policyholder personas, insurance journeys, and build an actionable optimization roadmap for insurance in minutes.",
    "Non-profit / Charity": "Discover your ideal donor personas, engagement journeys, and build an actionable fundraising roadmap for non-profits in minutes.",
  };

  // Return industry-specific variation if available, otherwise return original
  return industryVariations[industry] || subtitle;
}

export default function HeroBlock({ block }: HeroBlockProps) {
  const { title, subtitle, buttons, alignment = "center", personalization } = block.data;
  const [personalizedContent, setPersonalizedContent] = useState({ title, subtitle });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const industry = sessionStorage.getItem('userIndustry') || "";

      // Personalize subtitle based on industry
      if (industry && subtitle) {
        const personalizedSubtitle = personalizeSubtitle(subtitle, industry);
        setPersonalizedContent({ title, subtitle: personalizedSubtitle });
      } else {
        setPersonalizedContent({ title, subtitle });
      }
    }
  }, [title, subtitle, personalization]);

  const alignmentClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  };

  return (
    <section className={`py-16 md:py-24 ${alignmentClasses[alignment]}`}>
      <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
        {personalizedContent.title}
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto">
        {personalizedContent.subtitle}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {buttons.map((button, index) => (
          <Button
            key={index}
            asChild
            size="lg"
            variant={button.variant === "primary" ? "default" : "outline"}
            className="text-lg px-8 py-6"
          >
            <Link href={button.href}>
              {button.text}
            </Link>
          </Button>
        ))}
      </div>
    </section>
  );
}

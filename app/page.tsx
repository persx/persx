import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import ContentBlockRenderer from "./components/blocks/ContentBlockRenderer";
import StructuredData from "@/components/StructuredData";
import type { Metadata } from "next";

// Force dynamic rendering for homepage
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const supabase = createClient();

  const { data: page } = await supabase
    .from("knowledge_base_content")
    .select("meta_title, meta_description")
    .eq("slug", "home-blocks")
    .single();

  return {
    title: page?.meta_title || "PersX.ai - AI Strategist for Personalization & Experimentation",
    description: page?.meta_description || "Discover your ideal personas, journeys, and build an actionable roadmap in minutes.",
  };
}

export default async function HomePage() {
  const supabase = createClient();

  // Fetch the home-blocks page from database
  const { data: page, error } = await supabase
    .from("knowledge_base_content")
    .select("*")
    .eq("slug", "home-blocks")
    .eq("status", "published")
    .single();

  if (error || !page) {
    notFound();
  }

  // Check if page uses blocks
  const useBlocks = page.content_blocks && page.content_blocks.length > 0;

  if (!useBlocks) {
    // If no blocks, redirect to a fallback or show error
    notFound();
  }

  // Structured data for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "PersX.ai",
    "description": "AI Strategist for Personalization & Experimentation. Strategy engine for experience optimization.",
    "url": "https://www.persx.ai",
    "logo": "https://www.persx.ai/icon.svg",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "persx@alexdesigns.com",
      "contactType": "Customer Service"
    },
    "sameAs": []
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "PersX.ai",
    "applicationCategory": "BusinessApplication",
    "description": "Intelligence layer that uncovers hidden opportunities, aligns them to audience personas, proposes measurable tests, and maps integration paths across web, mobile and email.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free personalized roadmap"
    },
    "featureList": [
      "Behavioral persona inference",
      "Cross-channel journey design",
      "Experiment roadmap creation",
      "Martech stack integration",
      "Industry-specific optimization"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is PersX.ai?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PersX.ai is a strategy engine for experience optimization that helps businesses discover hidden opportunities, align them to audience personas, and propose measurable tests. It's backed by 20+ years of marketing and martech expertise."
        }
      },
      {
        "@type": "Question",
        "name": "How does PersX.ai help with personalization?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PersX.ai turns raw behavior signals into ready-to-test experiments by inferring personas from behavioral data, creating cross-channel journeys, and providing industry-specific guidance for your vertical's unique challenges."
        }
      },
      {
        "@type": "Question",
        "name": "Which industries does PersX.ai support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PersX.ai provides tailored strategies for eCommerce, Healthcare, Financial Services, Education, and B2B/SaaS, with specific personas, journeys, and experiments built for each vertical's KPIs."
        }
      },
      {
        "@type": "Question",
        "name": "What martech tools does PersX.ai integrate with?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PersX.ai integrates seamlessly with Optimizely, Segment, Salesforce, Marketo, Microsoft Dynamics, and other major martech tools."
        }
      }
    ]
  };

  return (
    <>
      <StructuredData data={organizationSchema} />
      <StructuredData data={softwareSchema} />
      <StructuredData data={faqSchema} />

      <div className="min-h-screen">
        <ContentBlockRenderer blocks={page.content_blocks} />
      </div>
    </>
  );
}

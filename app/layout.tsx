import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import ConditionalFooter from "@/components/ConditionalFooter";
import ConditionalAnalytics from "@/components/ConditionalAnalytics";
import RootErrorBoundary from "@/components/RootErrorBoundary";

export const metadata: Metadata = {
  title: {
    default: "PersX.ai - AI Strategist for Personalization & Experimentation",
    template: "%s | PersX.ai",
  },
  description: "Discover your ideal personas, journeys, and build an actionable roadmap in minutes. AI-powered personalization and experimentation strategy backed by 20+ years of expertise.",
  keywords: [
    "AI personalization",
    "experimentation platform",
    "A/B testing",
    "customer personas",
    "conversion optimization",
    "martech integration",
    "behavioral segmentation",
    "cross-channel marketing",
    "experience optimization",
    "GEO optimization",
    "CRO strategy",
    "marketing automation"
  ],
  authors: [{ name: "PersX.ai", url: "https://persx.ai" }],
  creator: "PersX.ai",
  publisher: "PersX.ai",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://persx.ai",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://persx.ai",
    siteName: "PersX.ai",
    title: "PersX.ai - AI Strategist for Personalization & Experimentation",
    description: "Discover your ideal personas, journeys, and build an actionable roadmap in minutes.",
    images: [
      {
        url: "/icon.svg",
        width: 32,
        height: 32,
        alt: "PersX.ai logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PersX.ai - AI Strategist for Personalization & Experimentation",
    description: "Discover your ideal personas, journeys, and build an actionable roadmap in minutes. Backed by 20+ years of expertise.",
    images: ["/icon.svg"],
    creator: "@PersXai",
  },
  category: "technology",
  classification: "Business Software, Marketing Technology, Personalization Platform",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <RootErrorBoundary>
          <Header />
          <main className="flex-1">{children}</main>
          <ConditionalFooter />
        </RootErrorBoundary>
        <ConditionalAnalytics />
      </body>
    </html>
  );
}

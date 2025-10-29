import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: {
    default: "persx.ai - AI Strategist for Personalization & Experimentation",
    template: "%s | persx.ai",
  },
  description: "Discovery your ideal personas, journeys, and build an actionable roadmap in minutes. AI-powered personalization and experimentation strategy.",
  keywords: ["AI", "personalization", "experimentation", "A/B testing", "customer personas", "conversion optimization", "martech"],
  authors: [{ name: "persx.ai" }],
  creator: "persx.ai",
  publisher: "persx.ai",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://persx.ai",
    siteName: "persx.ai",
    title: "persx.ai - AI Strategist for Personalization & Experimentation",
    description: "Discovery your ideal personas, journeys, and build an actionable roadmap in minutes.",
    images: [
      {
        url: "/icon.svg",
        width: 32,
        height: 32,
        alt: "persx.ai logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "persx.ai - AI Strategist for Personalization & Experimentation",
    description: "Discovery your ideal personas, journeys, and build an actionable roadmap in minutes.",
    images: ["/icon.svg"],
  },
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
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t py-6 md:py-8">
          <div className="container mx-auto px-4 md:px-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>&copy; {new Date().getFullYear()} persx.ai. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

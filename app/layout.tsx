import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import ConditionalFooter from "@/components/ConditionalFooter";
import ConditionalAnalytics from "@/components/ConditionalAnalytics";
import RootErrorBoundary from "@/components/RootErrorBoundary";
import AdminUtilityBar from "@/components/AdminUtilityBar";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getAdminSessionState, shouldShowUtilityBar } from "@/lib/admin-session";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase-server";

// Optimize font loading with Next.js font optimization
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
  variable: "--font-dm-sans",
});

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
  authors: [{ name: "PersX.ai", url: "https://www.persx.ai" }],
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
    canonical: "https://www.persx.ai",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.persx.ai",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get the current pathname to check if we're on a /go page
  const headersList = headers();
  const pathname = headersList.get("x-pathname") || "";
  const isGoPage = pathname.startsWith("/go");

  // Check if admin utility bar should be shown (but hide it on /go pages)
  const showUtilityBar = !isGoPage && await shouldShowUtilityBar();
  const adminState = showUtilityBar ? await getAdminSessionState() : null;

  // Check if current page is editable
  let currentPage = null;
  if (showUtilityBar && pathname) {
    const slug = pathname.substring(1) || "home"; // Remove leading slash
    const supabase = createClient();
    const { data } = await supabase
      .from("knowledge_base_content")
      .select("id, slug")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    if (data) {
      currentPage = data;
    }
  }

  // Only add padding if the bar will actually render (has an industry)
  const showAdminBar = showUtilityBar && adminState && adminState.industry;

  return (
    <html lang="en" className={`${dmSans.variable} dark`}>
      <body className="min-h-screen flex flex-col font-sans">
        <ThemeProvider>
          {/* Admin Utility Bar - only visible in admin sessions and not on /go pages */}
          {showUtilityBar && adminState && (
            <AdminUtilityBar
              industry={adminState.industry}
              tool={adminState.tool}
              goal={adminState.goal}
              currentPageId={currentPage?.id}
              currentPageSlug={currentPage?.slug}
            />
          )}

          {/* Main content with top padding when utility bar is visible */}
          <div className={showAdminBar ? "pt-12" : ""}>
            <RootErrorBoundary>
              <Header />
              <main className="flex-1">{children}</main>
              <ConditionalFooter />
            </RootErrorBoundary>
          </div>

          <ConditionalAnalytics />
        </ThemeProvider>
      </body>
    </html>
  );
}

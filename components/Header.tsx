"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

interface NavigationItem {
  id: string;
  title: string;
  slug: string;
  content_type: string;
}

interface NavigationData {
  insights: NavigationItem[];
  company: NavigationItem[];
  resources: NavigationItem[];
}

export default function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navigation, setNavigation] = useState<NavigationData>({
    insights: [],
    company: [],
    resources: [],
  });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Fetch navigation data
  useEffect(() => {
    fetch("/api/navigation")
      .then((res) => res.json())
      .then((data) => {
        if (data.navigation) {
          setNavigation(data.navigation);
        }
      })
      .catch((err) => console.error("Failed to fetch navigation:", err));
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClick = () => setOpenDropdown(null);
    if (openDropdown) {
      document.addEventListener("click", handleClick);
      return () => document.removeEventListener("click", handleClick);
    }
    return undefined;
  }, [openDropdown]);

  // Helper to get URL for content
  const getContentUrl = (item: NavigationItem) => {
    if (item.content_type === "static_page") {
      return `/${item.slug}`;
    }
    // For blog and news index pages, just use the slug
    if (item.content_type === "blog" && item.slug === "blog") {
      return `/blog`;
    }
    if (item.content_type === "news" && item.slug === "news") {
      return `/news`;
    }
    if (item.content_type === "blog") {
      return `/blog/${item.slug}`;
    }
    if (item.content_type === "news") {
      return `/news/${item.slug}`;
    }
    return `/${item.content_type}/${item.slug}`;
  };

  // Hide header on admin pages
  if (pathname?.startsWith("/go")) {
    return null;
  }

  // Fallback navigation items if database is empty
  const insightsItems = navigation.insights.length > 0
    ? navigation.insights
    : [
        { id: "blog-fallback", title: "Blog", slug: "blog", content_type: "blog" },
        { id: "news-fallback", title: "News", slug: "news", content_type: "news" },
      ];

  const companyItems = navigation.company.length > 0
    ? navigation.company
    : [
        { id: "about-fallback", title: "About", slug: "about", content_type: "static_page" },
      ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center space-x-2 text-2xl font-bold text-violet-600 dark:text-violet-400"
        >
          PersX.ai
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-3">
          <ul className="flex items-center space-x-2">
            {/* Insights Dropdown */}
            <li className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(openDropdown === "insights" ? null : "insights");
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1 ${
                  pathname?.startsWith("/blog") || pathname?.startsWith("/news")
                    ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Insights
                <svg
                  className={`w-4 h-4 transition-transform ${openDropdown === "insights" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === "insights" && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                  {insightsItems.map((item) => (
                    <Link
                      key={item.id}
                      href={getContentUrl(item)}
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            {/* Company Dropdown */}
            <li className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDropdown(openDropdown === "company" ? null : "company");
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-1 ${
                  pathname?.startsWith("/about") || pathname?.startsWith("/how-it-works")
                    ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Company
                <svg
                  className={`w-4 h-4 transition-transform ${openDropdown === "company" ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openDropdown === "company" && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                  {companyItems.map((item) => (
                    <Link
                      key={item.id}
                      href={getContentUrl(item)}
                      onClick={() => setOpenDropdown(null)}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              )}
            </li>

            {/* Contact Link */}
            <li>
              <Link
                href="/contact"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  pathname === "/contact"
                    ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Contact
              </Link>
            </li>
          </ul>
          <Link
            href="/start"
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Get Free Roadmap
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/start"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Get Free Roadmap
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6 text-gray-700 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-white dark:bg-gray-900">
          <ul className="container mx-auto px-4 py-2 space-y-1">
            {/* Mobile Insights Section */}
            <li>
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Insights
              </div>
              <ul className="ml-4 space-y-1">
                {insightsItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={getContentUrl(item)}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Mobile Company Section */}
            <li>
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Company
              </div>
              <ul className="ml-4 space-y-1">
                {companyItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={getContentUrl(item)}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Mobile Contact Link */}
            <li>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                  pathname === "/contact"
                    ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

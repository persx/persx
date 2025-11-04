"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NewsletterSubscription from "./NewsletterSubscription";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Hide footer on admin and start pages
  if (pathname?.startsWith("/go") || pathname?.startsWith("/start")) {
    return null;
  }

  // Show newsletter on all pages except /news (it has its own)
  const showNewsletter = !pathname?.startsWith("/news");

  const footerLinks = {
    content: [
      { name: "Blog", path: "/blog" },
      { name: "News", path: "/news" },
    ],
    company: [
      { name: "About", path: "/about" },
      { name: "Contact", path: "/contact" },
    ],
    getStarted: [
      { name: "Get Free Roadmap", path: "/start" },
    ],
  };

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Newsletter Subscription */}
        {showNewsletter && (
          <div className="max-w-4xl mx-auto mb-12">
            <NewsletterSubscription />
          </div>
        )}

        {/* Footer Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Content Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Content
            </h3>
            <ul className="space-y-3">
              {footerLinks.content.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Started Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
              Get Started
            </h3>
            <ul className="space-y-3">
              {footerLinks.getStarted.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link
              href="/"
              className="text-xl font-bold text-violet-600 dark:text-violet-400"
            >
              PersX.ai
            </Link>
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © {new Date().getFullYear()} PersX.ai. All rights reserved.
              </p>
              <Link
                href="/privacy"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

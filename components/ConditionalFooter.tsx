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

  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Newsletter Subscription */}
        {showNewsletter && (
          <div className="max-w-4xl mx-auto mb-8">
            <NewsletterSubscription />
          </div>
        )}

        {/* Footer Links */}
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">&copy; {new Date().getFullYear()} PersX.ai. All rights reserved.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/news" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              News
            </Link>
            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

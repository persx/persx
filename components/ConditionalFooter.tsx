"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ConditionalFooter() {
  const pathname = usePathname();

  // Hide footer on admin pages
  if (pathname?.startsWith("/go")) {
    return null;
  }

  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container mx-auto px-4 md:px-6 text-center text-sm text-gray-600 dark:text-gray-400">
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
    </footer>
  );
}

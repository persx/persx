/**
 * Admin Utility Bar
 *
 * Site-wide utility bar shown only during admin sessions.
 * Provides quick access to admin panel and personalization controls.
 */

"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { clearIndustry, clearAllPersonalization } from "@/app/actions/personalization";

interface AdminUtilityBarProps {
  industry?: string;
  tool?: string;
  goal?: string;
}

export default function AdminUtilityBar({ industry, tool, goal }: AdminUtilityBarProps) {
  const [message, setMessage] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const hasPersonalization = !!(industry || tool || goal);

  const handleClearIndustry = () => {
    startTransition(async () => {
      const result = await clearIndustry();
      setMessage(result.message);

      // Also clear sessionStorage to keep in sync
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('userIndustry');
      }

      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    });
  };

  const handleClearAll = () => {
    startTransition(async () => {
      const result = await clearAllPersonalization();
      setMessage(result.message);

      // Also clear sessionStorage to keep in sync
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('userIndustry');
      }

      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Left side: Admin link */}
          <div className="flex items-center gap-4">
            <Link
              href="/go/cm"
              className="text-sm px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              Admin
            </Link>
          </div>

          {/* Center: Personalization state */}
          <div className="flex items-center gap-3">
            {industry && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/10">
                <span className="text-sm">
                  Industry: <span className="font-medium">{industry}</span>
                </span>
                <button
                  onClick={handleClearIndustry}
                  disabled={isPending}
                  className="text-xs px-2 py-0.5 rounded bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Clear industry"
                >
                  Clear
                </button>
              </div>
            )}

            {tool && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/10">
                <span className="text-sm">
                  Tool: <span className="font-medium">{tool}</span>
                </span>
              </div>
            )}

            {goal && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/10">
                <span className="text-sm">
                  Goal: <span className="font-medium">{goal}</span>
                </span>
              </div>
            )}
          </div>

          {/* Right side: Clear all button */}
          <div className="flex items-center gap-4">
            {hasPersonalization && (
              <button
                onClick={handleClearAll}
                disabled={isPending}
                className="text-sm px-4 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {isPending ? "Clearing..." : "Clear personalization"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success message (ARIA live region) */}
      {message && (
        <div
          role="status"
          aria-live="polite"
          className="absolute top-full left-0 right-0 bg-green-500 text-white px-4 py-2 text-sm text-center shadow-md"
        >
          {message}
        </div>
      )}
    </div>
  );
}

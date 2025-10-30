"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import type { Session } from "next-auth";

const navItems = [
  { href: "/go/cm", label: "Dashboard", icon: "📊" },
  { href: "/go/cm/content", label: "Content", icon: "📝" },
  { href: "/go/cm/rm", label: "Submissions", icon: "🗺️" },
  { href: "/go/cm/tags", label: "Tags", icon: "🏷️" },
  { href: "/go/cm/analytics", label: "Analytics", icon: "📈" },
];

interface AdminNavProps {
  session: Session | null;
}

export default function AdminNav({ session }: AdminNavProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <nav
        className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="p-4 space-y-2">
          {/* Header with Logo and Toggle */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
            {!isCollapsed && (
              <Link
                href="/"
                target="_blank"
                className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                title="Visit PersX.ai homepage"
              >
                PersX.ai
              </Link>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg
                className={`w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform ${
                  isCollapsed ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                />
              </svg>
            </button>
          </div>

          {/* User Info */}
          {!isCollapsed && session?.user && (
            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Signed in as
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate">
                {session.user.email}
              </p>
              <Link
                href="/"
                target="_blank"
                className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 mt-2 inline-block"
              >
                View Site →
              </Link>
            </div>
          )}

          {/* Navigation Items */}
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/go/cm" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center ${
                  isCollapsed ? "justify-center" : "space-x-3"
                } px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <span className="text-xl">{item.icon}</span>
                {!isCollapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}

          {/* Sign Out */}
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => signOut({ callbackUrl: "/go" })}
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "space-x-3"
              } px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors`}
              title={isCollapsed ? "Sign Out" : undefined}
            >
              <span className="text-xl">🚪</span>
              {!isCollapsed && <span className="font-medium">Sign Out</span>}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/go/cm", label: "Dashboard", icon: "📊" },
  { href: "/go/cm/content", label: "Content", icon: "📝" },
  { href: "/go/cm/tags", label: "Tags", icon: "🏷️" },
  { href: "/go/cm/analytics", label: "Analytics", icon: "📈" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <div className="p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/go/cm" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => signOut({ callbackUrl: "/go" })}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: "Blog", path: "/blog" },
    { name: "News", path: "/news" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center space-x-2 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          PersX.ai
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          <ul className="flex items-center space-x-1 md:space-x-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    pathname === item.path
                      ? "bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/start"
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
          >
            Get Free Roadmap
          </Link>
        </div>
      </nav>
    </header>
  );
}

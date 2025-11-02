import { ReactNode } from "react";

interface ContentLayoutProps {
  children: ReactNode;
  maxWidth?: "2xl" | "3xl" | "4xl" | "5xl" | "full";
  className?: string;
}

/**
 * ContentLayout - Unified wrapper for all content display pages
 * Provides consistent container and spacing
 */
export default function ContentLayout({
  children,
  maxWidth = "4xl",
  className = "",
}: ContentLayoutProps) {
  const maxWidthClasses = {
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-full",
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className={`${maxWidthClasses[maxWidth]} mx-auto ${className}`}>
        {/* Main content */}
        <article>{children}</article>
      </div>
    </div>
  );
}

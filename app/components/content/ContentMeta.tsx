import Link from "next/link";

type Industry =
  | "eCommerce"
  | "Healthcare"
  | "Financial Services"
  | "Education"
  | "B2B/SaaS"
  | "General";

interface ContentMetaProps {
  tags?: string[] | null;
  industry?: Industry | null;
  goals?: string[] | null;
  martechTools?: string[] | null;
  estimatedReadTime?: number | null;
  showReadTime?: boolean;
  showIndustry?: boolean;
  className?: string;
}

/**
 * ContentMeta - Displays tags, categories, industry, and read time
 * Flexible component used across all content types
 */
export default function ContentMeta({
  tags,
  industry,
  goals,
  martechTools,
  estimatedReadTime,
  showReadTime = true,
  showIndustry = true,
  className = "",
}: ContentMetaProps) {
  const hasAnyMeta =
    (tags && tags.length > 0) ||
    industry ||
    (goals && goals.length > 0) ||
    (martechTools && martechTools.length > 0) ||
    estimatedReadTime;

  if (!hasAnyMeta) return null;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Read Time */}
      {showReadTime && estimatedReadTime && (
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{estimatedReadTime} min read</span>
        </div>
      )}

      {/* Industry */}
      {showIndustry && industry && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Industry
          </h3>
          <span className="inline-block px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full">
            {industry}
          </span>
        </div>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Goals */}
      {goals && goals.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Goals
          </h3>
          <div className="flex flex-wrap gap-2">
            {goals.map((goal, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full"
              >
                {goal}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Martech Tools */}
      {martechTools && martechTools.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Tools & Technologies
          </h3>
          <div className="flex flex-wrap gap-2">
            {martechTools.map((tool, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

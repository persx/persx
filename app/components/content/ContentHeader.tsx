import Image from "next/image";

type ContentType =
  | "blog"
  | "case_study"
  | "implementation_guide"
  | "test_result"
  | "best_practice"
  | "tool_guide"
  | "news";

interface ContentHeaderProps {
  title: string;
  contentType?: ContentType;
  publishedAt?: string | null;
  createdAt?: string;
  author?: string | null;
  featuredImage?: string | null;
  showTypeBadge?: boolean;
  excerpt?: string | null;
}

const contentTypeLabels: Record<ContentType, string> = {
  blog: "Blog Post",
  case_study: "Case Study",
  implementation_guide: "Implementation Guide",
  test_result: "Test Result",
  best_practice: "Best Practice",
  tool_guide: "Tool Guide",
  news: "News",
};

const contentTypeColors: Record<ContentType, string> = {
  blog: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  case_study:
    "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
  implementation_guide:
    "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  test_result:
    "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  best_practice:
    "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400",
  tool_guide:
    "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
  news: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
};

/**
 * ContentHeader - Displays title, metadata, and optional featured image
 * Used consistently across all content types
 */
export default function ContentHeader({
  title,
  contentType,
  publishedAt,
  createdAt,
  author,
  featuredImage,
  showTypeBadge = true,
  excerpt,
}: ContentHeaderProps) {
  const displayDate = publishedAt || createdAt;

  return (
    <header className="mb-8">
      {/* Type Badge */}
      {showTypeBadge && contentType && (
        <div className="mb-4">
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${contentTypeColors[contentType]}`}
          >
            {contentTypeLabels[contentType]}
          </span>
        </div>
      )}

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
        {title}
      </h1>

      {/* Meta information */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
        {displayDate && (
          <time dateTime={displayDate}>
            {new Date(displayDate).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        )}
        {author && (
          <>
            <span className="text-gray-400">•</span>
            <span>By {author}</span>
          </>
        )}
      </div>

      {/* Featured Image */}
      {featuredImage && (
        <div className="mb-6 rounded-lg overflow-hidden">
          <Image
            src={featuredImage}
            alt={title}
            width={1200}
            height={630}
            className="w-full h-auto"
            priority
          />
        </div>
      )}

      {/* Excerpt */}
      {excerpt && (
        <blockquote
          style={{
            borderLeft: '4px solid #06b6d4',
            paddingLeft: '1.25rem',
            paddingRight: '1.25rem',
            paddingTop: '0.75rem',
            paddingBottom: '0.75rem',
            marginBottom: '1.5rem',
            borderRadius: '0 0.5rem 0.5rem 0',
          }}
          className="text-gray-700 dark:text-gray-300 leading-relaxed"
        >
          {excerpt}
        </blockquote>
      )}
    </header>
  );
}

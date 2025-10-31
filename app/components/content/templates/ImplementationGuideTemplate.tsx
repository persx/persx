import ContentHeader from "../ContentHeader";
import ContentBody from "../ContentBody";
import ContentMeta from "../ContentMeta";
import ContentSources from "../ContentSources";

interface ImplementationGuideTemplateProps {
  content: any; // knowledge_base_content record
}

/**
 * ImplementationGuideTemplate - Step-by-step guide layout
 * Focuses on actionable instructions and clear progression
 */
export default function ImplementationGuideTemplate({
  content,
}: ImplementationGuideTemplateProps) {
  return (
    <div>
      {/* Header */}
      <ContentHeader
        title={content.title}
        contentType="implementation_guide"
        publishedAt={content.published_at}
        createdAt={content.created_at}
        author={content.author}
        featuredImage={content.featured_image_url}
        excerpt={content.excerpt}
      />

      {/* Guide Info Banner */}
      <div className="mb-8 p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex flex-wrap items-center gap-6">
          {content.estimated_read_time && (
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
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
              <span className="text-blue-900 dark:text-blue-200 font-medium">
                {content.estimated_read_time} min read
              </span>
            </div>
          )}
          {content.martech_tools && content.martech_tools.length > 0 && (
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                />
              </svg>
              <span className="text-blue-900 dark:text-blue-200 font-medium">
                Tools: {content.martech_tools.slice(0, 3).join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Content */}
        <div className="lg:col-span-3">
          {content.content && (
            <div className="mb-8">
              <ContentBody content={content.content} />
            </div>
          )}

          {/* Sources */}
          <div className="mt-8">
            <ContentSources
              sourceType={content.source_type}
              sourceName={content.source_name}
              sourceUrl={content.source_url}
              sourceAuthor={content.source_author}
              sourcePublishedDate={content.source_published_date}
              summary={content.summary}
            />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Quick Info */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Guide Information
              </h3>
              <ContentMeta
                tags={content.tags}
                industry={content.industry}
                goals={content.goals}
                showReadTime={false}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

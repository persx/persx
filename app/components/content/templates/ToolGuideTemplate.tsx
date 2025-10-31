import ContentHeader from "../ContentHeader";
import ContentBody from "../ContentBody";
import ContentMeta from "../ContentMeta";
import ContentSources from "../ContentSources";

interface ToolGuideTemplateProps {
  content: any; // knowledge_base_content record
}

/**
 * ToolGuideTemplate - Tool-focused layout with feature breakdown
 * Highlights specific tools, features, and use cases
 */
export default function ToolGuideTemplate({ content }: ToolGuideTemplateProps) {
  return (
    <div>
      {/* Header */}
      <ContentHeader
        title={content.title}
        contentType="tool_guide"
        publishedAt={content.published_at}
        createdAt={content.created_at}
        author={content.author}
        featuredImage={content.featured_image_url}
        excerpt={content.excerpt}
      />

      {/* Tool Info Bar */}
      {content.martech_tools && content.martech_tools.length > 0 && (
        <div className="mb-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-indigo-600 dark:bg-indigo-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
            </div>
            <div className="flex-grow">
              <h2 className="text-lg font-semibold text-indigo-900 dark:text-indigo-200 mb-2">
                Featured Tools
              </h2>
              <div className="flex flex-wrap gap-2">
                {content.martech_tools.map((tool: string, i: number) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-700 rounded-full font-medium"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Content */}
        <div className="lg:col-span-2">
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
            {/* Guide Metadata */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Guide Details
              </h3>
              <ContentMeta
                tags={content.tags}
                industry={content.industry}
                goals={content.goals}
                estimatedReadTime={content.estimated_read_time}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

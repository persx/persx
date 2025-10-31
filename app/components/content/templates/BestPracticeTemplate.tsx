import ContentHeader from "../ContentHeader";
import ContentBody from "../ContentBody";
import ContentMeta from "../ContentMeta";
import ContentSources from "../ContentSources";

interface BestPracticeTemplateProps {
  content: any; // knowledge_base_content record
}

/**
 * BestPracticeTemplate - Actionable tips and recommendations
 * Focuses on practical advice and clear takeaways
 */
export default function BestPracticeTemplate({
  content,
}: BestPracticeTemplateProps) {
  return (
    <div>
      {/* Header */}
      <ContentHeader
        title={content.title}
        contentType="best_practice"
        publishedAt={content.published_at}
        createdAt={content.created_at}
        author={content.author}
        featuredImage={content.featured_image_url}
        excerpt={content.excerpt}
      />

      {/* Quick Context */}
      <div className="mb-8 flex flex-wrap gap-4">
        {content.industry && (
          <div className="px-4 py-2 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg">
            <span className="text-sm text-teal-600 dark:text-teal-400 font-medium">
              {content.industry}
            </span>
          </div>
        )}
        {content.estimated_read_time && (
          <div className="px-4 py-2 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg flex items-center gap-2">
            <svg
              className="w-4 h-4 text-teal-600 dark:text-teal-400"
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
            <span className="text-sm text-teal-600 dark:text-teal-400 font-medium">
              {content.estimated_read_time} min read
            </span>
          </div>
        )}
      </div>

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
          <div className="sticky top-8">
            {/* Related Info */}
            <div className="p-4 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg mb-6">
              <h3 className="text-sm font-semibold text-teal-900 dark:text-teal-200 mb-3">
                Related To
              </h3>
              <ContentMeta
                tags={content.tags}
                goals={content.goals}
                martechTools={content.martech_tools}
                showReadTime={false}
                showIndustry={false}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

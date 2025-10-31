import ContentHeader from "../ContentHeader";
import ContentBody from "../ContentBody";

interface NewsTemplateProps {
  content: any; // knowledge_base_content record
}

/**
 * NewsTemplate - Multi-source news roundup layout
 * Displays sources, summaries, and PersX perspective
 */
export default function NewsTemplate({ content }: NewsTemplateProps) {
  return (
    <div>
      {/* Header */}
      <ContentHeader
        title={content.title}
        contentType="news"
        publishedAt={content.published_at}
        createdAt={content.created_at}
        author={content.author}
        showTypeBadge={false}
      />

      {/* Tags */}
      {content.tags && content.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {content.tags.map((tag: string, i: number) => (
            <span
              key={i}
              className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Overall Summary */}
      {content.overall_summary && (
        <div className="mb-6 md:mb-8 p-4 md:p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h2 className="text-base md:text-lg font-semibold mb-2 text-blue-900 dark:text-blue-200">
            Summary
          </h2>
          <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            {content.overall_summary}
          </p>
        </div>
      )}

      {/* PersX Perspective */}
      {content.persx_perspective && (
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-gray-900 dark:text-white">
            PersX.ai Perspective
          </h2>
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <div className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {content.persx_perspective}
            </div>
          </div>
        </section>
      )}

      {/* External Sources */}
      {content.external_sources && content.external_sources.length > 0 && (
        <section className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-900 dark:text-white">
            Sources
          </h2>
          <div className="space-y-3 md:space-y-4">
            {content.external_sources.map((source: any, index: number) => (
              <div
                key={index}
                className="p-4 md:p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-base md:text-lg mb-2 text-gray-900 dark:text-white">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline break-words"
                  >
                    {source.name || new URL(source.url).hostname}
                  </a>
                </h3>
                {source.author && (
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2">
                    By {source.author}
                  </p>
                )}
                {source.published_date && (
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-2 md:mb-3">
                    Published:{" "}
                    {new Date(source.published_date).toLocaleDateString()}
                  </p>
                )}
                {source.summary && (
                  <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                    {source.summary}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Content (if any) */}
      {content.content && (
        <div className="mb-8">
          <ContentBody content={content.content} />
        </div>
      )}
    </div>
  );
}

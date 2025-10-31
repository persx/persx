import ContentHeader from "../ContentHeader";
import ContentBody from "../ContentBody";
import ContentMeta from "../ContentMeta";
import ContentSources from "../ContentSources";

interface TestResultTemplateProps {
  content: any; // knowledge_base_content record
}

/**
 * TestResultTemplate - Data-focused layout for test results
 * Emphasizes metrics, findings, and before/after comparisons
 */
export default function TestResultTemplate({
  content,
}: TestResultTemplateProps) {
  return (
    <div>
      {/* Header */}
      <ContentHeader
        title={content.title}
        contentType="test_result"
        publishedAt={content.published_at}
        createdAt={content.created_at}
        author={content.author}
        featuredImage={content.featured_image_url}
        excerpt={content.excerpt}
      />

      {/* Test Overview Banner */}
      <div className="mb-8 p-6 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
        <h2 className="text-lg font-semibold text-orange-900 dark:text-orange-200 mb-3">
          Test Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {content.martech_tools && content.martech_tools.length > 0 && (
            <div>
              <div className="text-orange-600 dark:text-orange-400 font-medium mb-1">
                Tools Tested
              </div>
              <div className="text-gray-900 dark:text-white">
                {content.martech_tools.join(", ")}
              </div>
            </div>
          )}
          {content.industry && (
            <div>
              <div className="text-orange-600 dark:text-orange-400 font-medium mb-1">
                Industry
              </div>
              <div className="text-gray-900 dark:text-white">
                {content.industry}
              </div>
            </div>
          )}
          {content.published_at && (
            <div>
              <div className="text-orange-600 dark:text-orange-400 font-medium mb-1">
                Test Date
              </div>
              <div className="text-gray-900 dark:text-white">
                {new Date(content.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      {content.content && (
        <div className="mb-8">
          <ContentBody content={content.content} />
        </div>
      )}

      {/* Methodology & Sources */}
      <div className="mb-8">
        <ContentSources
          sourceType={content.source_type}
          sourceName={content.source_name}
          sourceUrl={content.source_url}
          sourceAuthor={content.source_author}
          sourcePublishedDate={content.source_published_date}
          summary={content.summary}
        />
      </div>

      {/* Metadata Footer */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <ContentMeta
          tags={content.tags}
          goals={content.goals}
          estimatedReadTime={content.estimated_read_time}
          showIndustry={false}
        />
      </div>
    </div>
  );
}

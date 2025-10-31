import ContentHeader from "../ContentHeader";
import ContentBody from "../ContentBody";
import ContentMeta from "../ContentMeta";
import ContentSources from "../ContentSources";

interface CaseStudyTemplateProps {
  content: any; // knowledge_base_content record
}

/**
 * CaseStudyTemplate - Problem/Solution/Results layout for case studies
 * Emphasizes outcomes and real-world application
 */
export default function CaseStudyTemplate({
  content,
}: CaseStudyTemplateProps) {
  return (
    <div>
      {/* Header */}
      <ContentHeader
        title={content.title}
        contentType="case_study"
        publishedAt={content.published_at}
        createdAt={content.created_at}
        author={content.author}
        featuredImage={content.featured_image_url}
        excerpt={content.excerpt}
      />

      {/* Key Highlights Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        {content.industry && (
          <div>
            <div className="text-sm text-green-600 dark:text-green-400 font-semibold mb-1">
              Industry
            </div>
            <div className="text-gray-900 dark:text-white font-medium">
              {content.industry}
            </div>
          </div>
        )}
        {content.martech_tools && content.martech_tools.length > 0 && (
          <div>
            <div className="text-sm text-green-600 dark:text-green-400 font-semibold mb-1">
              Tools Used
            </div>
            <div className="text-gray-900 dark:text-white font-medium">
              {content.martech_tools.slice(0, 2).join(", ")}
            </div>
          </div>
        )}
        {content.estimated_read_time && (
          <div>
            <div className="text-sm text-green-600 dark:text-green-400 font-semibold mb-1">
              Read Time
            </div>
            <div className="text-gray-900 dark:text-white font-medium">
              {content.estimated_read_time} minutes
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      {content.content && (
        <div className="mb-8">
          <ContentBody content={content.content} />
        </div>
      )}

      {/* Sources */}
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
          martechTools={content.martech_tools}
          showReadTime={false}
          showIndustry={false}
        />
      </div>
    </div>
  );
}

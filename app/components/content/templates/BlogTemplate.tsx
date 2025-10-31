import ContentHeader from "../ContentHeader";
import ContentBody from "../ContentBody";
import ContentMeta from "../ContentMeta";
import ContentSources from "../ContentSources";

interface BlogTemplateProps {
  content: any; // knowledge_base_content record
}

/**
 * BlogTemplate - Standard article layout for blog posts
 * Clean, focused reading experience with sidebar metadata
 */
export default function BlogTemplate({ content }: BlogTemplateProps) {
  return (
    <div>
      {/* Header */}
      <ContentHeader
        title={content.title}
        contentType="blog"
        publishedAt={content.published_at}
        createdAt={content.created_at}
        author={content.author}
        featuredImage={content.featured_image_url}
        excerpt={content.excerpt}
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {content.content && <ContentBody content={content.content} />}

          {/* Sources (if external) */}
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

        {/* Sidebar Metadata */}
        <aside className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <ContentMeta
              tags={content.tags}
              industry={content.industry}
              goals={content.goals}
              martechTools={content.martech_tools}
              estimatedReadTime={content.estimated_read_time}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}

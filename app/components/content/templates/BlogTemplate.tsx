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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
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
    </div>
  );
}

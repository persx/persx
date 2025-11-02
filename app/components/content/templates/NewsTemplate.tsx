import ContentHeader from "../ContentHeader";
import ContentBody from "../ContentBody";
import { ExternalSource } from "@/types/knowledge-base";

interface NewsTemplateProps {
  content: any; // knowledge_base_content record
}

/**
 * NewsTemplate - Editorial-style news roundup layout
 * Follows PersX editorial guidelines for scannable, action-oriented content
 * Structure: Title → TL;DR → Content (vendors, checklist, links) → Sources
 */
export default function NewsTemplate({ content }: NewsTemplateProps) {
  return (
    <article className="max-w-4xl">
      {/* Header with Title & Metadata */}
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
        <div className="flex flex-wrap gap-2 mb-6 md:mb-8" role="list" aria-label="Article tags">
          {content.tags.map((tag: string, i: number) => (
            <span
              key={i}
              role="listitem"
              className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* TL;DR - Prominent one-sentence summary as H2 */}
      {content.overall_summary && (
        <aside className="mb-8 md:mb-10 p-5 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-l-4 border-blue-600 dark:border-blue-400 rounded-r-lg">
          <h2 className="text-base md:text-lg text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
            {content.overall_summary}
          </h2>
        </aside>
      )}

      {/* Main Editorial Content */}
      {/* Expected structure in markdown:
          - Highlights by Vendor (H2)
            - Vendor Name (H3) with What/Why/Try sections
          - Cross-Vendor Checklist (H2)
          - Internal Links (H2)
          - Meta Description (H2)
          - Automated Schema Plan (H2)
      */}
      {content.content && (
        <div className="mb-10 md:mb-12">
          <ContentBody content={content.content} />
        </div>
      )}

      {/* Sources Section - Clean link list */}
      {content.external_sources && content.external_sources.length > 0 && (
        <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl md:text-2xl font-bold mb-5 text-gray-900 dark:text-white">
            Sources
          </h2>
          <ul className="space-y-3" role="list">
            {content.external_sources.map((source: ExternalSource, index: number) => {
              const domain = source.url ? new URL(source.url).hostname.replace('www.', '') : '';
              const displayName = source.name || domain;

              return (
                <li key={index} className="text-sm md:text-base">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline inline-flex items-center gap-2 group"
                  >
                    <span className="font-medium">{displayName}</span>
                    <span className="text-gray-500 dark:text-gray-400 text-xs">({domain})</span>
                    <svg
                      className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Schema.org structured data for SEO */}
      {typeof window === 'undefined' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "NewsArticle",
              headline: content.title,
              description: content.overall_summary || content.excerpt,
              datePublished: content.published_at,
              dateModified: content.updated_at,
              author: {
                "@type": "Organization",
                name: content.author || "PersX.ai",
                url: "https://www.persx.ai"
              },
              publisher: {
                "@type": "Organization",
                name: "PersX.ai",
                url: "https://www.persx.ai"
              },
              about: content.tags?.map((tag: string) => ({
                "@type": "Thing",
                name: tag
              })),
              mentions: content.external_sources?.map((source: ExternalSource) => ({
                "@type": "Thing",
                name: source.name,
                url: source.url
              }))
            })
          }}
        />
      )}
    </article>
  );
}

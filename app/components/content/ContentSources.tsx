interface ExternalSource {
  url: string;
  name?: string;
  author?: string;
  published_date?: string;
  summary?: string;
}

interface ContentSourcesProps {
  // Single source fields (for external_curated/external_referenced)
  sourceType?: "internal" | "external_curated" | "external_referenced";
  sourceName?: string | null;
  sourceUrl?: string | null;
  sourceAuthor?: string | null;
  sourcePublishedDate?: string | null;
  summary?: string | null;

  // Multi-source fields (for news roundups)
  externalSources?: ExternalSource[] | null;
  overallSummary?: string | null;
  persxPerspective?: string | null;

  className?: string;
}

/**
 * ContentSources - Displays external source attribution
 * Handles both single-source and multi-source content
 */
export default function ContentSources({
  sourceType,
  sourceName,
  sourceUrl,
  sourceAuthor,
  sourcePublishedDate,
  summary,
  externalSources,
  overallSummary,
  persxPerspective,
  className = "",
}: ContentSourcesProps) {
  const hasMultipleSources =
    externalSources && externalSources.length > 0;
  const hasSingleSource =
    sourceType &&
    (sourceType === "external_curated" ||
      sourceType === "external_referenced") &&
    sourceUrl;

  if (!hasMultipleSources && !hasSingleSource) return null;

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Overall Summary (for multi-source) */}
      {overallSummary && hasMultipleSources && (
        <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h2 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-200">
            Summary
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {overallSummary}
          </p>
        </div>
      )}

      {/* Single External Source */}
      {hasSingleSource && (
        <div className="border-l-4 border-blue-500 pl-6">
          <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
            {sourceType === "external_curated"
              ? "Curated From"
              : "Referenced From"}
          </h2>
          <div className="space-y-2">
            {sourceUrl && (
              <p className="text-gray-700 dark:text-gray-300">
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                >
                  {sourceName || new URL(sourceUrl).hostname}
                </a>
              </p>
            )}
            {sourceAuthor && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By {sourceAuthor}
              </p>
            )}
            {sourcePublishedDate && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Published:{" "}
                {new Date(sourcePublishedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
            {summary && (
              <p className="text-gray-700 dark:text-gray-300 mt-3 leading-relaxed">
                {summary}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Multiple External Sources */}
      {hasMultipleSources && (
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            Sources
          </h2>
          <div className="space-y-4">
            {externalSources.map((source, index) => (
              <div
                key={index}
                className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                  >
                    {source.name || new URL(source.url).hostname}
                  </a>
                </h3>
                {source.author && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    By {source.author}
                  </p>
                )}
                {source.published_date && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Published:{" "}
                    {new Date(source.published_date).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </p>
                )}
                {source.summary && (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {source.summary}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PersX Perspective */}
      {persxPerspective && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            PersX.ai Perspective
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {persxPerspective}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

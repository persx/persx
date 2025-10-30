import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const supabase = createClient();

  // Fetch the news article by slug
  const { data: article, error } = await supabase
    .from("knowledge_base_content")
    .select("*")
    .eq("slug", params.slug)
    .eq("content_type", "news")
    .single();

  if (error || !article) {
    notFound();
  }

  // Only show published articles to public
  if (article.status !== "published") {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Link
          href="/news"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-8"
        >
          ← Back to News
        </Link>

        {/* Article Header */}
        <article>
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              {article.title}
            </h1>

            {/* Meta information */}
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <time dateTime={article.created_at}>
                {new Date(article.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag: string, i: number) => (
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
            {article.overall_summary && (
              <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h2 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-200">
                  Summary
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {article.overall_summary}
                </p>
              </div>
            )}
          </header>

          {/* External Sources */}
          {article.external_sources && article.external_sources.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                Sources
              </h2>
              <div className="space-y-4">
                {article.external_sources.map((source: any, index: number) => (
                  <div
                    key={index}
                    className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
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
                        Published: {new Date(source.published_date).toLocaleDateString()}
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
          {article.persx_perspective && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                PersX.ai Perspective
              </h2>
              <div className="prose dark:prose-invert max-w-none">
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {article.persx_perspective}
                </div>
              </div>
            </section>
          )}
        </article>

        {/* Related Articles CTA */}
        <div className="mt-12 p-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
            Stay Informed
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Get the latest news and insights about personalization and marketing technology.
          </p>
          <Link
            href="/news"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View All News
          </Link>
        </div>
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function Tools() {
  const supabase = createClient();

  // Fetch tool guides from database
  const { data: toolGuides, error } = await supabase
    .from("knowledge_base_content")
    .select(
      "id, title, slug, excerpt, created_at, published_at, status, tags, martech_tools, industry"
    )
    .eq("content_type", "tool_guide")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching tool guides:", error);
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Tool Guides
        </h1>
        <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Comprehensive guides for marketing and personalization tools
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {toolGuides && toolGuides.length > 0 ? (
            toolGuides.map((guide) => (
              <Link
                key={guide.id}
                href={`/tools/${guide.slug}`}
                className="group"
              >
                <article className="h-full p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all hover:border-indigo-500 dark:hover:border-indigo-500">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
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

                  <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {guide.title}
                  </h2>

                  {guide.excerpt && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                      {guide.excerpt}
                    </p>
                  )}

                  {guide.martech_tools && guide.martech_tools.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {guide.martech_tools
                          .slice(0, 2)
                          .map((tool: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded font-medium"
                            >
                              {tool}
                            </span>
                          ))}
                        {guide.martech_tools.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                            +{guide.martech_tools.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {guide.industry && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 mb-3">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      {guide.industry}
                    </div>
                  )}

                  <div className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                    Explore guide →
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-12 text-gray-500 dark:text-gray-400">
              No tool guides available yet. Check back soon!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function Guides() {
  const supabase = createClient();

  // Fetch implementation guides from database
  const { data: guides, error } = await supabase
    .from("knowledge_base_content")
    .select(
      "id, title, slug, excerpt, created_at, published_at, status, tags, martech_tools, estimated_read_time"
    )
    .eq("content_type", "implementation_guide")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching guides:", error);
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Implementation Guides
        </h1>
        <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Step-by-step tutorials and implementation resources
        </h2>

        <div className="space-y-6">
          {guides && guides.length > 0 ? (
            guides.map((guide) => (
              <Link key={guide.id} href={`/guides/${guide.slug}`} className="group block">
                <article className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all hover:border-blue-500 dark:hover:border-blue-500">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm text-gray-500 dark:text-gray-500">
                          {new Date(
                            guide.published_at || guide.created_at
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        {guide.estimated_read_time && (
                          <>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm text-gray-500 dark:text-gray-500">
                              {guide.estimated_read_time} min read
                            </span>
                          </>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {guide.title}
                      </h2>
                      {guide.excerpt && (
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                          {guide.excerpt}
                        </p>
                      )}
                      {guide.martech_tools && guide.martech_tools.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            Tools:
                          </span>
                          {guide.martech_tools
                            .slice(0, 4)
                            .map((tool: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded"
                              >
                                {tool}
                              </span>
                            ))}
                        </div>
                      )}
                      {guide.tags && guide.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {guide.tags.slice(0, 3).map((tag: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No implementation guides available yet. Check back soon!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

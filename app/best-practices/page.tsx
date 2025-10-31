import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function BestPractices() {
  const supabase = createClient();

  // Fetch best practices from database
  const { data: bestPractices, error } = await supabase
    .from("knowledge_base_content")
    .select(
      "id, title, slug, excerpt, created_at, published_at, status, tags, industry, goals, estimated_read_time"
    )
    .eq("content_type", "best_practice")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching best practices:", error);
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Best Practices
        </h1>
        <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Proven strategies and actionable recommendations
        </h2>

        <div className="space-y-6">
          {bestPractices && bestPractices.length > 0 ? (
            bestPractices.map((practice) => (
              <Link
                key={practice.id}
                href={`/best-practices/${practice.slug}`}
                className="group block"
              >
                <article className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all hover:border-teal-500 dark:hover:border-teal-500">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {practice.industry && (
                          <span className="px-3 py-1 text-xs font-semibold bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-full">
                            {practice.industry}
                          </span>
                        )}
                        {practice.estimated_read_time && (
                          <span className="text-sm text-gray-500 dark:text-gray-500">
                            {practice.estimated_read_time} min read
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                        {practice.title}
                      </h2>
                      {practice.excerpt && (
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                          {practice.excerpt}
                        </p>
                      )}
                      {practice.goals && practice.goals.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            Goals:
                          </span>
                          {practice.goals
                            .slice(0, 3)
                            .map((goal: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-1 text-xs bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 rounded"
                              >
                                {goal}
                              </span>
                            ))}
                        </div>
                      )}
                      {practice.tags && practice.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {practice.tags
                            .slice(0, 3)
                            .map((tag: string, i: number) => (
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
              No best practices available yet. Check back soon!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

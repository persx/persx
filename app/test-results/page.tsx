import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function TestResults() {
  const supabase = createClient();

  // Fetch test results from database
  const { data: testResults, error } = await supabase
    .from("knowledge_base_content")
    .select(
      "id, title, slug, excerpt, created_at, published_at, status, tags, industry, martech_tools"
    )
    .eq("content_type", "test_result")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching test results:", error);
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
          Test Results
        </h1>
        <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Data-driven insights and testing outcomes
        </h2>

        <div className="space-y-6">
          {testResults && testResults.length > 0 ? (
            testResults.map((test) => (
              <Link
                key={test.id}
                href={`/test-results/${test.slug}`}
                className="group block"
              >
                <article className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all hover:border-orange-500 dark:hover:border-orange-500">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
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
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {test.industry && (
                          <span className="px-3 py-1 text-xs font-semibold bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
                            {test.industry}
                          </span>
                        )}
                        <span className="text-sm text-gray-500 dark:text-gray-500">
                          {new Date(
                            test.published_at || test.created_at
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                        {test.title}
                      </h2>
                      {test.excerpt && (
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                          {test.excerpt}
                        </p>
                      )}
                      {test.martech_tools && test.martech_tools.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            Tools Tested:
                          </span>
                          {test.martech_tools
                            .slice(0, 3)
                            .map((tool: string, i: number) => (
                              <span
                                key={i}
                                className="px-2 py-1 text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded font-medium"
                              >
                                {tool}
                              </span>
                            ))}
                        </div>
                      )}
                      <div className="text-orange-600 dark:text-orange-400 font-semibold text-sm">
                        View results →
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No test results available yet. Check back soon!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

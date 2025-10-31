import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function CaseStudies() {
  const supabase = createClient();

  // Fetch case studies from database
  const { data: caseStudies, error } = await supabase
    .from("knowledge_base_content")
    .select(
      "id, title, slug, excerpt, created_at, published_at, status, tags, industry, martech_tools, goals"
    )
    .eq("content_type", "case_study")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching case studies:", error);
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
          Case Studies
        </h1>
        <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Real-world success stories and proven results
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {caseStudies && caseStudies.length > 0 ? (
            caseStudies.map((study) => (
              <Link
                key={study.id}
                href={`/case-studies/${study.slug}`}
                className="group"
              >
                <article className="h-full p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all hover:border-green-500 dark:hover:border-green-500">
                  <div className="flex items-start justify-between mb-3">
                    {study.industry && (
                      <span className="px-3 py-1 text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full">
                        {study.industry}
                      </span>
                    )}
                    <span className="text-sm text-gray-500 dark:text-gray-500">
                      {new Date(
                        study.published_at || study.created_at
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {study.title}
                  </h2>

                  {study.excerpt && (
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      {study.excerpt}
                    </p>
                  )}

                  {study.martech_tools && study.martech_tools.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        Tools:
                      </span>
                      {study.martech_tools
                        .slice(0, 3)
                        .map((tool: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                          >
                            {tool}
                          </span>
                        ))}
                    </div>
                  )}

                  {study.goals && study.goals.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        Goals:
                      </span>
                      {study.goals.slice(0, 2).map((goal: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-1 text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded"
                        >
                          {goal}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-green-600 dark:text-green-400 font-semibold text-sm">
                    Read case study →
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 text-gray-500 dark:text-gray-400">
              No case studies available yet. Check back soon!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function News() {
  const supabase = createClient();

  // Fetch news content from database
  const { data: newsItems, error } = await supabase
    .from("knowledge_base_content")
    .select("id, title, slug, overall_summary, created_at, status, tags")
    .eq("content_type", "news")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching news:", error);
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          News
        </h1>
        <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Latest announcements and updates from PersX.ai
        </h2>

        <div className="space-y-6">
          {newsItems && newsItems.length > 0 ? (
            newsItems.map((item, index) => (
              <div
                key={item.id}
                className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(item.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      {item.tags && item.tags.length > 0 && (
                        <div className="flex gap-2">
                          {item.tags.slice(0, 3).map((tag: string, i: number) => (
                            <span
                              key={i}
                              className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <Link href={`/news/${item.slug}`}>
                      <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                        {item.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      {item.overall_summary}
                    </p>
                    <Link
                      href={`/news/${item.slug}`}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold text-sm"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No news items available yet. Check back soon!
            </div>
          )}
        </div>

        <div className="mt-12 p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-200">
            Stay Updated
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Subscribe to our newsletter to receive the latest news and updates directly in your inbox.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

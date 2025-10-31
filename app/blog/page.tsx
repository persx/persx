import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function Blog() {
  const supabase = createClient();

  // Fetch blog posts from database
  const { data: blogPosts, error } = await supabase
    .from("knowledge_base_content")
    .select(
      "id, title, slug, excerpt, created_at, published_at, status, tags, author, estimated_read_time, featured_image_url"
    )
    .eq("content_type", "blog")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Error fetching blog posts:", error);
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Blog
        </h1>
        <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Insights, tutorials, and updates from the PersX.ai team
        </h2>

        <div className="space-y-8">
          {blogPosts && blogPosts.length > 0 ? (
            blogPosts.map((post) => (
              <article
                key={post.id}
                className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {post.featured_image_url && (
                    <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30">
                      <img
                        src={post.featured_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm text-gray-500 dark:text-gray-500">
                        {new Date(
                          post.published_at || post.created_at
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      {post.author && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-500 dark:text-gray-500">
                            By {post.author}
                          </span>
                        </>
                      )}
                      {post.estimated_read_time && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-500 dark:text-gray-500">
                            {post.estimated_read_time} min read
                          </span>
                        </>
                      )}
                    </div>
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 transition-colors cursor-pointer">
                        {post.title}
                      </h2>
                    </Link>
                    {post.excerpt && (
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 3).map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-semibold text-sm"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No blog posts available yet. Check back soon!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase-server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const supabase = createClient();

  // Extract first name from email
  const userEmail = session?.user?.email || "";
  const userName = userEmail.split("@")[0] || "User";

  // Get content counts
  const { count: blogCount } = await supabase
    .from("knowledge_base_content")
    .select("*", { count: "exact", head: true })
    .eq("content_type", "blog");

  const { count: caseStudyCount } = await supabase
    .from("knowledge_base_content")
    .select("*", { count: "exact", head: true })
    .eq("content_type", "case_study");

  const { count: guideCount } = await supabase
    .from("knowledge_base_content")
    .select("*", { count: "exact", head: true })
    .eq("content_type", "implementation_guide");

  const { count: newsCount } = await supabase
    .from("knowledge_base_content")
    .select("*", { count: "exact", head: true })
    .eq("content_type", "news");

  const { count: roadmapCount } = await supabase
    .from("roadmap_submissions")
    .select("*", { count: "exact", head: true });

  // Get recent content
  const { data: recentContent } = await supabase
    .from("knowledge_base_content")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "Blog Posts", value: blogCount || 0, icon: "📝", color: "blue", link: "/go/cm/content?type=blog" },
    { label: "Case Studies", value: caseStudyCount || 0, icon: "📊", color: "purple", link: "/go/cm/content?type=case_study" },
    { label: "Guides", value: guideCount || 0, icon: "📚", color: "green", link: "/go/cm/content?type=implementation_guide" },
    { label: "News", value: newsCount || 0, icon: "📰", color: "orange", link: "/go/cm/content?type=news" },
    { label: "Roadmap Submissions", value: roadmapCount || 0, icon: "🗺️", color: "pink", link: "/go/cm/rm" },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      green: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      orange: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
      pink: "bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400",
    };
    return colors[color] || colors.blue;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Hello, {userName}! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Welcome to the PersX.ai Content Management System
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => {
          const card = (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                  {stat.value}
                </p>
              </div>
              <div className={`text-4xl p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                {stat.icon}
              </div>
            </div>
          );

          if (stat.link) {
            return (
              <Link
                key={stat.label}
                href={stat.link}
                className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer"
              >
                {card}
              </Link>
            );
          }

          return (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
            >
              {card}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/go/cm/content/new?type=blog"
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
          >
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">New Blog Post</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Create a new blog article
            </p>
          </Link>

          <Link
            href="/go/cm/content/new?type=case_study"
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">New Case Study</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Add a success story
            </p>
          </Link>

          <Link
            href="/go/cm/content/new?type=implementation_guide"
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-colors"
          >
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">New Guide</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Write an implementation guide
            </p>
          </Link>

          <Link
            href="/go/cm/content/new?type=news"
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:border-orange-500 dark:hover:border-orange-500 transition-colors"
          >
            <div className="text-3xl mb-3">📰</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">New News Item</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Publish a news update
            </p>
          </Link>
        </div>
      </div>

      {/* Recent Content */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Content</h2>
          <Link
            href="/go/cm/content"
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            View All →
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          {!recentContent || recentContent.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No content yet. Create your first piece of content to get started!
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentContent.map((content) => (
                <Link
                  key={content.id}
                  href={`/cm/content/${content.id}`}
                  className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          {content.content_type}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          content.status === "published"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        }`}>
                          {content.status}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mt-2">
                        {content.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {content.excerpt || content.content.substring(0, 150)}
                      </p>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                      {formatDate(content.created_at)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

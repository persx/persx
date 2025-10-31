import { createClient } from "@/lib/supabase-server";
import Link from "next/link";
import ContentFilter from "./components/ContentFilter";

type SearchParams = {
  type?: string;
  status?: string;
  search?: string;
};

export default async function ContentListPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const supabase = createClient();

  let query = supabase
    .from("knowledge_base_content")
    .select("*")
    .order("created_at", { ascending: false});

  // Apply filters
  if (searchParams.type) {
    query = query.eq("content_type", searchParams.type);
  }
  if (searchParams.status) {
    query = query.eq("status", searchParams.status);
  }
  if (searchParams.search) {
    // Search in title and excerpt (case-insensitive)
    query = query.or(`title.ilike.%${searchParams.search}%,excerpt.ilike.%${searchParams.search}%`);
  }

  const { data: content, error } = await query;

  if (error) {
    console.error("Error fetching content:", error);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      blog: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      case_study: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
      implementation_guide: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      news: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
      test_result: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
      best_practice: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
      tool_guide: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    };
    return colors[type] || colors.blog;
  };

  const formatType = (type: string) => {
    return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage all your content in one place
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/go/cm/content/quick-add"
            className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
          >
            ⚡ Quick Add News
          </Link>
          <Link
            href="/go/cm/content/new"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            + New Content
          </Link>
        </div>
      </div>

      {/* Filters */}
      <ContentFilter currentType={searchParams.type} currentStatus={searchParams.status} currentSearch={searchParams.search} />

      {/* Content List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {!content || content.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No content found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchParams.type || searchParams.status || searchParams.search
                ? "Try adjusting your filters or search"
                : "Get started by creating your first piece of content"}
            </p>
            <Link
              href="/go/cm/content/new"
              className="inline-block px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              Create Content
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {content.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-start">
                          <div>
                            <Link
                              href={`/go/cm/content/${item.id}`}
                              className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              {item.title}
                            </Link>
                            {item.excerpt && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1">
                                {item.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${getTypeColor(item.content_type)}`}>
                          {formatType(item.content_type)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          item.status === "published"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/go/cm/content/${item.id}`}
                          className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                        >
                          Edit →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-gray-200 dark:divide-gray-700">
              {content.map((item) => (
                <Link
                  key={item.id}
                  href={`/go/cm/content/${item.id}`}
                  className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-gray-900 dark:text-white flex-1">
                        {item.title}
                      </h3>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full shrink-0 ${getTypeColor(item.content_type)}`}>
                        {formatType(item.content_type)}
                      </span>
                    </div>

                    {item.excerpt && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {item.excerpt}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm">
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        item.status === "published"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {formatDate(item.created_at)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase-server";
import Link from "next/link";

export default async function RoadmapSubmissionsPage() {
  const supabase = createClient();

  const { data: submissions, error } = await supabase
    .from("roadmap_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching submissions:", error);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEnvironmentBadge = (env: string | null) => {
    if (env === "production") {
      return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
    }
    return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Roadmap Submissions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View all roadmap form submissions from visitors
          </p>
        </div>
        <Link
          href="/go/cm"
          className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Total Submissions
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {submissions?.length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            From Production
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {submissions?.filter((s) => s.environment === "production").length || 0}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            From Local
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {submissions?.filter((s) => s.environment === "local").length || 0}
          </p>
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {!submissions || submissions.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No submissions yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Roadmap submissions from visitors will appear here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Goals
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Environment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    IP Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {submissions.map((submission) => (
                  <tr
                    key={submission.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(submission.created_at)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {submission.industry}
                      {submission.industry_other && (
                        <span className="text-gray-500 dark:text-gray-400">
                          {" "}
                          ({submission.industry_other})
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      <div className="max-w-xs">
                        {submission.goals?.join(", ") || "—"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded-full ${getEnvironmentBadge(
                          submission.environment
                        )}`}
                      >
                        {submission.environment || "unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {[submission.city, submission.region, submission.country]
                        .filter(Boolean)
                        .join(", ") || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600 dark:text-gray-400">
                      {submission.ip_address || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {submission.email || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

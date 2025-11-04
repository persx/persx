"use client";

import { useRouter, useSearchParams } from "next/navigation";

const contentTypes = [
  { value: "", label: "All Types" },
  { value: "blog", label: "Blog Posts" },
  { value: "case_study", label: "Case Studies" },
  { value: "implementation_guide", label: "Guides" },
  { value: "news", label: "News" },
  { value: "test_result", label: "Test Results" },
  { value: "best_practice", label: "Best Practices" },
  { value: "tool_guide", label: "Tool Guides" },
  { value: "static_page", label: "Static Pages" },
];

const statuses = [
  { value: "", label: "All Statuses" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
];

export default function ContentFilter({
  currentType,
  currentStatus,
}: {
  currentType?: string;
  currentStatus?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams?.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`/go/cm/content?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4">
      <div className="flex-1 min-w-[200px]">
        <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Content Type
        </label>
        <select
          id="type-filter"
          value={currentType || ""}
          onChange={(e) => handleFilterChange("type", e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {contentTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Status
        </label>
        <select
          id="status-filter"
          value={currentStatus || ""}
          onChange={(e) => handleFilterChange("status", e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {statuses.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

"use client";

import type { CTABannerBlock } from "@/types/content-blocks";

interface CTABannerBlockEditorProps {
  data: CTABannerBlock["data"];
  onChange: (data: CTABannerBlock["data"]) => void;
}

export default function CTABannerBlockEditor({ data, onChange }: CTABannerBlockEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Heading
        </label>
        <input
          type="text"
          value={data.heading || ""}
          onChange={(e) => onChange({ ...data, heading: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          value={data.description || ""}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
          rows={2}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Button
        </label>
        <div className="space-y-2">
          <input
            type="text"
            value={data.button?.text || ""}
            onChange={(e) => onChange({
              ...data,
              button: { ...data.button, text: e.target.value, href: data.button?.href || "/" }
            })}
            placeholder="Button text"
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          />
          <input
            type="text"
            value={data.button?.href || ""}
            onChange={(e) => onChange({
              ...data,
              button: { text: data.button?.text || "", href: e.target.value }
            })}
            placeholder="Button link"
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Gradient
        </label>
        <select
          value={data.gradient || "blue-purple"}
          onChange={(e) => onChange({ ...data, gradient: e.target.value as "blue-purple" | "purple-pink" | "blue-green" | "orange-red" })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
        >
          <option value="blue-purple">Blue to Purple</option>
          <option value="purple-pink">Purple to Pink</option>
          <option value="blue-green">Blue to Green</option>
          <option value="orange-red">Orange to Red</option>
        </select>
      </div>
    </div>
  );
}

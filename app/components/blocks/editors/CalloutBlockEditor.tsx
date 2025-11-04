"use client";

import type { CalloutBlock } from "@/types/content-blocks";

interface CalloutBlockEditorProps {
  data: CalloutBlock["data"];
  onChange: (data: CalloutBlock["data"]) => void;
}

export default function CalloutBlockEditor({ data, onChange }: CalloutBlockEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Icon
        </label>
        <input
          type="text"
          value={data.icon || ""}
          onChange={(e) => onChange({ ...data, icon: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <input
          type="text"
          value={data.title || ""}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Content (HTML)
        </label>
        <textarea
          value={data.content || ""}
          onChange={(e) => onChange({ ...data, content: e.target.value })}
          rows={3}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Variant
          </label>
          <select
            value={data.variant || "info"}
            onChange={(e) => onChange({ ...data, variant: e.target.value as any })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="success">Success</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Color
          </label>
          <select
            value={data.color || "blue"}
            onChange={(e) => onChange({ ...data, color: e.target.value as "blue" | "amber" | "green" | "red" | "purple" })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <option value="blue">Blue</option>
            <option value="amber">Amber</option>
            <option value="green">Green</option>
            <option value="red">Red</option>
            <option value="purple">Purple</option>
          </select>
        </div>
      </div>
    </div>
  );
}

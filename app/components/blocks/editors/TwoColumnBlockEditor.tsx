"use client";

import type { TwoColumnBlock } from "@/types/content-blocks";

interface TwoColumnBlockEditorProps {
  data: TwoColumnBlock["data"];
  onChange: (data: TwoColumnBlock["data"]) => void;
}

export default function TwoColumnBlockEditor({ data, onChange }: TwoColumnBlockEditorProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Variant
          </label>
          <select
            value={data.variant || "equal"}
            onChange={(e) => onChange({ ...data, variant: e.target.value as any })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <option value="equal">Equal</option>
            <option value="left-heavy">Left Heavy</option>
            <option value="right-heavy">Right Heavy</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Background
          </label>
          <select
            value={data.background || "default"}
            onChange={(e) => onChange({ ...data, background: e.target.value as any })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <option value="default">Default</option>
            <option value="gray">Gray</option>
            <option value="gradient">Gradient</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Left Column Type
          </label>
          <select
            value={data.leftColumn.type}
            onChange={(e) =>
              onChange({
                ...data,
                leftColumn: { ...data.leftColumn, type: e.target.value as any },
              })
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          >
            <option value="text">Text</option>
            <option value="image">Image</option>
            <option value="custom">Custom</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Left Column Content (HTML)
        </label>
        <textarea
          value={data.leftColumn.content || ""}
          onChange={(e) =>
            onChange({
              ...data,
              leftColumn: { ...data.leftColumn, content: e.target.value },
            })
          }
          rows={5}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-mono text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Right Column Content (HTML)
        </label>
        <textarea
          value={data.rightColumn.content || ""}
          onChange={(e) =>
            onChange({
              ...data,
              rightColumn: { ...data.rightColumn, content: e.target.value },
            })
          }
          rows={5}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 font-mono text-sm"
        />
      </div>
    </div>
  );
}

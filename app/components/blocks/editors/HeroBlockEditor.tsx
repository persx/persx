"use client";

import type { HeroBlock } from "@/types/content-blocks";

interface HeroBlockEditorProps {
  data: HeroBlock["data"];
  onChange: (data: HeroBlock["data"]) => void;
}

export default function HeroBlockEditor({ data, onChange }: HeroBlockEditorProps) {
  const handleButtonChange = (index: number, field: string, value: string) => {
    const newButtons = [...(data.buttons || [])];
    const currentButton = newButtons[index] || { text: '', href: '', variant: 'primary' as const };
    newButtons[index] = { ...currentButton, [field]: value };
    onChange({ ...data, buttons: newButtons });
  };

  const addButton = () => {
    onChange({
      ...data,
      buttons: [...(data.buttons || []), { text: "New Button", href: "/", variant: "primary" }]
    });
  };

  const removeButton = (index: number) => {
    onChange({
      ...data,
      buttons: data.buttons?.filter((_, i) => i !== index) || []
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title
        </label>
        <input
          type="text"
          value={data.title || ""}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Subtitle
        </label>
        <textarea
          value={data.subtitle || ""}
          onChange={(e) => onChange({ ...data, subtitle: e.target.value })}
          rows={2}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Alignment
        </label>
        <select
          value={data.alignment || "center"}
          onChange={(e) => onChange({ ...data, alignment: e.target.value as any })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Buttons
          </label>
          <button
            type="button"
            onClick={addButton}
            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            + Add Button
          </button>
        </div>
        <div className="space-y-3">
          {data.buttons?.map((button, index) => (
            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={button.text}
                  onChange={(e) => handleButtonChange(index, "text", e.target.value)}
                  placeholder="Button text"
                  className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeButton(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  ×
                </button>
              </div>
              <input
                type="text"
                value={button.href}
                onChange={(e) => handleButtonChange(index, "href", e.target.value)}
                placeholder="Link URL"
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              />
              <select
                value={button.variant}
                onChange={(e) => handleButtonChange(index, "variant", e.target.value)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              >
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

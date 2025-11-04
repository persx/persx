"use client";

import type { FeatureGridBlock } from "@/types/content-blocks";

interface FeatureGridBlockEditorProps {
  data: FeatureGridBlock["data"];
  onChange: (data: FeatureGridBlock["data"]) => void;
}

export default function FeatureGridBlockEditor({ data, onChange }: FeatureGridBlockEditorProps) {
  const handleFeatureChange = (index: number, field: string, value: string) => {
    const newFeatures = [...(data.features || [])];
    const currentFeature = newFeatures[index] || { icon: '', title: '', description: '' };
    newFeatures[index] = { ...currentFeature, [field]: value };
    onChange({ ...data, features: newFeatures });
  };

  const addFeature = () => {
    onChange({
      ...data,
      features: [...(data.features || []), { icon: "⭐", title: "New Feature", description: "Description" }]
    });
  };

  const removeFeature = (index: number) => {
    onChange({
      ...data,
      features: data.features?.filter((_, i) => i !== index) || []
    });
  };

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
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Features
          </label>
          <button
            type="button"
            onClick={addFeature}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Feature
          </button>
        </div>
        <div className="space-y-3">
          {data.features?.map((feature, index) => (
            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={feature.icon}
                  onChange={(e) => handleFeatureChange(index, "icon", e.target.value)}
                  placeholder="Icon"
                  className="w-16 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                />
                <input
                  type="text"
                  value={feature.title}
                  onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
                  placeholder="Title"
                  className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  ×
                </button>
              </div>
              <textarea
                value={feature.description}
                onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
                placeholder="Description"
                rows={2}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

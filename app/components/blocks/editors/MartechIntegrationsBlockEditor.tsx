"use client";

import type { MartechIntegrationsBlock } from "@/types/content-blocks";

interface MartechIntegrationsBlockEditorProps {
  data: MartechIntegrationsBlock["data"];
  onChange: (data: MartechIntegrationsBlock["data"]) => void;
}

export default function MartechIntegrationsBlockEditor({ data, onChange }: MartechIntegrationsBlockEditorProps) {
  const handleIntegrationChange = (index: number, field: string, value: string) => {
    const newIntegrations = [...(data.integrations || [])];
    const currentIntegration = newIntegrations[index] || { name: '', color: '', fontSize: 'text-3xl' as const };
    newIntegrations[index] = { ...currentIntegration, [field]: value };
    onChange({ ...data, integrations: newIntegrations });
  };

  const addIntegration = () => {
    onChange({
      ...data,
      integrations: [...(data.integrations || []), { name: "New Tool", color: "blue-600", fontSize: "text-3xl" }]
    });
  };

  const removeIntegration = (index: number) => {
    onChange({
      ...data,
      integrations: data.integrations?.filter((_, i) => i !== index) || []
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
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Subheading
        </label>
        <input
          type="text"
          value={data.subheading || ""}
          onChange={(e) => onChange({ ...data, subheading: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Integrations
          </label>
          <button
            type="button"
            onClick={addIntegration}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Integration
          </button>
        </div>
        <div className="space-y-2">
          {data.integrations?.map((integration, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={integration.name}
                onChange={(e) => handleIntegrationChange(index, "name", e.target.value)}
                placeholder="Tool name"
                className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
              />
              <input
                type="text"
                value={integration.color}
                onChange={(e) => handleIntegrationChange(index, "color", e.target.value)}
                placeholder="Color"
                className="w-32 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
              />
              <button
                type="button"
                onClick={() => removeIntegration(index)}
                className="text-red-500 hover:text-red-600 px-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

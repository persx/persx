"use client";

import type { StepsBlock } from "@/types/content-blocks";

interface StepsBlockEditorProps {
  data: StepsBlock["data"];
  onChange: (data: StepsBlock["data"]) => void;
}

export default function StepsBlockEditor({ data, onChange }: StepsBlockEditorProps) {
  const handleStepChange = (index: number, field: string, value: string) => {
    const newSteps = [...(data.steps || [])];
    const currentStep = newSteps[index] || { title: '', description: '', color: 'blue' as const };
    newSteps[index] = { ...currentStep, [field]: value };
    onChange({ ...data, steps: newSteps });
  };

  const addStep = () => {
    onChange({
      ...data,
      steps: [...(data.steps || []), { title: "New Step", description: "Step description", color: "blue" }]
    });
  };

  const removeStep = (index: number) => {
    onChange({
      ...data,
      steps: data.steps?.filter((_, i) => i !== index) || []
    });
  };

  const moveStepUp = (index: number) => {
    if (index === 0) return;
    const newSteps = [...(data.steps || [])];
    const temp = newSteps[index - 1];
    newSteps[index - 1] = newSteps[index]!;
    newSteps[index] = temp!;
    onChange({ ...data, steps: newSteps });
  };

  const moveStepDown = (index: number) => {
    if (index === (data.steps?.length || 0) - 1) return;
    const newSteps = [...(data.steps || [])];
    const temp = newSteps[index];
    newSteps[index] = newSteps[index + 1]!;
    newSteps[index + 1] = temp!;
    onChange({ ...data, steps: newSteps });
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
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Subheading (optional)
        </label>
        <input
          type="text"
          value={data.subheading || ""}
          onChange={(e) => onChange({ ...data, subheading: e.target.value })}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Steps
          </label>
          <button
            type="button"
            onClick={addStep}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            + Add Step
          </button>
        </div>
        <div className="space-y-3">
          {data.steps?.map((step, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Step {index + 1}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveStepUp(index)}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveStepDown(index)}
                    disabled={index === (data.steps?.length || 0) - 1}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-bold text-xl"
                    title="Remove step"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => handleStepChange(index, "title", e.target.value)}
                  placeholder="Step title"
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  value={step.description}
                  onChange={(e) => handleStepChange(index, "description", e.target.value)}
                  placeholder="Step description"
                  rows={3}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Badge Color
                </label>
                <select
                  value={step.color}
                  onChange={(e) => handleStepChange(index, "color", e.target.value)}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                >
                  <option value="blue">Blue</option>
                  <option value="purple">Purple</option>
                  <option value="green">Green</option>
                  <option value="pink">Pink</option>
                  <option value="indigo">Indigo</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

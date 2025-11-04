"use client";

import { useState } from "react";
import type { ContactFormBlock } from "@/types/content-blocks";
import PersonalizationManager, { type Industry } from "../PersonalizationManager";

interface ContactFormBlockEditorProps {
  data: ContactFormBlock["data"];
  onChange: (data: ContactFormBlock["data"]) => void;
}

export default function ContactFormBlockEditor({ data, onChange }: ContactFormBlockEditorProps) {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);

  // Determine if we're editing a personalized variant or default content
  const isEditingVariant = selectedIndustry !== null;
  const currentData = isEditingVariant && data.personalization?.industryVariants?.[selectedIndustry]
    ? data.personalization.industryVariants[selectedIndustry]
    : { headline: data.subheading, reasons: data.reasons };

  const handleReasonChange = (index: number, field: 'title' | 'description', value: string) => {
    const newReasons = [...(currentData.reasons || [])];
    const currentReason = newReasons[index] || { title: '', description: '' };
    newReasons[index] = { ...currentReason, [field]: value };

    if (isEditingVariant && selectedIndustry) {
      // Update variant
      onChange({
        ...data,
        personalization: {
          ...data.personalization,
          enabled: true,
          industryVariants: {
            ...(data.personalization?.industryVariants || {}),
            [selectedIndustry]: {
              headline: currentData.headline || data.subheading || "",
              reasons: newReasons
            }
          }
        }
      });
    } else {
      // Update default
      onChange({ ...data, reasons: newReasons });
    }
  };

  const handleHeadlineChange = (value: string) => {
    if (isEditingVariant && selectedIndustry) {
      onChange({
        ...data,
        personalization: {
          ...data.personalization,
          enabled: true,
          industryVariants: {
            ...(data.personalization?.industryVariants || {}),
            [selectedIndustry]: {
              headline: value,
              reasons: currentData.reasons || []
            }
          }
        }
      });
    } else {
      onChange({ ...data, subheading: value });
    }
  };

  const addReason = () => {
    const newReasons = [...(currentData.reasons || []), { title: "New reason", description: "Description here" }];

    if (isEditingVariant && selectedIndustry) {
      onChange({
        ...data,
        personalization: {
          ...data.personalization,
          enabled: true,
          industryVariants: {
            ...(data.personalization?.industryVariants || {}),
            [selectedIndustry]: {
              headline: currentData.headline || data.subheading || "",
              reasons: newReasons
            }
          }
        }
      });
    } else {
      onChange({ ...data, reasons: newReasons });
    }
  };

  const removeReason = (index: number) => {
    const newReasons = currentData.reasons?.filter((_, i) => i !== index) || [];

    if (isEditingVariant && selectedIndustry) {
      onChange({
        ...data,
        personalization: {
          ...data.personalization,
          enabled: true,
          industryVariants: {
            ...(data.personalization?.industryVariants || {}),
            [selectedIndustry]: {
              headline: currentData.headline || data.subheading || "",
              reasons: newReasons
            }
          }
        }
      });
    } else {
      onChange({ ...data, reasons: newReasons });
    }
  };

  const handleTogglePersonalization = (enabled: boolean) => {
    onChange({
      ...data,
      personalization: {
        ...data.personalization,
        enabled,
        industryVariants: data.personalization?.industryVariants || {}
      }
    });
  };

  return (
    <div className="space-y-4">
      {!isEditingVariant && (
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
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Main heading - same across all industries
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {isEditingVariant ? `Headline for ${selectedIndustry}` : "Subheading (Default)"}
        </label>
        <input
          type="text"
          value={currentData.headline || ""}
          onChange={(e) => handleHeadlineChange(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
        />
        {isEditingVariant && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
            This headline will only show to {selectedIndustry} users
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Reasons to Contact
          </label>
          <button
            type="button"
            onClick={addReason}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            + Add Reason
          </button>
        </div>
        <div className="space-y-3">
          {currentData.reasons?.map((reason, index) => (
            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={typeof reason === 'string' ? reason : reason.title}
                  onChange={(e) => handleReasonChange(index, 'title', e.target.value)}
                  placeholder="Title"
                  className="flex-1 px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeReason(index)}
                  className="text-red-500 hover:text-red-600 px-2"
                >
                  ×
                </button>
              </div>
              <textarea
                value={typeof reason === 'object' ? reason.description : ''}
                onChange={(e) => handleReasonChange(index, 'description', e.target.value)}
                placeholder="Description"
                rows={2}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <PersonalizationManager
        enabled={data.personalization?.enabled || false}
        currentIndustry={selectedIndustry}
        onIndustryChange={setSelectedIndustry}
        onTogglePersonalization={handleTogglePersonalization}
        industryVariants={data.personalization?.industryVariants || {}}
      />
    </div>
  );
}

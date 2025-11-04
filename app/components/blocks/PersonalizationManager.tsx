"use client";

import { useState } from "react";

const INDUSTRIES = [
  { id: "eCommerce", label: "eCommerce", icon: "🛒" },
  { id: "Healthcare", label: "Healthcare", icon: "🏥" },
  { id: "Financial Services", label: "Financial Services", icon: "💳" },
  { id: "Education", label: "Education", icon: "🎓" },
  { id: "B2B/SaaS", label: "B2B/SaaS", icon: "💼" },
] as const;

export type Industry = typeof INDUSTRIES[number]["id"];

interface PersonalizationManagerProps {
  enabled: boolean;
  currentIndustry: Industry | null;
  onIndustryChange: (industry: Industry | null) => void;
  onTogglePersonalization: (enabled: boolean) => void;
  industryVariants?: Record<string, any>;
}

export default function PersonalizationManager({
  enabled,
  currentIndustry,
  onIndustryChange,
  onTogglePersonalization,
  industryVariants = {},
}: PersonalizationManagerProps) {
  const [showInfo, setShowInfo] = useState(false);

  const hasVariants = Object.keys(industryVariants).length > 0;
  const coverage = enabled
    ? `${Object.keys(industryVariants).length} / ${INDUSTRIES.length} industries`
    : "Not enabled";

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            🎯 Personalization
          </h3>
          {enabled && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              {coverage}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowInfo(!showInfo)}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {showInfo ? "Hide" : "Info"}
          </button>
          <button
            type="button"
            onClick={() => {
              const newEnabled = !enabled;
              onTogglePersonalization(newEnabled);
              if (!newEnabled) {
                onIndustryChange(null);
              }
            }}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              enabled
                ? "bg-blue-600"
                : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                enabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {showInfo && (
        <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
          <p className="text-blue-800 dark:text-blue-300 mb-2">
            <strong>Personalization</strong> allows you to create industry-specific
            content variants that automatically display based on user selection.
          </p>
          <ul className="text-blue-700 dark:text-blue-400 space-y-1 text-xs">
            <li>• Users select their industry in the /start form</li>
            <li>• Content automatically adapts to their industry</li>
            <li>• Each variant can have unique messaging and CTAs</li>
            <li>• Falls back to default content if no variant exists</li>
          </ul>
        </div>
      )}

      {enabled && (
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Edit Content For:
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onIndustryChange(null)}
              className={`p-3 rounded-lg border transition-all text-left ${
                currentIndustry === null
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🌐</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Default
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Fallback content
                  </div>
                </div>
                {currentIndustry === null && (
                  <div className="text-purple-600 dark:text-purple-400">✓</div>
                )}
              </div>
            </button>

            {INDUSTRIES.map((industry) => {
              const isSelected = currentIndustry === industry.id;
              const hasVariant = industryVariants[industry.id];

              return (
                <button
                  key={industry.id}
                  type="button"
                  onClick={() => onIndustryChange(industry.id)}
                  className={`p-3 rounded-lg border transition-all text-left relative ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : hasVariant
                      ? "border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{industry.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {industry.label}
                      </div>
                      <div
                        className={`text-xs truncate ${
                          hasVariant
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {hasVariant ? "Has variant" : "No variant"}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="text-blue-600 dark:text-blue-400">✓</div>
                    )}
                    {hasVariant && !isSelected && (
                      <div className="text-green-600 dark:text-green-400 text-xs">
                        ✓
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {currentIndustry && !industryVariants[currentIndustry] && (
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-xs text-yellow-800 dark:text-yellow-300">
                <strong>No variant yet for {currentIndustry}.</strong> Start by
                copying the default content below, then customize it for this
                industry.
              </p>
            </div>
          )}

          {currentIndustry && industryVariants[currentIndustry] && (
            <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-xs text-green-800 dark:text-green-300">
                Editing <strong>{currentIndustry}</strong> variant. Changes will
                only affect users who selected this industry.
              </p>
            </div>
          )}
        </div>
      )}

      {!enabled && hasVariants && (
        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg">
          <p className="text-xs text-orange-800 dark:text-orange-300">
            Personalization is disabled. {Object.keys(industryVariants).length}{" "}
            industry variant(s) exist but won't be used. Enable to activate them.
          </p>
        </div>
      )}
    </div>
  );
}

export { INDUSTRIES };

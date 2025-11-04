"use client";

interface BlockPickerProps {
  onSelect: (blockType: string) => void;
  onClose: () => void;
}

const blockTypes = [
  {
    type: "hero",
    icon: "🎯",
    name: "Hero Section",
    description: "Large header with title, subtitle, and CTA buttons"
  },
  {
    type: "feature_grid",
    icon: "⭐",
    name: "Feature Grid",
    description: "Grid of features with icons and descriptions"
  },
  {
    type: "cta_banner",
    icon: "📢",
    name: "CTA Banner",
    description: "Call-to-action banner with gradient background"
  },
  {
    type: "callout",
    icon: "💡",
    name: "Callout Box",
    description: "Highlighted information or warning box"
  },
  {
    type: "martech_integrations",
    icon: "🔌",
    name: "Integrations",
    description: "Logo grid showing tool integrations"
  },
  {
    type: "contact_form",
    icon: "📧",
    name: "Contact Form",
    description: "Form with contact fields and submission"
  },
];

export default function BlockPicker({ onSelect, onClose }: BlockPickerProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Add a Block
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Choose a block type to add to your page
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {blockTypes.map((blockType) => (
            <button
              key={blockType.type}
              onClick={() => onSelect(blockType.type)}
              className="text-left p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{blockType.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {blockType.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {blockType.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

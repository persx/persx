"use client";

import type { ContentBlock } from "@/types/content-blocks";
import HeroBlockEditor from "./editors/HeroBlockEditor";
import FeatureGridBlockEditor from "./editors/FeatureGridBlockEditor";
import CTABannerBlockEditor from "./editors/CTABannerBlockEditor";
import CalloutBlockEditor from "./editors/CalloutBlockEditor";
import MartechIntegrationsBlockEditor from "./editors/MartechIntegrationsBlockEditor";
import ContactFormBlockEditor from "./editors/ContactFormBlockEditor";
import TwoColumnBlockEditor from "./editors/TwoColumnBlockEditor";
import TrustCardsBlockEditor from "./editors/TrustCardsBlockEditor";
import StepsBlockEditor from "./editors/StepsBlockEditor";

interface BlockEditCardProps {
  block: ContentBlock;
  index: number;
  totalBlocks: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onUpdate: (blockId: string, updates: Partial<ContentBlock>) => void;
  onDelete: (blockId: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const blockTypeInfo: Record<string, { icon: string; name: string }> = {
  hero: { icon: "🎯", name: "Hero Section" },
  feature_grid: { icon: "⭐", name: "Feature Grid" },
  cta_banner: { icon: "📢", name: "CTA Banner" },
  callout: { icon: "💡", name: "Callout Box" },
  martech_integrations: { icon: "🔌", name: "Integrations" },
  contact_form: { icon: "📧", name: "Contact Form" },
  trust_cards: { icon: "🛡️", name: "Trust Cards" },
  steps: { icon: "📋", name: "Steps" },
};

export default function BlockEditCard({
  block,
  index,
  totalBlocks,
  isExpanded,
  onToggleExpand,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: BlockEditCardProps) {
  const info = blockTypeInfo[block.type] || { icon: "📦", name: block.type };

  const handleDataChange = (newData: any) => {
    onUpdate(block.id, { data: newData });
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
          isExpanded ? "bg-gray-50 dark:bg-gray-800" : ""
        }`}
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-3">
          <div className="text-2xl">{info.icon}</div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {info.name}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Block {index + 1} of {totalBlocks}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp();
            }}
            disabled={index === 0}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown();
            }}
            disabled={index === totalBlocks - 1}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move down"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("Delete this block?")) {
                onDelete(block.id);
              }
            }}
            className="p-2 text-red-400 hover:text-red-600 dark:hover:text-red-300"
            title="Delete"
          >
            🗑️
          </button>
          <button
            type="button"
            className="p-2 text-gray-400"
          >
            {isExpanded ? "▼" : "▶"}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          {renderBlockEditor(block, handleDataChange)}
        </div>
      )}
    </div>
  );
}

function renderBlockEditor(block: ContentBlock, onChange: (data: any) => void) {
  switch (block.type) {
    case "hero":
      return <HeroBlockEditor data={block.data} onChange={onChange} />;
    case "feature_grid":
      return <FeatureGridBlockEditor data={block.data} onChange={onChange} />;
    case "cta_banner":
      return <CTABannerBlockEditor data={block.data} onChange={onChange} />;
    case "callout":
      return <CalloutBlockEditor data={block.data} onChange={onChange} />;
    case "martech_integrations":
      return <MartechIntegrationsBlockEditor data={block.data} onChange={onChange} />;
    case "contact_form":
      return <ContactFormBlockEditor data={block.data} onChange={onChange} />;
    case "two_column":
      return <TwoColumnBlockEditor data={block.data} onChange={onChange} />;
    case "trust_cards":
      return <TrustCardsBlockEditor data={block.data} onChange={onChange} />;
    case "steps":
      return <StepsBlockEditor data={block.data} onChange={onChange} />;
    default:
      return (
        <div className="text-sm text-gray-500">
          Editor not implemented for {block.type}
        </div>
      );
  }
}

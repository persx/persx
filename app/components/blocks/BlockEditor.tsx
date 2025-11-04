"use client";

import { useState } from "react";
import type { ContentBlock } from "@/types/content-blocks";
import BlockPicker from "./BlockPicker";
import BlockEditCard from "./BlockEditCard";

interface BlockEditorProps {
  blocks: ContentBlock[];
  onChange: (blocks: ContentBlock[]) => void;
}

export default function BlockEditor({ blocks, onChange }: BlockEditorProps) {
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null);

  const handleAddBlock = (blockType: string) => {
    const newBlock = {
      id: `${blockType}-${Date.now()}`,
      type: blockType as any,
      order: blocks.length + 1,
      data: getDefaultDataForBlockType(blockType),
    } as ContentBlock;

    onChange([...blocks, newBlock]);
    setShowBlockPicker(false);
    setExpandedBlockId(newBlock.id);
  };

  const handleUpdateBlock = (blockId: string, updates: Partial<ContentBlock>) => {
    onChange(blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } as ContentBlock : block
    ));
  };

  const handleDeleteBlock = (blockId: string) => {
    onChange(blocks.filter(block => block.id !== blockId));
    setExpandedBlockId(null);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index - 1];
    newBlocks[index - 1] = newBlocks[index]!;
    newBlocks[index] = temp!;
    // Update order values
    newBlocks.forEach((block, i) => block.order = i + 1);
    onChange(newBlocks);
  };

  const handleMoveDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + 1]!;
    newBlocks[index + 1] = temp!;
    // Update order values
    newBlocks.forEach((block, i) => block.order = i + 1);
    onChange(newBlocks);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Content Blocks ({blocks.length})
        </h3>
        <button
          type="button"
          onClick={() => setShowBlockPicker(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
        >
          + Add Block
        </button>
      </div>

      {blocks.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <div className="text-4xl mb-4">🧩</div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No blocks yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start building your page by adding content blocks
          </p>
          <button
            type="button"
            onClick={() => setShowBlockPicker(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Add Your First Block
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <BlockEditCard
              key={block.id}
              block={block}
              index={index}
              totalBlocks={blocks.length}
              isExpanded={expandedBlockId === block.id}
              onToggleExpand={() => setExpandedBlockId(
                expandedBlockId === block.id ? null : block.id
              )}
              onUpdate={handleUpdateBlock}
              onDelete={handleDeleteBlock}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
            />
          ))}
        </div>
      )}

      {showBlockPicker && (
        <BlockPicker
          onSelect={handleAddBlock}
          onClose={() => setShowBlockPicker(false)}
        />
      )}
    </div>
  );
}

function getDefaultDataForBlockType(blockType: string): any {
  switch (blockType) {
    case "hero":
      return {
        title: "New Hero Section",
        subtitle: "Add your subtitle here",
        buttons: [
          { text: "Get Started", href: "/start", variant: "primary" }
        ],
        alignment: "center"
      };
    case "feature_grid":
      return {
        heading: "Features",
        features: [
          { icon: "⭐", title: "Feature 1", description: "Description here" }
        ]
      };
    case "cta_banner":
      return {
        heading: "Ready to Get Started?",
        description: "Join us today",
        button: { text: "Get Started", href: "/start" },
        gradient: "blue-purple"
      };
    case "callout":
      return {
        icon: "ℹ️",
        title: "Important Note",
        content: "<p>Add your content here</p>",
        variant: "info",
        color: "blue"
      };
    case "martech_integrations":
      return {
        heading: "Integrations",
        subheading: "Works with your favorite tools",
        integrations: [
          { name: "Tool 1", color: "blue-600", fontSize: "text-3xl" }
        ],
        columns: 5
      };
    case "contact_form":
      return {
        heading: "Contact Us",
        subheading: "Get in touch",
        reasons: [
          { title: "Reason 1", description: "Description for reason 1" },
          { title: "Reason 2", description: "Description for reason 2" }
        ],
        formConfig: {
          nameField: true,
          emailField: true,
          messageField: true,
          submitText: "Send Message",
          successMessage: "Thank you!",
          errorMessage: "Error sending message"
        }
      };
    case "two_column":
      return {
        leftColumn: {
          type: "text",
          content: "<h2>Left Column</h2><p>Content here</p>"
        },
        rightColumn: {
          type: "text",
          content: "<p>Right column content</p>"
        },
        variant: "equal",
        background: "default"
      };
    case "trust_cards":
      return {
        heading: "Why Choose Us",
        cards: [
          { title: "Trusted by Industry Leaders", description: "Description for trust card 1", color: "blue" },
          { title: "Award-Winning Platform", description: "Description for trust card 2", color: "purple" }
        ]
      };
    case "steps":
      return {
        heading: "How It Works",
        subheading: "Get started in just a few simple steps",
        steps: [
          { title: "Step One", description: "Description for step 1", color: "blue" },
          { title: "Step Two", description: "Description for step 2", color: "purple" },
          { title: "Step Three", description: "Description for step 3", color: "green" }
        ]
      };
    default:
      return {};
  }
}

"use client";

import type { TrustCardsBlock } from "@/types/content-blocks";

interface TrustCardsBlockEditorProps {
  data: TrustCardsBlock["data"];
  onChange: (data: TrustCardsBlock["data"]) => void;
}

export default function TrustCardsBlockEditor({ data, onChange }: TrustCardsBlockEditorProps) {
  const handleCardChange = (index: number, field: string, value: string) => {
    const newCards = [...(data.cards || [])];
    const currentCard = newCards[index] || { title: '', description: '', color: 'blue' as const };
    newCards[index] = { ...currentCard, [field]: value };
    onChange({ ...data, cards: newCards });
  };

  const addCard = () => {
    onChange({
      ...data,
      cards: [...(data.cards || []), { title: "New Card", description: "Card description", color: "blue" }]
    });
  };

  const removeCard = (index: number) => {
    onChange({
      ...data,
      cards: data.cards?.filter((_, i) => i !== index) || []
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
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Cards
          </label>
          <button
            type="button"
            onClick={addCard}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
          >
            + Add Card
          </button>
        </div>
        <div className="space-y-3">
          {data.cards?.map((card, index) => (
            <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Card {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeCard(index)}
                  className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 font-bold text-xl"
                  title="Remove card"
                >
                  ×
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={card.title}
                  onChange={(e) => handleCardChange(index, "title", e.target.value)}
                  placeholder="Card title"
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Description
                </label>
                <textarea
                  value={card.description}
                  onChange={(e) => handleCardChange(index, "description", e.target.value)}
                  placeholder="Card description"
                  rows={3}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Color
                </label>
                <select
                  value={card.color}
                  onChange={(e) => handleCardChange(index, "color", e.target.value)}
                  className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm"
                >
                  <option value="blue">Blue</option>
                  <option value="purple">Purple</option>
                  <option value="green">Green</option>
                  <option value="pink">Pink</option>
                  <option value="indigo">Indigo</option>
                  <option value="amber">Amber</option>
                  <option value="orange">Orange</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

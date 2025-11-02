"use client";

import { useState, useEffect, useRef } from "react";
import { Tag } from "@/types/knowledge-base";

interface TagSelectorProps {
  selectedTags: string[]; // Array of tag names
  onChange: (tags: string[]) => void;
  className?: string;
}

const TAG_CATEGORIES = [
  { value: "tactic", label: "Tactic", color: "#3b82f6" },
  { value: "tool", label: "Tool", color: "#8b5cf6" },
  { value: "industry", label: "Industry", color: "#10b981" },
  { value: "topic", label: "Topic", color: "#f59e0b" },
  { value: "content_type", label: "Content Type", color: "#ec4899" },
  { value: null, label: "Uncategorized", color: "#6b7280" },
];

/**
 * TagSelector - Advanced tag selection component
 * Features:
 * - Search and filter tags
 * - Create new tags inline
 * - Visual categories with colors
 * - Multiple selection
 */
export default function TagSelector({
  selectedTags,
  onChange,
  className = "",
}: TagSelectorProps) {
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagCategory, setNewTagCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null | "all">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load tags from API
  useEffect(() => {
    fetchTags();
  }, []);

  // Filter tags based on search and category
  useEffect(() => {
    let filtered = allTags;

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      filtered = filtered.filter((tag) => tag.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((tag) =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTags(filtered);
  }, [allTags, searchQuery, selectedCategory]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsCreating(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/tags");
      const data = await response.json();
      if (data.tags) {
        setAllTags(data.tags);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  const handleToggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      onChange(selectedTags.filter((t) => t !== tagName));
    } else {
      onChange([...selectedTags, tagName]);
    }
  };

  const handleRemoveTag = (tagName: string) => {
    onChange(selectedTags.filter((t) => t !== tagName));
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTagName.trim(),
          category: newTagCategory,
        }),
      });

      const data = await response.json();

      if (response.ok && data.tag) {
        // Add new tag to list
        setAllTags([data.tag, ...allTags]);
        // Select it
        onChange([...selectedTags, data.tag.name]);
        // Reset form
        setNewTagName("");
        setNewTagCategory(null);
        setIsCreating(false);
      } else {
        alert(data.error || "Failed to create tag");
      }
    } catch (error) {
      console.error("Error creating tag:", error);
      alert("Failed to create tag");
    }
  };

  const getCategoryColor = (category: string | null) => {
    const cat = TAG_CATEGORIES.find((c) => c.value === category);
    return cat?.color || "#6b7280";
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Selected Tags Display */}
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedTags.map((tagName) => {
          const tag = allTags.find((t) => t.name === tagName);
          return (
            <span
              key={tagName}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
              style={
                tag?.color
                  ? {
                      backgroundColor: `${tag.color}20`,
                      color: tag.color,
                    }
                  : undefined
              }
            >
              {tagName}
              <button
                type="button"
                onClick={() => handleRemoveTag(tagName)}
                className="hover:bg-blue-200 dark:hover:bg-blue-800/50 rounded-full p-0.5"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </span>
          );
        })}
      </div>

      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search or add tags..."
          className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-hidden flex flex-col">
          {/* Category Filter */}
          <div className="flex items-center gap-2 p-3 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                selectedCategory === "all"
                  ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              All
            </button>
            {TAG_CATEGORIES.filter((c) => c.value !== null).map((category) => (
              <button
                key={category.value || "uncategorized"}
                type="button"
                onClick={() => setSelectedCategory(category.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  selectedCategory === category.value
                    ? "text-white"
                    : "hover:opacity-80"
                }`}
                style={{
                  backgroundColor:
                    selectedCategory === category.value
                      ? category.color
                      : `${category.color}20`,
                  color:
                    selectedCategory === category.value ? "white" : category.color,
                }}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Tag List */}
          <div className="flex-1 overflow-y-auto p-2 min-h-0">
            {filteredTags.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                {searchQuery ? (
                  <div>
                    <p>No tags found</p>
                    <button
                      type="button"
                      onClick={() => {
                        setNewTagName(searchQuery);
                        setIsCreating(true);
                      }}
                      className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                    >
                      Create "{searchQuery}"
                    </button>
                  </div>
                ) : (
                  "No tags available"
                )}
              </div>
            ) : (
              <div className="space-y-1">
                {filteredTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleToggleTag(tag.name)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      selectedTags.includes(tag.name)
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          backgroundColor: tag.color || getCategoryColor(tag.category),
                        }}
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {tag.name}
                      </span>
                      {tag.usage_count > 0 && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ({tag.usage_count})
                        </span>
                      )}
                    </div>
                    {selectedTags.includes(tag.name) && (
                      <svg
                        className="w-4 h-4 text-blue-600 dark:text-blue-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Create New Tag Section */}
          {isCreating ? (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Create New Tag
              </p>
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Tag name"
                className="w-full px-3 py-2 mb-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <select
                value={newTagCategory || ""}
                onChange={(e) =>
                  setNewTagCategory(e.target.value || null)
                }
                className="w-full px-3 py-2 mb-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category (optional)</option>
                {TAG_CATEGORIES.filter((c) => c.value !== null).map((category) => (
                  <option key={category.value} value={category.value || ""}>
                    {category.label}
                  </option>
                ))}
              </select>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCreateTag}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewTagName("");
                    setNewTagCategory(null);
                  }}
                  className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="p-3 border-t border-gray-200 dark:border-gray-700 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-left"
            >
              + Create new tag
            </button>
          )}
        </div>
      )}
    </div>
  );
}

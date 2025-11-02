"use client";

import { useState, useEffect } from "react";
import { Tag } from "@/types/knowledge-base";

const TAG_CATEGORIES = [
  { value: "tactic", label: "Tactic", color: "#3b82f6" },
  { value: "tool", label: "Tool", color: "#8b5cf6" },
  { value: "industry", label: "Industry", color: "#10b981" },
  { value: "topic", label: "Topic", color: "#f59e0b" },
  { value: "content_type", label: "Content Type", color: "#ec4899" },
  { value: "", label: "Uncategorized", color: "#6b7280" },
];

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    color: "",
  });

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    filterTags();
  }, [tags, selectedCategory, searchQuery]);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tags");
      const data = await response.json();
      if (data.tags) {
        setTags(data.tags);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterTags = () => {
    let filtered = tags;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((tag) =>
        selectedCategory === ""
          ? !tag.category
          : tag.category === selectedCategory
      );
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (tag) =>
          tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tag.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTags(filtered);
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      alert("Tag name is required");
      return;
    }

    try {
      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          category: formData.category || null,
          description: formData.description || null,
          color: formData.color || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTags([data.tag, ...tags]);
        resetForm();
        setIsCreating(false);
      } else {
        alert(data.error || "Failed to create tag");
      }
    } catch (error) {
      console.error("Error creating tag:", error);
      alert("Failed to create tag");
    }
  };

  const handleUpdate = async () => {
    if (!editingTag || !formData.name.trim()) {
      alert("Tag name is required");
      return;
    }

    try {
      const response = await fetch(`/api/tags/${editingTag.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          category: formData.category || null,
          description: formData.description || null,
          color: formData.color || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTags(tags.map((t) => (t.id === editingTag.id ? data.tag : t)));
        resetForm();
        setEditingTag(null);
      } else {
        alert(data.error || "Failed to update tag");
      }
    } catch (error) {
      console.error("Error updating tag:", error);
      alert("Failed to update tag");
    }
  };

  const handleDelete = async (tag: Tag) => {
    if (
      !confirm(
        `Are you sure you want to delete "${tag.name}"? ${
          tag.usage_count > 0
            ? `This tag is used by ${tag.usage_count} content items.`
            : ""
        }`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/tags/${tag.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTags(tags.filter((t) => t.id !== tag.id));
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete tag");
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
      alert("Failed to delete tag");
    }
  };

  const startEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      category: tag.category || "",
      description: tag.description || "",
      color: tag.color || "",
    });
    setIsCreating(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      color: "",
    });
  };

  const getCategoryLabel = (category: string | null) => {
    const cat = TAG_CATEGORIES.find((c) => c.value === category);
    return cat?.label || "Uncategorized";
  };

  const getCategoryColor = (category: string | null) => {
    const cat = TAG_CATEGORIES.find((c) => c.value === category);
    return cat?.color || "#6b7280";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tag Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Organize and manage content tags with categories
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingTag(null);
            setIsCreating(true);
          }}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
        >
          + Create Tag
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Tags</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {tags.length}
          </p>
        </div>
        {TAG_CATEGORIES.slice(0, 3).map((category) => {
          const count = tags.filter((t) => t.category === category.value).length;
          return (
            <div
              key={category.value}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {category.label}
              </p>
              <p
                className="text-2xl font-bold mt-1"
                style={{ color: category.color }}
              >
                {count}
              </p>
            </div>
          );
        })}
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingTag) && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {editingTag ? "Edit Tag" : "Create New Tag"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tag Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., A/B Testing"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select category (optional)</option>
                {TAG_CATEGORIES.filter((c) => c.value).map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Color (Hex)
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.color || getCategoryColor(formData.category)}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="w-12 h-10 rounded border border-gray-300 dark:border-gray-700"
                />
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  placeholder="#3b82f6"
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={editingTag ? handleUpdate : handleCreate}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {editingTag ? "Update Tag" : "Create Tag"}
            </button>
            <button
              onClick={() => {
                resetForm();
                setIsCreating(false);
                setEditingTag(null);
              }}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tags..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === "all"
                  ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              All ({tags.length})
            </button>
            {TAG_CATEGORIES.map((category) => {
              const count = tags.filter((t) =>
                category.value === ""
                  ? !t.category
                  : t.category === category.value
              ).length;
              return (
                <button
                  key={category.value || "uncategorized"}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
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
                      selectedCategory === category.value
                        ? "white"
                        : category.color,
                  }}
                >
                  {category.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tags Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            Loading tags...
          </div>
        ) : filteredTags.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            No tags found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-750">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tag
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Usage
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTags.map((tag) => (
                  <tr
                    key={tag.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor:
                              tag.color || getCategoryColor(tag.category),
                          }}
                        />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {tag.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="px-2 py-1 text-xs font-medium rounded-full"
                        style={{
                          backgroundColor: `${getCategoryColor(tag.category)}20`,
                          color: getCategoryColor(tag.category),
                        }}
                      >
                        {getCategoryLabel(tag.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {tag.description || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {tag.usage_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => startEdit(tag)}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tag)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

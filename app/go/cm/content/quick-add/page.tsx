"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { ExternalSource } from "@/lib/supabase";

export default function QuickAddPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    overall_summary: "",
    persx_perspective: "",
    tags: "",
    industries: [] as string[],
    tool_categories: [] as string[],
  });

  const [sources, setSources] = useState<ExternalSource[]>([
    { url: "", name: "", author: "", published_date: "", summary: "" },
  ]);

  const handleAddSource = () => {
    if (sources.length < 5) {
      setSources([
        ...sources,
        { url: "", name: "", author: "", published_date: "", summary: "" },
      ]);
    }
  };

  const handleRemoveSource = (index: number) => {
    if (sources.length > 1) {
      setSources(sources.filter((_, i) => i !== index));
    }
  };

  const handleSourceChange = (
    index: number,
    field: keyof ExternalSource,
    value: string
  ) => {
    const newSources = [...sources];
    newSources[index] = { ...newSources[index], [field]: value };
    setSources(newSources);
  };

  const handleFetchMetadata = async (index: number) => {
    const source = sources[index];
    if (!source.url) {
      setError("Please enter a URL");
      return;
    }

    setIsLoading(index);
    setError("");

    try {
      const response = await fetch("/api/content/fetch-metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: source.url }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch metadata");
      }

      const data = await response.json();

      // Update the source with fetched metadata
      const newSources = [...sources];
      newSources[index] = {
        ...newSources[index],
        name: data.source_name || newSources[index].name,
        author: data.source_author || newSources[index].author,
        published_date: data.source_published_date || newSources[index].published_date,
        summary: data.summary || newSources[index].summary,
      };
      setSources(newSources);

      // If this is the first source and title is empty, use it for the title
      if (index === 0 && !formData.title) {
        setFormData({ ...formData, title: data.title || "" });
      }
    } catch (err) {
      setError(`Failed to fetch metadata for source ${index + 1}. Please fill in the fields manually.`);
      console.error(err);
    } finally {
      setIsLoading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      setError("Title is required");
      return;
    }

    // Validate that at least one source has a URL
    const validSources = sources.filter(s => s.url.trim() !== "");
    if (validSources.length === 0) {
      setError("At least one source URL is required");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          content: formData.persx_perspective || "See sources for details.",
          excerpt: formData.overall_summary?.substring(0, 200) || "",
          content_type: "news",
          status: "draft",
          source_type: "external_curated",
          external_sources: validSources,
          overall_summary: formData.overall_summary,
          persx_perspective: formData.persx_perspective,
          tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
          industries: formData.industries,
          tool_categories: formData.tool_categories,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create content");
      }

      router.push("/go/cm/content");
    } catch (err) {
      setError("Failed to save content. Please try again.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Quick Add News Roundup
            </h1>
            <Link
              href="/go/cm/content"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              ← Back to Content
            </Link>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Curate multiple news articles into a single roundup with your PersX perspective
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* External Sources */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                External Sources ({sources.length}/5)
              </h2>
              {sources.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddSource}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  + Add Source
                </button>
              )}
            </div>

            <div className="space-y-6">
              {sources.map((source, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Source {index + 1}
                    </h3>
                    {sources.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSource(index)}
                        className="text-sm text-red-600 dark:text-red-400 hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    {/* URL & Fetch */}
                    <div className="flex gap-3">
                      <input
                        type="url"
                        value={source.url}
                        onChange={(e) => handleSourceChange(index, "url", e.target.value)}
                        placeholder="https://example.com/article"
                        required={index === 0}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => handleFetchMetadata(index)}
                        disabled={isLoading === index || !source.url}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                      >
                        {isLoading === index ? "Fetching..." : "Fetch"}
                      </button>
                    </div>

                    {/* Metadata Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={source.name || ""}
                        onChange={(e) => handleSourceChange(index, "name", e.target.value)}
                        placeholder="Source name"
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                      />
                      <input
                        type="text"
                        value={source.author || ""}
                        onChange={(e) => handleSourceChange(index, "author", e.target.value)}
                        placeholder="Author"
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                      />
                      <input
                        type="date"
                        value={source.published_date || ""}
                        onChange={(e) => handleSourceChange(index, "published_date", e.target.value)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                      />
                    </div>

                    {/* Source Summary */}
                    <textarea
                      value={source.summary || ""}
                      onChange={(e) => handleSourceChange(index, "summary", e.target.value)}
                      rows={3}
                      placeholder="Quick summary of this specific article..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Title & Overview */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Roundup Overview
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Roundup Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 'Top 5 AI Personalization Trends This Week'"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="overall_summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Overall Summary *
                </label>
                <textarea
                  id="overall_summary"
                  name="overall_summary"
                  value={formData.overall_summary}
                  onChange={handleChange}
                  rows={4}
                  required
                  placeholder="High-level summary of all the articles and what they collectively tell us..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="persx_perspective" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  PersX Perspective *
                </label>
                <textarea
                  id="persx_perspective"
                  name="persx_perspective"
                  value={formData.persx_perspective}
                  onChange={handleChange}
                  rows={5}
                  required
                  placeholder="Your analysis, insights, and perspective on these developments from PersX.ai's point of view. What do these trends mean for marketers?"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  This is where you provide context, analysis, and actionable insights
                </p>
              </div>

              <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="ai, personalization, marketing (comma-separated)"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end">
            <Link
              href="/go/cm/content"
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSaving ? "Saving..." : "Save Roundup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

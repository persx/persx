"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ContentEditorToolbar from "./ContentEditorToolbar";
import { ContentPreviewModal } from "@/app/components/content";

// Import RichTextEditor dynamically with no SSR to avoid hydration issues
const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      <div className="border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2 h-[52px]">
        <div className="animate-pulse flex gap-2">
          <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      <div className="p-4 min-h-[400px]">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  ),
});

const contentTypes = [
  { value: "blog", label: "Blog Post" },
  { value: "case_study", label: "Case Study" },
  { value: "implementation_guide", label: "Implementation Guide" },
  { value: "news", label: "News" },
  { value: "test_result", label: "Test Result" },
  { value: "best_practice", label: "Best Practice" },
  { value: "tool_guide", label: "Tool Guide" },
];

const industries = [
  "eCommerce",
  "B2B/SaaS",
  "Media/Publishing",
  "Healthcare",
  "Financial Services",
];

const toolCategories = [
  "A/B Testing",
  "Personalization",
  "Analytics",
  "CRM",
  "Email Marketing",
  "CDP",
];

interface ContentEditorProps {
  defaultType?: string;
  initialData?: any;
  contentId?: string;
}

export default function ContentEditor({
  defaultType,
  initialData,
  contentId,
}: ContentEditorProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Preview and toolbar state
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [initialFormData, setInitialFormData] = useState<any>(null);

  // Get first external source URL if exists (for multi-source content from Quick Add)
  const firstExternalSourceUrl = initialData?.external_sources && initialData.external_sources.length > 0
    ? initialData.external_sources[0].url || ""
    : initialData?.source_url || "";

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    content_type: initialData?.content_type || defaultType || "blog",
    status: initialData?.status || "draft",
    industries: initialData?.industries || [],
    tool_categories: initialData?.tool_categories || [],
    tags: initialData?.tags ? initialData.tags.join(", ") : "",
    // External content fields
    source_type: initialData?.source_type || "internal",
    source_name: initialData?.source_name || "",
    source_url: firstExternalSourceUrl,
    source_author: initialData?.source_author || "",
    source_published_date: initialData?.source_published_date || "",
    curator_notes: initialData?.curator_notes || "",
    summary: initialData?.summary || initialData?.overall_summary || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0);

      const payload = {
        ...formData,
        tags: tagsArray,
      };

      const url = contentId
        ? `/api/content/${contentId}`
        : "/api/content";
      const method = contentId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/go/cm/content");
          router.refresh();
        }, 1500);
      } else {
        setError(data.error || "Failed to save content");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIndustryToggle = (industry: string) => {
    setFormData((prev) => ({
      ...prev,
      industries: prev.industries.includes(industry)
        ? prev.industries.filter((i: string) => i !== industry)
        : [...prev.industries, industry],
    }));
  };

  const handleToolCategoryToggle = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      tool_categories: prev.tool_categories.includes(category)
        ? prev.tool_categories.filter((c: string) => c !== category)
        : [...prev.tool_categories, category],
    }));
  };

  // Track initial form data for unsaved changes detection
  useEffect(() => {
    if (!initialFormData && formData.title) {
      setInitialFormData(JSON.stringify(formData));
      if (contentId) {
        setLastSaved(new Date());
      }
    }
  }, [formData, initialFormData, contentId]);

  // Track unsaved changes
  useEffect(() => {
    if (initialFormData) {
      const hasChanges = JSON.stringify(formData) !== initialFormData;
      setHasUnsavedChanges(hasChanges);
    }
  }, [formData, initialFormData]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+S or Ctrl+S - Save Draft
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSaveDraft();
      }
      // Cmd+P or Ctrl+P - Preview
      if ((e.metaKey || e.ctrlKey) && e.key === "p") {
        e.preventDefault();
        handlePreview();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [formData]);

  // Preview handler
  const handlePreview = useCallback(() => {
    setShowPreviewModal(true);
  }, []);

  // Save draft handler
  const handleSaveDraft = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0);

      const payload = {
        ...formData,
        tags: tagsArray,
        status: "draft",
      };

      const url = contentId ? `/api/content/${contentId}` : "/api/content";
      const method = contentId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setLastSaved(new Date());
        setInitialFormData(JSON.stringify(formData));
        setHasUnsavedChanges(false);
        // Don't redirect, stay on page
      } else {
        setError(data.error || "Failed to save draft");
      }
    } catch (err) {
      setError("An error occurred while saving draft");
    } finally {
      setIsLoading(false);
    }
  }, [formData, contentId]);

  // Publish handler
  const handlePublish = useCallback(async () => {
    if (!confirm("Are you sure you want to publish this content? It will be visible to the public.")) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const tagsArray = formData.tags
        .split(",")
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag.length > 0);

      const payload = {
        ...formData,
        tags: tagsArray,
        status: "published",
      };

      const url = contentId ? `/api/content/${contentId}` : "/api/content";
      const method = contentId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/go/cm/content");
          router.refresh();
        }, 1500);
      } else {
        setError(data.error || "Failed to publish content");
      }
    } catch (err) {
      setError("An error occurred while publishing");
    } finally {
      setIsLoading(false);
    }
  }, [formData, contentId, router]);

  // Get preview link handler
  const handleGetPreviewLink = useCallback(async () => {
    if (!contentId) {
      setError("Please save the content first before generating a preview link");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/content/preview-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId }),
      });

      const data = await response.json();

      if (response.ok) {
        setPreviewUrl(data.previewUrl);
      } else {
        setError(data.error || "Failed to generate preview link");
      }
    } catch (err) {
      setError("An error occurred while generating preview link");
    } finally {
      setIsLoading(false);
    }
  }, [contentId]);

  if (success) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <div className="text-green-500 text-5xl mb-4">✓</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {contentId ? "Content Updated!" : "Content Created!"}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Redirecting to content list...
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Preview Modal */}
      <ContentPreviewModal
        content={{ ...formData, id: contentId }}
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Toolbar */}
        <ContentEditorToolbar
          onPreview={handlePreview}
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          onGetPreviewLink={handleGetPreviewLink}
          contentId={contentId}
          currentStatus={formData.status as "draft" | "published" | "archived"}
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={isLoading}
          lastSaved={lastSaved}
          previewUrl={previewUrl}
        />

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Basic Information
          </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="content_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Content Type *
            </label>
            <select
              id="content_type"
              value={formData.content_type}
              onChange={(e) => setFormData({ ...formData, content_type: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {contentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter content title"
            />
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief summary of the content"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content *
            </label>
            <RichTextEditor
              content={formData.content}
              onChange={(newContent) => setFormData({ ...formData, content: newContent })}
              placeholder="Start writing your content..."
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Use the toolbar above to format your content with headings, bold, italic, lists, links, and images.
            </p>
          </div>
        </div>
      </div>

      {/* Source Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Source Information
        </h2>

        <div className="space-y-4">
          <div>
            <label htmlFor="source_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Source Type *
            </label>
            <select
              id="source_type"
              value={formData.source_type}
              onChange={(e) => setFormData({ ...formData, source_type: e.target.value })}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="internal">Internal (Created by us)</option>
              <option value="external_curated">External Curated (Summarized from external source)</option>
              <option value="external_referenced">External Referenced (Link only)</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Select "External" if this content is from another source
            </p>
          </div>

          {/* Show external fields only if not internal */}
          {formData.source_type !== "internal" && (
            <>
              {/* Display all external sources if they exist (from Quick Add) */}
              {initialData?.external_sources && initialData.external_sources.length > 0 && (
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    External Sources ({initialData.external_sources.length})
                  </h3>
                  <div className="space-y-2">
                    {initialData.external_sources.map((source: any, index: number) => (
                      <div key={index} className="text-sm">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          {index + 1}. {source.name || new URL(source.url).hostname}
                        </a>
                        {source.author && (
                          <span className="text-gray-600 dark:text-gray-400 ml-2">
                            by {source.author}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    These sources were added via Quick Add. The first source URL is prefilled below.
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="source_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Source URL *
                </label>
                <input
                  id="source_url"
                  type="url"
                  value={formData.source_url}
                  onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                  required={formData.source_type !== "internal"}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com/article"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  URL to the original article for proper attribution
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="source_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Source Name
                  </label>
                  <input
                    id="source_name"
                    type="text"
                    value={formData.source_name}
                    onChange={(e) => setFormData({ ...formData, source_name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="MarketingDive, TechCrunch, etc."
                  />
                </div>

                <div>
                  <label htmlFor="source_author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Source Author
                  </label>
                  <input
                    id="source_author"
                    type="text"
                    value={formData.source_author}
                    onChange={(e) => setFormData({ ...formData, source_author: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Original author name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="source_published_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Original Publication Date
                </label>
                <input
                  id="source_published_date"
                  type="date"
                  value={formData.source_published_date}
                  onChange={(e) => setFormData({ ...formData, source_published_date: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="summary" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Summary
                </label>
                <textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your summary or key takeaways from the external article"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Write a summary in your own words (do not copy original content)
                </p>
              </div>

              <div>
                <label htmlFor="curator_notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Curator Notes (Internal Only)
                </label>
                <textarea
                  id="curator_notes"
                  value={formData.curator_notes}
                  onChange={(e) => setFormData({ ...formData, curator_notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Why is this content relevant? Internal notes for the team..."
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Internal notes (not shown to users)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Categorization */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Categorization
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Industries
            </label>
            <div className="flex flex-wrap gap-2">
              {industries.map((industry) => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => handleIndustryToggle(industry)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    formData.industries.includes(industry)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tool Categories
            </label>
            <div className="flex flex-wrap gap-2">
              {toolCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleToolCategoryToggle(category)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    formData.tool_categories.includes(category)
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="optimization, conversion, testing"
            />
          </div>
        </div>
      </div>

      {/* Publishing */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Publishing
        </h2>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading
            ? "Saving..."
            : contentId
            ? "Update Content"
            : "Create Content"}
        </button>
      </div>
    </form>
    </>
  );
}

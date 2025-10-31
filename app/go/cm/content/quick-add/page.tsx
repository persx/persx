"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { sanitizeContentForSave } from "@/lib/content-utils";
import dynamic from "next/dynamic";

// Import RichTextEditor dynamically to avoid SSR issues
const RichTextEditor = dynamic(() => import("../components/RichTextEditor"), {
  ssr: false,
  loading: () => <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse"></div>,
});

type Step = 1 | 2 | 3 | 4;

interface SourceData {
  url: string;
  title: string;
  author: string;
  publishedDate: string;
  originalSummary: string;
}

export default function QuickAddPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1: URLs
  const [urls, setUrls] = useState<string[]>(["", "", "", "", ""]);
  const [fetchedSources, setFetchedSources] = useState<SourceData[]>([]);

  // Step 2: Title & Overall Summary
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [overallSummary, setOverallSummary] = useState("");
  const [isRegeneratingTitle, setIsRegeneratingTitle] = useState(false);
  const [isRegeneratingSummary, setIsRegeneratingSummary] = useState(false);

  // Step 3: PersX Perspective (individual summaries)
  const [sourceSummaries, setSourceSummaries] = useState<string[]>([]);
  const [regeneratingIndex, setRegeneratingIndex] = useState<number | null>(null);

  // Step 4: Tags
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // Helper function to generate slug from title (limited to 5 words)
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .split(/\s+/)
      .slice(0, 5)
      .join("-")
      .replace(/[^a-z0-9-]+/g, "")
      .replace(/(^-|-$)/g, "");
  };

  // Update slug when title changes
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  const handleUrlChange = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const handleFetchSources = async () => {
    const validUrls = urls.filter(url => url.trim() !== "");

    if (validUrls.length === 0) {
      setError("Please enter at least one URL");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Fetch metadata for each URL
      const sourcesPromises = validUrls.map(async (url) => {
        const response = await fetch("/api/content/fetch-metadata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        if (!response.ok) throw new Error(`Failed to fetch ${url}`);

        const data = await response.json();
        return {
          url,
          title: data.title || "",
          author: data.source_author || "",
          publishedDate: data.source_published_date || "",
          originalSummary: data.summary || "",
        };
      });

      const sources = await Promise.all(sourcesPromises);
      setFetchedSources(sources);

      // Generate initial title and summary
      await generateTitleAndSummary(sources);

      setCurrentStep(2);
    } catch (err) {
      setError("Failed to fetch some sources. Please check the URLs and try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTitleAndSummary = async (sources: SourceData[]) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/content/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sources, type: "title_and_summary" }),
      });

      if (!response.ok) throw new Error("Failed to generate summary");

      const data = await response.json();
      handleTitleChange(data.title);
      setOverallSummary(data.summary);
    } catch (err) {
      setError("Failed to generate summary. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateTitle = async () => {
    setIsRegeneratingTitle(true);
    try {
      const response = await fetch("/api/content/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sources: fetchedSources, type: "title_only" }),
      });

      if (!response.ok) throw new Error("Failed to regenerate title");

      const data = await response.json();
      handleTitleChange(data.title);
    } catch (err) {
      setError("Failed to regenerate title");
      console.error(err);
    } finally {
      setIsRegeneratingTitle(false);
    }
  };

  const handleRegenerateSummary = async () => {
    setIsRegeneratingSummary(true);
    try {
      const response = await fetch("/api/content/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sources: fetchedSources, type: "summary_only" }),
      });

      if (!response.ok) throw new Error("Failed to regenerate summary");

      const data = await response.json();
      setOverallSummary(data.summary);
    } catch (err) {
      setError("Failed to regenerate summary");
      console.error(err);
    } finally {
      setIsRegeneratingSummary(false);
    }
  };

  const handleGeneratePerspectives = async () => {
    setIsLoading(true);
    setError("");

    try {
      const perspectivesPromises = fetchedSources.map(async (source) => {
        const response = await fetch("/api/content/generate-summary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source, type: "perspective" }),
        });

        if (!response.ok) throw new Error("Failed to generate perspective");

        const data = await response.json();
        return data.perspective;
      });

      const perspectives = await Promise.all(perspectivesPromises);
      setSourceSummaries(perspectives);
      setCurrentStep(3);
    } catch (err) {
      setError("Failed to generate perspectives");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegeneratePerspective = async (index: number) => {
    setRegeneratingIndex(index);
    try {
      const response = await fetch("/api/content/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: fetchedSources[index], type: "perspective" }),
      });

      if (!response.ok) throw new Error("Failed to regenerate perspective");

      const data = await response.json();
      const newSummaries = [...sourceSummaries];
      newSummaries[index] = data.perspective;
      setSourceSummaries(newSummaries);
    } catch (err) {
      setError(`Failed to regenerate perspective for source ${index + 1}`);
      console.error(err);
    } finally {
      setRegeneratingIndex(null);
    }
  };

  const handleGenerateTags = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/content/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sources: fetchedSources,
          title,
          summary: overallSummary,
          type: "tags"
        }),
      });

      if (!response.ok) throw new Error("Failed to generate tags");

      const data = await response.json();
      setTags(data.tags);
      setCurrentStep(4);
    } catch (err) {
      setError("Failed to generate tags");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    const trimmedTag = newTag.trim().toLowerCase();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async (status: "draft" | "published") => {
    setIsLoading(true);
    setError("");

    try {
      // Sanitize title only (overall_summary and perspectives are HTML from rich text editor)
      const sanitizedData = sanitizeContentForSave({
        title,
      });

      const externalSources = fetchedSources.map((source, index) => {
        return {
          url: source.url,
          name: new URL(source.url).hostname,
          author: source.author,
          published_date: source.publishedDate,
          summary: sourceSummaries[index], // Already HTML from RichTextEditor
        };
      });

      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: sanitizedData.title,
          slug,
          content: sourceSummaries.join("\n\n"), // HTML from RichTextEditor
          excerpt: overallSummary.replace(/<[^>]*>/g, "").substring(0, 200), // Strip HTML for excerpt
          content_type: "news",
          status,
          source_type: "external_curated",
          external_sources: externalSources,
          overall_summary: overallSummary, // HTML from RichTextEditor
          persx_perspective: sourceSummaries.join("\n\n"), // HTML from RichTextEditor
          tags,
        }),
      });

      if (!response.ok) throw new Error("Failed to create content");

      router.push("/go/cm/content");
    } catch (err) {
      setError("Failed to save content");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
            AI-powered news curation in 4 simple steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {step}
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      currentStep > step
                        ? "bg-blue-600"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">URLs</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Summary</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Perspective</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Tags</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Step 1: Enter URLs */}
        {currentStep === 1 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Step 1: Enter Source URLs
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Add up to 5 external article URLs to curate into a news roundup
            </p>
            <div className="space-y-3">
              {urls.map((url, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Source {index + 1} {index === 0 && "*"}
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                    placeholder="https://example.com/article"
                    required={index === 0}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleFetchSources}
                disabled={isLoading || !urls[0]}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Fetching..." : "Next: Generate Summary →"}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Title & Overall Summary */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Step 2: Review Title & Summary
              </h2>

              {/* Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={handleRegenerateTitle}
                  disabled={isRegeneratingTitle}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 disabled:opacity-50"
                >
                  {isRegeneratingTitle ? "Regenerating..." : "🔄 Regenerate Title"}
                </button>
              </div>

              {/* Overall Summary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Overall Summary
                </label>
                <RichTextEditor
                  content={overallSummary}
                  onChange={setOverallSummary}
                  placeholder="Overall summary of all sources..."
                />
                <button
                  onClick={handleRegenerateSummary}
                  disabled={isRegeneratingSummary}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 disabled:opacity-50"
                >
                  {isRegeneratingSummary ? "Regenerating..." : "🔄 Regenerate Summary"}
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleGeneratePerspectives}
                disabled={isLoading || !title || !overallSummary}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Generating..." : "Next: Generate Perspectives →"}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: PersX Perspectives */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Step 3: PersX Perspective
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                AI-generated perspectives for each source (100-500 words each)
              </p>

              <div className="space-y-6">
                {fetchedSources.map((source, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-6 last:border-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Source {index + 1}: {source.title}
                    </h3>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline mb-4 block"
                    >
                      {source.url}
                    </a>
                    <RichTextEditor
                      content={sourceSummaries[index] || ""}
                      onChange={(value) => {
                        const newSummaries = [...sourceSummaries];
                        newSummaries[index] = value;
                        setSourceSummaries(newSummaries);
                      }}
                      placeholder={`PersX perspective for source ${index + 1}...`}
                    />
                    <button
                      onClick={() => handleRegeneratePerspective(index)}
                      disabled={regeneratingIndex === index}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 disabled:opacity-50"
                    >
                      {regeneratingIndex === index ? "Regenerating..." : "🔄 Regenerate"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                ← Back
              </button>
              <button
                onClick={handleGenerateTags}
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Generating..." : "Next: Generate Tags →"}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Tags & Publish */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Step 4: URL Slug, Tags & Publish
              </h2>

              {/* URL Slug */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  URL Slug
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    /news/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="article-slug"
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This will be the URL for your article: /news/{slug || "article-slug"}
                </p>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    >
                      {tag}
                      <button
                        onClick={() => setTags(tags.filter((_, i) => i !== index))}
                        className="ml-2 hover:text-blue-800 dark:hover:text-blue-200"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a new tag"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <button
                    onClick={handleAddTag}
                    disabled={!newTag.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Tag
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                ← Back
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSave("draft")}
                  disabled={isLoading}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? "Saving..." : "Preview (Save as Draft)"}
                </button>
                <button
                  onClick={() => handleSave("published")}
                  disabled={isLoading}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isLoading ? "Publishing..." : "Publish Live"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

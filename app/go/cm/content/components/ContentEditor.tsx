"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ContentEditorToolbar from "./ContentEditorToolbar";
import { ContentPreviewModal } from "@/app/components/content";
import RichTextEditor from "./RichTextEditor";
import { sanitizeContentForSave } from "@/lib/content-utils";
import DeleteContentButton from "./DeleteContentButton";
import CollapsibleSection from "@/app/components/CollapsibleSection";
import TagSelector from "@/app/components/TagSelector";
import { BreadcrumbItem } from "@/types/knowledge-base";

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

// Normalize text: replace smart quotes and em dashes with standard characters
const normalizeText = (text: string): string => {
  if (!text) return text;

  return text
    // Replace smart single quotes (left and right) with straight apostrophe
    .replace(/[\u2018\u2019]/g, "'")
    // Replace em dashes with hyphens
    .replace(/[\u2014]/g, "-")
    // Also replace en dashes with hyphens for consistency
    .replace(/[\u2013]/g, "-");
};

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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [initialFormData, setInitialFormData] = useState<any>(null);

  // Get first external source URL if exists (for multi-source content from Quick Add)
  const firstExternalSourceUrl = initialData?.external_sources && initialData.external_sources.length > 0
    ? initialData.external_sources[0].url || ""
    : initialData?.source_url || "";

  // Generate smart defaults for SEO and structured data
  const generateDefaults = (data: any) => {
    const title = data?.title || "";
    const slug = data?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    const contentType = data?.content_type || defaultType || "blog";
    const excerpt = data?.excerpt || "";
    const tags = data?.tags || [];

    // Generate canonical URL based on content type and slug
    const canonicalUrl = slug
      ? `https://persx.ai/${contentType === 'news' ? 'news' : contentType === 'blog' ? 'blog' : 'content'}/${slug}`
      : "";

    // Extract focus keyword from title (first meaningful word or phrase)
    const focusKeyword = tags.length > 0 ? tags[0] : title.split(' ').slice(0, 3).join(' ');

    // Generate breadcrumb schema
    const contentTypeLabel = contentType === 'news' ? 'News' :
                            contentType === 'blog' ? 'Blog' :
                            contentType === 'case_study' ? 'Case Studies' :
                            'Content';
    const contentTypePath = contentType === 'news' ? 'news' :
                           contentType === 'blog' ? 'blog' :
                           'content';

    const breadcrumbItems: BreadcrumbItem[] = [
      { position: 1, name: "Home", item: "https://persx.ai" },
      { position: 2, name: contentTypeLabel, item: `https://persx.ai/${contentTypePath}` },
    ];

    if (slug && title) {
      breadcrumbItems.push({
        position: 3,
        name: title,
        item: canonicalUrl,
      });
    }

    return {
      meta_title: data?.meta_title || title,
      meta_description: data?.meta_description || excerpt,
      focus_keyword: data?.focus_keyword || focusKeyword,
      canonical_url: data?.canonical_url || canonicalUrl,
      article_schema: data?.article_schema || {
        headline: title,
        author: { type: "Organization" as const, name: "PersX.ai" },
        publisher: { type: "Organization" as const, name: "PersX.ai", url: "https://persx.ai" },
        datePublished: data?.published_at || data?.created_at || new Date().toISOString(),
        dateModified: data?.updated_at || new Date().toISOString(),
        articleSection: contentType,
        keywords: tags,
        description: excerpt,
      },
      breadcrumb_schema: data?.breadcrumb_schema || {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbItems,
      },
    };
  };

  const defaults = generateDefaults(initialData);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    content_type: initialData?.content_type || defaultType || "blog",
    status: initialData?.status || "draft",
    industry: initialData?.industry || "General",
    tags: initialData?.tags || [],
    // External content fields
    source_type: initialData?.source_type || "internal",
    source_name: initialData?.source_name || "",
    source_url: firstExternalSourceUrl,
    source_author: initialData?.source_author || "",
    source_published_date: initialData?.source_published_date || "",
    curator_notes: initialData?.curator_notes || "",
    summary: initialData?.summary || initialData?.overall_summary || "",
    // SEO fields with smart defaults
    meta_title: defaults.meta_title,
    meta_description: defaults.meta_description,
    focus_keyword: defaults.focus_keyword,
    canonical_url: defaults.canonical_url,
    // Open Graph
    og_title: initialData?.og_title || "",
    og_description: initialData?.og_description || "",
    og_image_url: initialData?.og_image_url || "",
    // Twitter Card
    twitter_title: initialData?.twitter_title || "",
    twitter_description: initialData?.twitter_description || "",
    twitter_image_url: initialData?.twitter_image_url || "",
    // Article Schema with smart defaults
    article_schema: defaults.article_schema,
    // Breadcrumb Schema with smart defaults
    breadcrumb_schema: defaults.breadcrumb_schema,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Auto-generate slug from title if not set
      const slug = formData.slug || formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Sanitize content before saving
      const sanitizedData = sanitizeContentForSave({
        title: formData.title,
        excerpt: formData.excerpt,
        summary: formData.summary,
      });

      const payload = {
        ...formData,
        slug,
        title: sanitizedData.title,
        excerpt: sanitizedData.excerpt,
        summary: sanitizedData.summary,
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

  const handleIndustryChange = (industry: string) => {
    setFormData((prev) => ({
      ...prev,
      industry: industry,
    }));
  };

  // Track initial form data for unsaved changes detection
  useEffect(() => {
    if (!initialFormData && formData.title) {
      setInitialFormData(JSON.stringify(formData));
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
      // Auto-generate slug from title if not set
      const slug = formData.slug || formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Sanitize content before saving
      const sanitizedData = sanitizeContentForSave({
        title: formData.title,
        excerpt: formData.excerpt,
        summary: formData.summary,
      });

      const payload = {
        ...formData,
        slug,
        title: sanitizedData.title,
        excerpt: sanitizedData.excerpt,
        summary: sanitizedData.summary,
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
      // Auto-generate slug from title if not set
      const slug = formData.slug || formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Sanitize content before publishing
      const sanitizedData = sanitizeContentForSave({
        title: formData.title,
        excerpt: formData.excerpt,
        summary: formData.summary,
      });

      const payload = {
        ...formData,
        slug,
        title: sanitizedData.title,
        excerpt: sanitizedData.excerpt,
        summary: sanitizedData.summary,
        status: "published",
      };

      // Log what's being saved (for debugging blockquote issues)
      if (payload.content.includes('blockquote')) {
        console.log('[ContentEditor] Publishing content with blockquotes:', {
          hasBlockquoteClass: /blockquote class=/.test(payload.content),
          contentSample: payload.content.substring(0, 600)
        });
      }

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
        setError("");
        console.log('[ContentEditor] Content published successfully:', {
          contentId: data.content?.id || contentId,
          slug: data.content?.slug
        });
        setTimeout(() => {
          router.push("/go/cm/content");
          router.refresh();
        }, 1500);
      } else {
        const errorMsg = data.error || data.details || "Failed to publish content";
        console.error('[ContentEditor] Publish failed:', {
          status: response.status,
          error: errorMsg,
          response: data
        });
        setError(errorMsg);
      }
    } catch (err) {
      console.error('[ContentEditor] Publish error:', err);
      setError(err instanceof Error ? err.message : "An error occurred while publishing");
    } finally {
      setIsLoading(false);
    }
  }, [formData, contentId, router]);

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
          onSaveDraft={handleSaveDraft}
          onPublish={handlePublish}
          currentStatus={formData.status as "draft" | "published" | "archived"}
          hasUnsavedChanges={hasUnsavedChanges}
          isSaving={isLoading}
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
              onChange={(e) => setFormData({ ...formData, title: normalizeText(e.target.value) })}
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
              onChange={(e) => setFormData({ ...formData, excerpt: normalizeText(e.target.value) })}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief summary of the content"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Main Content *
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
      <CollapsibleSection
        title="Source Information"
        description="Attribution and external content details"
        icon="📰"
        defaultOpen={false}
      >
        <div className="space-y-4 mt-4">
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
                  onChange={(e) => setFormData({ ...formData, source_url: normalizeText(e.target.value) })}
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
                    onChange={(e) => setFormData({ ...formData, source_name: normalizeText(e.target.value) })}
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
                    onChange={(e) => setFormData({ ...formData, source_author: normalizeText(e.target.value) })}
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
      </CollapsibleSection>

      {/* SEO Metadata Section */}
      <CollapsibleSection
        title="SEO Metadata"
        description="Optimize your content for search engines"
        icon="🔍"
        defaultOpen={true}
      >
        <div className="space-y-4 mt-4">
          {/* Auto-fill button */}
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Auto-fill SEO Fields
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Generate defaults from title, excerpt, and tags
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const newDefaults = generateDefaults({
                  ...formData,
                  slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
                });
                setFormData({
                  ...formData,
                  meta_title: newDefaults.meta_title,
                  meta_description: newDefaults.meta_description,
                  focus_keyword: newDefaults.focus_keyword,
                  canonical_url: newDefaults.canonical_url,
                  article_schema: newDefaults.article_schema,
                });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Auto-fill
            </button>
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              URL Slug
            </label>
            <input
              id="slug"
              type="text"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="auto-generated-from-title"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Leave empty to auto-generate from title
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Meta Title
              </label>
              <span className={`text-xs ${formData.meta_title.length > 60 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                {formData.meta_title.length}/60
              </span>
            </div>
            <input
              id="meta_title"
              type="text"
              value={formData.meta_title}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Defaults to content title"
              maxLength={60}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Meta Description
              </label>
              <span className={`text-xs ${formData.meta_description.length > 160 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                {formData.meta_description.length}/160
              </span>
            </div>
            <textarea
              id="meta_description"
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description for search results"
              maxLength={160}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="focus_keyword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Focus Keyword
              </label>
              <input
                id="focus_keyword"
                type="text"
                value={formData.focus_keyword}
                onChange={(e) => setFormData({ ...formData, focus_keyword: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Primary keyword phrase"
              />
            </div>

            <div>
              <label htmlFor="canonical_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Canonical URL
              </label>
              <input
                id="canonical_url"
                type="url"
                value={formData.canonical_url}
                onChange={(e) => setFormData({ ...formData, canonical_url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://persx.ai/..."
              />
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Tags & Categories Section */}
      <CollapsibleSection
        title="Tags & Categories"
        description="Organize and categorize your content"
        icon="🏷️"
        defaultOpen={true}
        badge={formData.tags.length}
      >
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <TagSelector
              selectedTags={formData.tags}
              onChange={(tags) => setFormData({ ...formData, tags })}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Search existing tags or create new ones. Tags help organize and filter content.
            </p>
          </div>

          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Industry
            </label>
            <select
              id="industry"
              value={formData.industry}
              onChange={(e) => handleIndustryChange(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="General">General</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
          </div>
        </div>
      </CollapsibleSection>

      {/* Social Media Preview Section */}
      <CollapsibleSection
        title="Social Media Preview"
        description="Optimize how content appears when shared on social platforms"
        icon="📱"
        defaultOpen={false}
      >
        <div className="space-y-4 mt-4">
          {/* Auto-fill button */}
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Auto-fill Social Media Fields
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Populate from SEO metadata and title
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  ...formData,
                  og_title: formData.meta_title || formData.title,
                  og_description: formData.meta_description || formData.excerpt,
                  twitter_title: formData.meta_title || formData.title,
                  twitter_description: formData.meta_description || formData.excerpt,
                });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Auto-fill
            </button>
          </div>

          {/* Open Graph (Facebook, LinkedIn) */}
          <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span>📘</span>
              Open Graph (Facebook, LinkedIn)
            </h3>

            <div>
              <label htmlFor="og_title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                OG Title
              </label>
              <input
                id="og_title"
                type="text"
                value={formData.og_title}
                onChange={(e) => setFormData({ ...formData, og_title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Defaults to meta title"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Title shown when shared on Facebook/LinkedIn
              </p>
            </div>

            <div>
              <label htmlFor="og_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                OG Description
              </label>
              <textarea
                id="og_description"
                value={formData.og_description}
                onChange={(e) => setFormData({ ...formData, og_description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Defaults to meta description"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Description shown when shared
              </p>
            </div>

            <div>
              <label htmlFor="og_image_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                OG Image URL
              </label>
              <input
                id="og_image_url"
                type="url"
                value={formData.og_image_url}
                onChange={(e) => setFormData({ ...formData, og_image_url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Recommended: 1200×630px (1.91:1 ratio), max 5MB, JPG/PNG/WebP
              </p>
            </div>
          </div>

          {/* Twitter Card */}
          <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span>🐦</span>
              Twitter Card
            </h3>

            <div>
              <label htmlFor="twitter_title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Twitter Title
              </label>
              <input
                id="twitter_title"
                type="text"
                value={formData.twitter_title}
                onChange={(e) => setFormData({ ...formData, twitter_title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Defaults to OG title"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Title shown in Twitter card
              </p>
            </div>

            <div>
              <label htmlFor="twitter_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Twitter Description
              </label>
              <textarea
                id="twitter_description"
                value={formData.twitter_description}
                onChange={(e) => setFormData({ ...formData, twitter_description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Defaults to OG description"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Description shown in Twitter card
              </p>
            </div>

            <div>
              <label htmlFor="twitter_image_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Twitter Image URL
              </label>
              <input
                id="twitter_image_url"
                type="url"
                value={formData.twitter_image_url}
                onChange={(e) => setFormData({ ...formData, twitter_image_url: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Recommended: 1200×675px (16:9 ratio), max 5MB, JPG/PNG/WebP
              </p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>💡 Tip:</strong> Use the same image for both platforms to maintain consistency. If left empty, social platforms will auto-detect images from your content.
            </p>
          </div>
        </div>
      </CollapsibleSection>

      {/* Structured Data / AEO Schema Section */}
      <CollapsibleSection
        title="Structured Data (Article Schema)"
        description="Help AI and search engines understand your content"
        icon="📊"
        defaultOpen={false}
      >
        <div className="space-y-4 mt-4">
          <div>
            <label htmlFor="article_headline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Headline
            </label>
            <input
              id="article_headline"
              type="text"
              value={formData.article_schema.headline || ""}
              onChange={(e) => setFormData({
                ...formData,
                article_schema: { ...formData.article_schema, headline: e.target.value }
              })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Defaults to content title"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Main headline for Schema.org Article markup
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="article_section" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Article Section / Category
              </label>
              <input
                id="article_section"
                type="text"
                value={formData.article_schema.articleSection || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  article_schema: { ...formData.article_schema, articleSection: e.target.value }
                })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Technology, Marketing"
              />
            </div>

            <div>
              <label htmlFor="article_image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Featured Image URL
              </label>
              <input
                id="article_image"
                type="url"
                value={formData.article_schema.image || ""}
                onChange={(e) => setFormData({
                  ...formData,
                  article_schema: { ...formData.article_schema, image: e.target.value }
                })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>
          </div>

          <div>
            <label htmlFor="article_description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Article Description
            </label>
            <textarea
              id="article_description"
              value={formData.article_schema.description || ""}
              onChange={(e) => setFormData({
                ...formData,
                article_schema: { ...formData.article_schema, description: e.target.value }
              })}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of the article"
            />
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <strong>About Structured Data:</strong> Schema.org Article markup helps search engines and AI assistants understand your content better. This improves your chances of appearing in rich results, featured snippets, and AI-powered answer engines.
            </p>
          </div>
        </div>
      </CollapsibleSection>

      {/* Advanced Schema Section */}
      <CollapsibleSection
        title="Advanced Schema"
        description="Navigation breadcrumbs and additional structured data"
        icon="🔗"
        defaultOpen={false}
      >
        <div className="space-y-4 mt-4">
          {/* Auto-fill button */}
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                Auto-generate Breadcrumbs
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                Generate navigation breadcrumbs from content type and title
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                const regenerated = generateDefaults(formData);
                setFormData({
                  ...formData,
                  breadcrumb_schema: regenerated.breadcrumb_schema,
                });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Auto-generate
            </button>
          </div>

          {/* BreadcrumbList Schema */}
          <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <span>🍞</span>
              BreadcrumbList Schema
            </h3>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Breadcrumbs help search engines understand your site structure and may appear in search results.
            </p>

            {/* Display breadcrumb items */}
            {formData.breadcrumb_schema?.itemListElement && formData.breadcrumb_schema.itemListElement.length > 0 ? (
              <div className="space-y-3">
                {formData.breadcrumb_schema.itemListElement.map((item: BreadcrumbItem, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
                      {item.position}
                    </span>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const updatedItems = [...(formData.breadcrumb_schema?.itemListElement || [])];
                            updatedItems[index] = { ...item, name: e.target.value };
                            setFormData({
                              ...formData,
                              breadcrumb_schema: {
                                ...formData.breadcrumb_schema,
                                itemListElement: updatedItems,
                              },
                            });
                          }}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                          URL
                        </label>
                        <input
                          type="url"
                          value={item.item}
                          onChange={(e) => {
                            const updatedItems = [...(formData.breadcrumb_schema?.itemListElement || [])];
                            updatedItems[index] = { ...item, item: e.target.value };
                            setFormData({
                              ...formData,
                              breadcrumb_schema: {
                                ...formData.breadcrumb_schema,
                                itemListElement: updatedItems,
                              },
                            });
                          }}
                          className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    {index > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updatedItems = (formData.breadcrumb_schema?.itemListElement || [])
                            .filter((_: any, i: number) => i !== index)
                            .map((item: any, i: number) => ({ ...item, position: i + 1 }));
                          setFormData({
                            ...formData,
                            breadcrumb_schema: {
                              ...formData.breadcrumb_schema,
                              itemListElement: updatedItems,
                            },
                          });
                        }}
                        className="flex-shrink-0 p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}

                {/* Add breadcrumb button */}
                <button
                  type="button"
                  onClick={() => {
                    const currentItems = formData.breadcrumb_schema?.itemListElement || [];
                    const newPosition = currentItems.length + 1;
                    setFormData({
                      ...formData,
                      breadcrumb_schema: {
                        ...formData.breadcrumb_schema,
                        itemListElement: [
                          ...currentItems,
                          { position: newPosition, name: "", item: "" },
                        ],
                      },
                    });
                  }}
                  className="w-full p-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  + Add Breadcrumb Item
                </button>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="mb-3">No breadcrumbs defined</p>
                <button
                  type="button"
                  onClick={() => {
                    const regenerated = generateDefaults(formData);
                    setFormData({
                      ...formData,
                      breadcrumb_schema: regenerated.breadcrumb_schema,
                    });
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Generate Breadcrumbs
                </button>
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>💡 About Breadcrumbs:</strong> BreadcrumbList schema helps search engines understand your site hierarchy. Breadcrumbs may appear in search results, making it easier for users to navigate.
            </p>
          </div>
        </div>
      </CollapsibleSection>

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
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          {contentId && (
            <DeleteContentButton
              contentId={contentId}
              contentTitle={formData.title || "this content"}
              variant="button"
            />
          )}
        </div>
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

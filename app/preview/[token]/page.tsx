import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import ContentLayout from "@/app/components/content/ContentLayout";
import ContentRenderer from "@/app/components/content/ContentRenderer";

interface PageProps {
  params: {
    token: string;
  };
}

export default async function PreviewPage({ params }: PageProps) {
  const supabase = createClient();

  // Fetch the preview token
  const { data: tokenData, error: tokenError } = await supabase
    .from("content_preview_tokens")
    .select("*, knowledge_base_content(*)")
    .eq("token", params.token)
    .single();

  if (tokenError || !tokenData) {
    notFound();
  }

  // Check if token is expired
  const expiresAt = new Date(tokenData.expires_at);
  if (expiresAt < new Date()) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Preview Link Expired
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This preview link has expired. Preview links are valid for 24 hours
            after creation.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Please request a new preview link from the content editor.
          </p>
        </div>
      </div>
    );
  }

  const content = tokenData.knowledge_base_content;

  if (!content) {
    notFound();
  }

  // Update view count and last viewed timestamp
  await supabase
    .from("content_preview_tokens")
    .update({
      views_count: tokenData.views_count + 1,
      last_viewed_at: new Date().toISOString(),
    })
    .eq("id", tokenData.id);

  // Get content type label for back link
  const contentTypeLabels: Record<string, string> = {
    blog: "Blog Post",
    case_study: "Case Study",
    implementation_guide: "Implementation Guide",
    test_result: "Test Result",
    best_practice: "Best Practice",
    tool_guide: "Tool Guide",
    news: "News",
  };

  const backLink = {
    href: "#",
    label: `Back to ${contentTypeLabels[content.content_type] || "Content"} List`,
  };

  return (
    <>
      {/* Preview Banner */}
      <div className="sticky top-0 z-10 border-b border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-orange-600 dark:text-orange-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span className="text-sm font-medium text-orange-900 dark:text-orange-200">
                Preview Mode
              </span>
              <span className="text-sm text-orange-700 dark:text-orange-300">
                {content.status === "draft" ? "Draft Content" : "Published Content"}
              </span>
            </div>
            <div className="text-xs text-orange-700 dark:text-orange-300">
              Expires: {expiresAt.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <ContentLayout>
        <ContentRenderer content={content} contentType={content.content_type} />
      </ContentLayout>
    </>
  );
}

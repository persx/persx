import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import ContentLayout from "@/app/components/content/ContentLayout";
import { NewsTemplate } from "@/app/components/content";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function NewsArticlePage({ params }: PageProps) {
  const supabase = createClient();

  // Fetch the news article by slug
  const { data: article, error } = await supabase
    .from("knowledge_base_content")
    .select("*")
    .eq("slug", params.slug)
    .eq("content_type", "news")
    .single();

  if (error || !article) {
    notFound();
  }

  // Only show published articles to public
  if (article.status !== "published") {
    notFound();
  }

  return (
    <ContentLayout
      backLink={{
        href: "/news",
        label: "Back to News",
      }}
    >
      <NewsTemplate content={article} />

      {/* Related Articles CTA */}
      <div className="mt-12 p-6 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          Stay Informed
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Get the latest news and insights about personalization and marketing
          technology.
        </p>
        <Link
          href="/news"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          View All News
        </Link>
      </div>
    </ContentLayout>
  );
}

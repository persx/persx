import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import Link from "next/link";
import ContentLayout from "@/app/components/content/ContentLayout";
import { NewsTemplate } from "@/app/components/content";
import NewsletterSubscription from "@/components/NewsletterSubscription";

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

      {/* Newsletter Subscription */}
      <div className="mt-12">
        <NewsletterSubscription />
        <div className="mt-6 text-center">
          <Link
            href="/news"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View All News
          </Link>
        </div>
      </div>
    </ContentLayout>
  );
}

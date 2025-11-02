import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import ContentLayout from "@/app/components/content/ContentLayout";
import { NewsTemplate } from "@/app/components/content";
import NewsletterSubscription from "@/components/NewsletterSubscription";
import { ArticleStructuredData, BreadcrumbStructuredData } from "@/app/components/seo/StructuredData";
import "highlight.js/styles/github-dark.css";

interface PageProps {
  params: {
    slug: string;
  };
}

// Revalidate every 60 seconds to show fresh content
export const revalidate = 60;

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createClient();

  const { data: article } = await supabase
    .from("knowledge_base_content")
    .select("title, excerpt, featured_image, meta_title, meta_description, author, published_at, updated_at")
    .eq("slug", params.slug)
    .eq("content_type", "news")
    .single();

  if (!article) {
    return {
      title: "News Article Not Found",
    };
  }

  const title = article.meta_title || article.title;
  const description = article.meta_description || article.excerpt || article.title;
  const imageUrl = article.featured_image || "https://persx.ai/icon.svg";

  return {
    title,
    description,
    authors: article.author ? [{ name: article.author }] : [{ name: "PersX.ai Team" }],
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.published_at || undefined,
      modifiedTime: article.updated_at || undefined,
      authors: article.author ? [article.author] : ["PersX.ai Team"],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      url: `https://persx.ai/news/${params.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@PersXai",
    },
    alternates: {
      canonical: `https://persx.ai/news/${params.slug}`,
    },
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

  // Prepare breadcrumb data
  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "News", url: "/news" },
    { name: article.title, url: `/news/${params.slug}` },
  ];

  return (
    <>
      <ArticleStructuredData article={article} />
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <ContentLayout>
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
    </>
  );
}

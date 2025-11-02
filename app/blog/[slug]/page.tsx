import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import ContentLayout from "@/app/components/content/ContentLayout";
import { BlogTemplate } from "@/app/components/content";
import { ArticleStructuredData, BreadcrumbStructuredData } from "@/app/components/seo/StructuredData";
import "highlight.js/styles/github-dark.css"; // Load syntax highlighting CSS only for blog pages

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createClient();

  const { data: article } = await supabase
    .from("knowledge_base_content")
    .select("title, excerpt, featured_image, meta_title, meta_description, author, published_at, updated_at")
    .eq("slug", params.slug)
    .eq("content_type", "blog")
    .single();

  if (!article) {
    return {
      title: "Article Not Found",
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
      url: `https://persx.ai/blog/${params.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@PersXai",
    },
    alternates: {
      canonical: `https://persx.ai/blog/${params.slug}`,
    },
  };
}

export default async function BlogArticlePage({ params }: PageProps) {
  const supabase = createClient();

  // Fetch the blog post by slug
  const { data: article, error } = await supabase
    .from("knowledge_base_content")
    .select("*")
    .eq("slug", params.slug)
    .eq("content_type", "blog")
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
    { name: "Blog", url: "/blog" },
    { name: article.title, url: `/blog/${params.slug}` },
  ];

  return (
    <>
      {/* Add structured data for SEO */}
      <ArticleStructuredData article={article} />
      <BreadcrumbStructuredData items={breadcrumbItems} />

      <ContentLayout>
        <BlogTemplate content={article} />
      </ContentLayout>
    </>
  );
}

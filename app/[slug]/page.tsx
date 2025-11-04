import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import ContentBody from "@/app/components/content/ContentBody";
import ContentBlockRenderer from "@/app/components/blocks/ContentBlockRenderer";

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = createClient();

  const { data: page } = await supabase
    .from("knowledge_base_content")
    .select("*")
    .eq("slug", params.slug)
    .eq("content_type", "static_page")
    .eq("status", "published")
    .single();

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: page.meta_title || page.title,
    description: page.meta_description || page.excerpt || undefined,
    keywords: page.tags?.join(", ") || undefined,
    openGraph: {
      title: page.og_title || page.meta_title || page.title,
      description: page.og_description || page.meta_description || page.excerpt || undefined,
      images: page.og_image_url ? [page.og_image_url] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.twitter_title || page.og_title || page.meta_title || page.title,
      description: page.twitter_description || page.og_description || page.meta_description || page.excerpt || undefined,
      images: page.twitter_image_url ? [page.twitter_image_url] : page.og_image_url ? [page.og_image_url] : undefined,
    },
    alternates: {
      canonical: page.canonical_url || undefined,
    },
  };
}

export default async function StaticPage({ params }: PageProps) {
  const supabase = createClient();

  // Fetch the page content
  const { data: page, error } = await supabase
    .from("knowledge_base_content")
    .select("*")
    .eq("slug", params.slug)
    .eq("content_type", "static_page")
    .eq("status", "published")
    .single();

  if (error || !page) {
    notFound();
  }

  // Check if page uses content blocks or markdown
  const useBlocks = page.content_blocks && page.content_blocks.length > 0;

  return (
    <>
      {/* Render block-based pages */}
      {useBlocks ? (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <ContentBlockRenderer blocks={page.content_blocks} />
        </div>
      ) : (
        /* Render markdown-based pages */
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <main className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
            {/* Page Header */}
            <div className="max-w-4xl mx-auto mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                {page.title}
              </h1>
              {page.excerpt && (
                <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                  {page.excerpt}
                </p>
              )}
            </div>

            {/* Page Content */}
            <div className="max-w-4xl mx-auto">
              <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 md:p-12">
                <ContentBody content={page.content} />
              </article>
            </div>

        {/* Structured Data */}
        {page.article_schema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebPage",
                headline: page.article_schema.headline || page.title,
                description: page.article_schema.description || page.excerpt,
                author: page.article_schema.author || {
                  "@type": "Organization",
                  name: "PersX.ai",
                },
                publisher: page.article_schema.publisher || {
                  "@type": "Organization",
                  name: "PersX.ai",
                  url: "https://persx.ai",
                },
                datePublished: page.published_at || page.created_at,
                dateModified: page.updated_at,
                image: page.article_schema.image,
              }),
            }}
          />
        )}

        {/* Breadcrumb Structured Data */}
        {page.breadcrumb_schema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(page.breadcrumb_schema),
            }}
          />
        )}
          </main>
        </div>
      )}
    </>
  );
}

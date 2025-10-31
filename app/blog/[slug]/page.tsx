import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import ContentLayout from "@/app/components/content/ContentLayout";
import { BlogTemplate } from "@/app/components/content";

interface PageProps {
  params: {
    slug: string;
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

  return (
    <ContentLayout
      backLink={{
        href: "/blog",
        label: "Back to Blog",
      }}
    >
      <BlogTemplate content={article} />
    </ContentLayout>
  );
}

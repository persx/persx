import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import ContentLayout from "@/app/components/content/ContentLayout";
import { ToolGuideTemplate } from "@/app/components/content";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ToolGuidePage({ params }: PageProps) {
  const supabase = createClient();

  // Fetch the tool guide by slug
  const { data: article, error } = await supabase
    .from("knowledge_base_content")
    .select("*")
    .eq("slug", params.slug)
    .eq("content_type", "tool_guide")
    .single();

  if (error || !article) {
    notFound();
  }

  // Only show published articles to public
  if (article.status !== "published") {
    notFound();
  }

  return (
    <ContentLayout>
      <ToolGuideTemplate content={article} />
    </ContentLayout>
  );
}

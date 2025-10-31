import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import ContentLayout from "@/app/components/content/ContentLayout";
import { BestPracticeTemplate } from "@/app/components/content";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function BestPracticePage({ params }: PageProps) {
  const supabase = createClient();

  // Fetch the best practice by slug
  const { data: article, error } = await supabase
    .from("knowledge_base_content")
    .select("*")
    .eq("slug", params.slug)
    .eq("content_type", "best_practice")
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
        href: "/best-practices",
        label: "Back to Best Practices",
      }}
    >
      <BestPracticeTemplate content={article} />
    </ContentLayout>
  );
}

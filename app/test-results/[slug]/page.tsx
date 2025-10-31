import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import ContentLayout from "@/app/components/content/ContentLayout";
import { TestResultTemplate } from "@/app/components/content";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function TestResultPage({ params }: PageProps) {
  const supabase = createClient();

  // Fetch the test result by slug
  const { data: article, error } = await supabase
    .from("knowledge_base_content")
    .select("*")
    .eq("slug", params.slug)
    .eq("content_type", "test_result")
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
        href: "/test-results",
        label: "Back to Test Results",
      }}
    >
      <TestResultTemplate content={article} />
    </ContentLayout>
  );
}

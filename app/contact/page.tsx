import { createClient } from "@/lib/supabase-server";
import ContentBlockRenderer from "@/app/components/blocks/ContentBlockRenderer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact PersX.ai - Transform Your Personalization Strategy",
  description:
    "Ready to transform your personalization strategy? Get in touch with PersX.ai for high-impact opportunities and actionable experiment roadmaps.",
};

export default async function ContactPage() {
  const supabase = createClient();

  const { data: page, error } = await supabase
    .from("knowledge_base_content")
    .select("*")
    .eq("slug", "contact")
    .eq("status", "published")
    .single();

  if (error || !page) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            The contact page could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24">
      <ContentBlockRenderer blocks={page.content_blocks} />
    </div>
  );
}

import { createClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import ContentEditorWrapper from "../components/ContentEditorWrapper";

export default async function EditContentPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: content, error } = await supabase
    .from("knowledge_base_content")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !content) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Content</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Update your content
        </p>
      </div>

      <ContentEditorWrapper initialData={content} contentId={params.id} />
    </div>
  );
}

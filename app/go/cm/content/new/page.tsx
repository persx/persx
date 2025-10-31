"use client";

import { useSearchParams } from "next/navigation";
import ContentEditorWrapper from "../components/ContentEditorWrapper";

export default function NewContentPage() {
  const searchParams = useSearchParams();
  const contentType = searchParams.get("type") || undefined;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create New Content</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Add new content to your knowledge base
        </p>
      </div>

      <ContentEditorWrapper defaultType={contentType} />
    </div>
  );
}

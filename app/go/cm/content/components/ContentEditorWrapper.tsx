"use client";

import dynamic from "next/dynamic";

// Import ContentEditor dynamically with no SSR to avoid hydration issues
const ContentEditor = dynamic(() => import("./ContentEditor"), {
  ssr: false,
  loading: () => (
    <div className="space-y-6">
      <div className="animate-pulse space-y-4">
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  ),
});

interface ContentEditorWrapperProps {
  initialData?: any;
  contentId?: string;
  defaultType?: string;
}

export default function ContentEditorWrapper({
  initialData,
  contentId,
  defaultType,
}: ContentEditorWrapperProps) {
  return (
    <ContentEditor
      initialData={initialData}
      contentId={contentId}
      defaultType={defaultType}
    />
  );
}

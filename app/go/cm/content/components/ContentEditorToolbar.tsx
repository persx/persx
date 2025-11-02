"use client";

interface ContentEditorToolbarProps {
  onSaveDraft: () => Promise<void>;
  onPublish: () => Promise<void>;
  currentStatus: "draft" | "published" | "archived";
  hasUnsavedChanges: boolean;
  isSaving: boolean;
}

/**
 * ContentEditorToolbar - Action buttons and status indicators for content editor
 * Provides Save Draft and Publish functionality
 */
export default function ContentEditorToolbar({
  onSaveDraft,
  onPublish,
  currentStatus,
  hasUnsavedChanges,
  isSaving,
}: ContentEditorToolbarProps) {
  const getStatusBadge = () => {
    const badges = {
      draft: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
      published: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      archived: "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400",
    };

    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${badges[currentStatus]}`}>
        {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
      </span>
    );
  };

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 -mx-6 px-6 -mt-6 mb-6">
      <div className="py-4">
        {/* Top Row: Status and Actions */}
        <div className="flex items-center justify-between mb-3">
          {/* Left: Status Info */}
          <div className="flex items-center gap-4">
            {getStatusBadge()}

            {/* Save Status */}
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              {isSaving ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : hasUnsavedChanges ? (
                <>
                  <svg className="h-4 w-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="4" />
                  </svg>
                  <span>Unsaved changes</span>
                </>
              ) : null}
              {/* Hidden for now - "Saved just now" status
              : lastSaved ? (
                <>
                  <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Saved {getRelativeTime(lastSaved)}</span>
                </>
              ) : null
              */}
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Hidden for now - Preview Button
            <button
              type="button"
              onClick={onPreview}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Preview (Cmd+P)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </button>
            */}

            {/* Hidden for now - Get Preview Link Button
            {contentId && (
              <button
                type="button"
                onClick={onGetPreviewLink}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Share Preview
              </button>
            )}
            */}

            {/* Save Draft Button */}
            <button
              type="button"
              onClick={onSaveDraft}
              disabled={isSaving || (!hasUnsavedChanges && currentStatus === "draft")}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Save as Draft (Cmd+S)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save Draft
            </button>

            {/* Publish Button */}
            <button
              type="button"
              onClick={onPublish}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {currentStatus === "published" ? "Update & Publish" : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

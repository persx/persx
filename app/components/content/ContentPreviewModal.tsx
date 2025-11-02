"use client";

import { useEffect, useRef } from "react";
import ContentLayout from "./ContentLayout";
import ContentRenderer from "./ContentRenderer";

interface ContentPreviewModalProps {
  content: any; // knowledge_base_content record
  isOpen: boolean;
  onClose: () => void;
}

/**
 * ContentPreviewModal - Full-screen modal for previewing content
 * Shows exactly how content will look when published
 */
export default function ContentPreviewModal({
  content,
  isOpen,
  onClose,
}: ContentPreviewModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        className="fixed inset-0 overflow-y-auto bg-white dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-medium">
                Preview Mode
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                This is how your content will appear when published
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Close Preview
            </button>
          </div>
        </div>

        {/* Content */}
        <ContentLayout>
          <ContentRenderer
            content={content}
            contentType={content.content_type}
          />
        </ContentLayout>
      </div>
    </div>
  );
}

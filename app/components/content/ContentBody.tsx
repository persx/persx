"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github-dark.css";

interface ContentBodyProps {
  content: string;
  className?: string;
}

/**
 * ContentBody - Renders markdown content with syntax highlighting
 * Supports GitHub Flavored Markdown (tables, strikethrough, etc.)
 */
export default function ContentBody({
  content,
  className = "",
}: ContentBodyProps) {
  return (
    <div
      className={`prose prose-base md:prose-lg dark:prose-invert max-w-none
        prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
        prose-h1:text-2xl md:prose-h1:text-4xl prose-h1:mb-4 md:prose-h1:mb-6 prose-h1:mt-6 md:prose-h1:mt-8
        prose-h2:text-xl md:prose-h2:text-3xl prose-h2:mb-3 md:prose-h2:mb-4 prose-h2:mt-6 md:prose-h2:mt-8
        prose-h3:text-lg md:prose-h3:text-2xl prose-h3:mb-2 md:prose-h3:mb-3 prose-h3:mt-4 md:prose-h3:mt-6
        prose-h4:text-base md:prose-h4:text-xl prose-h4:mb-2 prose-h4:mt-4
        prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-3 md:prose-p:mb-4 prose-p:text-sm md:prose-p:text-base
        prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
        prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs md:prose-code:text-sm
        prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:p-3 md:prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:text-xs md:prose-pre:text-sm
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-3 md:prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:text-sm md:prose-blockquote:text-base
        prose-ul:list-disc prose-ul:pl-5 md:prose-ul:pl-6 prose-ul:mb-3 md:prose-ul:mb-4
        prose-ol:list-decimal prose-ol:pl-5 md:prose-ol:pl-6 prose-ol:mb-3 md:prose-ol:mb-4
        prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:mb-1 md:prose-li:mb-2 prose-li:text-sm md:prose-li:text-base
        prose-table:border-collapse prose-table:w-full prose-table:mb-4 prose-table:text-xs md:prose-table:text-sm
        prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-700 prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-2 prose-th:text-left
        prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-700 prose-td:p-2
        prose-img:rounded-lg prose-img:shadow-md prose-img:my-4 md:prose-img:my-6
        ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

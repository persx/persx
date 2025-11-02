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
        prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:tracking-tight
        prose-h1:text-2xl md:prose-h1:text-4xl prose-h1:mb-5 md:prose-h1:mb-6 prose-h1:mt-8 md:prose-h1:mt-10 prose-h1:leading-tight
        prose-h2:text-xl md:prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:font-bold
        prose-h3:text-lg md:prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:font-bold
        prose-h4:text-xl md:prose-h4:text-2xl prose-h4:mb-4 prose-h4:mt-8 prose-h4:font-bold
        prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4 prose-p:text-sm md:prose-p:text-base
        prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold
        prose-em:italic
        prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
        prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto
        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:my-4 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/30 prose-blockquote:py-2 prose-blockquote:rounded-r
        prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4 prose-ul:mt-2
        prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4 prose-ol:mt-2
        prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:text-sm md:prose-li:text-base prose-li:leading-relaxed prose-li:mb-2
        prose-li::marker:text-gray-500 dark:prose-li::marker:text-gray-400
        prose-table:border-collapse prose-table:w-full prose-table:mb-5
        prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-700 prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-3 prose-th:text-left prose-th:font-semibold
        prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-700 prose-td:p-3
        prose-img:rounded-lg prose-img:shadow-md prose-img:my-5 prose-img:w-full
        prose-hr:border-gray-300 dark:prose-hr:border-gray-700 prose-hr:my-6 prose-hr:border-t-2
        ${className}`}
      style={{
        // Ensure base styles are applied
        lineHeight: '1.75',
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // Ensure proper rendering of elements
          p: ({ node, ...props }) => <p style={{ marginBottom: '1rem' }} {...props} />,
          ul: ({ node, ...props }) => <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', marginBottom: '1rem' }} {...props} />,
          ol: ({ node, ...props }) => <ol style={{ listStyleType: 'decimal', paddingLeft: '1.5rem', marginBottom: '1rem' }} {...props} />,
          li: ({ node, ...props }) => <li style={{ marginBottom: '0.5rem' }} {...props} />,
          h2: ({ node, ...props }) => <h2 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }} {...props} />,
          h3: ({ node, ...props }) => <h3 style={{ marginTop: '1.5rem', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 'bold' }} {...props} />,
          h4: ({ node, ...props }) => <h4 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: 'bold' }} {...props} />,
          strong: ({ node, ...props }) => <strong style={{ fontWeight: 'bold' }} {...props} />,
          hr: ({ node, ...props }) => <hr style={{ marginTop: '2rem', marginBottom: '2rem', borderTop: '1px solid #e5e7eb' }} {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

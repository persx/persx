"use client";

import { EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { useCallback, useState, useEffect, useRef, useMemo } from "react";
import { marked } from "marked";
import TurndownService from "turndown";
import { contentTemplates, ContentTemplate } from "../lib/contentTemplates";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing your content...",
}: RichTextEditorProps) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const contentRef = useRef(content);
  const turndownService = useRef<TurndownService | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize turndown service immediately
  if (typeof window !== "undefined" && !turndownService.current) {
    turndownService.current = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
    });
  }

  // Update content ref when content prop changes
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Convert markdown to HTML
  const markdownToHtml = (markdown: string): string => {
    if (!markdown) return "";
    return marked.parse(markdown, { async: false }) as string;
  };

  // Convert HTML to markdown
  const htmlToMarkdown = (html: string): string => {
    if (!html || !turndownService.current) return "";
    return turndownService.current.turndown(html);
  };

  // Initialize editor only on client-side after mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Convert markdown content to HTML for editor
    const htmlContent = markdownToHtml(contentRef.current);

    const editorInstance = new Editor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [2, 3, 4],
          },
          // Disable link in StarterKit since we're adding it separately with custom config
          link: false,
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-blue-600 dark:text-blue-400 no-underline hover:underline",
          },
        }),
        Image.configure({
          HTMLAttributes: {
            class: "rounded-lg shadow-md my-5 w-full",
          },
        }),
        Table.configure({
          resizable: true,
          HTMLAttributes: {
            class: "border-collapse w-full my-5",
          },
        }),
        TableRow,
        TableHeader,
        TableCell,
        Placeholder.configure({
          placeholder,
        }),
      ],
      content: htmlContent,
      onUpdate: ({ editor }) => {
        // Convert HTML back to markdown before saving
        const html = editor.getHTML();
        const markdown = htmlToMarkdown(html);
        onChange(markdown);
      },
      editorProps: {
        attributes: {
          class:
            "prose prose-base md:prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-3 " +
            "prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white prose-headings:tracking-tight " +
            "prose-h1:text-2xl md:prose-h1:text-4xl prose-h1:mb-5 md:prose-h1:mb-6 prose-h1:mt-8 md:prose-h1:mt-10 prose-h1:leading-tight " +
            "prose-h2:text-xl md:prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8 prose-h2:font-bold " +
            "prose-h3:text-lg md:prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6 prose-h3:font-bold " +
            "prose-h4:text-xl md:prose-h4:text-2xl prose-h4:mb-4 prose-h4:mt-8 prose-h4:font-bold " +
            "prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:!my-6 prose-p:text-sm md:prose-p:text-base prose-p:min-h-[1.5rem] " +
            "[&_p]:!my-6 [&_p]:leading-relaxed [&_p]:min-h-[1.5rem] [&_p]:block " +
            "prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline " +
            "prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-bold " +
            "prose-em:italic " +
            "prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm " +
            "prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-6 " +
            "prose-blockquote:!border-l-4 prose-blockquote:!pl-5 prose-blockquote:!pr-5 prose-blockquote:!py-3 prose-blockquote:!my-4 prose-blockquote:!rounded-r prose-blockquote:!not-italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 " +
            "[&_blockquote]:!border-l-4 [&_blockquote]:!pl-5 [&_blockquote]:!pr-5 [&_blockquote]:!py-3 [&_blockquote]:!my-4 [&_blockquote]:!rounded-r [&_blockquote]:!not-italic [&_blockquote]:!border-blue-500 " +
            "prose-ul:!list-disc prose-ul:!pl-6 prose-ul:!mb-4 prose-ul:!mt-2 " +
            "[&_ul]:!list-disc [&_ul]:!pl-6 [&_ul]:!mb-4 [&_ul]:!mt-2 [&_ul]:!block " +
            "prose-ol:!list-decimal prose-ol:!pl-6 prose-ol:!mb-4 prose-ol:!mt-2 " +
            "[&_ol]:!list-decimal [&_ol]:!pl-6 [&_ol]:!mb-4 [&_ol]:!mt-2 [&_ol]:!block " +
            "prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:text-sm md:prose-li:text-base prose-li:!leading-relaxed prose-li:!mb-2 " +
            "[&_li]:text-gray-700 dark:[&_li]:text-gray-300 [&_li]:!leading-relaxed [&_li]:!mb-2 [&_li]:!block " +
            "prose-li::marker:text-gray-500 dark:prose-li::marker:text-gray-400 " +
            "[&_li::marker]:!text-gray-500 dark:[&_li::marker]:!text-gray-400 " +
            "prose-table:border-collapse prose-table:w-full prose-table:mb-5 " +
            "prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-700 prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:p-3 prose-th:text-left prose-th:font-semibold " +
            "prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-700 prose-td:p-3 " +
            "prose-img:rounded-lg prose-img:shadow-md prose-img:my-5 prose-img:w-full " +
            "prose-hr:border-gray-300 dark:prose-hr:border-gray-700 prose-hr:my-6 prose-hr:border-t-2",
        },
      },
    });

    setEditor(editorInstance);

    return () => {
      editorInstance.destroy();
    };
  }, []); // Only run once on mount

  // Sticky toolbar effect
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      if (containerRef.current && toolbarRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setIsSticky(rect.top < 0 && rect.bottom > toolbarRef.current.offsetHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle escape key for shortcuts modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showShortcuts) {
        setShowShortcuts(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showShortcuts]);

  // Calculate word and character count
  const stats = useMemo(() => {
    if (!editor) return { words: 0, characters: 0 };
    const text = editor.getText();
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    return { words, characters };
  }, [editor?.state.doc]);

  // Get current markdown content for preview
  const currentMarkdown = useMemo(() => {
    if (!editor) return "";
    const html = editor.getHTML();
    return htmlToMarkdown(html);
  }, [editor?.state.doc]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const applyTemplate = useCallback((template: ContentTemplate) => {
    if (!editor) return;

    // Convert markdown template to HTML
    const htmlContent = markdownToHtml(template.content);

    // Set the content
    editor.commands.setContent(htmlContent);

    // Close the modal
    setShowTemplates(false);
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;

    // Create hidden file input
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) return;

      try {
        // Upload file
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Upload failed");
        }

        const data = await response.json();

        // Replace loading image with actual image
        editor
          .chain()
          .focus()
          .setImage({ src: data.url, alt: data.alt })
          .run();
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    };

    input.click();
  }, [editor]);

  // Show loading skeleton until editor is ready
  if (!editor) {
    return (
      <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        <div className="border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2 h-[52px]">
          <div className="animate-pulse flex gap-2">
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
        <div className="p-4 min-h-[400px]">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Toolbar */}
      <div
        ref={toolbarRef}
        className={`
          border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2 flex flex-wrap gap-1
          transition-all duration-200 z-50
          ${isSticky ? 'fixed top-0 left-0 right-0 shadow-lg' : 'relative'}
        `}
      >
        {/* Text Type Dropdown */}
        <select
          onChange={(e) => {
            const value = e.target.value;
            if (value === "p") {
              editor.chain().focus().setParagraph().run();
            } else if (value.startsWith("h")) {
              const level = parseInt(value.substring(1)) as 2 | 3 | 4;
              editor.chain().focus().toggleHeading({ level }).run();
            } else if (value === "blockquote") {
              // Insert Quote blockquote with strong prefix
              editor.chain().focus().clearNodes().insertContent({
                type: 'blockquote',
                content: [{
                  type: 'paragraph',
                  content: [
                    { type: 'text', marks: [{ type: 'bold' }], text: 'Quote' },
                    { type: 'hardBreak' },
                    { type: 'text', text: 'Enter your quote here...' }
                  ]
                }]
              }).run();
            } else if (value === "perspective") {
              // Insert PersX.ai Perspective blockquote with strong prefix
              editor.chain().focus().clearNodes().insertContent({
                type: 'blockquote',
                content: [{
                  type: 'paragraph',
                  content: [
                    { type: 'text', marks: [{ type: 'bold' }], text: 'PersX.ai Perspective' },
                    { type: 'hardBreak' },
                    { type: 'text', text: 'Enter your perspective here...' }
                  ]
                }]
              }).run();
            } else if (value === "callout") {
              // Insert Quick Win Recommendations blockquote with strong prefix
              editor.chain().focus().clearNodes().insertContent({
                type: 'blockquote',
                content: [{
                  type: 'paragraph',
                  content: [
                    { type: 'text', marks: [{ type: 'bold' }], text: 'Quick Win Recommendations' },
                    { type: 'hardBreak' },
                    { type: 'text', text: 'Enter your recommendations here...' }
                  ]
                }]
              }).run();
            }
            // Reset dropdown to paragraph after selection
            e.target.value = "p";
          }}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="blockquote">Quote</option>
          <option value="perspective">PersX.ai Perspective</option>
          <option value="callout">Quick Win</option>
        </select>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 text-sm font-bold rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive("bold")
              ? "bg-gray-300 dark:bg-gray-600"
              : "bg-white dark:bg-gray-800"
          }`}
          title="Bold (Ctrl+B)"
        >
          B
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 text-sm italic rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive("italic")
              ? "bg-gray-300 dark:bg-gray-600"
              : "bg-white dark:bg-gray-800"
          }`}
          title="Italic (Ctrl+I)"
        >
          I
        </button>

        {/* Strikethrough */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 text-sm line-through rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive("strike")
              ? "bg-gray-300 dark:bg-gray-600"
              : "bg-white dark:bg-gray-800"
          }`}
          title="Strikethrough"
        >
          S
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive("bulletList")
              ? "bg-gray-300 dark:bg-gray-600"
              : "bg-white dark:bg-gray-800"
          }`}
          title="Bullet List"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="3" cy="4" r="1.5"/>
            <circle cx="3" cy="10" r="1.5"/>
            <circle cx="3" cy="16" r="1.5"/>
            <rect x="7" y="3" width="11" height="2" rx="1"/>
            <rect x="7" y="9" width="11" height="2" rx="1"/>
            <rect x="7" y="15" width="11" height="2" rx="1"/>
          </svg>
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive("orderedList")
              ? "bg-gray-300 dark:bg-gray-600"
              : "bg-white dark:bg-gray-800"
          }`}
          title="Numbered List"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <text x="1" y="5" fontSize="5" fontWeight="bold">1</text>
            <text x="1" y="11" fontSize="5" fontWeight="bold">2</text>
            <text x="1" y="17" fontSize="5" fontWeight="bold">3</text>
            <rect x="7" y="3" width="11" height="2" rx="1"/>
            <rect x="7" y="9" width="11" height="2" rx="1"/>
            <rect x="7" y="15" width="11" height="2" rx="1"/>
          </svg>
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Code Block */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive("codeBlock")
              ? "bg-gray-300 dark:bg-gray-600"
              : "bg-white dark:bg-gray-800"
          }`}
          title="Code Block"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive("blockquote")
              ? "bg-gray-300 dark:bg-gray-600"
              : "bg-white dark:bg-gray-800"
          }`}
          title="Blockquote"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M6.5 2a.5.5 0 00-.5.5v15a.5.5 0 00.5.5h7a.5.5 0 00.5-.5v-15a.5.5 0 00-.5-.5h-7z"
            />
          </svg>
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Link */}
        <button
          type="button"
          onClick={setLink}
          className={`px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            editor.isActive("link")
              ? "bg-gray-300 dark:bg-gray-600"
              : "bg-white dark:bg-gray-800"
          }`}
          title="Add Link"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Image */}
        <button
          type="button"
          onClick={addImage}
          className="px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
          title="Add Image"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Table */}
        <button
          type="button"
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          className="px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
          title="Insert Table (3x3)"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <rect x="2" y="2" width="16" height="16" rx="1" stroke="currentColor" fill="none" strokeWidth="1.5"/>
            <line x1="2" y1="7" x2="18" y2="7" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="2" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="7" y1="2" x2="7" y2="18" stroke="currentColor" strokeWidth="1.5"/>
            <line x1="12" y1="2" x2="12" y2="18" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </button>

        {/* Horizontal Rule */}
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
          title="Insert Horizontal Line"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <rect x="2" y="9" width="16" height="2" rx="1"/>
          </svg>
        </button>

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Templates */}
        <button
          type="button"
          onClick={() => setShowTemplates(true)}
          className="px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
          title="Insert Template"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
          </svg>
        </button>

        {/* Markdown Preview Toggle */}
        <button
          type="button"
          onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
          className={`px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
            showMarkdownPreview
              ? "bg-gray-300 dark:bg-gray-600"
              : "bg-white dark:bg-gray-800"
          }`}
          title={showMarkdownPreview ? "Hide Markdown" : "Show Markdown"}
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8h8V6z" clipRule="evenodd"/>
            <path d="M7 8h1v4H7V8zm2 0h1v4H9V8zm2 0h1v4h-1V8z"/>
          </svg>
        </button>

        {/* Keyboard Shortcuts Help */}
        <button
          type="button"
          onClick={() => setShowShortcuts(true)}
          className="px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800"
          title="Keyboard Shortcuts"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
          </svg>
        </button>

        {/* Word Count */}
        <div className="ml-auto flex items-center gap-2 px-3 py-1 text-xs text-gray-600 dark:text-gray-400">
          <span title="Word count">📝 {stats.words} words</span>
          <span className="text-gray-400 dark:text-gray-600">|</span>
          <span title="Character count">{stats.characters.toLocaleString()} chars</span>
        </div>
      </div>

      {/* Editor */}
      <div className={showMarkdownPreview ? "grid grid-cols-2 gap-4 p-4" : ""}>
        <div className={showMarkdownPreview ? "" : "w-full"}>
          <EditorContent editor={editor} />

          {/* Custom CSS to force editor formatting to match live site */}
          <style jsx global>{`
            /* Force blockquote styling */
            .ProseMirror blockquote {
              border-left: 4px solid #3b82f6 !important;
              padding-left: 1.25rem !important;
              padding-right: 1.25rem !important;
              padding-top: 0.75rem !important;
              padding-bottom: 0.75rem !important;
              margin-top: 1rem !important;
              margin-bottom: 1rem !important;
              border-radius: 0 0.5rem 0.5rem 0 !important;
              font-style: normal !important;
            }

            /* Force paragraph spacing */
            .ProseMirror p {
              margin-top: 1.5rem !important;
              margin-bottom: 1.5rem !important;
              line-height: 1.75 !important;
            }

            /* Force list styling - unordered */
            .ProseMirror ul {
              display: block !important;
              list-style-type: disc !important;
              padding-left: 1.5rem !important;
              margin-bottom: 1rem !important;
              margin-top: 0.5rem !important;
            }

            /* Force list styling - ordered */
            .ProseMirror ol {
              display: block !important;
              list-style-type: decimal !important;
              padding-left: 1.5rem !important;
              margin-bottom: 1rem !important;
              margin-top: 0.5rem !important;
            }

            /* Force list item styling */
            .ProseMirror li {
              display: list-item !important;
              margin-bottom: 0.5rem !important;
              line-height: 1.75 !important;
            }

            .ProseMirror ul li {
              list-style-type: disc !important;
            }

            .ProseMirror ol li {
              list-style-type: decimal !important;
            }

            /* Note: Special blockquote types (TLDR, Quick Win, Perspective) will show
               with correct colors when published. In editor, they show with blue border. */
          `}</style>
        </div>

        {showMarkdownPreview && (
          <div className="border-l border-gray-300 dark:border-gray-700 pl-4">
            <div className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Markdown Preview
            </div>
            <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 font-mono text-xs overflow-auto max-h-[600px]">
              <pre className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                {currentMarkdown}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowShortcuts(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Keyboard Shortcuts
                </h2>
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>

              <div className="space-y-6">
                {/* Text Formatting */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Text Formatting</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300">Bold</span>
                      <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 rounded">Ctrl+B</kbd>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300">Italic</span>
                      <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 rounded">Ctrl+I</kbd>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300">Strikethrough</span>
                      <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 rounded">Ctrl+Shift+X</kbd>
                    </div>
                  </div>
                </div>

                {/* Paragraph */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Paragraph</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300">Heading 2</span>
                      <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 rounded">Ctrl+Alt+2</kbd>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300">Heading 3</span>
                      <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 rounded">Ctrl+Alt+3</kbd>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300">Paragraph</span>
                      <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 rounded">Ctrl+Alt+0</kbd>
                    </div>
                  </div>
                </div>

                {/* Lists */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Lists</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300">Bullet List</span>
                      <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 rounded">Ctrl+Shift+8</kbd>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300">Numbered List</span>
                      <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 rounded">Ctrl+Shift+7</kbd>
                    </div>
                  </div>
                </div>

                {/* Other */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Other</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300">Undo</span>
                      <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 rounded">Ctrl+Z</kbd>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300">Redo</span>
                      <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 rounded">Ctrl+Y</kbd>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300">Add Link</span>
                      <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 rounded">Ctrl+K</kbd>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700 dark:text-gray-300">Code Block</span>
                      <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 rounded">Ctrl+Alt+C</kbd>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  💡 Tip: Press <kbd className="px-2 py-1 text-xs font-semibold bg-gray-100 dark:bg-gray-700 rounded">Esc</kbd> to close this dialog
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Templates Modal */}
      {showTemplates && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowTemplates(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Content Templates
                </h2>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Choose a template to start with. This will replace your current content.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contentTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    className="text-left p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                  >
                    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {template.description}
                    </p>
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded">
                      {template.contentType}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  💡 Tip: Templates provide a starting structure. Customize them to fit your needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

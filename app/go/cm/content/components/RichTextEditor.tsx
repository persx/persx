"use client";

import { EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useState, useEffect, useRef } from "react";

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
  const contentRef = useRef(content);

  // Update content ref when content prop changes
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Initialize editor only on client-side after mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const editorInstance = new Editor({
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [2, 3, 4],
          },
        }),
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class: "text-blue-600 hover:text-blue-700 underline",
          },
        }),
        Image.configure({
          HTMLAttributes: {
            class: "max-w-full h-auto rounded-lg",
          },
        }),
        Placeholder.configure({
          placeholder,
        }),
      ],
      content: contentRef.current,
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      onUpdate: ({ editor }) => {
        onChange(editor.getHTML());
      },
      editorProps: {
        attributes: {
          class:
            "prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-3",
        },
      },
    });

    setEditor(editorInstance);

    return () => {
      editorInstance.destroy();
    };
  }, []); // Only run once on mount

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

  const addImage = useCallback(() => {
    if (!editor) return;

    const url = window.prompt("Enter image URL:");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
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
    <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
      {/* Toolbar */}
      <div className="border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-2 flex flex-wrap gap-1">
        {/* Text Type Dropdown */}
        <select
          onChange={(e) => {
            const value = e.target.value;
            if (value === "p") {
              editor.chain().focus().setParagraph().run();
            } else if (value.startsWith("h")) {
              const level = parseInt(value.substring(1)) as 2 | 3 | 4;
              editor.chain().focus().toggleHeading({ level }).run();
            }
          }}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
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
            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
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
            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
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

        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Undo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Undo"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="px-3 py-1 text-sm rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Redo"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10.293 16.707a1 1 0 001.414 0l6-6a1 1 0 000-1.414l-6-6a1 1 0 00-1.414 1.414L14.586 9H3a1 1 0 100 2h11.586l-4.293 4.293a1 1 0 000 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}

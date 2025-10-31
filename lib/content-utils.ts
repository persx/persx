/**
 * Content utilities for sanitizing and formatting content
 */

/**
 * Remove quotes and apostrophes from titles
 * Removes: ", ", ', ', «, », ‹, ›
 */
export function sanitizeTitle(title: string): string {
  if (!title) return "";

  return title
    .replace(/[""]/g, "") // Remove curly double quotes
    .replace(/['']/g, "") // Remove curly single quotes/apostrophes
    .replace(/[«»‹›]/g, "") // Remove guillemets
    .replace(/^["']|["']$/g, "") // Remove quotes at start/end
    .trim();
}

/**
 * Convert markdown syntax to HTML
 * Handles: headings, bold, italic, links, lists, line breaks
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return "";

  let html = markdown;

  // Convert headings (must be done before other replacements)
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Convert bold (**text** or __text__)
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");

  // Convert italic (*text* or _text_)
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");

  // Convert strikethrough (~~text~~)
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

  // Convert links [text](url)
  html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

  // Convert unordered lists (lines starting with -, *, or +)
  html = html.replace(/^\s*[-*+]\s+(.+)$/gim, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\s*)+/gs, "<ul>$&</ul>");

  // Convert ordered lists (lines starting with numbers)
  html = html.replace(/^\s*\d+\.\s+(.+)$/gim, "<li>$1</li>");
  // Note: This will also wrap unordered lists, so we need to fix that
  html = html.replace(/<\/ul>\s*<ul>/g, ""); // Merge consecutive ul tags

  // Convert line breaks (double newline = paragraph)
  html = html.replace(/\n\n/g, "</p><p>");
  html = html.replace(/\n/g, "<br>");

  // Wrap in paragraph tags if not already wrapped
  if (!html.startsWith("<h") && !html.startsWith("<ul") && !html.startsWith("<ol") && !html.startsWith("<p")) {
    html = `<p>${html}</p>`;
  }

  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, "");
  html = html.replace(/<p>\s*<\/p>/g, "");

  return html;
}

/**
 * Strip markdown syntax and return plain text
 * Removes markdown formatting but keeps the text content
 */
export function stripMarkdown(markdown: string): string {
  if (!markdown) return "";

  let text = markdown;

  // Remove headings markers
  text = text.replace(/^#{1,6}\s+/gm, "");

  // Remove bold/italic markers
  text = text.replace(/\*\*(.+?)\*\*/g, "$1");
  text = text.replace(/__(.+?)__/g, "$1");
  text = text.replace(/\*(.+?)\*/g, "$1");
  text = text.replace(/_(.+?)_/g, "$1");

  // Remove strikethrough
  text = text.replace(/~~(.+?)~~/g, "$1");

  // Remove links, keep text
  text = text.replace(/\[(.+?)\]\(.+?\)/g, "$1");

  // Remove list markers
  text = text.replace(/^\s*[-*+]\s+/gm, "");
  text = text.replace(/^\s*\d+\.\s+/gm, "");

  // Clean up extra whitespace
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.trim();

  return text;
}

/**
 * Sanitize all content fields for saving
 * Applies title sanitization and markdown conversion as needed
 */
export function sanitizeContentForSave(data: {
  title?: string;
  content?: string;
  excerpt?: string;
  summary?: string;
  overall_summary?: string;
  persx_perspective?: string;
}): typeof data {
  return {
    ...data,
    title: data.title ? sanitizeTitle(data.title) : data.title,
    // Note: content is handled by RichTextEditor, no conversion needed
    // Textareas: strip markdown to keep plain text clean
    excerpt: data.excerpt ? stripMarkdown(data.excerpt) : data.excerpt,
    summary: data.summary ? stripMarkdown(data.summary) : data.summary,
    overall_summary: data.overall_summary ? stripMarkdown(data.overall_summary) : data.overall_summary,
    persx_perspective: data.persx_perspective ? stripMarkdown(data.persx_perspective) : data.persx_perspective,
  };
}

/**
 * HTML Sanitization Utilities
 *
 * Provides functions to sanitize user input before rendering in emails or HTML.
 * Uses DOMPurify to prevent XSS attacks.
 */

import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize HTML content for email
 * Allows basic formatting tags but strips potentially dangerous content
 */
export function sanitizeForEmail(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "b", "em", "i", "u", "a"],
    ALLOWED_ATTR: ["href"],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Sanitize plain text for email
 * Escapes HTML entities and converts newlines to <br> tags
 */
export function sanitizeTextForEmail(text: string): string {
  // Escape HTML entities
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  // Convert newlines to <br> tags
  return escaped.replace(/\n/g, "<br>");
}

/**
 * Sanitize rich HTML content (for display in web pages)
 * More permissive than email sanitization
 */
export function sanitizeRichContent(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "a",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "pre",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "img",
    ],
    ALLOWED_ATTR: ["href", "src", "alt", "title"],
    ALLOW_DATA_ATTR: false,
  });
}

/**
 * Strip all HTML tags from content
 * Useful for creating plain text versions
 */
export function stripAllHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

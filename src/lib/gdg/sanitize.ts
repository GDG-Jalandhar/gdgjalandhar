import "server-only";
import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = ["p", "br", "strong", "em", "u", "h2", "h3", "ul", "ol", "li", "a", "blockquote", "code"];

DOMPurify.addHook("afterSanitizeAttributes", (node) => {
  if (node.tagName === "A") {
    node.setAttribute("target", "_blank");
    node.setAttribute("rel", "noopener noreferrer nofollow");
  }
});

/**
 * `description` is organizer-authored HTML from Bevy — sanitized server-side
 * so DOMPurify never ships to the client (PRD §6.6 D-3, §7.2). Every anchor
 * attribute but `href` is stripped, and every link is forced to open safely
 * in a new tab.
 */
export function sanitizeEventHtml(html: string | null | undefined): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ["href"],
  });
}

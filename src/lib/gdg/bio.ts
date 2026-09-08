import "server-only";
import { sanitizeEventHtml } from "./sanitize";

/**
 * Bevy returns a person's bio in TWO incompatible formats depending on which
 * endpoint it came from, and the field is called `bio` in both cases:
 *
 *   - `event_person.bio` is organizer-authored HTML (`<p>`, `<br>`, `<span>`,
 *     `<a>`) — except for 7 of the 132 non-empty values on this chapter, which
 *     are plain text.
 *   - `chapter_slim/<slug>/team/` → `user.bio` is ALWAYS plain text, with `\n`
 *     and `\n\n` carrying the paragraph structure.
 *
 * Rendering one as the other is silently wrong in both directions: HTML shown
 * as text leaks tags, and plain text shown as HTML collapses every line break
 * into a single run-on paragraph. So both funnel through here into one
 * sanitized HTML string, and components get a single render path (`<Prose />`).
 *
 * Never throws — same contract as `parseAgenda`. A bio is decorative.
 */

/**
 * Only the tags Bevy's rich-text editor actually emits count as "this is
 * markup" — measured across the chapter, that's `p`, `br`, `span` and `a`; the
 * rest are here because the sanitizer's allowlist accepts them.
 *
 * Deliberately NOT a generic `<tag>` match. Prose mentioning `<canvas>` or
 * `<script>` is plain text, and a loose test routes it down the HTML branch
 * where the sanitizer deletes the tag and the reader silently loses a word.
 * Anything unrecognised stays text, gets escaped, and remains visible and inert.
 */
const LOOKS_LIKE_HTML =
  /<\/?(?:p|br|div|span|a|strong|b|em|i|u|ul|ol|li|h[1-6]|blockquote|code)\b[^>]*>/i;

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => ESCAPES[char]);
}

/**
 * Plain text → paragraphs. A blank line starts a new `<p>`; a lone newline
 * inside one becomes `<br>`, which is how the team bios are actually written.
 */
function textToHtml(text: string): string {
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${escapeHtml(block).replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export function toBioHtml(raw: string | null | undefined): string {
  const bio = raw?.trim();
  if (!bio) return "";

  // Plain text is escaped first, so anything tag-shaped inside it stays visible
  // text rather than becoming markup. Both branches then go through the same
  // sanitizer, so one allowlist governs everything that reaches the DOM.
  return sanitizeEventHtml(LOOKS_LIKE_HTML.test(bio) ? bio : textToHtml(bio));
}

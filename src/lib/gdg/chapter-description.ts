/**
 * Post-sanitize cleanup for the chapter `description`, which is organizer-
 * authored rich text from Bevy and carries a block that makes no sense once
 * it's rendered on this site:
 *
 *   <p>Mail: gdgjalandhar@gmail.com</p>      — contradicts chapter.contactEmail
 *   <p>Website: gdgjalandhar.com</p>         — links to the page you're on
 *   <p>Our Team: gdgjalandhar.com/team</p>   — ditto
 *
 * plus `<p><b><br></b></p>` spacers that survive sanitizing as `<p><br></p>`
 * and render as dead vertical gaps.
 *
 * The GDG program disclaimer is deliberately KEPT — it's a requirement, not
 * boilerplate.
 *
 * Runs on already-sanitized HTML (see sanitize.ts), so the tag set is a known
 * allowlist and `<p>` can't nest — a regex sweep is safe here in a way it
 * would not be against raw input. Never throws; the worst case is that a
 * paragraph it doesn't recognise stays on the page.
 */

/** Matches the label at the start of a self-referential contact paragraph. */
const CONTACT_LABEL = /^\s*(mail|e-?mail|website|our team)\s*:/i;

const PARAGRAPH = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;

/**
 * Visible text of a paragraph's inner HTML: tags removed, `&nbsp;` (entity or
 * literal U+00A0) and the handful of entities DOMPurify emits folded down to
 * plain characters, then trimmed.
 */
function textOf(innerHtml: string): string {
  return innerHtml
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/ /g, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

export function stripContactParagraphs(html: string): string {
  if (!html) return "";

  return html
    .replace(PARAGRAPH, (whole, inner: string) => {
      const text = textOf(inner);
      // Drop the contact block, and drop paragraphs with no visible text
      // (the `<br>`-only spacers).
      if (!text || CONTACT_LABEL.test(text)) return "";
      return whole;
    })
    .trim();
}

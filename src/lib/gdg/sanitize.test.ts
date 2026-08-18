import { describe, expect, it } from "vitest";
import { sanitizeEventHtml } from "./sanitize";

describe("sanitizeEventHtml", () => {
  it("strips <script> tags entirely", () => {
    const out = sanitizeEventHtml('<p>Hello</p><script>alert("hi")</script>');
    expect(out).not.toContain("<script");
    expect(out).not.toContain("alert");
    expect(out).toContain("Hello");
  });

  it("strips event-handler attributes like onerror", () => {
    const out = sanitizeEventHtml('<img src="x" onerror="alert(1)"><p>Body</p>');
    expect(out).not.toContain("onerror");
    expect(out).not.toContain("<img");
  });

  it("keeps the allowlisted tags", () => {
    const out = sanitizeEventHtml("<h2>Title</h2><p>Body <strong>bold</strong></p><ul><li>Item</li></ul>");
    expect(out).toContain("<h2>Title</h2>");
    expect(out).toContain("<strong>bold</strong>");
    expect(out).toContain("<li>Item</li>");
  });

  it("forces target=_blank and a safe rel on links, stripping other attributes", () => {
    const out = sanitizeEventHtml('<a href="https://example.com" onclick="evil()" class="x">link</a>');
    expect(out).toContain('href="https://example.com"');
    expect(out).toContain('target="_blank"');
    expect(out).toContain('rel="noopener noreferrer nofollow"');
    expect(out).not.toContain("onclick");
    expect(out).not.toContain("class=");
  });

  it("returns an empty string for null/undefined input", () => {
    expect(sanitizeEventHtml(null)).toBe("");
    expect(sanitizeEventHtml(undefined)).toBe("");
  });
});

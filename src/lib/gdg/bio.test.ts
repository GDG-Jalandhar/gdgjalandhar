import { describe, expect, it } from "vitest";
import { toBioHtml } from "./bio";

describe("toBioHtml", () => {
  it("passes organizer-authored HTML through the sanitizer", () => {
    const html = toBioHtml("<p>Kaggle Expert.</p><p>Ships ML into products.</p>");
    expect(html).toBe("<p>Kaggle Expert.</p><p>Ships ML into products.</p>");
  });

  it("strips scripts and inline handlers from an HTML bio without losing the prose", () => {
    const html = toBioHtml('<p>Cloud architect.<script>alert(1)</script></p><p onerror="alert(2)">Ten years on GCP.</p>');
    expect(html).not.toContain("script");
    expect(html).not.toContain("onerror");
    expect(html).toContain("Cloud architect.");
    expect(html).toContain("Ten years on GCP.");
  });

  it("wraps plain text in a paragraph, since the team endpoint never sends HTML", () => {
    expect(toBioHtml("JavaScript developer.")).toBe("<p>JavaScript developer.</p>");
  });

  it("splits a plain-text bio on blank lines, which is how the real ones are written", () => {
    const html = toBioHtml("Android developer.\n\nWTM Ambassador.\n\nDraws, when there's time.");
    expect(html.match(/<p>/g)).toHaveLength(3);
    expect(html).toContain("<p>Android developer.</p>");
  });

  it("keeps a single newline inside a paragraph as a line break, not a lost one", () => {
    expect(toBioHtml("Builds tools.\nStill writes Kotlin.")).toBe(
      "<p>Builds tools.<br>Still writes Kotlin.</p>",
    );
  });

  it("escapes markup in plain text rather than letting it become real tags", () => {
    const html = toBioHtml("Works on <canvas> & WebGL");
    expect(html).toContain("&lt;canvas&gt;");
    expect(html).toContain("&amp;");
  });

  it("does not let a plain-text bio smuggle a script through the escape", () => {
    const html = toBioHtml("Hi <script>alert(1)</script>");
    expect(html).not.toContain("<script");
    expect(html).toContain("&lt;script&gt;");
  });

  it("returns an empty string for the bios organizers left blank", () => {
    expect(toBioHtml("")).toBe("");
    expect(toBioHtml("   ")).toBe("");
    expect(toBioHtml(null)).toBe("");
    expect(toBioHtml(undefined)).toBe("");
  });

  it("handles the shortest real bio on the chapter", () => {
    expect(toBioHtml("<p>S</p>")).toBe("<p>S</p>");
  });
});

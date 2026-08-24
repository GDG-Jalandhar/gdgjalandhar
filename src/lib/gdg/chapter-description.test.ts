import { describe, expect, it } from "vitest";
import { stripContactParagraphs } from "./chapter-description";
import { sanitizeEventHtml } from "./sanitize";

/**
 * The chapter description exactly as `/api/chapter_slim/gdg-jalandhar/`
 * returned it — captured verbatim, invalid-looking bits and all, the same way
 * agenda-parser.test.ts pins the real malformed agenda string. If Bevy's
 * output changes shape, these tests are where it should surface.
 */
const REAL_DESCRIPTION = `<div><p><b>Google Developers Group Jalandhar </b>is an initiative to concentrate the efforts of many developers in and around Punjab to learn, share, and get productive using the various Google products. It was formed in <b>February 2011.</b>&nbsp;</p><p><b><br></b></p><p>A special community called<b> Women Techmakers Jalandhar </b>has been founded for girls to bridge the gap between women who are eager to lay their hands on the latest technology.&nbsp;</p><p>We were recognized among the <b>Top 3 Google Developer communities of India</b> during <b>Google community Summit Asia 2014 </b>held at<b> Sri Lanka </b>in<b> August 2014</b>.&nbsp;</p><p>To put it in a nutshell, we are a community that organizes tech talks, workshops, bootcamps, Google flagship events where programmers meet to discuss and work with several Google developer resources and products.</p><p>Mail: gdgjalandhar@gmail.com</p><p>Website: <span><a href="http://gdgjalandhar.com">gdgjalandhar.com</a></span></p><p>Our Team:&nbsp;<span><a href="http://gdgjalandhar.com/team">gdgjalandhar.com/team</a></span></p><p>Our events are open to newbies, developers, managers, and organizations who are interested in Google's technologies or use them as part of their projects. Google Developer Groups (GDGs) are for developers who are interested in Google's developer technology; everything from the Android, App Engine, and Google Chrome platforms, to product APIs like the Maps API, YouTube API, and Google Calendar API.</p><p><br></p><p>Disclaimer: GDG Jalandhar is an independent group; our activities and the opinions expressed here should in no way be linked to Google, the corporation. To learn more about the GDG program, visit <a href="https://developers.google.com/community/gdg/" style="background-color: rgb(255, 255, 255);">https://developers.google.com/community/gdg/</a><br></p></div>`;

describe("stripContactParagraphs", () => {
  const out = stripContactParagraphs(sanitizeEventHtml(REAL_DESCRIPTION));

  it("drops the self-referential contact block", () => {
    expect(out).not.toContain("gdgjalandhar@gmail.com");
    expect(out).not.toMatch(/Mail\s*:/);
    expect(out).not.toMatch(/Website\s*:/);
    expect(out).not.toMatch(/Our Team\s*:/);
  });

  it("keeps the GDG program disclaimer, which is a requirement not boilerplate", () => {
    expect(out).toContain("Disclaimer");
    expect(out).toContain("independent group");
    expect(out).toContain("https://developers.google.com/community/gdg/");
  });

  it("keeps every substantive paragraph", () => {
    expect(out).toContain("concentrate the efforts");
    expect(out).toContain("Women Techmakers Jalandhar");
    expect(out).toContain("Top 3 Google Developer communities");
    expect(out).toContain("To put it in a nutshell");
    expect(out).toContain("open to newbies");
  });

  it("drops the <br>-only spacer paragraphs that would render as dead gaps", () => {
    expect(out).not.toMatch(/<p>\s*(<br\s*\/?>)+\s*<\/p>/);
  });

  it("preserves bold, since the description carries all its emphasis in <b>", () => {
    expect(out).toContain("<b>February 2011.</b>");
  });

  it("is a no-op on empty input rather than throwing", () => {
    expect(stripContactParagraphs("")).toBe("");
    expect(stripContactParagraphs(sanitizeEventHtml(null))).toBe("");
  });

  it("leaves a description with no contact block untouched", () => {
    const clean = sanitizeEventHtml("<p>Just a chapter.</p><p>Two paragraphs.</p>");
    expect(stripContactParagraphs(clean)).toBe(clean);
  });

  it("matches on the label, not the URL, so editing the link cannot defeat it", () => {
    const html = sanitizeEventHtml('<p>Website: <a href="https://example.org">example.org</a></p><p>Keep me.</p>');
    const result = stripContactParagraphs(html);
    expect(result).not.toContain("example.org");
    expect(result).toContain("Keep me.");
  });
});

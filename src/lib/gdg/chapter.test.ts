import { afterEach, describe, expect, it, vi } from "vitest";
import { normalizeChapter } from "./normalize";
import { fetchChapter } from "./client";
import { chapterFixture } from "@/mocks/fixtures/chapter";

describe("normalizeChapter", () => {
  it("maps the raw Bevy fields onto GdgChapter", () => {
    const out = normalizeChapter(chapterFixture);
    expect(out.id).toBe(781);
    expect(out.title).toBe("GDG Jalandhar");
    expect(out.membersCount).toBe(9999);
  });

  it("sanitizes and cleans the description on the way through", () => {
    const { descriptionHtml } = normalizeChapter(chapterFixture);
    // sanitized: no unallowlisted wrappers, no inline style
    expect(descriptionHtml).not.toContain("<div");
    expect(descriptionHtml).not.toContain("<span");
    expect(descriptionHtml).not.toContain("style=");
    // bold survives (Bevy emits <b>, not <strong>)
    expect(descriptionHtml).toContain("<b>");
    // contact block gone, disclaimer kept
    expect(descriptionHtml).not.toContain("gdgjalandhar@gmail.com");
    expect(descriptionHtml).toContain("Disclaimer");
  });

  it("treats an absent description as empty rather than throwing", () => {
    expect(normalizeChapter({ ...chapterFixture, description: null }).descriptionHtml).toBe("");
    expect(normalizeChapter({ ...chapterFixture, description: undefined }).descriptionHtml).toBe("");
  });
});

/**
 * `fetchChapter` is the one fetch in this module that must NEVER throw — the
 * member count is decorative, and a Bevy outage must not be able to take down
 * the home page or About. Every failure mode collapses to `null`.
 */
describe("fetchChapter never throws", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns the chapter on a good response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(chapterFixture)));
    expect((await fetchChapter())?.membersCount).toBe(9999);
  });

  it("returns null on a non-200", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 404 })));
    expect(await fetchChapter()).toBeNull();
  });

  it("returns null when the network call rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));
    expect(await fetchChapter()).toBeNull();
  });

  it("returns null on malformed JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not json", { status: 200 })));
    expect(await fetchChapter()).toBeNull();
  });

  it("returns null on schema drift rather than surfacing a half-parsed chapter", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ id: 781, title: "GDG Jalandhar" })));
    expect(await fetchChapter()).toBeNull();
  });
});

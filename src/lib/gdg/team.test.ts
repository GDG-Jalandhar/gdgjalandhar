import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchTeam } from "./client";
import { normalizeTeam } from "./normalize";
import type { RawTeamMember } from "./schema";

/**
 * The verbatim response from `/api/chapter_slim/gdg-jalandhar/team/`, trimmed to
 * the fields the site reads. Pinned rather than paraphrased because the whole
 * point of `normalizeTeam` is reconciling this payload's two title fields, which
 * contradict each other differently for each of the four members.
 */
const REAL_TEAM: RawTeamMember[] = [
  {
    title: "Software Engineer",
    user: { full_name: "Simar Preet Singh", title: "Organiser", company: "GDG Jalandhar", cropped_avatar_url: "https://res.cloudinary.com/x/simar.png", avatar: {} },
  },
  {
    title: "Organiser",
    user: { full_name: "Amanpreet Kaur", title: "Android Developer", company: "Intellisense Technology", cropped_avatar_url: "https://res.cloudinary.com/x/aman.jpg", avatar: {} },
  },
  {
    title: "Graphics and UI/UX Designer",
    user: { full_name: "Qazi Zaid", title: "", company: "", cropped_avatar_url: "https://res.cloudinary.com/x/qazi.jpg", avatar: {} },
  },
  {
    title: "Fullstack developer",
    user: { full_name: "veer pratap Singh", title: "Fullstack developer", company: "Antier Solutions", cropped_avatar_url: null, avatar: { thumbnail_url: "https://res.cloudinary.com/x/veer.jpeg" } },
  },
];

describe("normalizeTeam", () => {
  const members = normalizeTeam(REAL_TEAM);

  it("badges both organizers, whichever of the two title fields names the role", () => {
    // Simar's role is in `user.title`; Amanpreet's is in the team `title`.
    expect(members.map((m) => m.isOrganizer)).toEqual([true, true, false, false]);
  });

  it("drops a title line that only restates the Organizer badge", () => {
    expect(members[0]).toMatchObject({ title: "Software Engineer", secondaryTitle: "" });
    expect(members[1]).toMatchObject({ title: "Android Developer", secondaryTitle: "" });
  });

  it("falls back to the team title when the member has no job title of their own", () => {
    expect(members[2]).toMatchObject({ title: "Graphics and UI/UX Designer", secondaryTitle: "" });
  });

  it("collapses the two titles when they say the same thing", () => {
    expect(members[3]).toMatchObject({ title: "Fullstack developer", secondaryTitle: "" });
  });

  it("keeps both lines when they genuinely differ", () => {
    const [member] = normalizeTeam([
      { title: "Event Manager", user: { full_name: "A B", title: "Product Designer", avatar: {} } },
    ]);
    expect(member).toMatchObject({ title: "Product Designer", secondaryTitle: "Event Manager" });
  });

  it("prefers the cropped avatar and falls back to the avatar thumbnail", () => {
    expect(members[0].photo).toBe("https://res.cloudinary.com/x/simar.png");
    expect(members[3].photo).toBe("https://res.cloudinary.com/x/veer.jpeg");
  });

  it("preserves Bevy's order — the endpoint has no ordering field to sort on", () => {
    expect(members.map((m) => m.name)).toEqual([
      "Simar Preet Singh",
      "Amanpreet Kaur",
      "Qazi Zaid",
      "veer pratap Singh",
    ]);
  });
});

describe("fetchTeam never throws", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("parses the bare array this endpoint returns instead of the usual envelope", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(REAL_TEAM)));
    expect(await fetchTeam()).toHaveLength(4);
  });

  it("returns null on a non-200 so About falls back to the static roster", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
    expect(await fetchTeam()).toBeNull();
  });

  it("returns null when the network call rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));
    expect(await fetchTeam()).toBeNull();
  });

  it("returns null on malformed JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not json", { status: 200 })));
    expect(await fetchTeam()).toBeNull();
  });

  it("returns null if the envelope shape ever appears, rather than rendering nobody", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ count: 4, results: REAL_TEAM })));
    expect(await fetchTeam()).toBeNull();
  });

  it("returns null on an empty roster, which for this chapter means something broke", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json([])));
    expect(await fetchTeam()).toBeNull();
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchEventPeople, fetchEventSponsors } from "./client";
import { normalizeEventPeople, normalizeEventSponsors } from "./normalize";
import {
  groupPeopleByRole,
  groupSponsorsByType,
  linkedinUrl,
  roleLabel,
  sponsorTypeLabel,
  twitterUrl,
} from "./format-people";
import { eventPeople, eventSponsors, peopleEnvelope } from "@/mocks/fixtures/people";
import type { RawEventPerson, RawEventSponsor } from "./schema";

const mixedRoles = eventPeople["devfest-jalandhar-2026"];
const withPlaceholder = eventPeople["flutter-forward-extended-2025"];
const sponsorRows = eventSponsors[10002];

describe("fetchEventPeople never throws", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns the people on a good response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(peopleEnvelope(mixedRoles))));
    expect(await fetchEventPeople("devfest-jalandhar-2026")).toHaveLength(5);
  });

  it("queries by slug, because the numeric event id silently returns nothing", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(Response.json(peopleEnvelope([])));
    vi.stubGlobal("fetch", fetchSpy);
    await fetchEventPeople("devfest-jalandhar-2026");
    expect(fetchSpy.mock.calls[0][0]).toContain("event=devfest-jalandhar-2026");
  });

  it("returns an empty list on a non-200 rather than failing the event page", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 500 })));
    expect(await fetchEventPeople("x")).toEqual([]);
  });

  it("returns an empty list when the network call rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));
    expect(await fetchEventPeople("x")).toEqual([]);
  });

  it("returns an empty list on malformed JSON", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("not json", { status: 200 })));
    expect(await fetchEventPeople("x")).toEqual([]);
  });

  it("returns an empty list on schema drift rather than half-parsed people", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json({ results: "nope" })));
    expect(await fetchEventPeople("x")).toEqual([]);
  });
});

describe("fetchEventSponsors never throws", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("returns the visible sponsors on a good response", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(peopleEnvelope(sponsorRows))));
    expect(await fetchEventSponsors(10002)).toHaveLength(3);
  });

  it("skips the request entirely for a list-derived event, whose id is 0", async () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    expect(await fetchEventSponsors(0)).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("queries by numeric id, because a slug is a hard 400 upstream", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(Response.json(peopleEnvelope([])));
    vi.stubGlobal("fetch", fetchSpy);
    await fetchEventSponsors(10002);
    expect(fetchSpy.mock.calls[0][0]).toContain("event_id=10002");
  });

  it("returns an empty list on a non-200", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status: 400 })));
    expect(await fetchEventSponsors(10002)).toEqual([]);
  });

  it("returns an empty list when the network call rejects", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNREFUSED")));
    expect(await fetchEventSponsors(10002)).toEqual([]);
  });
});

describe("normalizeEventPeople", () => {
  it("drops Bevy's empty '- -' placeholder rows, which have no name to show", () => {
    const people = normalizeEventPeople(withPlaceholder as RawEventPerson[]);
    expect(people).toHaveLength(2);
    expect(people.map((p) => p.name)).toEqual(["Suraj Kumar", "Bharat Agarwal"]);
  });

  it("survives the empty `{}` picture those rows carry instead of null", () => {
    const [person] = normalizeEventPeople([
      { id: 1, first_name: "A", last_name: "B", role: "speaker", order: 0, picture: {} },
    ] as RawEventPerson[]);
    expect(person.photo).toBeNull();
  });

  it("sorts by Bevy's `order` field, not by array position", () => {
    const people = normalizeEventPeople([
      { id: 2, first_name: "Second", last_name: "X", role: "speaker", order: 5, picture: {} },
      { id: 1, first_name: "First", last_name: "X", role: "speaker", order: 1, picture: {} },
    ] as RawEventPerson[]);
    expect(people.map((p) => p.name)).toEqual(["First X", "Second X"]);
  });

  it("keeps the raw role slug, since the vocabulary is open-ended", () => {
    const people = normalizeEventPeople(mixedRoles as RawEventPerson[]);
    expect(people.map((p) => p.role)).toContain("guest_emcee");
  });
});

describe("normalizeEventSponsors", () => {
  it("drops sponsors Bevy has marked invisible", () => {
    const sponsors = normalizeEventSponsors(sponsorRows as RawEventSponsor[]);
    expect(sponsors.map((s) => s.company)).not.toContain("Withdrawn Partner");
  });

  it("uses the uncropped logo, because the thumbnail is a square crop of a wide logo", () => {
    const [sponsor] = normalizeEventSponsors([
      {
        id: 1,
        company: "Acme",
        sponsor_type: "media_partner",
        order: 0,
        visible: true,
        logo: { url: "https://example.test/wide.png", thumbnail_url: "https://example.test/square.png" },
      },
    ] as RawEventSponsor[]);
    expect(sponsor.logo).toBe("https://example.test/wide.png");
  });
});

describe("role and sponsor-type labels", () => {
  it("maps the roles Bevy documents", () => {
    expect(roleLabel("speaker")).toBe("Speaker");
    expect(sponsorTypeLabel("media_partner")).toBe("Media partner");
  });

  it("titleizes a slug nobody mapped, so a new Bevy role still renders", () => {
    expect(roleLabel("guest_emcee")).toBe("Guest Emcee");
    expect(sponsorTypeLabel("community_partner")).toBe("Community Partner");
  });
});

describe("grouping", () => {
  it("orders groups by reading precedence, with unknown roles appended last", () => {
    const groups = groupPeopleByRole(normalizeEventPeople(mixedRoles as RawEventPerson[]));
    expect(groups.map((g) => g.role)).toEqual(["speaker", "host", "judge", "mentor", "guest_emcee"]);
    expect(groups[0].label).toBe("Speakers");
  });

  it("groups sponsors by type", () => {
    const groups = groupSponsorsByType(normalizeEventSponsors(sponsorRows as RawEventSponsor[]));
    expect(groups.map((g) => g.label)).toEqual(["Local sponsors", "Media partners"]);
    expect(groups.find((g) => g.type === "media_partner")?.sponsors).toHaveLength(2);
  });

  it("returns no groups at all for an event with nobody, so no empty heading renders", () => {
    expect(groupPeopleByRole([])).toEqual([]);
    expect(groupSponsorsByType([])).toEqual([]);
  });
});

describe("social handles", () => {
  it("builds URLs from the bare handles Bevy stores", () => {
    expect(twitterUrl("AashiDutt")).toBe("https://x.com/AashiDutt");
    expect(linkedinUrl("aashi-dutt")).toBe("https://www.linkedin.com/in/aashi-dutt");
  });

  it("tolerates a leading @, which the API doesn't send but a human might", () => {
    expect(twitterUrl("@AashiDutt")).toBe("https://x.com/AashiDutt");
  });

  it("drops the link entirely rather than building a broken one", () => {
    expect(twitterUrl("")).toBeNull();
    expect(twitterUrl(null)).toBeNull();
    expect(twitterUrl("https://twitter.com/someone")).toBeNull();
    expect(linkedinUrl("in/someone/extra")).toBeNull();
  });

  it("normalizes handles off the wire and nulls the ones that aren't handles", () => {
    const [ok, bad] = normalizeEventPeople([
      { id: 1, first_name: "A", last_name: "B", role: "speaker", order: 0, picture: {}, personal_twitter: " @handle ", personal_linkedin_page: "a-b" },
      { id: 2, first_name: "C", last_name: "D", role: "speaker", order: 1, picture: {}, personal_twitter: "http://x.com/c", personal_linkedin_page: "" },
    ] as RawEventPerson[]);
    expect(ok).toMatchObject({ twitter: "handle", linkedin: "a-b" });
    expect(bad).toMatchObject({ twitter: null, linkedin: null });
  });
});

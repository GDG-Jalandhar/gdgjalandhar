import { describe, expect, it } from "vitest";
import { parseAgenda } from "./agenda-parser";
import { bangkokAgendaString, malformedAgendaString } from "@/mocks/fixtures/agenda";

describe("parseAgenda", () => {
  it("parses a well-formed agenda into the normalized shape", () => {
    const agenda = parseAgenda(bangkokAgendaString);
    expect(agenda).not.toBeNull();
    expect(agenda?.multiday).toBe(false);
    expect(agenda?.days).toHaveLength(1);
    expect(agenda?.days[0].title).toBe("Google I/O Extended Bangkok 2026");
    expect(agenda?.days[0].rows).toHaveLength(13);
    expect(agenda?.days[0].rows[7]).toMatchObject({
      time: "1:40 PM",
      activity: "Google I/O 2026 Keynote Recap",
    });
  });

  it("recovers from the real-world invalid-escape string (PRD §6.5) via the cleanup pre-pass", () => {
    // Verbatim from the Bangkok sample, invalid escapes intact — this string
    // fails a strict JSON.parse (asserted below) and must still produce a
    // usable agenda, never crash the page.
    expect(() => JSON.parse(malformedAgendaString)).toThrow();
    const agenda = parseAgenda(malformedAgendaString);
    expect(agenda).not.toBeNull();
    expect(agenda?.days[0].rows[0].activity).toBe("Google I/O 2026 Keynote Recap");
  });

  it("degrades to null on genuinely unparseable input rather than throwing", () => {
    expect(parseAgenda("{not even close to json")).toBeNull();
    expect(parseAgenda("")).toBeNull();
    expect(parseAgenda(null)).toBeNull();
    expect(parseAgenda(undefined)).toBeNull();
  });

  it("returns null when the API's own `empty` flag is set", () => {
    expect(parseAgenda(JSON.stringify({ multiday: false, empty: true, days: [] }))).toBeNull();
  });

  it("returns null when `days` is missing entirely", () => {
    expect(parseAgenda(JSON.stringify({ multiday: false, empty: false }))).toBeNull();
  });
});

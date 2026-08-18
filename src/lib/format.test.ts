import { describe, expect, it } from "vitest";
import { yearsSince } from "./format";

describe("yearsSince", () => {
  it("counts full years elapsed once the founding month has passed", () => {
    expect(yearsSince("2011-02", new Date("2026-08-17"))).toBe(15);
  });

  it("doesn't count the current year until the founding month arrives", () => {
    expect(yearsSince("2011-02", new Date("2026-01-15"))).toBe(14);
  });

  it("counts the year as soon as the founding month begins", () => {
    expect(yearsSince("2011-02", new Date("2026-02-01"))).toBe(15);
  });
});

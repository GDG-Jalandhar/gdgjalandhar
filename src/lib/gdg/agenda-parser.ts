import { z } from "zod";
import type { Agenda } from "./types";

/**
 * `agenda` arrives as a double-encoded JSON string, and real data contains
 * invalid JSON escapes — sequences like `\’` and `\—` that a strict
 * `JSON.parse` throws `SyntaxError` on (PRD §6.5). A malformed agenda must
 * degrade to "agenda not available", never take down the event page.
 *
 * Strategy: try a strict parse first (cheap, correct for well-formed data);
 * on failure, run a pre-pass that removes backslashes preceding any
 * character outside the legal JSON escape set (`"\/bfnrtu`), then retry.
 */
function stripInvalidEscapes(raw: string): string {
  return raw.replace(/\\(.)/g, (match, char: string) => {
    return '"\\/bfnrtu'.includes(char) ? match : char;
  });
}

const rawAgendaRowSchema = z.object({
  time: z.string(),
  activity: z.string(),
  description: z.string().optional().default(""),
  audience_type: z.enum(["IN_PERSON", "VIRTUAL", "HYBRID"]).optional().default("IN_PERSON"),
});

const rawAgendaSchema = z.object({
  multiday: z.boolean().optional().default(false),
  empty: z.boolean().optional().default(false),
  days: z
    .array(
      z.object({
        title: z.string(),
        agenda: z.array(rawAgendaRowSchema),
      }),
    )
    .optional()
    .default([]),
});

/**
 * Never throws. Returns `null` when the field is absent, the API's own
 * `empty` flag is set, or the string fails to parse even after cleanup —
 * all three collapse to the same "no agenda" state for callers.
 */
export function parseAgenda(raw: string | null | undefined): Agenda | null {
  if (!raw) return null;

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    try {
      json = JSON.parse(stripInvalidEscapes(raw));
    } catch {
      return null;
    }
  }

  const result = rawAgendaSchema.safeParse(json);
  if (!result.success) return null;
  const parsed = result.data;

  if (parsed.empty || parsed.days.length === 0) return null;

  return {
    multiday: parsed.multiday,
    days: parsed.days.map((day) => ({
      title: day.title,
      rows: day.agenda.map((row) => ({
        time: row.time,
        activity: row.activity,
        description: row.description,
        audienceType: row.audience_type,
      })),
    })),
  };
}

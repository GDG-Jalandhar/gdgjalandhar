import { chapter } from "@/data/chapter";

/**
 * Years running, derived at render time from the founding date (PRD H-4b) —
 * the one stat that goes wrong on its own if hardcoded.
 */
export function yearsSince(foundedISO: string = chapter.foundedISO, now: Date = new Date()): number {
  const [year, month] = foundedISO.split("-").map(Number);
  let years = now.getFullYear() - year;
  const foundedMonthPassedThisYear =
    now.getMonth() + 1 > month || (now.getMonth() + 1 === month && now.getDate() >= 1);
  if (!foundedMonthPassedThisYear) years -= 1;
  return years;
}

// Single source of truth for the chapter ID (PRD §6: "never hardcode it
// twice"). Server-side only constant, not an env var — the API module runs
// server-side (§7.2), so this never needs to reach the browser. The PRD's own
// `VITE_GDG_CHAPTER_ID` name is a leftover from a pre-Next draft; `VITE_*` has
// no meaning in this stack.
export const CHAPTER_ID = 781;

// The chapter profile endpoint (`/api/chapter_slim/<slug>/`) is keyed by SLUG,
// not by the numeric ID — `/api/chapter_slim/781/` 404s and `/api/chapter/781/`
// is 403. Same "never hardcode it twice" rule as CHAPTER_ID above.
export const CHAPTER_SLUG = "gdg-jalandhar";

export const GDG_API_BASE = "https://gdg.community.dev/api";

// Single source of truth for the chapter ID (PRD §6: "never hardcode it
// twice"). Server-side only constant, not an env var — the API module runs
// server-side (§7.2), so this never needs to reach the browser. The PRD's own
// `VITE_GDG_CHAPTER_ID` name is a leftover from a pre-Next draft; `VITE_*` has
// no meaning in this stack.
export const CHAPTER_ID = 781;

export const GDG_API_BASE = "https://gdg.community.dev/api";

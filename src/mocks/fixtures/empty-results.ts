// Today's live state for chapter 781 (PRD §6.8) — the site must look
// deliberate here, not broken.
export const emptyResultsEnvelope = {
  links: { next: null, previous: null },
  pagination: { previous_page: null, current_page: 1, next_page: null, page_size: 500 },
  count: 0,
  results: [],
};

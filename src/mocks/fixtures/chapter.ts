/**
 * Raw Bevy `chapter_slim` fixture.
 *
 * `members_count` is deliberately a round, obviously-fake number so it's
 * instantly clear whether a page is showing mock or live data.
 *
 * The description reproduces the awkward parts of the real one verbatim, so
 * mock mode actually exercises the sanitize + strip path rather than a clean
 * string that proves nothing:
 *   - `<b>` bold (NOT `<strong>`) — the tag Bevy's editor emits
 *   - `<div>`/`<span>` wrappers, which aren't allowlisted and get unwrapped
 *   - an inline `style=` attribute, which must be stripped
 *   - a `<p><b><br></b></p>` spacer, which must be dropped as empty
 *   - the Mail / Website / Our Team block, which must be dropped
 *   - the GDG disclaimer, which must SURVIVE
 */
export const chapterFixture = {
  id: 781,
  title: "GDG Jalandhar",
  members_count: 9999,
  member_count_is_at_limit: false,
  description:
    "<div>" +
    "<p><b>Google Developer Group Jalandhar </b>is a mock chapter profile used by " +
    "<b>pnpm dev:mock</b>. It was formed in <b>February 2011.</b>&nbsp;</p>" +
    "<p><b><br></b></p>" +
    "<p>A special community called<b> Women Techmakers Jalandhar </b>has been founded " +
    "to bridge the gap for women eager to work with the latest technology.&nbsp;</p>" +
    "<p>Mail: gdgjalandhar@gmail.com</p>" +
    "<p>Website: <span><a href=\"http://gdgjalandhar.com\">gdgjalandhar.com</a></span></p>" +
    "<p>Our Team:&nbsp;<span><a href=\"http://gdgjalandhar.com/team\">gdgjalandhar.com/team</a></span></p>" +
    "<p>Our events are open to newbies, developers, managers, and organizations " +
    "interested in Google's technologies.</p>" +
    "<p>Disclaimer: GDG Jalandhar is an independent group; our activities and the " +
    "opinions expressed here should in no way be linked to Google, the corporation. " +
    "To learn more about the GDG program, visit " +
    "<a href=\"https://developers.google.com/community/gdg/\" style=\"background-color: rgb(255, 255, 255);\">" +
    "https://developers.google.com/community/gdg/</a><br></p>" +
    "</div>",
};

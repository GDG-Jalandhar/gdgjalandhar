/**
 * Realistic 13-row multi-block agenda, matching the shape and one verbatim
 * row from PRD §6.5's sample ("Google I/O Extended Bangkok 2026" / "1:40 PM"
 * / "Google I/O 2026 Keynote Recap"). Used for the cohosted Bangkok fixture.
 */
export const bangkokAgendaObject = {
  multiday: false,
  any_descriptions: true,
  empty: false,
  days: [
    {
      title: "Google I/O Extended Bangkok 2026",
      agenda: [
        { time: "9:00 AM", activity: "Registration & Coffee", description: "", audience_type: "IN_PERSON" },
        { time: "9:30 AM", activity: "Welcome & Opening Remarks", description: "Kicking off the day with a look at what's new for GDG Bangkok.", audience_type: "IN_PERSON" },
        { time: "9:45 AM", activity: "What's New in Android", description: "A tour of the latest Jetpack Compose and Kotlin Multiplatform updates.", audience_type: "HYBRID" },
        { time: "10:30 AM", activity: "Coffee Break", description: "", audience_type: "IN_PERSON" },
        { time: "10:45 AM", activity: "Building with Gemini", description: "Hands-on patterns for grounding, tool use, and structured output.", audience_type: "IN_PERSON" },
        { time: "11:30 AM", activity: "Firebase for Startups", description: "Shipping fast without an ops team.", audience_type: "IN_PERSON" },
        { time: "12:15 PM", activity: "Lunch", description: "", audience_type: "IN_PERSON" },
        { time: "1:40 PM", activity: "Google I/O 2026 Keynote Recap", description: "Missed the livestream? We'll walk through every major announcement.", audience_type: "IN_PERSON" },
        { time: "2:30 PM", activity: "Web Performance in Practice", description: "Chasing Core Web Vitals on real production traffic.", audience_type: "VIRTUAL" },
        { time: "3:15 PM", activity: "Coffee Break", description: "", audience_type: "IN_PERSON" },
        { time: "3:30 PM", activity: "Panel: Careers in Developer Relations", description: "Four DevRel engineers on how they got there and what the job is actually like.", audience_type: "IN_PERSON" },
        { time: "4:15 PM", activity: "Lightning Talks", description: "Five-minute talks from the community — sign up at the registration desk.", audience_type: "IN_PERSON" },
        { time: "5:00 PM", activity: "Closing & Networking", description: "", audience_type: "IN_PERSON" },
      ],
    },
  ],
};

/**
 * The same content, but re-serialized with the exact malformed escape
 * sequences PRD §6.5 calls out as present in real data: `\'` and `\—` are
 * not legal JSON escapes and make a strict JSON.parse throw SyntaxError.
 * Used verbatim by the agenda-parser unit test in Phase 2 — do not "fix" it.
 */
export const malformedAgendaString =
  '{"multiday":false,"any_descriptions":true,"empty":false,"days":[{"title":"Google I/O Extended Bangkok 2026","agenda":[{"time":"1:40 PM","activity":"Google I/O 2026 Keynote Recap","description":"Missed the livestream? We\\’ll walk through every major announcement \\—here\\’s the recap.","audience_type":"IN_PERSON"}]}]}';

export const bangkokAgendaString = JSON.stringify(bangkokAgendaObject);

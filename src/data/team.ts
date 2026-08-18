export type TeamMember = {
  name: string;
  title: string;
  badge: "organizer" | null;
  photo: string | null;
};

// A-2 / A-2a / A-2b — "GDG Organizer" (never "GDG Lead"); badge only on the
// two Organizers, Graphics Designer / Event Manager render as plain role text.
export const team: TeamMember[] = [
  { name: "Simar Preet Singh", title: "GDG Organizer", badge: "organizer", photo: null },
  { name: "Amanpreet Kaur", title: "GDG Organizer", badge: "organizer", photo: null },
  { name: "Qazi Zaid", title: "Graphics Designer", badge: null, photo: null },
  { name: "Veer Pratap Singh", title: "Event Manager", badge: null, photo: null },
];

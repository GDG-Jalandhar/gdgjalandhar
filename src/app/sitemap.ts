import type { MetadataRoute } from "next";
import { fetchEventList } from "@/lib/gdg/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [upcoming, past] = await Promise.all([fetchEventList("Live"), fetchEventList("Completed")]);
  const events = [...upcoming, ...past];

  return [
    { url: "https://gdgjalandhar.com/", changeFrequency: "weekly", priority: 1 },
    { url: "https://gdgjalandhar.com/events", changeFrequency: "daily", priority: 0.9 },
    { url: "https://gdgjalandhar.com/about", changeFrequency: "monthly", priority: 0.5 },
    ...events.map((event) => ({
      url: `https://gdgjalandhar.com/events/${event.slug}`,
      lastModified: event.startAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}

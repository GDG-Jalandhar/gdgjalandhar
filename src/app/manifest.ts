import type { MetadataRoute } from "next";
import { chapter } from "@/data/chapter";

// P-1/P-10: manifest values sourced from chapter.ts so there's one place
// holding these facts.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: chapter.name,
    short_name: chapter.name,
    description: `${chapter.fullName} — a local developer community running since February 2011.`,
    start_url: "/?source=pwa",
    display: "standalone",
    background_color: "#1e1e1e",
    theme_color: "#1e1e1e",
    orientation: "portrait",
    categories: ["education", "social"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Events", url: "/events" },
      { name: "Join", url: chapter.joinUrl },
    ],
  };
}

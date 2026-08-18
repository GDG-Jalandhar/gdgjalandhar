import localFont from "next/font/local";

export const googleSans = localFont({
  variable: "--font-sans",
  display: "swap",
  preload: true,
  fallback: [
    "Inter",
    "Roboto",
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "sans-serif",
  ],
  src: [
    { path: "../fonts/GoogleSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/GoogleSans-Italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/GoogleSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/GoogleSans-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "../fonts/GoogleSans-Bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/GoogleSans-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
});

export const googleSansMono = localFont({
  variable: "--font-mono",
  display: "swap",
  preload: true,
  fallback: [
    "Roboto Mono",
    "JetBrains Mono",
    "ui-monospace",
    "SFMono-Regular",
    "monospace",
  ],
  src: [
    { path: "../fonts/GoogleSansMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/GoogleSansMono-Italic.woff2", weight: "400", style: "italic" },
    { path: "../fonts/GoogleSansMono-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/GoogleSansMono-MediumItalic.woff2", weight: "500", style: "italic" },
    { path: "../fonts/GoogleSansMono-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/GoogleSansMono-SemiBoldItalic.woff2", weight: "600", style: "italic" },
    { path: "../fonts/GoogleSansMono-Bold.woff2", weight: "700", style: "normal" },
    { path: "../fonts/GoogleSansMono-BoldItalic.woff2", weight: "700", style: "italic" },
  ],
});

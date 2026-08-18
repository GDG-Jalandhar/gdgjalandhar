import type { Metadata, Viewport } from "next";
import { SerwistProvider } from "@serwist/turbopack/react";
import { googleSans, googleSansMono } from "@/lib/fonts";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { UpdateToast } from "@/components/pwa/UpdateToast";
import { chapter } from "@/data/chapter";
import { organizationJsonLd } from "@/lib/seo/jsonld";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gdgjalandhar.com"),
  title: {
    default: "GDG Jalandhar",
    template: "%s · GDG Jalandhar",
  },
  description:
    "Google Developer Group Jalandhar — a local developer community running since February 2011.",
  openGraph: {
    type: "website",
    siteName: chapter.name,
    title: "GDG Jalandhar",
    description:
      "Google Developer Group Jalandhar — a local developer community running since February 2011.",
  },
  // P-9: apple-mobile-web-app-* meta tags for iOS standalone install.
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: chapter.name,
  },
};

export const viewport: Viewport = {
  themeColor: "#1e1e1e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${googleSans.variable} ${googleSansMono.variable}`}>
      <body className="flex min-h-full flex-col overflow-x-hidden antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd()) }}
        />
        <SerwistProvider swUrl="/serwist/sw.js">
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content" className="flex flex-1 flex-col">
            {children}
          </main>
          <Footer />
          <InstallPrompt />
          <UpdateToast />
        </SerwistProvider>
      </body>
    </html>
  );
}

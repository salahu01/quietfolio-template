import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter, JetBrains_Mono } from "next/font/google";
import Chrome from "@/components/Chrome";
import CursorFx from "@/components/CursorFx";
import { profile } from "@/lib/data";
import { NOINDEX, SITE_URL, site } from "@/lib/site";
import "./globals.css";

const instrument = Instrument_Serif({ weight: "400", subsets: ["latin"], variable: "--font-instrument" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  // Origin only: Next prepends basePath to file-based metadata images itself, so a path here would double it.
  // Canonical URLs are therefore passed absolute (absoluteUrl) instead of relative.
  metadataBase: new URL(new URL(SITE_URL).origin),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  keywords: site.keywords,
  alternates: {
    canonical: SITE_URL,
    types: { "application/rss+xml": [{ url: "/feed.xml", title: `${profile.name} — Writing` }] },
  },
  openGraph: { type: "website", url: SITE_URL, siteName: site.name, title: site.title, description: site.description, locale: site.locale },
  twitter: { card: "summary_large_image", title: site.title, description: site.description, creator: site.twitter || undefined },
  robots: NOINDEX
    ? { index: false, follow: false }
    : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: site.themeColor.dark },
    { media: "(prefers-color-scheme: light)", color: site.themeColor.light },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

// Runs before first paint so a saved light theme never flashes dark.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light")document.documentElement.dataset.theme="light"}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${instrument.variable} ${inter.variable} ${jetbrains.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-md focus:bg-fg focus:px-3 focus:py-2 focus:text-bg">
          Skip to content
        </a>
        <Chrome>{children}</Chrome>
        <CursorFx />
      </body>
    </html>
  );
}

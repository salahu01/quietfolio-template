import { profile } from "./data";

/** Canonical URL (origin + optional sub-path). Override with NEXT_PUBLIC_SITE_URL; invalid values fall back to the default. */
function resolveSiteUrl() {
  const fallback = "https://example.com"; // placeholder: set NEXT_PUBLIC_SITE_URL to your real URL
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return fallback;
  try {
    const u = new URL(raw);
    return (u.origin + u.pathname).replace(/\/$/, ""); // keep a sub-path such as /quietfolio
  } catch {
    return fallback;
  }
}

export const SITE_URL = resolveSiteUrl();
/** Demo/mirror deployments set NEXT_PUBLIC_NOINDEX=1 so they never compete with the canonical site in search. */
export const NOINDEX = process.env.NEXT_PUBLIC_NOINDEX === "1";
export const absoluteUrl = (path = "/") => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;

/** Site-wide SEO settings. Forks: edit here and in lib/data.ts. */
export const site = {
  name: profile.short,
  title: `${profile.name} — ${profile.role}`,
  description: `Portfolio of ${profile.name}, ${profile.role.toLowerCase()}: projects, case studies and writing.`,
  locale: "en_US",
  /** Twitter/X handle for cards, e.g. "@yourhandle". Leave empty to omit. */
  twitter: "",
  keywords: ["developer portfolio", profile.role, profile.name, "case studies", "blog"],
  themeColor: { dark: "#0a0a0a", light: "#fafaf9" },
};

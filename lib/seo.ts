import { profile, stackGroups, experience } from "./data";
import { SITE_URL, absoluteUrl } from "./site";

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const personRef = { "@id": PERSON_ID };

export const personJsonLd = () => ({
  "@type": "Person",
  "@id": PERSON_ID,
  name: profile.name,
  alternateName: profile.short,
  jobTitle: profile.role,
  description: profile.about[0],
  url: SITE_URL,
  image: absoluteUrl(profile.avatar),
  email: `mailto:${profile.email}`,
  sameAs: [profile.github, profile.linkedin, profile.x],
  knowsAbout: Object.values(stackGroups).flat(),
  worksFor: experience[0] ? { "@type": "Organization", name: experience[0].company } : undefined,
  address:
    profile.region || profile.country
      ? { "@type": "PostalAddress", addressRegion: profile.region || undefined, addressCountry: profile.country || undefined }
      : undefined,
});

export const websiteJsonLd = () => ({
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: profile.name,
  inLanguage: "en",
  publisher: personRef,
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: absoluteUrl(it.path),
  })),
});

/** Plain-text description (strips the tiny markdown used in content), trimmed at a word boundary. */
export function plainDescription(text: string | undefined, max = 180) {
  if (!text) return undefined;
  const clean = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*`]/g, "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

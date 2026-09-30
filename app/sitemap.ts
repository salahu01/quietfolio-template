import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { caseStudies, posts, toISO } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "monthly", priority: 0.8 },
    ...caseStudies.map((c) => ({ url: `${SITE_URL}/work/${c.slug}`, lastModified: toISO(c.date), priority: 0.7 })),
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: toISO(p.date), priority: 0.6 })),
  ];
}

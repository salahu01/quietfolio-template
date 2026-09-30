import type { MetadataRoute } from "next";
import { NOINDEX, SITE_URL } from "@/lib/site";

// Open to search engines and AI answer engines alike; demo deployments (NEXT_PUBLIC_NOINDEX=1) are closed.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  if (NOINDEX) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return { rules: [{ userAgent: "*", allow: "/" }], sitemap: `${SITE_URL}/sitemap.xml`, host: SITE_URL };
}

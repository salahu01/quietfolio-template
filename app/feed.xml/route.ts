import { posts, firstParagraph, toISO } from "@/lib/content";
import { profile } from "@/lib/data";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import { plainDescription } from "@/lib/seo";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function GET() {
  const items = posts
    .map((p) => {
      const url = absoluteUrl(`/blog/${p.slug}`);
      return `<item><title>${esc(p.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(toISO(p.date)).toUTCString()}</pubDate><category>${esc(p.category)}</category><description>${esc(plainDescription(firstParagraph(p.blocks), 300) ?? "")}</description></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${esc(profile.name)} — Writing</title><link>${SITE_URL}/blog</link><description>Engineering notes by ${esc(profile.name)}.</description><language>en</language><atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}

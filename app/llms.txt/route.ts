import { caseStudies, posts, firstParagraph, splitTitle } from "@/lib/content";
import { profile } from "@/lib/data";
import { absoluteUrl, site } from "@/lib/site";
import { plainDescription } from "@/lib/seo";

export const dynamic = "force-static";

/** llms.txt — concise, LLM-friendly site index (https://llmstxt.org). */
export function GET() {
  const line = (title: string, path: string, blocks: Parameters<typeof firstParagraph>[0]) =>
    `- [${title}](${absoluteUrl(path)}): ${plainDescription(firstParagraph(blocks), 160) ?? ""}`;
  const body = [
    `# ${profile.name}`,
    "",
    `> ${site.description}`,
    "",
    `${profile.role}, based in ${profile.location}. Contact: ${profile.email}. GitHub: ${profile.github}.`,
    "",
    "## Case studies",
    ...caseStudies.map((c) => line(splitTitle(c.title).name, `/work/${c.slug}`, c.blocks)),
    "",
    "## Blog",
    ...posts.map((p) => line(p.title, `/blog/${p.slug}`, p.blocks)),
    "",
    "## Optional",
    `- [Full content in one file](${absoluteUrl("/llms-full.txt")})`,
    `- [RSS feed](${absoluteUrl("/feed.xml")})`,
    `- [Sitemap](${absoluteUrl("/sitemap.xml")})`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}

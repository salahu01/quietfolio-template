import { caseStudies, posts, blocksToMarkdown, splitTitle } from "@/lib/content";
import { profile, projects, experience, stackGroups } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** llms-full.txt — the whole site as one Markdown document for LLM ingestion. */
export function GET() {
  const parts = [
    `# ${profile.name}`,
    `${profile.role} — ${profile.location}`,
    profile.about.join("\n\n"),
    "## Experience",
    experience.map((e) => `### ${e.role}, ${e.company} (${e.period})\n${e.body}`).join("\n\n"),
    "## Tech stack",
    Object.entries(stackGroups).map(([g, items]) => `- **${g}:** ${items.join(", ")}`).join("\n"),
    "## Projects",
    projects.map((p) => `- **${p.title}** (${p.year}, ${p.category}): ${p.description}`).join("\n"),
    "# Case studies",
    ...caseStudies.map((c) => `## ${splitTitle(c.title).name}\nURL: ${absoluteUrl(`/work/${c.slug}`)}\nPublished: ${c.date} · ${c.category} · ${c.tags.join(", ")}\n\n${blocksToMarkdown(c.blocks)}`),
    "# Blog",
    ...posts.map((p) => `## ${p.title}\nURL: ${absoluteUrl(`/blog/${p.slug}`)}\nPublished: ${p.date}\n\n${blocksToMarkdown(p.blocks)}`),
  ];
  return new Response(parts.join("\n\n") + "\n", { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}

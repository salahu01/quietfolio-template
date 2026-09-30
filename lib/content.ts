import workJson from "@/content/work.json";
import blogJson from "@/content/blog.json";

export type Block =
  | { t: "h2" | "h3" | "p" | "quote" | "code"; x: string }
  | { t: "ul" | "ol"; x: string[] }
  | { t: "img"; x: string; alt?: string }
  | { t: "table"; x: string[][] };

export type CaseStudy = {
  slug: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  cover: string;
  blocks: Block[];
};
export type Post = { slug: string; title: string; date: string; category: string; blocks: Block[] };

export const caseStudies = workJson as CaseStudy[];
export const posts = blogJson as Post[];

export const getCaseStudy = (slug: string) => caseStudies.find((c) => c.slug === slug);
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);
export const toISO = (d: string) => new Date(`${d} UTC`).toISOString();

/** Split "Name: subtitle" titles; subtitle is empty when there is no colon. */
export function splitTitle(title: string) {
  const i = title.indexOf(": ");
  return i === -1 ? { name: title, sub: "" } : { name: title.slice(0, i), sub: title.slice(i + 2) };
}

export function readingTime(blocks: Block[]) {
  const words = blocks
    .map((b) => (Array.isArray(b.x) ? b.x.flat().join(" ") : b.x))
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

/** Markdown rendering of a block list (used by llms-full.txt). */
export function blocksToMarkdown(blocks: Block[]): string {
  return blocks
    .map((b) => {
      switch (b.t) {
        case "h2": return `## ${b.x}`;
        case "h3": return `### ${b.x}`;
        case "p": return b.x;
        case "quote": return `> ${b.x}`;
        case "code": return "```\n" + b.x + "\n```";
        case "ul": return b.x.map((i) => `- ${i}`).join("\n");
        case "ol": return b.x.map((i, n) => `${n + 1}. ${i}`).join("\n");
        case "img": return `![${b.alt ?? ""}](${b.x})`;
        case "table": return b.x.map((r) => `| ${r.join(" | ")} |`).join("\n");
      }
    })
    .join("\n\n");
}

export const firstParagraph = (blocks: Block[]) => {
  const p = blocks.find((b) => b.t === "p");
  return p && typeof p.x === "string" ? p.x : undefined;
};

import Link from "next/link";
import type { ReactNode } from "react";

// Renders the tiny markdown subset used in content: **bold**, *italic*, `code`, [text](url).
const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;

export default function Inline({ text }: { text: string }) {
  const nodes: ReactNode[] = text.split(TOKEN).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={i} className="font-semibold text-fg"><Inline text={part.slice(2, -2)} /></strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={i} className="rounded border border-line bg-chip px-1.5 py-0.5 font-mono text-[0.85em] text-fg">{part.slice(1, -1)}</code>;
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) {
      const cls = "text-fg underline decoration-line underline-offset-4 transition-colors hover:decoration-fg";
      return m[2].startsWith("/") ? (
        <Link key={i} href={m[2]} className={cls}>{m[1]}</Link>
      ) : (
        <a key={i} href={m[2]} target="_blank" rel="noreferrer noopener" className={cls}>{m[1]}</a>
      );
    }
    return part;
  });
  return <>{nodes}</>;
}

import Image from "next/image";
import type { Block } from "@/lib/content";
import Inline from "./Inline";

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-4 px-6 py-8 text-[15px] leading-[1.75] text-muted">
      {blocks.map((b, i) => {
        switch (b.t) {
          case "h2":
            return <h2 key={i} id={slugify(b.x)} className="!mt-10 scroll-mt-16 font-serif text-2xl text-fg">{b.x}</h2>;
          case "h3":
            return <h3 key={i} className="!mt-7 text-base font-semibold text-fg">{b.x}</h3>;
          case "p":
            return <p key={i}><Inline text={b.x} /></p>;
          case "ul":
          case "ol": {
            const List = b.t === "ul" ? "ul" : "ol";
            return (
              <List key={i} className={`space-y-2.5 pl-5 ${b.t === "ul" ? "list-disc" : "list-decimal"} marker:text-soft`}>
                {b.x.map((li, j) => <li key={j} className="pl-1"><Inline text={li} /></li>)}
              </List>
            );
          }
          case "quote":
            return <blockquote key={i} className="rounded-r-md border-l-2 border-fg/40 bg-card px-4 py-3 text-[14px] italic"><Inline text={b.x} /></blockquote>;
          case "code":
            return <pre key={i} className="overflow-x-auto rounded-lg border border-line bg-card p-4 font-mono text-[12.5px] leading-relaxed text-fg"><code>{b.x}</code></pre>;
          case "img":
            return <Image key={i} src={b.x} alt={b.alt ?? ""} width={1200} height={675} className="rounded-lg border border-line" />;
          case "table":
            return (
              <div key={i} className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-line">{b.x[0].map((c, k) => <th key={k} scope="col" className="px-3 py-2 font-mono text-[11px] font-normal uppercase tracking-wider text-soft"><Inline text={c} /></th>)}</tr>
                  </thead>
                  <tbody>{b.x.slice(1).map((r, j) => <tr key={j} className="border-b border-line">{r.map((c, k) => <td key={k} className="px-3 py-2"><Inline text={c} /></td>)}</tr>)}</tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}

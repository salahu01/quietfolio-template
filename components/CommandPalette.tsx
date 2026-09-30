"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { openMail } from "@/lib/mail";
import { withBase } from "@/lib/paths";
import { profile } from "@/lib/data";
import { caseStudies, posts, splitTitle } from "@/lib/content";

type Item = { label: string; hint: string; href: string };

export default function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const [q, setQ] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    return () => { prev?.focus?.(); setQ(""); };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
      } else if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  const items: Item[] = useMemo(
    () => [
      { label: "Home", hint: "Section", href: "/" },
      { label: "Projects", hint: "Section", href: "/#projects" },
      { label: "Experience", hint: "Section", href: "/#experience" },
      { label: "Blog", hint: "Section", href: "/blog" },
      { label: "Contact", hint: "Section", href: "/#contact" },
      { label: "GitHub", hint: "Link", href: profile.github },
      { label: "LinkedIn", hint: "Link", href: profile.linkedin },
      { label: "Email", hint: "Link", href: `mailto:${profile.email}` },
      { label: "Resume", hint: "Page", href: "/resume" },
      ...caseStudies.map((c) => ({ label: splitTitle(c.title).name, hint: "Case study", href: `/work/${c.slug}` })),
      ...posts.map((p) => ({ label: p.title, hint: "Post", href: `/blog/${p.slug}` })),
    ],
    []
  );
  const go = (i: Item) => {
    setOpen(false);
    if (i.href.startsWith("mailto:")) openMail();
    else if (i.href.startsWith("http")) window.open(i.href, "_blank", "noopener");
    else router.push(i.href);
  };
  const shown = items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-start bg-black/60 pt-[15vh] backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div role="dialog" aria-modal="true" aria-label="Search" className="mx-auto w-[min(92vw,520px)] overflow-hidden rounded-xl border border-line bg-card shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <input autoFocus aria-label="Search sections, projects and links" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sections, projects, links…"
          onKeyDown={(e) => { if (e.key === "Enter" && shown[0]) go(shown[0]); }}
          className="w-full border-b border-line bg-transparent px-4 py-3 font-mono text-sm outline-none placeholder:text-soft" />
        <ul className="max-h-72 overflow-y-auto p-1">
          {shown.map((i) => (
            <li key={i.label + i.hint}>
              <a href={i.href.startsWith("/") ? withBase(i.href) : i.href} onClick={(e) => { if (i.href.startsWith("mailto:")) { e.preventDefault(); go(i); } else setOpen(false); }}
                target={i.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-[var(--hover)]">
                {i.label}<span className="font-mono text-[10px] text-soft">{i.hint}</span>
              </a>
            </li>
          ))}
          {!shown.length && <li className="px-3 py-4 text-sm text-soft">No results</li>}
        </ul>
      </div>
    </div>
  );
}

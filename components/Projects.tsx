"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Globe, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, projectFilters } from "@/lib/data";

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.16-1.18 3.16-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>
);

const statusStyle: Record<string, string> = {
  LIVE: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
  WIP: "border-sky-500/40 bg-sky-500/10 text-sky-400",
  PRIVATE: "border-zinc-500/40 bg-zinc-500/10 text-zinc-400",
};

export default function Projects() {
  const [filter, setFilter] = useState<string>("All");
  const list = projects.filter((p) => filter === "All" || p.category === filter);

  return (
    <section id="projects">
      <h2 className="section-title">Projects</h2>
      <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2 px-6 pt-5">
        {projectFilters.map((f) => (
          <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f}
            className={`rounded-md border px-3 py-1 text-[13px] transition-colors ${
              filter === f ? "border-fg bg-fg text-bg" : "border-line text-muted hover:text-fg"
            }`}>
            {f}
          </button>
        ))}
      </div>
      <div className="grid gap-4 p-6 sm:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <motion.article
              layout key={p.title}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              data-spot className="spot group flex flex-col rounded-xl border border-line bg-card p-3"
            >
              <div className="relative h-36 overflow-hidden rounded-lg border border-line bg-chip">
                <Image src={p.image} alt={`${p.title} cover`} fill sizes="(min-width:640px) 340px, 92vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
                <div className="absolute left-2.5 top-2.5 flex items-center gap-2 font-mono text-[10px] text-white/80">
                  <span className="rec-dot size-1.5 rounded-full bg-red-500" />REC
                  <span>ISO 400</span>
                </div>
                <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between">
                  <span className={`badge backdrop-blur-sm ${statusStyle[p.status]}`}>{p.status}</span>
                  {p.featured && <span className="badge border-amber-500/40 bg-amber-500/10 text-amber-400 backdrop-blur-sm">FEATURED</span>}
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between px-1">
                <h3 className="text-[17px] font-semibold">{p.title}</h3>
                <span className="font-mono text-xs text-soft">{p.year}</span>
              </div>
              <p className="mt-2 flex-1 px-1 text-[13px] leading-relaxed text-muted">{p.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-line px-1 pt-3">
                {p.tags.map((t) => <span key={t} className="chip">{t}</span>)}
              </div>
              <div className="mt-3 flex items-center gap-3 px-1 text-muted">
                {p.live && <a href={p.live} target="_blank" rel="noreferrer" aria-label="Live" className="hover:text-fg"><Globe size={15} /></a>}
                {p.repo && <a href={p.repo} target="_blank" rel="noreferrer" aria-label="Source" className="hover:text-fg"><GithubIcon /></a>}
                {p.caseStudy && (
                  <Link href={p.caseStudy} className="ml-auto flex items-center gap-1 font-mono text-[11px] hover:text-fg">
                    Case study <ArrowUpRight size={11} />
                  </Link>
                )}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}

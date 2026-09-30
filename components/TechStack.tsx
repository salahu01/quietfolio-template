"use client";
import { useState } from "react";
import { stackGroups } from "@/lib/data";

export default function TechStack() {
  const groups = Object.keys(stackGroups);
  const [g, setG] = useState("All");
  const items = g === "All" ? Object.values(stackGroups).flat() : stackGroups[g];
  return (
    <section id="stack">
      <h2 className="section-title">Tech Stack</h2>
      <div role="group" aria-label="Filter tech stack" className="flex flex-wrap gap-2 px-6 pt-5">
        {["All", ...groups].map((x) => (
          <button key={x} onClick={() => setG(x)} aria-pressed={g === x}
            className={`rounded-md border px-3 py-1 text-[13px] transition-colors ${
              g === x ? "border-fg bg-fg text-bg" : "border-line text-muted hover:text-fg"
            }`}>{x}</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 px-6 py-6">
        {items.map((t) => (
          <span key={t} className="rounded-md border border-line bg-card px-3 py-1.5 font-mono text-[12px] text-muted">{t}</span>
        ))}
      </div>
    </section>
  );
}

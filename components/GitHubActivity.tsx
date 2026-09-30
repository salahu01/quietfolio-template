"use client";
import { useEffect, useState } from "react";
import { profile } from "@/lib/data";

type Day = { date: string; count: number; level: number };

export default function GitHubActivity() {
  const [days, setDays] = useState<Day[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`https://github-contributions-api.jogruber.de/v4/${profile.githubUser}?y=last`, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((d) => {
        setDays(d.contributions ?? []);
        setTotal(d.total?.lastYear ?? null);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setFailed(true);
      });
    return () => ctrl.abort();
  }, []);

  const weeks: Day[][] = [];
  days.forEach((d, i) => {
    if (i % 7 === 0) weeks.push([]);
    weeks[weeks.length - 1].push(d);
  });
  const shade = ["var(--chip)", "#0e4429", "#006d32", "#26a641", "#39d353"];

  return (
    <section id="github">
      <h2 className="section-title">GitHub Activity</h2>
      <div className="px-6 py-6">
        <p className="mb-3 font-mono text-xs text-soft">@{profile.githubUser}</p>
        <div role="img" aria-label={total === null ? "GitHub contribution graph" : `GitHub contribution graph: ${total} contributions in the last year`} className="overflow-x-auto pb-2">
          <div className="flex gap-[3px]">
            {weeks.map((w, i) => (
              <div key={i} className="flex flex-col gap-[3px]">
                {w.map((d) => (
                  <span key={d.date} title={`${d.count} on ${d.date}`}
                    className="size-[10px] rounded-[2px]" style={{ background: shade[d.level] }} />
                ))}
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 font-mono text-xs text-soft">
          {failed ? (
            <a href={profile.github} target="_blank" rel="noreferrer" className="underline underline-offset-4">
              View activity on GitHub
            </a>
          ) : total === null ? "Loading…" : `${total} contributions in the last year`}
        </p>
      </div>
    </section>
  );
}

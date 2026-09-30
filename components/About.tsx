import Link from "next/link";
import { profile } from "@/lib/data";
import EmailLink from "./EmailLink";

export default function About() {
  return (
    <section id="about">
      <h2 className="section-title">About</h2>
      <ul className="space-y-4 px-6 py-6 text-[15px] leading-relaxed text-muted">
        {profile.about.map((p) => (
          <li key={p} className="flex gap-3">
            <span className="mt-2.5 size-1 shrink-0 rounded-full bg-soft" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
      <div data-spot className="spot mx-6 mb-6 rounded-lg border border-line bg-card p-5">
        <p className="mb-3 font-mono text-[11px] tracking-widest text-fg">DEVELOPER SNAPSHOT</p>
        <ul className="grid gap-2 font-mono text-[13px] text-muted sm:grid-cols-2">
          {profile.snapshot.map((s) => (
            <li key={s} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-emerald-400" />{s}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap gap-2 px-6 pb-7">
        {(() => {
          const btn = "rounded-md border border-line px-3 py-1.5 text-[13px] text-muted transition-colors hover:bg-[var(--hover)] hover:text-fg";
          return (
            <>
              <a href="#contact" className={btn}>Contact</a>
              <a href={profile.github} target="_blank" rel="noreferrer" className={btn}>GitHub</a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className={btn}>LinkedIn</a>
              <EmailLink className={btn}>Mail</EmailLink>
              <Link href="/resume" className={btn}>Resume</Link>
            </>
          );
        })()}
      </div>
    </section>
  );
}

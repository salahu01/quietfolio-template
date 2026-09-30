import type { Metadata } from "next";
import Link from "next/link";
import { profile, projects, experience, stackGroups } from "@/lib/data";
import { SITE_URL, absoluteUrl } from "@/lib/site";
import { withBase } from "@/lib/paths";
import PrintButton from "@/components/PrintButton";
import EmailLink from "@/components/EmailLink";

// Temporary resume generated from lib/data.ts. Not indexed: the real CV should be the canonical one.
export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${profile.name}.`,
  alternates: { canonical: absoluteUrl("/resume") },
  robots: { index: false, follow: true },
};

export default function ResumePage() {
  const featured = projects.filter((p) => p.featured);
  const host = SITE_URL.replace(/^https?:\/\//, "");

  return (
    <main id="main" className="rail min-h-screen">
      <div className="no-print flex items-center justify-between gap-3 border-b border-line px-6 py-3">
        <Link href="/" className="font-mono text-xs text-muted hover:text-fg">← Home</Link>
        <div className="flex items-center gap-2">
          <a href={withBase("/resume.pdf")} download className="rounded-md border border-line px-3 py-1.5 font-mono text-xs text-muted hover:text-fg">Download PDF</a>
          <PrintButton />
        </div>
      </div>

      <article className="resume bg-white px-8 py-10 text-[13px] leading-relaxed text-zinc-800 sm:px-12">
        <header className="border-b border-zinc-300 pb-5">
          <h1 className="font-serif text-4xl text-zinc-950">{profile.name}</h1>
          <p className="mt-1 font-mono text-[13px] text-zinc-600">{profile.role}</p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11.5px] text-zinc-600">
            <span>{profile.location}</span>
            <EmailLink className="underline underline-offset-2">{profile.email}</EmailLink>
            <a href={profile.github} className="underline underline-offset-2">github.com/{profile.githubUser}</a>
            <a href={profile.linkedin} className="underline underline-offset-2">LinkedIn</a>
            <a href={SITE_URL} className="underline underline-offset-2">{host}</a>
          </p>
        </header>

        <Section title="Summary">
          <p>{profile.about[0]}</p>
          <p className="mt-2">{profile.about[1]}</p>
        </Section>

        <Section title="Experience">
          {experience.map((e) => (
            <div key={e.company + e.role} className="break-inside-avoid">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-semibold text-zinc-950">{e.role} · {e.company}</h3>
                <span className="font-mono text-[11.5px] text-zinc-500">{e.period}</span>
              </div>
              <p className="mt-1">{e.body}</p>
            </div>
          ))}
        </Section>

        <Section title="Selected projects">
          <ul className="space-y-3">
            {featured.map((p) => (
              <li key={p.title} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold text-zinc-950">{p.title}</h3>
                  <span className="font-mono text-[11.5px] text-zinc-500">{p.year}</span>
                </div>
                <p>{p.description}</p>
                <p className="mt-0.5 font-mono text-[11.5px] text-zinc-500">{p.tags.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Skills">
          <dl className="space-y-1.5">
            {Object.entries(stackGroups).map(([group, items]) => (
              <div key={group} className="flex gap-3">
                <dt className="w-32 shrink-0 font-semibold text-zinc-950">{group}</dt>
                <dd>{items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </Section>
      </article>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 border-b border-zinc-200 pb-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{title}</h2>
      {children}
    </section>
  );
}

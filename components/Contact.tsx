import Link from "next/link";
import { profile } from "@/lib/data";
import { posts } from "@/lib/content";
import EmailLink from "./EmailLink";

export default function Contact() {
  return (
    <section id="contact">
      <h2 className="section-title">Latest writing</h2>
      <ul className="divide-y divide-line">
        {posts.slice(0, 3).map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`}
              className="flex items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-[var(--hover)]">
              <span className="text-[14px]">{p.title}</span>
              <span className="shrink-0 font-mono text-xs text-soft">{p.date}</span>
            </Link>
          </li>
        ))}
        <li>
          <Link href="/blog" className="block px-6 py-3 font-mono text-xs text-muted hover:text-fg">All posts →</Link>
        </li>
      </ul>
      <h2 className="section-title border-t border-line">Contact</h2>
      <div className="px-6 py-6 text-[14px] text-muted">
        <p>Open to interesting work and collaborations. Say hi:</p>
        <EmailLink className="mt-3 inline-block font-mono text-fg underline underline-offset-4">
          {profile.email}
        </EmailLink>
        <div className="mt-4 flex gap-4 font-mono text-xs">
          <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-fg">GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-fg">LinkedIn</a>
          <a href={profile.x} target="_blank" rel="noreferrer" className="hover:text-fg">X</a>
        </div>
      </div>
      <p className="border-t border-line px-6 py-5 font-mono text-[11px] text-soft">
        © {new Date().getFullYear()} {profile.name}
      </p>
    </section>
  );
}

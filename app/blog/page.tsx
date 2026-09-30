import type { Metadata } from "next";
import Link from "next/link";
import ArticleShell from "@/components/ArticleShell";
import JsonLd from "@/components/JsonLd";
import { posts, readingTime, toISO, firstParagraph } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbJsonLd, personRef, plainDescription } from "@/lib/seo";

const description = "Notes on engineering: performance, offline-first apps, native tooling and the decisions behind them.";

export const metadata: Metadata = {
  title: "Writing",
  description,
  alternates: { canonical: absoluteUrl("/blog") },
  openGraph: { type: "website", title: "Writing", description, url: absoluteUrl("/blog") },
};

export default function BlogIndex() {
  return (
    <ArticleShell back="/" backLabel="Home">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Writing",
            description,
            url: absoluteUrl("/blog"),
            author: personRef,
            blogPost: posts.map((p) => ({ "@type": "BlogPosting", headline: p.title, url: absoluteUrl(`/blog/${p.slug}`), datePublished: toISO(p.date) })),
          },
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]),
        ]}
      />
      <h1 className="section-title">Writing</h1>
      <ul className="divide-y divide-line">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="group block px-6 py-5 transition-colors hover:bg-[var(--hover)]">
              <p className="font-mono text-[11px] text-soft">
                <time dateTime={toISO(p.date)}>{p.date}</time> · {p.category} · {readingTime(p.blocks)} min read
              </p>
              <h2 className="mt-1.5 font-serif text-2xl group-hover:underline group-hover:underline-offset-4">{p.title}</h2>
              <p className="mt-2 line-clamp-2 text-[14px] text-muted">{plainDescription(firstParagraph(p.blocks), 220)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </ArticleShell>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleShell from "@/components/ArticleShell";
import ArticleBody from "@/components/ArticleBody";
import JsonLd from "@/components/JsonLd";
import { caseStudies, getCaseStudy, splitTitle, toISO, firstParagraph } from "@/lib/content";
import { profile, projects } from "@/lib/data";
import { absoluteUrl, site } from "@/lib/site";
import { breadcrumbJsonLd, personRef, plainDescription } from "@/lib/seo";

export const dynamicParams = false;
export const generateStaticParams = () => caseStudies.map((c) => ({ slug: c.slug }));

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const c = getCaseStudy((await props.params).slug);
  if (!c) return {};
  const { name } = splitTitle(c.title);
  const description = plainDescription(firstParagraph(c.blocks));
  const url = absoluteUrl(`/work/${c.slug}`);
  return {
    title: name,
    description,
    keywords: [...c.tags, "case study", name],
    alternates: { canonical: url },
    openGraph: {
      type: "article", title: c.title, description, url, siteName: site.name, locale: site.locale,
      publishedTime: toISO(c.date), authors: [profile.name], tags: c.tags,
      images: [{ url: absoluteUrl(c.cover), width: 1280, height: 720, alt: `${name} cover` }],
    },
    twitter: { card: "summary_large_image", title: c.title, description, images: [absoluteUrl(c.cover)] },
  };
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const c = getCaseStudy((await props.params).slug);
  if (!c) notFound();
  const { name, sub } = splitTitle(c.title);
  const project = projects.find((p) => p.caseStudy?.endsWith(`/${c.slug}`));
  const links = [project?.live && ["Visit", project.live], project?.repo && ["Source", project.repo]].filter(Boolean) as string[][];
  const url = absoluteUrl(`/work/${c.slug}`);

  return (
    <ArticleShell back="/#projects" backLabel="All projects">
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            headline: c.title,
            description: plainDescription(firstParagraph(c.blocks), 300),
            datePublished: toISO(c.date),
            dateModified: toISO(c.date),
            inLanguage: "en",
            url,
            mainEntityOfPage: url,
            image: absoluteUrl(c.cover),
            keywords: c.tags.join(", "),
            author: personRef,
            publisher: personRef,
          },
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/#projects" },
            { name, path: `/work/${c.slug}` },
          ]),
        ]}
      />
      <article>
        <div className="relative aspect-[16/7] border-b border-line bg-chip">
          <Image src={c.cover} alt={`${name} cover`} fill priority sizes="(min-width: 768px) 740px, 100vw" className="object-cover object-top" />
        </div>
        <header className="space-y-3 border-b border-line px-6 py-7">
          <p className="font-mono text-[11px] tracking-widest text-soft">
            CASE STUDY · {c.category.toUpperCase()} · <time dateTime={toISO(c.date)}>{c.date.toUpperCase()}</time>
          </p>
          <h1 className="font-serif text-3xl leading-tight sm:text-4xl">{name}</h1>
          {sub && <p className="text-[15px] text-muted">{sub}</p>}
          <div className="flex flex-wrap gap-1.5 pt-1">{c.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
          {links.length > 0 && (
            <div className="flex gap-2 pt-2">
              {links.map(([l, h]) => (
                <a key={l} href={h} target="_blank" rel="noreferrer noopener" className="rounded-md border border-line px-3 py-1.5 text-[13px] text-muted hover:bg-[var(--hover)] hover:text-fg">{l} ↗</a>
              ))}
            </div>
          )}
        </header>
        <ArticleBody blocks={c.blocks} />
      </article>
      <nav aria-label="More case studies" className="border-t border-line px-6 py-6">
        <p className="mb-3 font-mono text-[11px] tracking-widest text-soft">MORE WORK</p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {caseStudies.filter((x) => x.slug !== c.slug).slice(0, 4).map((x) => (
            <li key={x.slug}>
              <Link href={`/work/${x.slug}`} className="block rounded-md border border-line px-3 py-2 text-[13px] text-muted transition-colors hover:bg-[var(--hover)] hover:text-fg">{splitTitle(x.title).name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </ArticleShell>
  );
}

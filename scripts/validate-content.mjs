#!/usr/bin/env node
// Validates content/*.json and asset/link references. Runs in CI (`npm run validate`).
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const errors = [];
const fail = (m) => errors.push(m);
const read = (p) => readFileSync(join(root, p), "utf8");

const work = JSON.parse(read("content/work.json"));
const blog = JSON.parse(read("content/blog.json"));
const BLOCKS = new Set(["h2", "h3", "p", "ul", "ol", "quote", "code", "img", "table"]);
const slugs = { work: new Set(work.map((w) => w.slug)), blog: new Set(blog.map((b) => b.slug)) };

function checkEntries(kind, list, extra) {
  const seen = new Set();
  for (const e of list) {
    const id = `${kind}/${e.slug}`;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.slug ?? "")) fail(`${id}: invalid slug`);
    if (seen.has(e.slug)) fail(`${id}: duplicate slug`);
    seen.add(e.slug);
    if (!e.title) fail(`${id}: missing title`);
    if (Number.isNaN(Date.parse(`${e.date} UTC`))) fail(`${id}: unparseable date "${e.date}"`);
    if (!Array.isArray(e.blocks) || e.blocks.length === 0) fail(`${id}: no blocks`);
    extra?.(e, id);
    for (const [i, b] of (e.blocks ?? []).entries()) {
      if (!BLOCKS.has(b.t)) fail(`${id}: block ${i} has unknown type "${b.t}"`);
      const text = JSON.stringify(b.x);
      if (!b.x || text === "[]" || text === '""') fail(`${id}: block ${i} (${b.t}) is empty`);
      for (const m of text.matchAll(/\]\((\/(?:work|blog)\/[\w-]+)\)/g)) {
        const [, k, s] = m[1].split("/");
        if (!slugs[k]?.has(s)) fail(`${id}: broken internal link ${m[1]}`);
      }
    }
  }
}

checkEntries("work", work, (e, id) => {
  if (!e.cover || !existsSync(join(root, "public", e.cover))) fail(`${id}: cover missing on disk (${e.cover})`);
  if (!e.category) fail(`${id}: missing category`);
  if (!Array.isArray(e.tags)) fail(`${id}: tags must be an array`);
});
checkEntries("blog", blog);

// lib/data.ts: case-study links and image paths must resolve
const data = read("lib/data.ts");
for (const m of data.matchAll(/caseStudy:\s*"\/work\/([\w-]+)"/g)) if (!slugs.work.has(m[1])) fail(`lib/data.ts: caseStudy /work/${m[1]} has no content entry`);
for (const m of data.matchAll(/(?:image|avatar):\s*"(\/img\/[^"]+)"/g)) if (!existsSync(join(root, "public", m[1]))) fail(`lib/data.ts: missing asset ${m[1]}`);

if (errors.length) {
  console.error(`✖ content validation failed (${errors.length}):\n` + errors.map((e) => "  - " + e).join("\n"));
  process.exit(1);
}
console.log(`✔ content ok: ${work.length} case studies, ${blog.length} posts`);

/**
 * Sub-path the site is served from (e.g. "/quietfolio" on GitHub Pages project sites). Empty at a domain root.
 * Set NEXT_PUBLIC_BASE_PATH at build time; it must match `basePath` in next.config.ts.
 */
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

/** Prefix a root-relative path for raw <a>/<img>/<source> tags (next/link and next/image do this themselves). */
export const withBase = (path: string) => `${BASE_PATH}${path}`;

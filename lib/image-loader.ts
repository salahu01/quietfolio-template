// Used only for the static export (STATIC_EXPORT=1): there is no image optimizer on a static host,
// and next/image does not add `basePath` to local paths in that mode, so prefix it here.
export default function imageLoader({ src }: { src: string }) {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
  return /^(https?:)?\/\//.test(src) ? src : `${base}${src}`;
}

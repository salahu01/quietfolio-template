import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
// `STATIC_EXPORT=1` builds plain HTML into ./out for static hosts such as GitHub Pages (see README > Deploy).
// Static export has no server, so custom headers, redirects and the image optimizer are disabled.
const isExport = process.env.STATIC_EXPORT === "1";
if (isProd && !process.env.NEXT_PUBLIC_SITE_URL) {
  console.warn("\n[quietfolio] NEXT_PUBLIC_SITE_URL is not set: canonical URLs, sitemap and social tags will point to https://example.com\n");
}
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

// CSP: Next injects inline bootstrap scripts, so 'unsafe-inline' is required without nonces.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://github-contributions-api.jogruber.de",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const serverOnly: NextConfig = {
  async redirects() {
    return [{ source: "/work", destination: "/#projects", permanent: false }];
  },
  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      ...(isProd ? [{ key: "Content-Security-Policy", value: csp }] : []),
    ];
    return [
      { source: "/:path*", headers: security },
      { source: "/img/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] },
    ];
  },
};

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  basePath,
  ...(isExport
    ? { output: "export", trailingSlash: true, images: { loader: "custom", loaderFile: "./lib/image-loader.ts" } }
    : { ...serverOnly, images: { formats: ["image/avif", "image/webp"] } }),
};

export default nextConfig;

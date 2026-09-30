import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found", robots: { index: false, follow: false } };

export default function NotFound() {
  return (
    <main id="main" className="rail grid min-h-[80vh] place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-xs text-soft">404</p>
        <h1 className="mt-2 font-serif text-4xl">Page not found</h1>
        <p className="mt-3 text-sm text-muted">That page doesn&apos;t exist or has moved.</p>
        <Link href="/" className="mt-6 inline-block rounded-md border border-line px-4 py-2 text-sm text-muted hover:text-fg">Back home</Link>
      </div>
    </main>
  );
}

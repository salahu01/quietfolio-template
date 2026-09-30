import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export default function ArticleShell({ back, backLabel, children }: { back: string; backLabel: string; children: ReactNode }) {
  return (
    <main id="main" className="rail min-h-screen">
      <div className="border-b border-line px-6 py-3">
        <Link href={back} className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-fg">
          <ArrowLeft size={13} /> {backLabel}
        </Link>
      </div>
      {children}
      <p className="border-t border-line px-6 py-5 font-mono text-[11px] text-soft">
        <Link href="/#contact" className="hover:text-fg">Get in touch →</Link>
      </p>
    </main>
  );
}

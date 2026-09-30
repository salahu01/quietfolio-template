"use client";

export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="rounded-md border border-line px-3 py-1.5 font-mono text-xs text-muted hover:text-fg">
      Print
    </button>
  );
}

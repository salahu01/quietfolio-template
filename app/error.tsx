"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main" className="rail grid min-h-[80vh] place-items-center px-6 text-center">
      <div>
        <p className="font-mono text-xs text-soft">Error</p>
        <h1 className="mt-2 font-serif text-4xl">Something went wrong</h1>
        <button onClick={reset} className="mt-6 rounded-md border border-line px-4 py-2 text-sm text-muted hover:text-fg">Try again</button>
      </div>
    </main>
  );
}

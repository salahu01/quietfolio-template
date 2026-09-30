"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Sun, Moon } from "lucide-react";
import { profile } from "@/lib/data";
import { withBase } from "@/lib/paths";

const links = [
  { id: "home", label: "Home", href: "/" },
  { id: "projects", label: "Projects", href: "/#projects" },
  { id: "experience", label: "Experience", href: "/#experience" },
  { id: "blog", label: "Blog", href: "/blog" },
  { id: "contact", label: "Contact", href: "/#contact" },
];

// Home-page sections in DOM order -> the nav item each one belongs to.
const SECTIONS: [string, string][] = [
  ["home", "home"],
  ["about", "home"],
  ["projects", "projects"],
  ["experience", "experience"],
  ["stack", "experience"],
  ["github", "experience"],
  ["contact", "contact"],
];

const HEADER = 48;

export default function Navbar({ onSearch }: { onSearch: () => void }) {
  const pathname = usePathname();
  const [spy, setSpy] = useState("home");
  const active =
    pathname === "/" ? spy : pathname.startsWith("/blog") ? "blog" : pathname.startsWith("/work") ? "projects" : "";

  useEffect(() => {
    try {
      const t = localStorage.getItem("theme");
      if (t === "light") document.documentElement.dataset.theme = "light";
    } catch {}
  }, []);

  // Scroll-spy by position: the active item is the last section whose top has passed 40% of the viewport.
  useEffect(() => {
    if (pathname !== "/") return;
    let raf = 0;
    const update = () => {
      raf = 0;
      let current = "home";
      for (const [id, nav] of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= innerHeight * 0.4) current = nav;
      }
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) current = "contact";
      if (scrollY < 8) current = "home";
      setSpy(current);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  // On the home page every section link behaves identically: an instant jump (no animation) to the section
  // top, even if the URL hash already matches. Other routes (e.g. /blog) navigate normally.
  const go = (e: React.MouseEvent, l: (typeof links)[number]) => {
    if (pathname !== "/" || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const isHash = l.href.startsWith("/#");
    if (l.id !== "home" && !isHash) return;
    const el = l.id === "home" ? null : document.getElementById(l.id);
    if (l.id !== "home" && !el) return;
    e.preventDefault();
    scrollTo({ top: el ? Math.max(0, scrollY + el.getBoundingClientRect().top - HEADER) : 0, behavior: "instant" });
    history.replaceState(null, "", withBase(l.id === "home" ? "/" : l.href));
    setSpy(l.id);
  };

  const toggle = () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch {}
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/80 backdrop-blur">
      <div className="rail flex h-12 items-center justify-between gap-2 px-4 sm:px-6">
        <Link href="/" onClick={(e) => go(e, links[0])} className="hidden font-serif text-xl min-[520px]:block">{profile.short}</Link>
        <nav aria-label="Primary" className="ml-auto flex items-center gap-2.5 text-[13px] sm:gap-5">
          {links.map((l) => (
            <Link
              key={l.id}
              href={l.href}
              onClick={(e) => go(e, l)}
              aria-current={active === l.id ? "page" : undefined}
              className={`relative pb-0.5 transition-colors ${active === l.id ? "text-fg" : "text-muted hover:text-fg"}`}
            >
              {l.label}
              {active === l.id && (
                <motion.span layoutId="nav-underline" transition={{ type: "spring", stiffness: 500, damping: 40 }}
                  className="absolute inset-x-0 -bottom-px h-px bg-fg" />
              )}
            </Link>
          ))}
          <button onClick={onSearch} aria-label="Search" className="grid size-7 place-items-center rounded-full border border-line text-muted hover:text-fg sm:size-8">
            <Search size={14} />
          </button>
          <button onClick={toggle} aria-label="Toggle theme" className="grid size-7 place-items-center rounded-full border border-line text-muted hover:text-fg sm:size-8">
            <Sun size={14} className="in-data-[theme=light]:hidden" />
            <Moon size={14} className="hidden in-data-[theme=light]:block" />
          </button>
        </nav>
      </div>
    </header>
  );
}

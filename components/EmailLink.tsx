"use client";
import type { ReactNode } from "react";
import { mailtoHref, openMail } from "@/lib/mail";

/** A real mailto: link (works without JS / on crawlers) that falls back to Gmail compose when no mail app opens. */
export default function EmailLink({ children, className, subject }: { children: ReactNode; className?: string; subject?: string }) {
  return (
    <a
      href={mailtoHref(subject)}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        openMail(subject);
      }}
    >
      {children}
    </a>
  );
}

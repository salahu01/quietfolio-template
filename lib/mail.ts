import { profile } from "./data";

const SUBJECT = "Hello from your portfolio";

export const mailtoHref = (subject = SUBJECT) => `mailto:${profile.email}?subject=${encodeURIComponent(subject)}`;
export const gmailHref = (subject = SUBJECT) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}&su=${encodeURIComponent(subject)}`;

/**
 * Opens the visitor's mail app via mailto:. Desktop browsers without a configured mail client do nothing
 * on mailto:, so if the page is still focused shortly after, fall back to a Gmail compose window.
 */
export function openMail(subject = SUBJECT) {
  let left = false;
  const mark = () => { left = true; };
  addEventListener("blur", mark, { once: true });
  document.addEventListener("visibilitychange", mark, { once: true });
  window.location.href = mailtoHref(subject);
  setTimeout(() => {
    removeEventListener("blur", mark);
    document.removeEventListener("visibilitychange", mark);
    const touch = matchMedia("(pointer: coarse)").matches;
    if (!left && !touch) window.open(gmailHref(subject), "_blank", "noopener,noreferrer");
  }, 900);
}

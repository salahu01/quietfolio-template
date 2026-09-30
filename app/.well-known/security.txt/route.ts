import { profile } from "@/lib/data";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

/** RFC 9116 security.txt, generated from your profile email. `Expires` is one year from build time. */
export function GET() {
  const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
  const body = [
    `Contact: mailto:${profile.email}`,
    `Expires: ${expires}`,
    "Preferred-Languages: en",
    `Canonical: ${absoluteUrl("/.well-known/security.txt")}`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

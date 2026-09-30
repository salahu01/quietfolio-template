import type { MetadataRoute } from "next";
import { profile } from "@/lib/data";
import { withBase } from "@/lib/paths";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: profile.name,
    short_name: profile.short,
    description: `${profile.name} — ${profile.role}.`,
    start_url: withBase("/"),
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [{ src: withBase("/icon.png"), sizes: "192x192", type: "image/png" }],
  };
}

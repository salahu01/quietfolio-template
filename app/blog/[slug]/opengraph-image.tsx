import { ImageResponse } from "next/og";
import { getPost, posts } from "@/lib/content";
import { profile } from "@/lib/data";

export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = false;
export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);
  const title = post?.title ?? profile.name;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 72, background: "#0a0a0a", color: "#f5f5f4", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", fontSize: 26, color: "#a1a1aa", letterSpacing: 4 }}>
          {(post?.category ?? "WRITING").toUpperCase()} · {post?.date.toUpperCase()}
        </div>
        <div style={{ display: "flex", fontSize: title.length > 48 ? 64 : 80, lineHeight: 1.1, fontWeight: 600 }}>{title}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 28, color: "#a1a1aa" }}>
          <span>{profile.name}</span>
          <span style={{ color: "#63636b" }}>{profile.role}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}

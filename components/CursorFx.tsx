"use client";
import { useEffect, useRef } from "react";

/**
 * Pointer effects on one full-screen canvas (fine pointers only, off for reduced motion):
 *  - pixel trail: snapped squares that shrink/fade behind the cursor
 *  - focus reticle: camera-style corner brackets that lerp to the cursor and snap to interactive elements
 *  - click burst: pixel sparks
 *  - soft spotlight glow
 * Also feeds --mx/--my to [data-spot] elements for the card glow.
 */
const PX = 6; // pixel cell size (CSS px)
const TRAIL_MS = 650;

type Dot = { x: number; y: number; born: number; hue: number };
type Spark = { x: number; y: number; vx: number; vy: number; born: number; ttl: number; hue: number };

export default function CursorFx() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const dots: Dot[] = [];
    const sparks: Spark[] = [];
    const mouse = { x: -100, y: -100, inside: false, hot: false, rect: null as DOMRect | null };
    const ring = { x: -100, y: -100, s: 12, a: 0 };
    let last: { x: number; y: number } | null = null;
    let raf = 0, running = false, hueShift = 0, lastMove = 0;

    const isLight = () => document.documentElement.dataset.theme === "light";
    const color = (hue: number, a: number) => (isLight() ? `hsla(${hue}, 80%, 42%, ${a})` : `hsla(${hue}, 95%, 66%, ${a})`);

    const start = () => { if (!running) { running = true; raf = requestAnimationFrame(frame); } };

    const addDots = (x0: number, y0: number, x1: number, y1: number, now: number) => {
      const dist = Math.hypot(x1 - x0, y1 - y0);
      const steps = Math.max(1, Math.ceil(dist / PX));
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const gx = Math.round((x0 + (x1 - x0) * t) / PX) * PX;
        const gy = Math.round((y0 + (y1 - y0) * t) / PX) * PX;
        const prev = dots[dots.length - 1];
        if (prev && prev.x === gx && prev.y === gy) continue;
        hueShift = (hueShift + 2.2) % 360;
        dots.push({ x: gx, y: gy, born: now, hue: 200 + 70 * (0.5 + 0.5 * Math.sin(hueShift / 28)) });
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const now = performance.now();
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.inside = true; lastMove = now;
      if (last) addDots(last.x, last.y, e.clientX, e.clientY, now);
      last = { x: e.clientX, y: e.clientY };

      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      const target = el?.closest<HTMLElement>("a, button, [role='button'], input, summary, [data-cursor]") ?? null;
      mouse.hot = !!target;
      mouse.rect = target ? target.getBoundingClientRect() : null;

      const spot = el?.closest<HTMLElement>("[data-spot]");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--my", `${e.clientY - r.top}px`);
      }
      start();
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const now = performance.now();
      for (let i = 0; i < 16; i++) {
        const a = (Math.PI * 2 * i) / 16 + Math.random() * 0.3;
        const sp = 1.2 + Math.random() * 2.6;
        sparks.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, born: now, ttl: 450 + Math.random() * 300, hue: 190 + Math.random() * 100 });
      }
      ring.s = 6; // reticle "snap" pulse
      start();
    };
    const onLeave = () => { mouse.inside = false; last = null; start(); };
    const onVis = () => { if (document.hidden) { running = false; cancelAnimationFrame(raf); } };

    const bracket = (cx: number, cy: number, hw: number, hh: number, arm: number) => {
      const x0 = cx - hw, x1 = cx + hw, y0 = cy - hh, y1 = cy + hh;
      ctx.beginPath();
      ctx.moveTo(x0, y0 + arm); ctx.lineTo(x0, y0); ctx.lineTo(x0 + arm, y0);
      ctx.moveTo(x1 - arm, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y0 + arm);
      ctx.moveTo(x1, y1 - arm); ctx.lineTo(x1, y1); ctx.lineTo(x1 - arm, y1);
      ctx.moveTo(x0 + arm, y1); ctx.lineTo(x0, y1); ctx.lineTo(x0, y1 - arm);
      ctx.stroke();
    };

    let ringW = 12, ringH = 12;
    function frame(now: number) {
      ctx!.clearRect(0, 0, w, h);
      const light = isLight();
      ctx!.globalCompositeOperation = light ? "source-over" : "lighter";

      // spotlight
      if (mouse.inside) {
        const g = ctx!.createRadialGradient(ring.x, ring.y, 0, ring.x, ring.y, 190);
        g.addColorStop(0, light ? "rgba(60,90,220,0.07)" : "rgba(110,140,255,0.10)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx!.fillStyle = g; ctx!.fillRect(ring.x - 190, ring.y - 190, 380, 380);
      }

      // trail
      while (dots.length && now - dots[0].born > TRAIL_MS) dots.shift();
      for (const d of dots) {
        const life = 1 - (now - d.born) / TRAIL_MS;
        const s = PX * (0.35 + 0.65 * life);
        ctx!.fillStyle = color(d.hue, Math.pow(life, 1.4) * 0.9);
        ctx!.fillRect(d.x - s / 2, d.y - s / 2, s, s);
      }

      // sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i], age = now - p.born;
        if (age > p.ttl) { sparks.splice(i, 1); continue; }
        p.x += p.vx; p.y += p.vy; p.vy += 0.06; p.vx *= 0.985;
        const life = 1 - age / p.ttl, s = Math.max(2, Math.round((PX * 0.7 * life) / 2) * 2);
        ctx!.fillStyle = color(p.hue, life);
        ctx!.fillRect(Math.round(p.x / 2) * 2, Math.round(p.y / 2) * 2, s, s);
      }

      // reticle: lerp to cursor; expand to surround hovered interactive element
      ctx!.globalCompositeOperation = "source-over";
      const tx = mouse.hot && mouse.rect ? mouse.rect.left + mouse.rect.width / 2 : mouse.x;
      const ty = mouse.hot && mouse.rect ? mouse.rect.top + mouse.rect.height / 2 : mouse.y;
      const tw = mouse.hot && mouse.rect ? mouse.rect.width / 2 + 6 : 11;
      const th = mouse.hot && mouse.rect ? mouse.rect.height / 2 + 6 : 11;
      const k = mouse.hot ? 0.28 : 0.35;
      ring.x += (tx - ring.x) * k; ring.y += (ty - ring.y) * k;
      ringW += (tw - ringW) * 0.25; ringH += (th - ringH) * 0.25;
      ring.a += ((mouse.inside ? 1 : 0) - ring.a) * 0.2;
      if (ring.a > 0.02) {
        ctx!.lineWidth = 1.5; ctx!.lineCap = "square";
        ctx!.strokeStyle = light ? `rgba(10,10,10,${0.7 * ring.a})` : `rgba(245,245,244,${0.85 * ring.a})`;
        bracket(ring.x, ring.y, ringW, ringH, Math.min(6, ringW, ringH));
        if (!mouse.hot) { // centre pixel
          ctx!.fillStyle = light ? `rgba(10,10,10,${ring.a})` : `rgba(245,245,244,${ring.a})`;
          ctx!.fillRect(mouse.x - 1, mouse.y - 1, 2, 2);
        }
      }

      const settled = Math.abs(tx - ring.x) < 0.3 && Math.abs(ty - ring.y) < 0.3 && Math.abs(tw - ringW) < 0.3;
      const idle = !dots.length && !sparks.length && settled && (!mouse.inside ? ring.a < 0.03 : now - lastMove > 1500);
      if (idle) {
        running = false;
        if (!mouse.inside) ctx!.clearRect(0, 0, w, h);
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[45] size-full" />;
}

#!/usr/bin/env node
// Regenerates docs/screenshots/*.png for the README using your installed Chrome.
//   npm run build && npm start &            # serve the production build (port 3000)
//   npm i --no-save puppeteer-core          # one-off, not added to package.json
//   node scripts/make_screenshots.mjs       # BASE_URL / CHROME_PATH can be overridden
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const CHROME =
  process.env.CHROME_PATH ??
  ({ darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", win32: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" }[process.platform] ??
    "/usr/bin/google-chrome");
const OUT = "docs/screenshots";
mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-sandbox"] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function open({ path, w = 1280, h = 900, theme = "dark", scale = 1, mobile = false }) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: scale, isMobile: mobile, hasTouch: mobile });
  await page.evaluateOnNewDocument((t) => { try { localStorage.setItem("theme", t); } catch {} }, theme);
  await page.goto(BASE + path, { waitUntil: "networkidle0" });
  await sleep(1200);
  return page;
}
const save = (page, name) => page.screenshot({ path: `${OUT}/${name}.png` });

{ // home, dark, with the pixel cursor trail and focus reticle in frame
  const p = await open({ path: "/" });
  for (const [x, y] of [[180, 560], [260, 520], [360, 470], [470, 450], [560, 500], [640, 470]]) await p.mouse.move(x, y, { steps: 6 });
  await sleep(120);
  await save(p, "home-dark");
  await p.close();
}
{ const p = await open({ path: "/", theme: "light" }); await save(p, "home-light"); await p.close(); }
{ // projects section, cropped without the sticky header
  const p = await open({ path: "/", h: 1000 });
  await p.addStyleTag({ content: "header.sticky,canvas{display:none!important}" });
  const el = await p.$("#projects"); await el.scrollIntoView(); await sleep(900);
  await el.screenshot({ path: `${OUT}/projects.png` });
  await p.close();
}
{ const p = await open({ path: "/work/northwind-dashboard/", h: 1000 }); await save(p, "case-study"); await p.close(); }
{ const p = await open({ path: "/blog/getting-started-with-quietfolio/", h: 1000 }); await save(p, "blog-post"); await p.close(); }
{ // command palette
  const p = await open({ path: "/", h: 560 });
  await p.keyboard.down("Meta"); await p.keyboard.press("k"); await p.keyboard.up("Meta");
  await sleep(300); await p.keyboard.type("north"); await sleep(400);
  await p.addStyleTag({ content: "canvas{display:none!important}" });
  await save(p, "command-palette");
  await p.close();
}
for (const [name, path, anchor] of [["mobile-home", "/", null], ["mobile-projects", "/", "#projects"], ["mobile-case-study", "/work/pocket-budget/", null]]) {
  const p = await open({ path, w: 390, h: 844, scale: 1.5, mobile: true });
  if (anchor) { await p.evaluate((s) => document.querySelector(s).scrollIntoView(), anchor); await sleep(700); }
  await save(p, name);
  await p.close();
}
await browser.close();
console.log(`screenshots written to ${OUT}/`);

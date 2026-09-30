"""Generates the neutral placeholder art used by the template: a pixel identicon avatar and project covers.
Replace public/img/avatar.jpeg and public/img/projects/* with your own images, or re-run this for new placeholders.
Usage: python3 scripts/make_sample_assets.py"""
import hashlib, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def font(size, mono=False):
    names = (["/System/Library/Fonts/Menlo.ttc", "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"] if mono
             else ["/System/Library/Fonts/NewYork.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"])
    for n in names:
        try: return ImageFont.truetype(n, size)
        except OSError: pass
    return ImageFont.load_default()

def hsl(h, s, l):
    import colorsys
    r, g, b = colorsys.hls_to_rgb(h / 360, l, s); return (int(r * 255), int(g * 255), int(b * 255))

# ---------- avatar: symmetric 7x7 pixel identicon ----------
def avatar(seed="sample", path="public/img/avatar.jpeg"):
    rnd = random.Random(int(hashlib.md5(seed.encode()).hexdigest(), 16))
    hue = rnd.randrange(360); fg = hsl(hue, .65, .62); bg = hsl(hue, .35, .12)
    n, cell = 7, 100
    im = Image.new("RGB", (800, 800), bg); d = ImageDraw.Draw(im)
    grid = [[rnd.random() > .48 for _ in range(4)] for _ in range(n)]
    for y in range(n):
        for x in range(n):
            if grid[y][x if x < 4 else n - 1 - x]:
                d.rectangle([50 + x * cell, 50 + y * cell, 50 + (x + 1) * cell - 1, 50 + (y + 1) * cell - 1], fill=fg)
    im.save(path, quality=90, optimize=True, progressive=True)

# ---------- covers: abstract UI mock on a gradient ----------
def cover(title, tag, hue, path, kind):
    W, H = 1280, 720
    im = Image.new("RGB", (W, H), "#0d0d0f")
    g = Image.new("RGB", (W, H))
    gd = ImageDraw.Draw(g)
    for y in range(H):
        t = y / H; gd.line([(0, y), (W, y)], fill=hsl(hue + 30 * t, .55, .10 + .10 * (1 - t)))
    im.paste(g)
    glow = Image.new("RGB", (W, H), (0, 0, 0)); ImageDraw.Draw(glow).ellipse([640, -120, 1300, 520], fill=hsl(hue, .8, .42))
    im = Image.blend(im, Image.composite(glow.filter(ImageFilter.GaussianBlur(140)), im, Image.new("L", (W, H), 255)), .35)
    d = ImageDraw.Draw(im)
    card = "#15161a"; line = "#2a2c33"; acc = hsl(hue, .8, .65); acc2 = hsl(hue + 40, .7, .55)
    if kind == "web":      # dashboard window
        d.rounded_rectangle([170, 150, 1110, 600], 18, fill=card, outline=line, width=2)
        for i, c in enumerate(["#ff5f57", "#febc2e", "#28c840"]): d.ellipse([196 + i * 26, 176, 212 + i * 26, 192], fill=c)
        d.rounded_rectangle([200, 230, 420, 570], 10, fill="#1b1d22")
        for i in range(6): d.rounded_rectangle([220, 256 + i * 48, 400 - (i % 3) * 30, 274 + i * 48], 6, fill=line)
        for i, h in enumerate([120, 200, 150, 260, 190, 300, 230]):
            d.rounded_rectangle([470 + i * 84, 560 - h, 530 + i * 84, 560], 8, fill=acc if i % 2 else acc2)
    elif kind == "mobile":  # phone
        d.rounded_rectangle([450, 70, 830, 660], 46, fill=card, outline=line, width=3)
        d.rounded_rectangle([590, 92, 690, 110], 9, fill="#0d0d0f")
        d.rounded_rectangle([480, 150, 800, 290], 22, fill=acc)
        d.text((510, 185), "$ 2,480", font=font(54, True), fill="#0d0d0f")
        for i in range(5):
            y = 320 + i * 62
            d.ellipse([486, y, 530, y + 44], fill=line); d.rounded_rectangle([548, y + 6, 720 - (i % 3) * 40, y + 20], 6, fill="#3a3d46"); d.rounded_rectangle([548, y + 28, 650, y + 38], 5, fill=line)
    elif kind == "cli":     # terminal
        d.rounded_rectangle([190, 150, 1090, 590], 16, fill="#0a0b0d", outline=line, width=2)
        for i, c in enumerate(["#ff5f57", "#febc2e", "#28c840"]): d.ellipse([216 + i * 26, 176, 232 + i * 26, 192], fill=c)
        lines = [("$ plainfile sync ./docs", "#e7e7ea"), ("  ✔ 128 files scanned", acc), ("  ✔ 3 conflicts resolved", acc), ("  → up to date in 1.2s", "#8b8b96"), ("$ _", "#e7e7ea")]
        for i, (t, c) in enumerate(lines): d.text((224, 232 + i * 62), t, font=font(34, True), fill=c)
    else:                   # notes app
        d.rounded_rectangle([170, 150, 1110, 600], 18, fill=card, outline=line, width=2)
        d.rectangle([170, 150, 420, 600], fill="#1b1d22")
        for i in range(5): d.rounded_rectangle([196, 190 + i * 70, 396, 240 + i * 70], 10, fill=acc if i == 1 else "#23252b")
        d.text((460, 190), "Untitled note", font=font(46), fill="#e7e7ea")
        for i in range(6): d.rounded_rectangle([460, 270 + i * 46, 1060 - (i % 3) * 110, 286 + i * 46], 8, fill=line)
    d.text((60, 640), tag.upper(), font=font(24, True), fill="#8b8b96")
    d.text((60, 54), title, font=font(54), fill="#f5f5f4")
    im.save(path, "JPEG", quality=84, optimize=True, progressive=True)

if __name__ == "__main__":
    avatar()
    cover("Northwind Dashboard", "Web app · Sample", 215, "public/img/projects/northwind-dashboard.jpg", "web")
    cover("Pocket Budget", "Mobile app · Sample", 155, "public/img/projects/pocket-budget.jpg", "mobile")
    cover("Plainfile CLI", "Tooling · Sample", 275, "public/img/projects/plainfile-cli.jpg", "cli")
    cover("Orbit Notes", "Desktop app · Sample", 20, "public/img/projects/orbit-notes.jpg", "desktop")
    print("ok")

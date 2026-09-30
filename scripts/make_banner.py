"""Generates public/img/banner.gif and banner.webp: an original animated pixel-art developer desk scene."""
import math, random
from PIL import Image, ImageDraw

W, H, S, N = 240, 60, 5, 32  # grid, upscale, frame count

def hexrgb(h): h = h.lstrip("#"); return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))
def mix(a, b, k): a, b = hexrgb(a), hexrgb(b); return tuple(int(a[i] + (b[i]-a[i]) * k) for i in range(3))

STARS = [(random.Random(i).randint(11, 48), random.Random(i+99).randint(9, 24)) for i in range(20)]
SKY = [(11, 6), (15, 10), (20, 7), (25, 12), (31, 8), (36, 11), (42, 6), (46, 9)]
WIN = [(x, wy, random.Random(x*31+wy).random()) for x, h in SKY for wy in range(32-h+2, 30, 3)]
LINES = []
_r = random.Random(11)
for i in range(6):
    x, segs = _r.choice([0, 0, 4, 8]), []
    for _ in range(_r.randint(2, 4)):
        w = _r.randint(4, 14)
        if x + w > 62: break
        segs.append((x, w, _r.choice(["#a5d6ff", "#ff9e64", "#9ece6a", "#bb9af7", "#f7f7f7", "#7dcfff"]))); x += w + 2
    LINES.append(segs)

def frame(t):
    p = t / N  # 0..1 loop
    im = Image.new("RGB", (W, H)); d = ImageDraw.Draw(im)
    R = lambda x0, y0, x1, y1, c: d.rectangle([x0, y0, x1-1, y1-1], fill=c)
    for i, c in enumerate(["#0b1626", "#0d1b2e", "#102238", "#13283f", "#173049"]): R(0, i*10, W, i*10+10, c)
    for x in range(0, W, 30): R(x, 0, x+1, 46, "#0a1321")
    # window
    R(8, 6, 52, 34, "#22385a"); R(10, 8, 50, 32, "#0a1730")
    for i, (x, y) in enumerate(STARS):
        k = 0.5 + 0.5 * math.sin(2*math.pi*(p*2 + i/7))
        R(x, y, x+1, y+1, mix("#2a3f66", "#e6efff", k))
    R(40, 11, 45, 16, "#f3e9b5"); R(42, 11, 45, 16, "#dcd091")
    for x, h in SKY: R(x, 32-h, x+4, 32, "#07101f")
    for x, wy, r in WIN:
        if (r + (0.35 if math.sin(2*math.pi*(p + r)) > 0.92 else 0)) < .6: R(x+1, wy, x+2, wy+1, "#ffd479")
    R(29, 6, 31, 34, "#22385a")
    # desk
    R(0, 46, W, 52, "#3a2a24"); R(0, 46, W, 47, "#57403a"); R(0, 52, W, H, "#241a17")
    for x in (12, 120, 226): R(x, 52, x+4, H, "#1a1210")
    # tower + LEDs + RGB strip
    R(176, 18, 204, 46, "#1c2230"); R(176, 18, 204, 19, "#2b3447"); R(176, 18, 177, 46, "#2b3447")
    R(180, 23, 200, 25, "#0e131d"); R(180, 28, 200, 30, "#0e131d")
    R(181, 34, 185, 36, "#3ddc97" if t % 8 < 5 else "#1d6b49")
    R(187, 34, 190, 36, "#ff5d5d" if t % 12 < 2 else "#6b2b2b")
    R(193, 34, 199, 36, "#0e131d"); R(181, 40, 199, 42, "#141a26")
    hue = (p * 3) % 1
    R(176, 44, 204, 46, mix("#6b5bff", "#2ad4ff", 0.5 + 0.5*math.sin(2*math.pi*hue)))
    # monitor
    R(92, 6, 168, 38, "#0d1117"); R(93, 7, 167, 37, "#1e2635")
    for i, c in enumerate(["#1247a8", "#1450b8", "#1757c4", "#1a5fd0", "#1e67dc", "#2470e6"]): R(95, 9+i*4, 165, 13+i*4, c)
    R(97, 11, 99, 13, "#ff5d5d"); R(101, 11, 103, 13, "#ffd166"); R(105, 11, 107, 13, "#3ddc97")
    # typing: reveal lines over time, hold, loop
    total = sum(w for l in LINES for _, w, _ in l)
    shown = int(total * min(1, p / 0.75)) if p < 0.9 else total
    cur_x, cur_y = 97, 16
    for li, segs in enumerate(LINES):
        y = 16 + li*4; cur_x, cur_y = 97, y
        for (dx, w, c) in segs:
            take = min(w, shown); shown -= take
            if take > 0: R(97+dx, y, 97+dx+take, y+2, c)
            cur_x, cur_y = 97+dx+take, y
            if take < w: break
        if shown <= 0: break
    if t % 6 < 3: R(cur_x+1, cur_y-1, cur_x+3, cur_y+3, "#f7f7f7")
    R(159, 15, 162, 33, "#2a7bf2")
    R(124, 38, 136, 44, "#151b26"); R(112, 44, 148, 46, "#1c2434")
    # keyboard with flashing keys
    R(96, 46, 150, 49, "#2a3142"); R(96, 46, 150, 47, "#3a4358")
    kr = random.Random(t // 2)
    hot = {kr.randrange(17) for _ in range(3)}
    for i, x in enumerate(range(98, 148, 3)): R(x, 47, x+2, 48, "#b9c8f0" if i in hot else "#515c78")
    R(156, 47, 162, 49, "#2a3142")
    # mug + rising steam
    R(72, 39, 82, 46, "#e8e2d4"); R(72, 39, 82, 41, "#b9b2a3"); R(82, 41, 85, 44, "#e8e2d4"); R(83, 42, 84, 43, "#0b1626"); R(74, 40, 80, 41, "#3a2418")
    for k in range(4):
        ph = (p*2 + k*0.25) % 1
        y = int(37 - ph*12); x = 75 + int(2*math.sin(2*math.pi*(ph + k*.3)))
        R(x, y, x+1, y+2, mix("#3d5376", "#0d1b2e", ph))
    # lamp
    R(60, 44, 70, 46, "#2a3142"); R(64, 30, 66, 44, "#2a3142"); R(56, 28, 70, 32, "#3a4358"); R(56, 32, 70, 34, "#ffd479")
    # plant (gentle sway)
    R(14, 38, 26, 46, "#7a4a36"); R(14, 38, 26, 40, "#9a5e44")
    sway = 1 if math.sin(2*math.pi*p) > 0.3 else 0
    for (x, y, w, h) in [(17, 28, 3, 10), (12, 31, 3, 7), (22, 30, 3, 8), (20, 25, 3, 6), (25, 34, 3, 4)]:
        dx = sway if y < 32 else 0
        R(x+dx, y, x+dx+w, y+h, "#2f8f5b"); R(x+dx, y, x+dx+1, y+h, "#44c07d")
    # books
    R(210, 34, 220, 46, "#c2553b"); R(212, 36, 218, 38, "#f0c8b8")
    R(220, 38, 232, 46, "#3b6fc2"); R(222, 40, 230, 42, "#b8cdf0"); R(214, 30, 228, 34, "#e0b341")
    return im.resize((W*S, H*S), Image.NEAREST)

frames = [frame(t) for t in range(N)]
pal = frames[0].quantize(colors=64, method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE)
q = [f.quantize(palette=pal, dither=Image.Dither.NONE) for f in frames]
q[0].save("public/img/banner.gif", save_all=True, append_images=q[1:], duration=110, loop=0, optimize=True, disposal=1)
# Animated WebP: ~5x smaller than the GIF, used first by <picture>; GIF stays as fallback.
frames[0].save("public/img/banner.webp", save_all=True, append_images=frames[1:], duration=110, loop=0, lossless=True, quality=100, method=6)
print("ok", frames[0].size, len(q))

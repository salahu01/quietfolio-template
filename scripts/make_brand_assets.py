"""Generates favicon/app icons, OG image and the reduced-motion static banner from source art."""
import sys
from PIL import Image, ImageDraw, ImageFont, ImageOps

# Usage: python3 scripts/make_brand_assets.py "Your Name" "Your Role" "yourdomain.com"
NAME = sys.argv[1] if len(sys.argv) > 1 else "Alex Morgan"
ROLE = sys.argv[2] if len(sys.argv) > 2 else "Full Stack Developer"
DOMAIN = sys.argv[3] if len(sys.argv) > 3 else "example.com"

# icons from avatar (square crop, rounded)
av = Image.open("public/img/avatar.jpeg").convert("RGB")
def rounded(img, size, r):
    img = img.resize((size, size), Image.LANCZOS)
    m = Image.new("L", (size, size), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, size-1, size-1], r, fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0)); out.paste(img, (0, 0), m); return out
rounded(av, 192, 42).save("app/icon.png", optimize=True)
av.resize((180, 180), Image.LANCZOS).save("app/apple-icon.png", optimize=True)

# static banner = first frame of the GIF (reduced-motion users)
g = Image.open("public/img/banner.gif"); g.seek(8); g.convert("RGB").save("public/img/banner-static.png", optimize=True)

# OG image 1200x630
bg = Image.new("RGB", (1200, 630), "#0a0a0a")
ban = Image.open("public/img/banner-static.png").convert("RGB")
ban = ImageOps.fit(ban, (1200, 300), Image.NEAREST); bg.paste(ban, (0, 0))
ImageDraw.Draw(bg).rectangle([0, 300, 1200, 301], fill="#2a2a2a")
bg.paste(rounded(av, 150, 26), (70, 240), rounded(av, 150, 26))
d = ImageDraw.Draw(bg)
title = ImageFont.truetype("/System/Library/Fonts/NewYork.ttf", 68)
sub = ImageFont.truetype("/System/Library/Fonts/Menlo.ttc", 28)
d.text((70, 420), NAME, font=title, fill="#f5f5f4")
d.text((70, 515), ROLE, font=sub, fill="#a1a1aa")
d.text((70, 560), DOMAIN, font=sub, fill="#63636b")
bg.save("app/opengraph-image.png", optimize=True)
print("ok")

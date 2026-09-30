"""Converts project cover images to web-sized JPEGs (max 1280px wide) and updates nothing else.
Static hosts (GitHub Pages) have no image optimizer, so committed images must already be small."""
import sys, pathlib
from PIL import Image

root = pathlib.Path("public/img/projects")
for src in sorted(root.glob("*")):
    if src.suffix.lower() not in {".png", ".jpg", ".jpeg", ".webp"}: continue
    im = Image.open(src)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA"); bg = Image.new("RGB", im.size, "#111111"); bg.paste(im, mask=im.split()[-1]); im = bg
    else:
        im = im.convert("RGB")
    if im.width > 1280: im = im.resize((1280, round(im.height * 1280 / im.width)), Image.LANCZOS)
    out = src.with_suffix(".jpg")
    im.save(out, "JPEG", quality=82, optimize=True, progressive=True)
    if out != src: src.unlink()
    print(f"{out.name}: {out.stat().st_size // 1024} KB")

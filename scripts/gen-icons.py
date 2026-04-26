#!/usr/bin/env python3
"""Generate iOS touch icons + PWA icons from a procedural design.
Greenhouse Drift palette: leaf-deep + brass + cream.
"""
from PIL import Image, ImageDraw, ImageFont
import os
import sys

OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'icons')
os.makedirs(OUT_DIR, exist_ok=True)

LEAF_DEEP = (31, 77, 62)
LEAF_LIGHT = (127, 176, 105)
BRASS = (212, 163, 115)
CREAM = (244, 233, 216)
SUN_AMBER = (244, 162, 97)


def make_icon(size, padding_ratio=0.12):
    """Procedural icon: a stylized leaf with the letter M centered."""
    img = Image.new('RGB', (size, size), LEAF_DEEP)
    d = ImageDraw.Draw(img, 'RGBA')

    # Background gradient circle
    cx, cy = size // 2, size // 2
    r = int(size * 0.46)
    # Concentric circles for soft glow
    for i in range(3):
        alpha = 60 - i * 18
        rr = r + i * int(size * 0.04)
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=(*BRASS, alpha))

    # Inner leaf circle
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=LEAF_LIGHT)

    # Inner darker mask for depth
    rr = int(r * 0.85)
    d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=LEAF_DEEP)

    # Decorative leaves
    for ang_deg, leaf_r in [(35, 0.38), (-35, 0.38), (90, 0.38)]:
        import math
        ang = math.radians(ang_deg)
        lx = cx + int(math.cos(ang) * size * 0.20)
        ly = cy + int(math.sin(ang) * size * 0.20)
        lr = int(size * 0.13)
        d.ellipse([lx - lr, ly - lr, lx + lr, ly + lr], fill=(*LEAF_LIGHT, 230))

    # Center "M" letter (Mimi)
    try:
        font = ImageFont.truetype('/System/Library/Fonts/Supplemental/Georgia Bold.ttf', size=int(size * 0.42))
    except Exception:
        try:
            font = ImageFont.truetype('/System/Library/Fonts/Times.ttc', size=int(size * 0.42))
        except Exception:
            font = ImageFont.load_default()
    text = 'M'
    bbox = d.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx = cx - tw // 2 - bbox[0]
    ty = cy - th // 2 - bbox[1]
    # Soft shadow
    d.text((tx + 2, ty + 4), text, font=font, fill=(0, 0, 0, 120))
    d.text((tx, ty), text, font=font, fill=CREAM)

    # Tiny sun-amber dot accent
    dot_r = int(size * 0.04)
    d.ellipse([cx + r * 0.6 - dot_r, cy - r * 0.6 - dot_r,
               cx + r * 0.6 + dot_r, cy - r * 0.6 + dot_r], fill=SUN_AMBER)

    return img


def save(img, name):
    path = os.path.join(OUT_DIR, name)
    img.save(path, 'PNG', optimize=True)
    print(f'  written: {os.path.relpath(path)} ({os.path.getsize(path)} bytes)')


def main():
    print('Generating Mimi icons...')
    save(make_icon(180), 'apple-touch-icon-180.png')
    save(make_icon(192), 'icon-192.png')
    save(make_icon(512), 'icon-512.png')
    save(make_icon(32), 'favicon-32.png')
    print('Done.')


if __name__ == '__main__':
    main()

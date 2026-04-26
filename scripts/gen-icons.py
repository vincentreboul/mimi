#!/usr/bin/env python3
"""Generate pixel-art KORA icons.
Style: chunky, retro sci-fi, brass + cream + space-blue palette.
"""
from PIL import Image, ImageDraw
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'icons')
os.makedirs(OUT_DIR, exist_ok=True)

# Palette
SPACE_DEEP = (10, 18, 24)
SPACE_MID = (26, 58, 64)
BRASS = (212, 163, 115)
BRASS_DARK = (168, 122, 79)
CREAM = (244, 233, 216)
SKY = (168, 218, 220)
GREEN = (127, 176, 105)
AMBER = (244, 162, 97)
BLACK = (0, 0, 0)


def make_pixel_grid(size, grid_size=16):
    """Return a (cell_size, draw_pixel) helper."""
    cell = size // grid_size
    img = Image.new('RGB', (size, size), SPACE_DEEP)
    d = ImageDraw.Draw(img)

    def px(gx, gy, color):
        d.rectangle([gx * cell, gy * cell, (gx + 1) * cell - 1, (gy + 1) * cell - 1], fill=color)

    def line_h(gx0, gx1, gy, color):
        d.rectangle([gx0 * cell, gy * cell, (gx1 + 1) * cell - 1, (gy + 1) * cell - 1], fill=color)

    def line_v(gx, gy0, gy1, color):
        d.rectangle([gx * cell, gy0 * cell, (gx + 1) * cell - 1, (gy1 + 1) * cell - 1], fill=color)

    return img, px, line_h, line_v, cell


def make_icon(size):
    """Procedural pixel-art KORA icon: stylized planet + station ring."""
    img, px, line_h, line_v, cell = make_pixel_grid(size, 16)
    d = ImageDraw.Draw(img)

    # Background gradient (3-tone)
    for gy in range(16):
        if gy < 5:
            line_h(0, 15, gy, SPACE_DEEP)
        elif gy < 11:
            line_h(0, 15, gy, SPACE_MID)
        else:
            line_h(0, 15, gy, SPACE_DEEP)

    # Stars (a few scattered pixels)
    for gx, gy in [(2, 1), (13, 2), (4, 3), (11, 4), (1, 13), (14, 14), (3, 14), (10, 13)]:
        px(gx, gy, CREAM)

    # Planet body (centered, ~10x10 cells, lower portion)
    # We'll draw a 8-cell-wide "circle" approximation
    planet_color = SKY
    # Row by row: rough circle
    planet_pixels = [
        (4, 6), (5, 6), (6, 6), (7, 6), (8, 6), (9, 6), (10, 6), (11, 6),
        (3, 7), (4, 7), (5, 7), (6, 7), (7, 7), (8, 7), (9, 7), (10, 7), (11, 7), (12, 7),
        (2, 8), (3, 8), (4, 8), (5, 8), (6, 8), (7, 8), (8, 8), (9, 8), (10, 8), (11, 8), (12, 8), (13, 8),
        (2, 9), (3, 9), (4, 9), (5, 9), (6, 9), (7, 9), (8, 9), (9, 9), (10, 9), (11, 9), (12, 9), (13, 9),
        (2, 10), (3, 10), (4, 10), (5, 10), (6, 10), (7, 10), (8, 10), (9, 10), (10, 10), (11, 10), (12, 10), (13, 10),
        (3, 11), (4, 11), (5, 11), (6, 11), (7, 11), (8, 11), (9, 11), (10, 11), (11, 11), (12, 11),
        (4, 12), (5, 12), (6, 12), (7, 12), (8, 12), (9, 12), (10, 12), (11, 12),
    ]
    for gx, gy in planet_pixels:
        px(gx, gy, planet_color)

    # Continents (green patches)
    continents = [(4, 8), (5, 8), (5, 9), (6, 9), (10, 10), (11, 10), (10, 11), (9, 7), (10, 7)]
    for gx, gy in continents:
        px(gx, gy, GREEN)

    # Atmosphere highlight (top of planet — cream)
    px(7, 6, CREAM)
    px(8, 6, CREAM)

    # Ring/orbit — passing across the planet (brass band)
    # Top of ring (foreground)
    for gx in range(0, 16):
        if gy_line := 7:
            pass
    # Diagonal ring band
    ring_top = [(0, 9), (1, 8), (15, 8), (14, 9)]
    for gx, gy in ring_top:
        px(gx, gy, BRASS)
    # Ring around planet
    line_h(0, 15, 9, BRASS_DARK)
    # Re-paint planet body over the ring on the front part
    for gx in range(2, 14):
        if 9 <= gx <= 13:
            px(gx, 9, planet_color)
    # Re-paint continents over ring
    for gx, gy in continents:
        if gy == 9:
            px(gx, gy, GREEN)

    # Front of ring (over planet)
    for gx in range(3, 13):
        px(gx, 9, BRASS)
    # Restore continents on top of front ring
    for gx, gy in [(5, 9), (6, 9)]:
        px(gx, gy, GREEN)

    # Pixel sparkle on ring
    px(2, 9, AMBER)
    px(13, 9, AMBER)

    # Tiny "K" mark in upper-left (3-cell wide)
    # Skip for sub-32 size (too small)
    if size >= 192:
        # Draw "K" as pixels at top-left
        k_pixels = [
            (1, 1), (2, 1), (3, 1),  # top of K
            (1, 2), (3, 2),
            (1, 3), (2, 3),
            (1, 4), (3, 4),
            (1, 5), (3, 5),
        ]
        # actually a proper K letter
        k = [
            (1, 1), (1, 2), (1, 3), (1, 4), (1, 5),  # vertical stem
            (3, 1), (2, 2), (3, 5), (2, 4),  # diagonals
        ]
        # better K
        k = [
            (1, 1), (1, 2), (1, 3), (1, 4), (1, 5),  # left bar
            (3, 1), (2, 2), (2, 3), (3, 4), (3, 5),  # right diagonals
        ]
        # Skip K for cleaner look
    return img


def save(img, name):
    path = os.path.join(OUT_DIR, name)
    img.save(path, 'PNG', optimize=True)
    print(f'  written: {os.path.relpath(path)} ({os.path.getsize(path)} bytes)')


def main():
    print('Generating pixel-art KORA icons...')
    save(make_icon(180), 'apple-touch-icon-180.png')
    save(make_icon(192), 'icon-192.png')
    save(make_icon(512), 'icon-512.png')
    save(make_icon(32), 'favicon-32.png')
    print('Done.')


if __name__ == '__main__':
    main()

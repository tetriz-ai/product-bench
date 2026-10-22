#!/usr/bin/env python3
# Copyright 2026 Workloom Solutions Private Limited
# SPDX-License-Identifier: MIT
"""Render a four-scene, code-drawn motion demo. Requires Pillow; no network or model."""

import argparse
import json
import math
from itertools import pairwise
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H, FPS, STEPS = 1200, 760, 10, 45
BG, INK, MUTED, LINE = "#f7f7f3", "#172a32", "#68767b", "#dce2df"
GREEN = "#258268"
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("--preview-dir", type=Path)
args = parser.parse_args()
ROOT = Path(__file__).resolve().parents[2]
CFG = json.loads((ROOT / ".github/assets/demo/story.json").read_text())
ACCENT = CFG["accent"]
for evidence in CFG.get("evidence", []):
    if evidence["contains"] not in (ROOT / evidence["path"]).read_text():
        raise ValueError("Demo evidence changed: " + evidence["path"])


def font(size, bold=False):
    paths = [
        Path("/System/Library/Fonts/Supplemental")
        / ("Arial Bold.ttf" if bold else "Arial.ttf"),
        Path("/usr/share/fonts/truetype/dejavu")
        / ("DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"),
    ]
    for p in paths:
        if p.exists():
            return ImageFont.truetype(str(p), size)
    raise SystemExit("Install Arial or DejaVu Sans to render the demo.")


def ease(t):
    t = min(1, max(0, t))
    return t * t * (3 - 2 * t)


def mix(a, b, t):
    t = min(1, max(0, t))
    a, b = tuple(bytes.fromhex(a.lstrip("#"))), tuple(bytes.fromhex(b.lstrip("#")))
    return tuple(round(x + (y - x) * t) for x, y in zip(a, b))


def label(d, xy, value, size=22, color=INK, bold=False, center=False, width=None):
    f = font(size, bold)
    if width:
        while d.textlength(value, font=f) > width and size > 15:
            size -= 1
            f = font(size, bold)
        if d.textlength(value, font=f) > width:
            raise ValueError("Text does not fit: " + value)
    d.text(xy, value, font=f, fill=color, anchor="mm" if center else "lt")


def panel(d, box, fill="white", outline=LINE, radius=18, stroke=2):
    d.rounded_rectangle(box, radius, fill=fill, outline=outline, width=stroke)


def badge(d, x, y, value, color=None, width=150):
    color = color or ACCENT
    panel(
        d,
        (x - width / 2, y - 19, x + width / 2, y + 19),
        fill=mix("#ffffff", color, 0.10),
        outline=mix("#ffffff", color, 0.2),
    )
    label(d, (x, y), value, 17, color, True, True, width - 18)


def icon(d, x, y, kind="doc", color=None, scale=1):
    c, s = color or ACCENT, scale
    if kind == "check":
        d.line(
            [(x - 13 * s, y), (x - 3 * s, y + 10 * s), (x + 17 * s, y - 13 * s)],
            fill=c,
            width=max(2, int(4 * s)),
        )
    elif kind == "person":
        d.ellipse((x - 9 * s, y - 21 * s, x + 9 * s, y - 3 * s), outline=c, width=3)
        d.arc(
            (x - 20 * s, y - 3 * s, x + 20 * s, y + 30 * s), 180, 360, fill=c, width=3
        )
    elif kind == "chart":
        for i, h in enumerate((14, 27, 39)):
            d.rounded_rectangle(
                (
                    x - 22 * s + i * 17 * s,
                    y + 19 * s - h * s,
                    x - 12 * s + i * 17 * s,
                    y + 19 * s,
                ),
                3,
                fill=c,
            )
    elif kind == "search":
        d.ellipse((x - 20 * s, y - 22 * s, x + 8 * s, y + 6 * s), outline=c, width=3)
        d.line((x + 5 * s, y + 5 * s, x + 22 * s, y + 22 * s), fill=c, width=4)
    else:
        d.rounded_rectangle(
            (x - 18 * s, y - 24 * s, x + 18 * s, y + 24 * s), 5, outline=c, width=3
        )
        for offset in (-10, 0, 10):
            d.line(
                (x - 9 * s, y + offset * s, x + 9 * s, y + offset * s), fill=c, width=2
            )


def wire(d, start, end, t, color=None, offset=0):
    c = color or ACCENT
    d.line((start, end), fill=mix("#ffffff", c, 0.22), width=3)
    p = (t * 1.2 + offset) % 1
    x, y = start[0] + (end[0] - start[0]) * p, start[1] + (end[1] - start[1]) * p
    d.ellipse((x - 5, y - 5, x + 5, y + 5), fill=c)


def flow(d, points, t, color=None):
    c = color or ACCENT
    d.line(points, fill=mix("#ffffff", c, 0.25), width=4, joint="curve")
    lengths = [math.dist(a, b) for a, b in pairwise(points)]
    travel = (t % 1) * sum(lengths)
    for i, length in enumerate(lengths):
        if travel <= length:
            f = travel / length
            a, b = points[i : i + 2]
            x, y = a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f
            d.ellipse((x - 6, y - 6, x + 6, y + 6), fill=c)
            return
        travel -= length


def brain(d, x, y, r, t):
    pulse = 4 * math.sin(t * math.pi * 2)
    d.ellipse(
        (
            x - r - 16 - pulse,
            y - r - 16 - pulse,
            x + r + 16 + pulse,
            y + r + 16 + pulse,
        ),
        outline=mix("#ffffff", ACCENT, 0.22),
        width=2,
    )
    d.ellipse((x - r, y - r, x + r, y + r), fill=ACCENT)
    size = max(22, min(34, round(r * 0.34)))
    label(d, (x, y - size * 0.55), "Product", size, "white", True, True)
    label(d, (x, y + size * 0.65), "Bench", size, "white", True, True)


def tile(d, x, y, title, kind="doc", width=175):
    panel(d, (x - width / 2, y - 48, x + width / 2, y + 48))
    icon(d, x - width / 2 + 32, y, kind, scale=0.65)
    label(d, (x - width / 2 + 59, y - 11), title, 21, bold=True, width=width - 72)


def doc(d, x, y, w=270, h=290, title="Draft", tag=None, color=None):
    panel(d, (x, y, x + w, y + h))
    color = color or ACCENT
    icon(d, x + 36, y + 40, color=color, scale=0.65)
    label(d, (x + 65, y + 31), title, 23, bold=True, width=w - 85)
    for i, frac in enumerate((0.78, 0.92, 0.61, 0.86, 0.69)):
        yy = y + 92 + i * 29
        d.rounded_rectangle(
            (x + 25, yy, x + 25 + (w - 50) * frac, yy + 7),
            3,
            fill=mix("#ffffff", INK, 0.14),
        )
    if tag:
        badge(d, x + w / 2, y + h - 35, tag, color, w - 44)


def draw_brain(d, scene, t):
    if scene == 0:
        positions = [
            (175, 310),
            (405, 310),
            (175, 440),
            (405, 440),
            (175, 570),
            (405, 570),
        ]
        for i, (pos, title) in enumerate(zip(positions, CFG["inputs"])):
            wire(d, (pos[0] + 75, pos[1]), (850, 440), t, offset=i / 6)
            tile(d, *pos, title, width=185)
        brain(d, 850, 440, 105, t)
        label(d, (850, 590), "Your product brain", 31, bold=True, center=True)
        badge(d, 850, 645, "Human-reviewed", GREEN, 190)
    elif scene == 1:
        positions = [
            (220, 310),
            (220, 555),
            (600, 640),
            (980, 555),
            (980, 310),
            (600, 240),
        ]
        for i, (pos, title) in enumerate(zip(positions, CFG["outputs"])):
            wire(d, (600, 445), pos, t, offset=i / 6)
            tile(
                d,
                *pos,
                title,
                "search" if i == 0 else "chart" if i == 5 else "doc",
                width=180,
            )
        brain(d, 600, 445, 85, t)
        badge(d, 600, 560, "Shared context", ACCENT, 190)
    elif scene == 2:
        doc(d, 70, 300, 240, 260, "Evidence", "Fictional input")
        wire(d, (310, 430), (520, 430), t)
        brain(d, 520, 430, 65, t)
        wire(d, (585, 430), (760, 430), t, offset=0.5)
        doc(d, 760, 240, 350, 390, "Resumable imports", "8-section spec")
        badge(d, 935, 475, "Acceptance cases", GREEN, 260)
        badge(d, 935, 528, "Open decisions", ACCENT, 260)
    else:
        brain(d, 270, 430, 85, t)

        wire(d, (355, 430), (575, 430), t)
        tile(d, 660, 430, "Proposed update", width=225)
        wire(d, (772, 430), (960, 430), t, offset=0.4)
        d.ellipse(
            (935, 395, 1005, 465),
            fill=mix("#ffffff", GREEN, 0.1),
            outline=GREEN,
            width=2,
        )
        icon(d, 970, 430, "check" if t > 0.5 else "person", GREEN)
        label(d, (970, 507), "Your approval", 24, bold=True, center=True)
        if t > 0.5:
            flow(
                d,
                [(970, 470), (970, 635), (270, 635), (270, 520)],
                (t - 0.5) * 2,
                GREEN,
            )
        badge(d, 615, 635, "Apply approved edits", GREEN, 235)
        badge(d, 270, 550, "Shared knowledge", ACCENT, 230)


DRAW = draw_brain


def render(scene, t):
    im = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(im)
    label(d, (52, 32), CFG["brand"], 18, ACCENT, True)
    label(d, (52, 101), CFG["titles"][scene], 49, bold=True, width=1095)
    for i in range(4):
        d.ellipse(
            (1050 + i * 26, 37, 1058 + i * 26, 45), fill=ACCENT if i == scene else LINE
        )
    DRAW(d, scene, t)
    d.line((52, 712, 1148, 712), fill=LINE, width=1)
    label(d, (52, 731), CFG["footers"][scene], 15, MUTED, width=1095)
    return im


# All four keyframes contribute to one palette, keeping colors stable during motion.
keys = [render(i, 1) for i in range(4)]
atlas = Image.new("RGB", (W, H * 4))
for i, im in enumerate(keys):
    atlas.paste(im, (0, H * i))
palette = atlas.quantize(colors=128)
frames = []
for scene in range(4):
    previous = keys[(scene - 1) % 4]
    for step in range(STEPS):
        frame = render(scene, step / (STEPS - 1))
        if scene and step < 4:
            frame = Image.blend(previous, frame, (step + 1) / 4)
        frames.append(frame.quantize(palette=palette, dither=Image.Dither.NONE))
out = ROOT / ".github/assets/demo.gif"
frames[0].save(
    out,
    save_all=True,
    append_images=frames[1:],
    duration=1000 // FPS,
    loop=0,
    optimize=True,
    disposal=1,
)
if args.preview_dir:
    args.preview_dir.mkdir(parents=True, exist_ok=True)
    for i, im in enumerate(keys):
        im.save(args.preview_dir / f"scene-{i + 1}.png")
print(
    f"{out}: {len(frames)} frames, {len(frames) / FPS:.1f}s, {out.stat().st_size} bytes"
)

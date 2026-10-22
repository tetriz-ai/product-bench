#!/usr/bin/env python3
# Copyright 2026 Workloom Solutions Private Limited
# SPDX-License-Identifier: MIT
"""Generate a terminal demo from the actual offline example. Requires Pillow."""
from pathlib import Path
import subprocess
from PIL import Image, ImageDraw, ImageFont

root = Path(__file__).resolve().parents[2]
command = 'node examples/inspect-install/run.mjs'
result = subprocess.run(['node', 'examples/inspect-install/run.mjs'], cwd=root,
                        check=True, capture_output=True, text=True, timeout=30)
fonts = ['/System/Library/Fonts/Menlo.ttc',
         '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf']
font = next((ImageFont.truetype(path, 17) for path in fonts if Path(path).exists()),
            ImageFont.load_default(size=17))
lines = ['$ ' + command, *result.stdout.strip().splitlines()]
# Wrap the long JSON at field boundaries so the entire result stays readable.
lines[-1] = lines[-1].replace(',"', ',\n  "')
frames = []
for count in range(1, len(lines) + 1):
    frame = Image.new('RGB', (1000, 390), '#14213d')
    draw = ImageDraw.Draw(frame)
    draw.text((32, 24), 'Product Bench | offline fictional example', font=font, fill='#b4c5df')
    draw.multiline_text((32, 74), '\n\n'.join(lines[:count]), font=font,
                        fill='#f4f6fb', spacing=6)
    frames.append(frame)
frames[0].save(root / '.github/assets/installation.gif', save_all=True,
               append_images=frames[1:], duration=[1200, 1000, 1000, 4500], loop=0)

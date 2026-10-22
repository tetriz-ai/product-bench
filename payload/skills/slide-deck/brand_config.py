# Copyright 2026 Workloom Solutions Private Limited
# SPDX-License-Identifier: MIT
"""Approved task brand inputs and neutral preview defaults; no network discovery."""
import json
import re
from pathlib import Path

DEFAULTS = {
    "name": "Example", "tagline": "Neutral layout preview", "sender": "",
    "website": "", "confidentiality": "Draft · Neutral preview",
    "display_font": "system-ui, Arial, sans-serif",
    "body_font": "system-ui, Arial, sans-serif",
    "tokens": {
        "t50": "#f8fafc", "t100": "#e2e8f0", "t200": "#cbd5e1", "t300": "#94a3b8",
        "t500": "#64748b", "t700": "#475569", "t900": "#1e293b", "t950": "#0f172a",
        "muted": "#64748b", "subtle": "#f1f5f9", "alarm": "#b91c1c",
        "alarmTint": "#fef2f2", "positive": "#15803d", "canvas": "#ffffff",
        "canvasInk": "#0f172a", "dark": "#1e293b", "darkInk": "#ffffff"
    }
}
# Old token names remain accepted as semantic compatibility aliases only.
TOKEN_ALIASES = {"mineral": "muted", "linen": "subtle"}


def load_brand(path=None):
    data = json.loads(Path(path).read_text()) if path else {}
    supplied = data.get("tokens", {})
    tokens = {TOKEN_ALIASES.get(key, key): value for key, value in supplied.items()}
    result = {**DEFAULTS, **data, "tokens": {**DEFAULTS["tokens"], **tokens}}
    if path and result.get("logo_path"):
        result["logo_path"] = str((Path(path).resolve().parent / result["logo_path"]).resolve())
    return result


def brand_css(brand):
    rules = []
    for key, value in brand["tokens"].items():
        key = TOKEN_ALIASES.get(key, key)
        if key not in DEFAULTS["tokens"] or not isinstance(value, str) or not re.fullmatch(r"#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})", value):
            raise ValueError(f"Invalid brand token {key}: {value}")
        rules.append(f"--{key}:{value}")
    for key, field in [("f-display", "display_font"), ("f-body", "body_font")]:
        value = brand[field]
        if not isinstance(value, str) or any(c in value for c in "{};<>\n"):
            raise ValueError("Invalid font family")
        rules.append(f"--{key}:{value}")
    return ":root{" + ";".join(rules) + "}"

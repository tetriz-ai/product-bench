# Copyright 2026 Workloom Solutions Private Limited
# SPDX-License-Identifier: MIT
"""Reviewed brand inputs and neutral preview defaults; no network or asset discovery."""
import json, re
from pathlib import Path
DEFAULTS = {
    "name": "Example", "tagline": "Neutral layout preview", "sender": "",
    "website": "", "confidentiality": "Draft · Neutral preview",
    "display_font": "Arial, sans-serif", "body_font": "Arial, sans-serif",
    "tokens": {"t50":"#f8fafc", "t100":"#e2e8f0", "t200":"#cbd5e1", "t300":"#94a3b8",
               "t500":"#64748b", "t700":"#475569", "t900":"#1e293b", "t950":"#0f172a",
               "mineral":"#64748b", "linen":"#f1f5f9", "alarm":"#b91c1c", "positive":"#15803d"}
}
def load_brand(path=None):
    data=json.loads(Path(path).read_text()) if path else {}
    result={**DEFAULTS, **data, "tokens":{**DEFAULTS["tokens"], **data.get("tokens",{})}}
    if path and result.get("logo_path"):
        result["logo_path"]=str((Path(path).resolve().parent / result["logo_path"]).resolve())
    return result

def brand_css(brand):
    rules=[]
    for key,value in brand["tokens"].items():
        if key not in DEFAULTS["tokens"] or not isinstance(value, str) or not re.fullmatch(r"#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})", value):
            raise ValueError(f"Invalid brand token {key}: {value}")
        rules.append(f"--{key}:{value}")
    for key,field in [("f-display","display_font"),("f-body","body_font")]:
        value=brand[field]
        if not isinstance(value, str) or not value.strip() or any(c in value for c in "{};<>\n"):
            raise ValueError("Invalid font family")
        rules.append(f"--{key}:{value}")
    return ":root{"+";".join(rules)+"}"

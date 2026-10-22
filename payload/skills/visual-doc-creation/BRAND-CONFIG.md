# Reviewed brand inputs

Reuse identity, tokens, typography and assets from reviewed context or explicit task instructions. Materialize them in a build-local `brand.json` without a separate questionnaire or renewed approval for supplied inputs. Missing nonessential choices can use the clearly labeled neutral preview defaults; do not imply those defaults are approved branding.

Supported fields: `name`, `tagline`, `sender`, `website`, `confidentiality`, `display_font`, `body_font`, `tokens`, optional `logo_path`, and optional `font_url` (flow renderer). Relative logos resolve relative to the config file. Token keys `t50` through `t950`, `mineral`, `linen`, `alarm`, and `positive` are legacy CSS aliases; they do not mandate teal or any semantic use of color. Hex values and font-family strings are validated before injection.

Defaults use slate, Arial/Helvetica-compatible system fonts, no contact or website, and a draft label. The neutral mark is a synthetic preview asset. For final output, apply required reviewed identity and available evidence under the user's task.

`flow_renderer.py --brand-config /path/brand.json` and `build_trial_report.py --brand-config /path/brand.json` apply token overrides. A working copy of `TEMPLATE.html` must append `brand_css(load_brand(path))` overrides after its CSS. Layout choices remain separate `FlowConfig` inputs.

No fonts load from the network by default. A flow `font_url` loads only the supplied reviewed stylesheet. For local branded fonts, add reviewed `@font-face` declarations to the working HTML. Check actual loading and embedding; header/footer templates use an independent font context. See [PRINCIPLES.md](PRINCIPLES.md).

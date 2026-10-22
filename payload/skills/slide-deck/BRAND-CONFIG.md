# Approved brand context

Inherit approved brand identity, typography, palette, marks, surface choices and assets from the reviewed context or the task itself. Materialize those inputs in a build-local `brand.json`. Do not start a separate setup questionnaire or re-approve choices already supplied. When identity inputs are absent, use neutral previews and report the missing inputs as a final brand fidelity gap.

Supported fields: `name`, `tagline`, `sender`, `website`, `confidentiality`, `display_font`, `body_font`, `tokens` and optional `logo_path`. Relative logo paths resolve relative to the config file. Font family declarations do not load fonts: add only approved local `@font-face` assets or an explicitly supplied approved font stylesheet during HTML authoring. Verify actual loaded and PDF embedded fonts before claiming fidelity.

Tokens: `t50`, `t100`, `t200`, `t300`, `t500`, `t700`, `t900`, `t950` are tonal layout slots; `muted`, `subtle`, `alarm`, `alarmTint`, `positive` are semantic roles; `canvas`, `canvasInk`, `dark`, `darkInk` govern surface and contrasting ink. Map approved colors to these roles rather than inheriting a sample palette. Legacy `mineral` and `linen` input keys map to `muted` and `subtle` for compatibility only. A legacy `forest` class, surface or template key means dark, not a forest color identity.

Apply `brand_css(load_brand(path))` after the Pattern Library CSS, then inject approved wordmark/logo and footer content. Choose light or dark surfaces and optional decoration from the approved identity. Geometry samples do not mandate a dark cover, surface cadence, arrow eyebrows, texture or oversized background numerals. Review inline styles when adapting a sample to another surface.

The neutral defaults use slate, system fonts, a draft label, no contact details and no external font fetches. `brand-config.example.json` is a synthetic preview example, not an approved company identity. Final output must flag missing identity, assets or loaded font fidelity honestly.

# Renderer constraints

This file is a technical reference, not a company decision log. Task-specific design decisions belong with the output and do not change skill defaults.

- **Fixed pages can silently clip.** Measure final content against footer bounds; export success alone does not establish fit.
- **Fonts affect pagination.** Wait for font readiness before measuring, and inspect actual PDF embedding. Header/footer templates have a separate font context.
- **Raw HTML can suppress Markdown.** Each image-containing custom div needs `markdown="1"`; native table cells are pre-rendered separately.
- **Screenshot sizing differs from logo sizing.** Row classes override `.dash-img` dimensions while preserving asset aspect ratio.
- **Page margins bound printable overflow.** Full bleed requires matching CSS and PDF side margins; negative margins alone are insufficient.
- **Contextual headers require multiple PDFs.** One Chromium header template cannot select a different active section for each physical page. The renderer maps extracted numbered openers, renders variants and stitches matching pages.
- **Missing evidence must not become visual proof.** Missing required assets fail; synthetic previews remain visibly synthetic.

See [PRINCIPLES.md](PRINCIPLES.md) for implementation details and verification.

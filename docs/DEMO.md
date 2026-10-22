# Product-brain demo

The 18-second animation presents Product Bench as a shared product brain: reviewed
customer, product, market, strategy, engineering and decision context feeds research,
strategy, specs, GTM, content and analytics. Proposed knowledge updates pass through
human approval before application.

This is a workflow illustration, not a live agent recording or shipped dashboard.
The fictional [resumable-import spec](examples/spec.md) grounds the spec scene. The
actual offline [render-spec example](../examples/render-spec/) was run; its output
is retained in [render-spec.txt](../.github/assets/demo/render-spec.txt). That verifies
rendering and eight sections, not model quality, acceptance tests or customer outcomes.
Content and live analytics still require their configured integrations.

## Reproduce

Use Node.js 22+, Python 3.12 and a temporary Python environment with
`.github/assets/requirements.txt` installed. From the repo root:

```sh
node examples/render-spec/run.mjs > .github/assets/demo/render-spec.txt
python .github/assets/render-visual-demo.py --preview-dir /tmp/product-brain-demo
```

The renderer draws the artwork and motion from `story.json`; no font binary, model,
credentials or live service is required. Arial on macOS or DejaVu Sans on Linux
supplies the type. Inspect every keyframe and the animation before committing.
The workflow uploads the GIF as an artifact and does not commit it automatically.

The previous [installation GIF](../.github/assets/installation.gif) remains available.
`python .github/assets/render-demo.py` refreshes it from the actual packed-CLI
[offline example](../examples/inspect-install/). Healthy installation and fictional
analytics do not verify a live workflow. Pillow attribution is in
[THIRD-PARTY-NOTICES.md](../THIRD-PARTY-NOTICES.md#demo-capture).

The README uses a static first-frame preview. Open its linked GIF to play the animation.
Regenerate the preview after rendering:

```sh
python -c "from PIL import Image; im = Image.open('.github/assets/demo.gif'); im.seek(0); im.convert('RGB').save('.github/assets/demo-static.png', optimize=True)"
```

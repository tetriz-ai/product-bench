# Third-party notices

Product Bench's project-owned material is licensed under the [MIT License](LICENSE).
The third-party material below retains its upstream license and attribution.

## SEO & GEO Skills Library

The 20 bundled `seo-*` skills are third-party marketplace skills from
[Aaron He Zhu's SEO & GEO Skills Library](https://github.com/aaron-he-zhu/seo-geo-claude-skills).
The upstream library is distributed through [ClawHub](https://clawhub.ai) and
[skills.sh](https://skills.sh).

- Copyright: **2024 Aaron He Zhu**, as stated in the upstream license.
- License: **Apache License 2.0**. The complete text is bundled at
  [LICENSE](payload/skills/seo-memory-management/upstream-shared/LICENSE).
- Included material: all 20 `payload/skills/seo-*` directories and their supporting
  references, including shared instructions and benchmarks under
  `seo-memory-management/upstream-shared/`.
- Bundled skill versions: frontmatter declares version 6.0.0, except memory
  management at 7.0.0. These are adapted files; no single upstream commit is
  asserted for all base skill files. Distributed files have individual hashes.
- Shared dependency revision: contracts, benchmarks, wiki instructions, and
  license correspond to upstream commit
  [`406239d0bb699fa8cc670e7627e03af561da1eb7`](https://github.com/aaron-he-zhu/seo-geo-claude-skills/tree/406239d0bb699fa8cc670e7627e03af561da1eb7).
  No upstream `NOTICE` file exists in that snapshot.
- Product Bench modifications: host-compatible frontmatter, local reference
  links, caller-supplied context/voice/output paths, explicit provider availability,
  the imported Editorial Draft handoff, and whitespace normalization. Original author and license declarations are retained.

The [version and file inventory](docs/THIRD-PARTY-PROVENANCE.json) records the
public upstream URLs, declared versions, distributed hashes, and shared dependency
revision. Installed copies retain the skill metadata and full license; this notice
and inventory are also copied into the installed runtime.

The Apache license above applies to the listed SEO material. Other bundled skills
are covered by the project's MIT License. Optional Buzz imports retain their
own upstream checkout and notices.

## CITE and CORE-EEAT benchmark references

The adapted shared references `cite-domain-rating.md` and `core-eeat-benchmark.md`
include MIT material from [cite-domain-rating](https://github.com/aaron-he-zhu/cite-domain-rating/tree/2e669c5c801aca6bc8c5f5df3b94ac734f00ff52)
and [core-eeat-content-benchmark](https://github.com/aaron-he-zhu/core-eeat-content-benchmark/tree/2a04c2f7c0010d6ed2102ff606f6032d4267b0dc).
Both carry Copyright (c) 2026 Aaron. Full permission notices are distributed in
[CITE-LICENSE](payload/skills/seo-memory-management/upstream-shared/CITE-LICENSE)
and [CORE-EEAT-LICENSE](payload/skills/seo-memory-management/upstream-shared/CORE-EEAT-LICENSE).
The copied O05 content-type/schema mapping in
`payload/skills/seo-schema-markup-generator/SKILL.md` also includes CORE-EEAT MIT
material with the same copyright and permission notice.
These MIT notices supplement the SEO library's Apache-2.0 adaptation terms.

## Contributor Covenant

[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) adapts Contributor Covenant 2.1 under
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Its Enforcement and
Enforcement Guidelines sections and associated Mozilla attribution are removed.

## Optional Python renderers

Optional renderers use separately installed Python packages; these packages are
not vendored in Product Bench and are not Node dependencies. The audited
resolution included Playwright 1.60.0 (Apache-2.0), pyee 13.0.1 (MIT), greenlet
3.2.5 (MIT AND Python-2.0), and typing_extensions 4.16.0 (PSF-2.0). These are
observed versions, not dependency pins. The renderer requirements also include
Markdown (BSD-3-Clause) and pypdf (BSD-3-Clause); their installed distributions
carry their full notices.

An additional isolated Python 3.12 verification resolved Playwright 1.63.0
(Apache-2.0), greenlet 3.5.6 (MIT AND PSF-2.0), pyee 13.0.1 (MIT),
typing_extensions 4.16.0 (PSF-2.0), Markdown 3.11 (BSD-3-Clause) and pypdf
6.20.1 (BSD-3-Clause). These are observed resolutions; [the CI verification requirements](scripts/renderer-requirements.txt) pin them for reproducibility, while bundled skills retain compatibility ranges. The newer
greenlet distribution declares PSF-2.0 instead of the older Python-2.0 term.
The approved optional renderer PSF-2.0 terms remain in force.

The dependency chains are Playwright → greenlet and Playwright → pyee →
typing_extensions. This release's dependency policy explicitly permits the
listed greenlet and typing_extensions licenses for the optional renderers;
the project's MIT License does not replace their upstream terms.

See the public package sources for [Playwright](https://pypi.org/project/playwright/),
[pyee](https://pypi.org/project/pyee/),
[greenlet](https://pypi.org/project/greenlet/), and
[typing_extensions](https://pypi.org/project/typing-extensions/), and the upstream
[greenlet MIT notice](https://github.com/python-greenlet/greenlet/blob/master/LICENSE),
[greenlet Python license](https://github.com/python-greenlet/greenlet/blob/master/LICENSE.PSF),
and [typing_extensions license](https://github.com/python/typing_extensions/blob/main/LICENSE).
Upstream distributions carry their full notices. If these dependencies are
bundled or redistributed, retain the notices required by their upstream licenses.

Renderer package sources: [Markdown](https://pypi.org/project/Markdown/) and [pypdf](https://pypi.org/project/pypdf/). Their terms remain separate from the project MIT License.

## Demo capture

The optional GIF capture tool separately installs Pillow 13.0.0, declared in [.github/assets/requirements.txt](.github/assets/requirements.txt). Pillow uses MIT-CMU terms; its upstream distribution retains the full license and copyright notices. It is not vendored, installed by the Product Bench CLI or included in the npm package.

See [Pillow's package source](https://pypi.org/project/pillow/13.0.0/) and [upstream license](https://github.com/python-pillow/Pillow/blob/13.0.0/LICENSE). These dependency terms remain separate from Product Bench's MIT License.

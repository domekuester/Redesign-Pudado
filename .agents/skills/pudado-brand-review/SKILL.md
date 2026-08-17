---
name: pudado-brand-review
description: Review Pudado's rendered visual brand for Royal Blue consistency, restrained color use, Cabinet Grotesk/Inter hierarchy, card styling, radii, borders, shadows, spacing rhythm, CTA hierarchy, image direction, and calm premium coherence. Use for design audits, visual polish requests, component reviews, or before approving brand-affecting UI changes. Diagnose from rendered output and do not redesign or edit during review-only work.
---

# Pudado brand review

Read `AGENTS.md`, brand/design sections in `CLAUDE.md`,
`pdos/00-core/README.md`, and `pdos/02-brand-design/README.md`. Use `$visual-qa`
for browser setup and evidence.

## Review criteria

Inspect relevant pages at mobile and desktop, including component states. Check:

- Royal Blue (`--blue`) remains the single brand accent;
- `--sage` appears only for semantic status, not decoration;
- no unapproved turquoise, raw selector colors, generic AI gradients, or
  competing saturated accents;
- Cabinet Grotesk leads headings and Inter supports body copy with a clear,
  economical hierarchy;
- cards share deliberate padding, cool borders, restrained shadows, and the
  established radius language rather than near-duplicate variants;
- section spacing creates calm rhythm without dead space or crowding;
- primary, secondary, and link CTAs remain visually and verbally distinct;
- icon weight, image crop, natural materials, and bathroom context feel
  consistent rather than stock-shop or clinical;
- animation supports comprehension and polish without spectacle;
- trust, privacy, product-development honesty, accessibility, and readability
  are not traded for visual novelty or conversion pressure.

Compare computed styles and `style.css` tokens when inconsistency is suspected.
Use `node .claude/scripts/check-tokens.js` for mechanical token/image checks,
but do not mistake a passing script for visual consistency.

## Report

Group findings as brand-breaking, inconsistent, or refinement. Cite viewport,
page/section, rendered evidence, and relevant token/component. Recommend the
smallest system-aligned correction. Do not propose a broad redesign when an
existing component or token solves the issue. Remain read-only unless the user
asks for implementation; then hand confirmed issues to `ui_fixer`.

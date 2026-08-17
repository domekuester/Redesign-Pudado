---
name: pudado-responsive-audit
description: Audit the real rendered Pudado website at 1280px or wider, 1024px, 768px, 430px, 390px, and 375px for overflow, clipping, wrapping, spacing, image crops, navigation, touch targets, responsive transitions, animation regressions, and visual consistency. Use after responsive/layout changes, before flagship or release approval, or whenever breakpoint safety is requested. Requires browser rendering; source-only review is insufficient.
---

# Pudado responsive audit

Read `AGENTS.md`, the mobile-first and visual QA sections in `CLAUDE.md`, and
`.claude/skills/visual-qa/SKILL.md`. Use the configured Browser/Playwright MCP;
do not install another browser tool.

## Prepare

Start the appropriate local server and use cache-busted URLs as described by
`$visual-qa`. After every navigation, reveal `.reveal` elements, disable smooth
scroll for inspection, and load lazy images. Avoid full-page homepage captures.

## Required viewport matrix

Test in this order to expose mobile constraints early, then confirm expansion:

1. 375px
2. 390px
3. 430px
4. 768px
5. 1024px
6. 1280px or wider

Use a consistent practical height such as 900px unless the issue requires a
specific device height. At every width, verify:

- `scrollWidth <= innerWidth` and no clipped off-canvas content;
- header, mobile menu, language switch, sticky CTA, and focus order;
- heading/button/card wrapping in DE, EN, and FR where relevant;
- section spacing, grid transitions, alignment, and content order;
- images retain intended crop/proportion and do not cause layout shift;
- touch targets are at least 44×44px on coarse/mobile layouts;
- reveal/scroll behavior works and reduced motion remains usable;
- affected CTAs, FAQ, calculator, checker, and form behavior;
- no new console errors or failed local assets.

Treat 768px, 1024px, and the established CSS media-query boundaries as
transition zones, not only representative screenshots. Explicitly verify the
three-child `#insight .duel.comparison` grid is one column on mobile.

## Report

Produce a viewport matrix with pass/fail and concise evidence. For each defect,
name the narrowest failing range, page/section, symptom, reproduction, and
likely owning CSS/HTML/JS. Distinguish site bugs from browser emulation or
screenshot artifacts. Do not edit during audit-only work. State that Safari/iOS
is unverified unless it was tested in an actual suitable environment.

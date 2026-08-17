---
name: visual-qa
description: Inspect the rendered Pudado website for visual regressions, premium design quality, responsive behavior, typography, spacing, image proportions, overflow, animation, focus states, and console errors. Use after any HTML/CSS/motion/UI change, before calling a visual change complete, or whenever a user asks to inspect, compare, polish, or diagnose the live interface. Do not use source inspection alone as visual evidence.
---

# Pudado visual QA

Read `AGENTS.md`, the visual rules in `CLAUDE.md`, and
`.claude/skills/visual-qa/SKILL.md`. Treat the latter as a read-only record of
known Pudado browser pitfalls.

## Prepare

1. Inspect `git status` and identify the pages and components affected.
2. Prefer the configured in-app Browser/Playwright MCP. Do not install another
   browser server.
3. Start `python3 -m http.server 8899` for layout and interaction checks. Use
   `node .claude/skills/visual-qa/serve.mjs` on port 8900 only for Lighthouse or
   reported performance numbers.
4. Open a cache-busted URL, for example `?fresh=<timestamp>`.
5. After each navigation, add `in-view` to every `.reveal`, set root
   `scrollBehavior` to `auto`, and scroll once to load lazy images.

## Inspect rendered output

Test 375px first, then 768px and 1280px. If the task is a full responsive
audit, invoke `$pudado-responsive-audit` instead and use its full viewport set.

At each relevant viewport, inspect:

- spacing rhythm and section boundaries;
- Cabinet Grotesk/Inter hierarchy, wrapping, clipping, and readable measure;
- image crop, intrinsic proportions, sharpness, loading, and reserved space;
- grid/flex alignment, overlap, horizontal overflow, and excessive whitespace;
- consistent cards, borders, radii, shadows, buttons, and Royal Blue accents;
- navigation, primary CTA prominence, FAQ, language switch, and affected flows;
- reveal, hover, scroll, and reduced-motion behavior without layout shift;
- calm premium restraint: no visual noise, generic gradients, excessive color,
  competing CTAs, or decorative motion without purpose.

Check `document.documentElement.scrollWidth <= window.innerWidth`, computed
styles for disputed results, and browser console errors. Exercise keyboard
focus and DE/EN/FR switching. Test calculator/checker when layout, JavaScript,
or i18n could affect them.

Do not take a full-page homepage screenshot: its height exceeds Chromium's
reliable texture range. Capture viewport or section screenshots under
`.playwright-mcp/`. On mobile, verify `#insight .duel.comparison` remains one
column because it has three grid children.

## Report

Diagnose before proposing changes. Group findings as blocking, important, and
polish. For each finding include viewport, page/section, visible symptom,
evidence, likely owning files, and the smallest likely correction. Distinguish
real defects from browser-tool artifacts. State which server and browser were
used and what was not tested, especially Safari/iOS.

Do not edit application code during a review-only request. After a defect is
confirmed, use `ui_fixer` only when implementation is requested.

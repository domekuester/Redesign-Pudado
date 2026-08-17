# Codex project instructions — Pudado

This file is the Codex-native entry point for this repository. It does not
replace the existing Claude Code setup. Treat `.claude/` as read-only reference
material: never modify, delete, rename, or replace anything inside it unless the
user explicitly changes that restriction.

## Instruction hierarchy

Before non-trivial work, read the sources relevant to the task:

1. `CLAUDE.md` — binding operational rules for the website and the primary
   technical source of truth.
2. `pdos/00-core/README.md` — product, trust, and decision principles.
3. The task-specific PDOS document: `02-brand-design`, `03-engineering`,
   `04-growth`, `05-quality`, or `06-ai-workflows`.
4. The relevant existing workflow under `.claude/commands/`, `.claude/agents/`,
   or `.claude/skills/` when the task matches it.

Do not read every PDOS document for a small task. If documents conflict, the
more specific, current rule wins. For website implementation details,
`CLAUDE.md` wins over older PDOS wording. In particular, do not add font
preloads: the current, intentional rule in `CLAUDE.md` is self-hosted
`@font-face` with `font-display: swap` and no font preload.

## Preserve the architecture

- This is a static multi-page site: HTML, `style.css`, `script.js`,
  `translations.js`, and `motion.js`. There is no application build step and no
  framework. Do not migrate, scaffold, bundle, or add a framework.
- Keep browser libraries as controlled copies under `assets/vendor/`.
  `package.json` dependencies are sources for those copies, not runtime
  application dependencies. Do not add packages unless explicitly approved.
- Preserve the existing page families (`blog/`, `situations/`), legal pages,
  SEO files, and shared header/footer/i18n patterns.
- Never modify `_backup_original/`; it is the pre-redesign rollback reference.
- Prefer small, local edits in the established style. Do not broadly reformat,
  rewrite, reorganize, or clean unrelated code.

## Brand and design

- Pudado/EcoBum is calm, trustworthy, premium, modern, and timeless. The core
  message is: “Wasser reinigt. Papier reibt.” Explain; do not shout, shame,
  moralize, or attack toilet paper.
- Never invent certifications, medical effects, customer evidence,
  availability, sustainability figures, testimonials, or guaranteed outcomes.
  Keep the pre-launch/product-development state explicit.
- Royal blue (`--blue`) is the single brand accent. `--sage` is only a semantic
  status color. Do not introduce another accent or generic AI gradients.
- `style.css` `:root` is the design-token source of truth. Reuse existing color,
  spacing, type, radius, and shadow tokens; do not add raw selector-level colors
  or arbitrary visual values. Reuse existing components and base + modifier
  naming before creating variants.
- Keep Cabinet Grotesk and Inter self-hosted. Do not add Google Fonts, font CDNs,
  trackers, or third-party widgets without explicit privacy review and approval.
- Visual changes require rendered browser QA. Never claim that a layout is good
  from source inspection alone.

For copy work, apply `.claude/skills/pudado-brand-voice/SKILL.md`. For design
work, also consult `pdos/02-brand-design/README.md`. These are references, not
Codex-installed skills, and remain read-only.

## HTML, CSS, JavaScript, accessibility, and performance

- Use semantic HTML, exactly one `h1`, logical headings, landmarks, the skip
  link, correct button-versus-link semantics, and ARIA only where native HTML is
  insufficient.
- Preserve visible `:focus-visible` states, logical keyboard order, 44×44px
  touch targets, WCAG AA contrast, non-color status cues, and
  `prefers-reduced-motion` behavior.
- Every `<img>` needs real `width` and `height` plus an appropriate `alt`.
  Below-the-fold images also use `loading="lazy"` and `decoding="async"`;
  LCP/above-the-fold images must not be lazy-loaded.
- Keep CSS mobile-first and reuse established breakpoints. New UI must work at
  375px without horizontal overflow, then tablet and desktop.
- Keep JavaScript vanilla, scoped, defensive, and consistent with existing
  `init*()` feature functions. Prefer event listeners; do not introduce new
  globals beyond an intentional namespace.
- Protect navigation, language switching, calculator, installation/photo
  checker, gallery, FAQ, contact form, sticky CTA, and motion behavior whenever
  nearby code changes.
- Avoid new render blockers, long tasks, layout-changing animation, oversized
  assets, and unnecessary CSS/JS. Prefer transform/opacity animation and check
  LCP, CLS, and interaction risk for material changes.

## i18n: DE / EN / FR

- `translations.js` exposes `window.PUDADO_I18N`; `script.js` applies language
  and silently falls back to German. A fallback can therefore hide a defect.
- Never add user-facing copy only to HTML on translated pages. Use established
  `bereich.element` keys and add every new key to `de`, `en`, and `fr` in the
  same change.
- Translate meaning and brand tone, not word-for-word. Preserve hedging and
  development-status claims across languages; account for longer French copy.
- A page's `<body data-page>` drives dynamic `meta.title.*` and `meta.desc.*`
  keys. New pages require those keys in all three languages.
- After any HTML or translation edit, run:

  ```sh
  node .claude/scripts/check-i18n.js
  ```

- After substantive translation changes, perform the read-only voice review
  described in `.claude/agents/i18n-voice-reviewer.md`, limited to changed keys.

## SEO and content pages

- Preserve unique title, description, canonical, Open Graph/Twitter metadata,
  one `h1`, logical headings, internal links, and accurate JSON-LD.
- New public blog/situation pages must reuse the closest existing template,
  receive a correct canonical and `data-page`, be linked internally, and be
  added to `sitemap.xml`. Follow `.claude/commands/new-content-page.md`.
- `404.html` intentionally has no canonical and is not in the sitemap.
  `impressum.html` and `datenschutz.html` intentionally remain outside the
  sitemap.
- Do not report missing `hreflang` as an error while each page has one URL and
  language switches client-side. Do not invent language-specific URLs.
- For an SEO audit, first run the release check, then use the qualitative,
  read-only checks in `.claude/agents/seo-page-auditor.md`; do not duplicate
  mechanical findings.

## Existing checks — reuse them

Use the repository scripts instead of duplicating their logic:

```sh
node --check script.js
node --check motion.js
node --check translations.js
node .claude/scripts/check-i18n.js
node .claude/scripts/check-tokens.js
node .claude/scripts/check-assets.js
node .claude/scripts/release-check.js
```

- `release-check.js` covers JS syntax, i18n parity/usage, asset content hashes,
  sitemap coverage, and basic SEO across all static pages.
- `check-tokens.js` protects token usage and required image attributes.
- If CSS, JS, translations, motion, or vendor assets changed, update content
  hash query strings only with:

  ```sh
  node .claude/scripts/check-assets.js --fix
  ```

  This intentionally rewrites affected HTML files; inspect the resulting diff
  and do not overwrite unrelated user changes.
- Use `release-check.js --fix` only when cache-buster updates are intended.
- Vendor checks use `node .claude/scripts/vendor-sync.js`. Never run `--apply`
  for a real version difference without user approval, changelog review, browser
  QA, cache-buster refresh, and a final release check. Whitespace-only drift is
  intentionally left alone.

## Browser and visual QA

Use the in-app Browser capability for rendered frontend testing when available.
Follow `.claude/skills/visual-qa/SKILL.md`; its known failure modes are binding.

1. For layout, screenshots, and interaction, serve the repository locally with
   `python3 -m http.server 8899`. For Lighthouse/Core Web Vitals or any reported
   performance numbers, use `node .claude/skills/visual-qa/serve.mjs` on port
   8900. State which server produced measured numbers.
2. Navigate with a fresh query such as `?fresh=<timestamp>`. If versioned asset
   references are stale after an edit, run the asset fixer before diagnosing the
   rendered result. Verify important visual changes via computed styles.
3. After every navigation and before screenshots, force `.reveal` elements into
   view and set root `scrollBehavior` to `auto`. Scroll through once to load lazy
   images.
4. Never use a full-page screenshot of the ~24,000px homepage; Chromium can
   produce stitched ghosts above its texture limit. Capture individual sections.
5. Test 375px first, then 768px/tablet, then 1280px/desktop. Check horizontal
   overflow, wrapping, clipping, navigation, CTAs, and relevant interactions.
6. Always check browser console errors, `prefers-reduced-motion`, keyboard/focus
   behavior, and DE/EN/FR switching. Exercise calculator/checker when CSS, JS,
   layout, or i18n could affect them.
7. On mobile, `#insight .duel.comparison` has three grid children and must remain
   a one-column grid. Treat this as a known regression hotspot.
8. Do not add font preload as a hero CLS fix. When relevant, test delayed font
   loading and compare geometry before and after `document.fonts.ready`.
9. Put browser artifacts under `.playwright-mcp/` and stop local servers after
   testing. Safari/iOS remains a manual, explicitly unverified check unless an
   actual Safari/WebKit environment is available.

## Git safety and working tree ownership

- At task start, inspect `git status`, the current branch, and relevant recent
  history. Existing dirty files are user work: preserve them and never revert,
  overwrite, stage, or include them without explicit scope.
- Larger feature/redesign work belongs on a named `area/short-description`
  branch, not directly on `main`. Do not switch branches while user changes are
  present unless explicitly requested and safe.
- Never use destructive Git operations, force-push, delete branches, rewrite
  history, or modify remote state without explicit approval.
- Do not commit, push, stage files, or create a PR unless the user explicitly
  asks. Before any requested commit, inspect `git status` and the complete
  intended diff, check for secrets/unexpected files, and keep the commit focused
  with an imperative message.
- Deployment is a push to `main` through GitHub Pages. There is no build or CI
  safety net, so release verification is mandatory before saying deploy-ready.

## Definition of done

Before reporting a code/content change complete:

1. Confirm scope and inspect the final diff, including interactions with
   pre-existing user changes.
2. Run the narrow checks relevant to the changed files.
3. For a release candidate, run `node .claude/scripts/release-check.js` without
   relying on `--fix` to hide unresolved drift.
4. Perform rendered QA for any visual, interaction, layout, or i18n effect.
5. Report exactly what was tested, what was not tested, remaining risks, and
   whether asset hashes changed. Never imply browser, Safari, accessibility, or
   performance coverage that was not actually performed.

## Code review rules

Flag changes that introduce framework/build tooling, hard-coded translated
copy, incomplete DE/EN/FR keys, stale asset hashes, raw visual values outside
the token system, external fonts/tracking, misleading claims, missing image
dimensions/alt text, inaccessible interactions, inaccurate SEO/schema, untested
mobile regressions, or accidental changes to `.claude/`/`_backup_original/`.
Treat loss of privacy, brand trust, accessibility, stability, or deployability
as higher severity than stylistic preferences or speculative conversion gains.

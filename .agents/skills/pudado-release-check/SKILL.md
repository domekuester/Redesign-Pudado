---
name: pudado-release-check
description: Run and interpret Pudado's existing pre-deploy verification for JavaScript syntax, DE/EN/FR integrity, content-hash asset versions, sitemap coverage, SEO basics, design-token/image rules, browser console cleanliness, and responsive safety. Use before release, deploy, merge, commit readiness, or whenever asked whether Pudado is deployable. Reuse repository scripts; do not create duplicate checks.
---

# Pudado release check

Read `AGENTS.md`, `CLAUDE.md`, `.claude/commands/release-check.md`, and the
relevant part of `pdos/05-quality/README.md`.

## Gate

1. Inspect `git status`, branch, and the complete intended diff. Preserve
   unrelated user changes and flag unexpected or sensitive files.
2. Run the non-mutating gate:

   ```sh
   node .claude/scripts/release-check.js
   node .claude/scripts/check-tokens.js
   ```

3. Interpret failures by owner:
   - syntax: fix only when implementation is authorized;
   - i18n: require parity in `de`, `en`, and `fr`;
   - assets: use `node .claude/scripts/check-assets.js --fix` only when the user
     authorized correction of stale content hashes, then inspect every rewrite;
   - sitemap/SEO: preserve the deliberate exceptions for `404.html`,
     `impressum.html`, and `datenschutz.html`.
4. Re-run the gate after any correction until it passes. Never treat `--fix` as
   proof that unrelated website changes are correct.

## Rendered release safety

For changes that affect HTML, CSS, JavaScript, motion, translations, or vendor
assets, use the configured browser tooling and `$visual-qa` or
`$pudado-responsive-audit` as appropriate. At minimum verify:

- no new console errors or failed local resource requests;
- no horizontal overflow at 375px;
- navigation and the affected interaction;
- DE/EN/FR switching;
- calculator/checker when relevant;
- no obvious tablet or desktop regression.

Do not report performance numbers from Python's simple server. Use the realistic
port-8900 server when measuring and name the environment.

## Report

State each mechanical gate result, rendered checks actually performed, files
changed by any fixer, remaining manual checks such as Safari/iOS, and one of:

- `release-ready` — every relevant automated and rendered gate passed;
- `not release-ready` — list concrete blockers;
- `mechanical gate passed; rendered verification pending`.

Do not commit, push, merge, or deploy unless separately and explicitly asked.

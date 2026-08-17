---
name: pudado-i18n-review
description: Review changed Pudado translations and rendered copy across German, English, and French for key parity, natural language, non-literal translation, calm brand voice, claim consistency, terminology, and layout-risking length. Use after any translations.js or translated HTML change, for new copy/content pages, or when awkward EN/FR wording is suspected. Review changed keys only unless a full audit is explicitly requested.
---

# Pudado i18n review

Read `AGENTS.md`, the i18n rules in `CLAUDE.md`,
`.claude/skills/pudado-brand-voice/SKILL.md`, and
`.claude/agents/i18n-voice-reviewer.md`. Treat them as read-only references.

## Review

1. Determine changed keys with `git diff -- translations.js` or use the keys
   named by the user. Do not audit all keys by default.
2. Run `node .claude/scripts/check-i18n.js` for parity and HTML references.
3. Load the changed values from `window.PUDADO_I18N` with a short read-only Node
   command and compare `de`, `en`, and `fr` side by side.
4. Check:
   - missing or wrong keys and leftover source-language fragments;
   - literal translation, German syntax in EN/FR, unnatural register, and `tu`
     instead of Pudado's established French register;
   - calm, factual, premium tone without hype, shame, or toilet-paper bashing;
   - identical hedging and product-development status across languages;
   - consistent EcoBum, hand-bidet, set, installation, and hygiene terminology;
   - longer EN/FR labels that could break navigation, buttons, chips, or cards;
   - matching dynamic `meta.title.<data-page>` and `meta.desc.<data-page>` keys.
5. For substantive or UI-constrained copy, render the changed page and switch
   through all three languages. Use `$pudado-responsive-audit` when length could
   affect multiple breakpoints.

Never invent stronger claims, certification, medical benefit, availability,
customer evidence, or sustainability certainty while improving wording.

## Report

List claim discrepancies first, then tone/naturalness, terminology, and layout
risk. For each finding give key, language, concise reason, and one concrete
replacement. If clean, say so briefly. Remain read-only unless implementation
is separately requested.

---
description: Pre-Deploy-Gate — Syntax, i18n-Parität, Cache-Buster, Sitemap und SEO-Basics prüfen
argument-hint: "[--fix]"
allowed-tools: Bash(node .claude/scripts/release-check.js*), Bash(git status*), Bash(git diff*), Read, Edit
---

Führe das Pre-Deploy-Gate für Pudado aus.

## Kontext

Deploy bedeutet hier: push auf `main` → GitHub Pages. Es gibt keinen Build-Schritt
und keine CI-Stufe dazwischen. Dieses Gate ist die einzige Prüfung vor Livegang.

## Ablauf

1. Führe aus: `node .claude/scripts/release-check.js $ARGUMENTS`

2. Berichte das Ergebnis kompakt. Bei bestandener Prüfung genügen zwei Sätze.

3. Bei Fehlern: behebe sie, statt sie nur zu melden — aber nach Kategorie unterschiedlich:

   - **assets** (veraltete/fehlende Cache-Buster): mit `--fix` automatisch
     korrigierbar. Die Stempel sind Content-Hashes, kein Handbetrieb nötig.
   - **syntax**: sofort beheben, das blockiert die gesamte Seite.
   - **i18n**: fehlende Keys in allen drei Sprachen (de/en/fr) ergänzen.
     Übersetze sinngemäß im Markenton, nicht wörtlich — bei mehr als ein, zwei
     Keys den Subagenten `i18n-voice-reviewer` zur Prüfung einsetzen.
   - **sitemap**: fehlende Seiten nach dem Muster der bestehenden Einträge
     ergänzen — eine Zeile, `<loc>` + `<lastmod>`, kein `changefreq`.
   - **seo**: fehlende/doppelte Titel, Descriptions oder Canonicals korrigieren.
     Achtung: Titel und Description niemals inhaltlich umschreiben, wenn nur ein
     technisches Problem vorliegt.

4. Wenn Dateien geändert wurden, zeige `git diff --stat` und lasse das Gate
   erneut laufen, bis es sauber ist.

## Grenzen

- Keine visuellen oder inhaltlichen Änderungen an der Website vornehmen. Dieses
  Kommando repariert Technik, kein Design und keine Copy.
- Nicht committen, außer die Nutzerin oder der Nutzer fordert es ausdrücklich.

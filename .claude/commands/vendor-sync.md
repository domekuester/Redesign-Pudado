---
description: assets/vendor gegen node_modules abgleichen (GSAP, ScrollTrigger, Lenis) — Versionen prüfen, Drift melden
argument-hint: "[--apply] [--force]"
allowed-tools: Bash(node .claude/scripts/vendor-sync.js*), Bash(node .claude/scripts/check-assets.js*), Bash(node .claude/scripts/release-check.js*), Bash(git diff*), Bash(git status*), Read, Skill
---

Gleiche die ausgelieferten Browser-Builds mit `node_modules` ab.

## Kontext

Die Website ist bewusst abhängigkeitsfrei. Ausgeliefert wird ausschließlich, was
in `assets/vendor/` liegt — kopiert von Hand. `package.json` dient nur als Quelle
dieser Kopien.

## Ablauf

1. `node .claude/scripts/vendor-sync.js $ARGUMENTS`

2. Ergebnis einordnen:

   - **`✓ identisch`** — nichts zu tun.
   - **`~ nur Leerraum abweichend`** — **bewusst nicht anfassen.** Inhaltlich
     dieselbe Bibliothek; ein Kopieren würde nur die `?v=`-Content-Hashes ändern
     und allen wiederkehrenden Besucher:innen über 100 KB Neu-Download aufzwingen,
     ohne dass sich eine Zeile Code ändert.
   - **`✗ INHALTLICH abweichend`** — echter Versionsunterschied. Siehe unten.

3. Bei echtem Versionsunterschied **nicht einfach übernehmen.** Ein Sprung in
   GSAP oder Lenis ist eine funktionale Änderung an der Live-Seite:
   - Nenne die konkrete Version vorher/nachher und frage nach, bevor du `--apply` ausführst.
   - Prüfe bei einem Minor-/Major-Sprung die Changelogs auf Breaking Changes
     (context7-MCP ist dafür da — kein Rätselraten aus dem Gedächtnis).
   - `motion.js` nutzt `ScrollTrigger`, `gsap.ticker` und `Lenis` samt
     `data-lenis-prevent`. Genau diese Berührungspunkte nach einem Update prüfen.

4. Nach jedem `--apply` **zwingend**: `node .claude/scripts/check-assets.js --fix`
   Sonst zeigen die `?v=`-Stempel auf den alten Inhalt und der Browser liefert
   weiter die alte Bibliothek aus.

5. Danach visuell abnehmen mit dem Skill `visual-qa` — Scroll-Animationen, Pinning
   und Lenis-Smooth-Scroll ab 981px. Ein Animations-Update fällt nur im Browser auf,
   nicht im Diff. Zum Schluss `node .claude/scripts/release-check.js`.

## Grenzen

- Keine neuen Abhängigkeiten aufnehmen (CLAUDE.md: bewusst dependency-frei).
- `three` und `vanta` liegen in `node_modules`, stehen nicht in `package.json` und
  werden nicht ausgeliefert — Reste eines verworfenen Wool-Motion-Versuchs. Nicht
  vendoren. Entfernen nur auf ausdrücklichen Wunsch.

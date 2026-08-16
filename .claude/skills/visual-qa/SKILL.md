---
name: visual-qa
description: Visuelles Prüfen der Pudado-Site im Browser (Playwright/Chrome DevTools) inklusive Screenshots, Konsolen-Check und Performance-Messung. Nutze diesen Skill immer, bevor ein visueller Befund notiert oder eine Layout-Änderung als fertig gemeldet wird.
---

# Visual QA für Pudado

Dieser Skill enthält die Stolperfallen, die beim visuellen Prüfen dieser Seite
schon mehrfach zu **Fehldiagnosen** geführt haben. Ohne die Setup-Schritte unten
sehen Screenshots nach Bugs aus, die keine sind: leere Karten, durchscheinende
Menüs, halbleere Seiten.

**Regel: erst das Setup, dann der erste Befund.** Kein Screenshot ohne Schritt 1–3.

## 1. Server wählen — die Wahl verfälscht das Ergebnis

| Zweck | Server |
|---|---|
| Layout, Screenshots, Funktion | `python3 -m http.server 8899` genügt |
| Lighthouse, LCP, CLS, alles mit Zahlen | **`node .claude/skills/visual-qa/serve.mjs`** (Port 8900) |

`python3 -m http.server` liefert weder Kompression noch Cache-Header. Messungen
dagegen sind nicht nur zu schlecht — sie **verstecken echte Fehler**. Am
2026-08-15 maskierte der langsame Server einen CLS-Bug: weil die Fonts so spät
ankamen, fiel der Font-Swap aus dem Messfenster (CLS 0,054). Mit realistischer
Auslieferung sprang derselbe Wert auf **0,211**.

Dieselbe Codebasis, zwei Server:

| | python | serve.mjs |
|---|---|---|
| Mobile Performance | 72 | **97** |
| Mobile LCP | 7,2 s | **2,6 s** |
| `style.css` Transfer | 112 KB | **24,9 KB** |

Wenn du Zahlen berichtest: sag dazu, gegen welchen Server gemessen wurde.

## 2. Cache umgehen

`style.css` und `translations.js` werden aggressiv gecacht — nach einem Edit
liefert ein normales `navigate` die alte Version.

- URL immer mit Cache-Buster aufrufen: `http://localhost:8900/?fresh=<timestamp>`
- Ergebnis per `getComputedStyle` verifizieren, nicht dem Screenshot vertrauen.

Seit dem `release-check` tragen die Assets Content-Hash-Stempel (`?v=…`). Nach
einem CSS-Edit ohne `node .claude/scripts/check-assets.js --fix` zeigt der
Browser weiter das alte Stylesheet — das ist dann kein Site-Bug, sondern ein
veralteter Stempel.

## 3. Vor jedem Screenshot ausführen

```js
// Scroll-Reveal: .reveal-Elemente sind bis zum Scroll unsichtbar (opacity 0)
document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
// Smooth-Scroll macht scrollIntoView + Screenshot unzuverlässig
document.documentElement.style.scrollBehavior = 'auto';
```

Beides überlebt **keine Navigation** — nach jedem `navigate_page` erneut setzen.
Lazy-Images laden erst nach einmaligem Durchscrollen.

## 4. Screenshots: niemals `fullPage`

Die Startseite ist ~24.000px hoch und überschreitet das Chromium-Textur-Limit
(16.384px). `fullPage: true` stitcht fehlerhaft — Geisterbilder und Duplikate,
die wie Layout-Bugs aussehen.

**Stattdessen Element-Screenshots pro Sektion:** `#hero`, `#insight`, `#set`,
`#footer` usw. Die sind zuverlässig.

## 5. Viewports

Mobile First gilt auch beim Prüfen: **375px zuerst**, dann 768px, dann 1280px.

Bei Chrome DevTools MCP wird die `emulate`-Viewport-Emulation bei *jedem*
Tool-Call neu angewendet, was die Scrollposition zurückspringen lässt (Chrome
Scroll-Anchoring). Symptom: `scrollTo` meldet korrektes `scrollY`, der folgende
Screenshot zeigt eine andere Sektion. **Kein Site-Bug.** Workaround: scrollen und
sofort screenshotten, danach per `elementFromPoint` verifizieren. Bei
maximiertem Fenster funktioniert `resize_page` nicht → `emulate` mit
`viewport`-String nutzen.

## 6. Bekannte Fallen im Layout

- **`.duel.comparison` (`#insight`) hat DREI Grid-Kinder**, nicht zwei:
  `.comparison-panel--paper`, `.duel-divider`, `.comparison-panel--water`.
  Desktop ist `1fr auto 1fr`. Jede zweispaltige Mobile-Variante schiebt das
  Wasser-Panel in eine implizite zweite Zeile → beide Panels halbbreit, Hälfte
  leer. Auf Mobile bewusst `grid-template-columns: 1fr`.
- **Font-Swap-CLS im Hero:** schriftabhängige Maße (`ch`-Einheiten,
  `flex-wrap` mit knappem Platz) verschieben das Layout beim Swap. Prüfen per
  künstlicher Font-Verzögerung (Playwright `route`, ~1,5 s) und Elementhöhen vor
  und nach `document.fonts.ready` vergleichen. **Kein `<link rel=preload>` als
  Fix** — das ist laut CLAUDE.md bewusst ausgeschlossen.

## 7. Immer mitprüfen

- Konsole auf Fehler (`list_console_messages` / `browser_console_messages`)
- Kein horizontales Scrollen auf 375px: `document.documentElement.scrollWidth <= window.innerWidth`
- `prefers-reduced-motion: reduce` respektiert (emulieren und gegenprüfen)
- Sichtbare `:focus-visible`-Ringe beim Durchtabben
- Sprachwechsel de/en/fr wirkt auf der geprüften Seite

## 8. Aufräumen

Screenshots mit relativem `filename` landen im **Projekt-Root** und sind dort
untracked. Nach dem Test löschen oder direkt nach `.playwright-mcp/` schreiben
(steht in `.gitignore`). Den Test-Server am Ende beenden.

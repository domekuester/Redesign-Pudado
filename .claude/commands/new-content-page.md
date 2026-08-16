---
description: Neue Blog- oder Situations-Seite anlegen — inklusive i18n in allen drei Sprachen, Sitemap und interner Verlinkung
argument-hint: "blog|situation <slug>"
allowed-tools: Read, Edit, Write, Bash(node .claude/scripts/*), Bash(git diff*), Bash(git status*), Glob, Grep, Skill
---

Lege eine neue Inhaltsseite an: `$ARGUMENTS` (Typ und Slug).

Ohne Argumente: frage nach Typ (`blog` oder `situation`), Slug und Thema, bevor
du irgendetwas schreibst.

## Warum es dieses Kommando gibt

Eine neue Seite anzulegen sind ~7 aufeinander abgestimmte Änderungen in 4 Dateien.
Vergessen wird typischerweise der Sitemap-Eintrag oder eine der drei Sprachen —
und ein fehlender Key fällt still auf Deutsch zurück (`script.js`), ist also auf
der französischen Seite nicht als Fehler erkennbar.

## Konventionen dieses Projekts

| | Blog | Situation |
|---|---|---|
| Pfad | `blog/<slug>.html` | `situations/<slug>.html` |
| `data-page` | `blog-<slug>` | `situation-<slug>` |
| i18n-Namespace | `blog.*` | `sit.*` |
| Vorlage | eine bestehende Datei aus `blog/` | eine bestehende aus `situations/` |

- `data-page` ist der Schlüssel: `script.js` baut daraus `meta.title.<data-page>`
  und `meta.desc.<data-page>`. Beide Keys **müssen** in de, en und fr existieren,
  sonst bleibt der Seitentitel beim Sprachwechsel auf dem Vorgabewert stehen.
- Sitemap-Format ist einzeilig: `<url><loc>…</loc><lastmod>JJJJ-MM-TT</lastmod></url>`
- Slug klein, mit Bindestrich, ohne Umlaute (`komfort-senioren`, nicht `Komfort_Senioren`).

## Ablauf

1. **Vorlage wählen.** Nimm die inhaltlich nächstliegende bestehende Seite und
   kopiere ihre Struktur. Baue das Markup nicht neu — Header, Navigation, Footer
   und Cookie-Banner sind auf allen Seiten identisch und sollen es bleiben.

2. **Seite erstellen** mit eindeutigem `<title>`, eigener `meta description`,
   korrektem `canonical` (`https://pudado.de/<pfad>`), passendem `data-page`
   und genau einem `<h1>`.

3. **Texte über i18n einpflegen**, niemals hart ins HTML. Neue Keys nach dem
   Schema `bereich.element` in `translations.js` — in **allen drei Sprachen**.
   Nutze den Skill `pudado-brand-voice` für die Copy. Übersetze sinngemäß, nicht
   wörtlich: die Kernbotschaft "Wasser reinigt. Papier reibt." muss in jeder
   Sprache tragen.

4. **Bilder** nur aus `assets/`, immer mit `width`/`height` (echte Pixelmaße),
   beschreibendem `alt`, `loading="lazy"` und `decoding="async"`.

5. **Sitemap** `sitemap.xml` um den Eintrag ergänzen, `lastmod` auf heute.

6. **Intern verlinken** — eine neue Seite ohne eingehende Links ist für Nutzende
   und für Suchmaschinen unsichtbar:
   - Blog-Artikel → in `blog/index.html` in die Artikelliste aufnehmen
   - Situations-Seite → in `index.html` in die Situations-Sektion aufnehmen

7. **Prüfen:** `node .claude/scripts/release-check.js --fix`
   Das ergänzt die Cache-Buster und verifiziert i18n-Parität, Sitemap-Abdeckung
   und SEO-Basics. Erst wenn das Gate grün ist, ist die Seite fertig.

8. **Visuell abnehmen** mit dem Skill `visual-qa` (375px zuerst), inklusive
   Sprachwechsel de/en/fr auf der neuen Seite.

## Grenzen

- Keine neuen Komponenten oder Layout-Muster erfinden. Bestehende Karten,
  Buttons und Sektionen wiederverwenden (CLAUDE.md, Komponenten-Standards).
- Keine neuen Farben, Abstände oder Radien — ausschließlich Tokens aus `:root`.
- Bestehende Seiten inhaltlich nicht umschreiben; nur den Link ergänzen.

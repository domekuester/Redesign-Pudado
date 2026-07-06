# PDOS Changelog

Alle relevanten Änderungen an der PDOS-Struktur und ihren Inhalten werden hier festgehalten, chronologisch, neueste Änderung zuerst.

## [Konsistenz-Bereinigung: pdos/README.md 0.1.1, 00-core 0.2.2, 01-executive 0.1.1, 02-brand-design 0.1.2, 03-engineering 0.1.1, 04-growth 0.1.1, 05-quality 0.2.1, 06-ai-workflows 0.2.1] - 2026-07-04

### Behoben
- **`pdos/README.md` Versionierungsstand korrigiert:** Der Abschnitt "Versionierung" behauptete fälschlich, alle Bereichs-READMEs außer `00-core` seien unbearbeitete Platzhalter. Ersetzt durch eine Tabelle mit dem tatsächlichen Stand jedes Bereichs (alle sechs inhaltlich ausgearbeitet; `templates/`/`checklists/`/`playbooks/` weiterhin bewusst offen).
- **Prioritätsreihenfolge vereinheitlicht:** `00-core`s eigene Konfliktlösung & Eskalation (Performance vor Conversion) und die von `01-executive`/`02-brand-design`/`03-engineering`/`04-growth` zitierte Rangfolge (Conversion vor Performance) widersprachen sich. `00-core` führt jetzt die einzige kanonische, neunstufige PDOS-weite Priorität: Sicherheit/Recht/Datenschutz → Markenvertrauen → Produktverständnis → UX & Accessibility → Stabilität & Engineering → Performance → Conversion/Growth → SEO → Umsetzungsgeschwindigkeit.
- **Performance/Conversion-Diskrepanz geschlossen:** `01-executive` (Abschnitt 4/10), `02-brand-design` (Abschnitt 13), `03-engineering` (Abschnitt 15), `04-growth` (Abschnitt 16) und `05-quality` (Abschnitt 4) zitieren jetzt wortgleich dieselbe kanonische Rangfolge aus `00-core`. `01-executive` führt zusätzlich eine neue, fehlende Stufe "Stabilität & Engineering" ein, die zuvor nicht als eigener Rang existierte. Nicht heimlich neu entschieden — die vom Nutzer vorgegebene Zielreihenfolge wurde 1:1 übernommen und die betroffenen Dokumente konsequent darauf ausgerichtet.
- **`06-ai-workflows` Abschnitt 18 aktualisiert:** Gate-Liste referenzierte noch alte, in `05-quality` v0.2.1 bereits umbenannte Gate-Namen und ließ das "Growth/Conversion Gate" komplett aus — jetzt vollständig und mit den vereinheitlichten Namen.

## [06-ai-workflows 0.2] - 2026-07-03

### Hinzugefügt (in `06-ai-workflows/README.md`)
- **Abschnitt 7 "MCP-Werkzeug-Priorität":** klare Bevorzugungsregeln zwischen GitHub MCP, Chrome DevTools MCP, Playwright MCP und Context7, inkl. Faustregel Chrome DevTools = Zustand vs. Playwright = Ablauf. Regel ergänzt: kein Tool ersetzt menschliche Freigabe bei strategischen Entscheidungen.
- **Abschnitt 9 "Umgang mit unstrukturierten Prompts":** verbindliches Vorgehen für grobe Anfragen ("Mach es schöner", "Fix das", "Committe das" u. a.) — Teilaufgaben übersetzen, Scope/Risiken benennen, fehlende Informationen markieren, bei Risiko zuerst Plan zeigen, nicht blind loslegen.
- **Abschnitt 10 "Umgang mit widersprüchlichen Anweisungen":** Vorgehen bei gleichzeitig widersprüchlichen Zielen (schnell vs. gründlich, Tracking vs. Datenschutz u. a.) — Widerspruch benennen, betroffene PDOS-Regeln nennen, mind. 2 Optionen, Empfehlung, menschliche Freigabe bei strategischer/rechtlicher/sicherheits- oder markenrelevanter Tragweite.
- **Abschnitt 21 "KI-Selbstprüfung nach jeder Aufgabe":** neunteilige Routine-Checkliste nach jeder relevanten Aufgabe.
- **Abschnitt 22 "Retrospektive nach größeren Aufgaben":** sechs Reflexionsfragen nach größeren Arbeiten, inkl. "welche PDOS-Regel fehlt noch" als eingebauter Weiterentwicklungs-Impuls für PDOS selbst.

### Geändert
- Abschnitte 7–19 (v0.1) auf 8/11–20 (v0.2) renummeriert, alle internen Querverweise (`Abschnitt N`) aktualisiert.
- Offene Fragen (jetzt Abschnitt 24) um zwei neue Punkte ergänzt: ob Selbstprüfung/Retrospektive in der Praxis eingehalten werden, ob die MCP-Werkzeug-Priorität eindeutig genug ist.

## [06-ai-workflows 0.1] - 2026-07-03

### Hinzugefügt
- `06-ai-workflows/README.md` von Platzhalter zu erstem inhaltlichen Entwurf: Zweck & Abgrenzung, Grundprinzipien für KI-Arbeit, simulierte Rollen, Standard-Arbeitsablauf (12 Schritte), Aufgabenklassen-Matrix (Analyse-/Freigabe-/Testpflicht, Commit-Regel), MCP-Nutzung (GitHub, Chrome DevTools, Playwright, Context7), Prompting-Regeln inkl. Standard-Template, Sicherheitsregeln, Git-Regeln, Umgang mit Unsicherheit, Review-Modus, Design-/Engineering-/Growth-SEO-Workflows mit KI, Quality-Gate-Workflow, Incident-Workflow, Definition of Done für KI-Aufgaben, Anti-Patterns, offene Fragen.
- Baut auf `00-core` v0.2.1, `01-executive` v0.1, `02-brand-design` v0.1.1, `03-engineering` v0.1, `04-growth` v0.1, `05-quality` v0.2 auf und schließt damit den Kreis der sechs PDOS-Bereichsdokumente.
- Grundlage sind die real eingerichteten MCP-Server (GitHub, Chrome DevTools, Playwright, Context7) und die tatsächliche Repository-/Git-Konfiguration (Remote `domekuester/Redesign-Pudado`, Branch `redesign/premium-refresh`).

## [05-quality 0.2] - 2026-07-03

### Hinzugefügt (in `05-quality/README.md`)
- **Abschnitt 4 "Priorität der Quality Gates":** verbindliche Rangfolge der elf Gates (Security & Privacy > Legal/DSGVO > Brand Trust > UX & Accessibility > Engineering/Stability > Performance > Growth/Conversion > SEO > Release), abgeleitet aus der Gesamt-Rangfolge in `00-core`/`01-executive`. Regel ergänzt: niedrigere Gates dürfen höhere nie aushebeln; SEO/Conversion dürfen nie Privacy, Security, Accessibility oder Vertrauen überstimmen.
- **Abschnitt 5 "Gate-Konflikte":** vier Beispielkonflikte (SEO vs. Design, Conversion vs. Brand Trust, Animation vs. Accessibility/Performance, Growth-Tracking vs. Privacy) plus verbindliches 7-Schritte-Vorgehen für Claude Code bei Gate-Konflikten.
- **Abschnitt 8 "Browser- und Geräte-Matrix":** pragmatische Pflichtprüfung (Mobile/Tablet/Desktop-Breite, Chrome, Navigation, CTAs, Sprache, Rechner/Checker, rechtliche Seiten) und Optional-Liste (Firefox, Edge, echte Devices). Safari/WebKit explizit als aktuell nicht automatisierbar markiert, keine erfundene Enterprise-Testmatrix.
- **Abschnitt 19 "Incident-Prozess v0.2 – erste echte Reaktionslogik":** sechs konkrete Fehlerszenarien (Website lädt nicht, Mobile kaputt, Sprache/Translations kaputt, Rechner/Checker liefert falsche Werte, Token/Secret sichtbar, rechtliche/Datenschutz-Änderung) jeweils mit Sofortmaßnahme, Prüfung, Fix-/Rollback-Entscheidung, Dokumentation. Verbindliche Regel ergänzt: keine neuen Features vor Verstehen/Eingrenzen/Beheben oder bewusstem Rollback eines kritischen Fehlers.

### Geändert
- Abschnitte 4–20 (v0.1) auf 6–24 (v0.2) renummeriert, alle internen Querverweise (`Abschnitt N`) entsprechend aktualisiert.
- Fehlerklassifikation (jetzt Abschnitt 20) verweist bei "Kritisch" auf die neue Reaktionslogik in Abschnitt 19.

## [05-quality 0.1] - 2026-07-03

### Hinzugefügt
- `05-quality/README.md` von Platzhalter zu erstem inhaltlichen Entwurf: Zweck & Abgrenzung, Qualitätsphilosophie, elf Quality Gates (Brand/UX/Design/Engineering/Performance/Accessibility/SEO/Security/Privacy/Growth/Release), Testing-Grundregeln, manuelle QA-Checkliste, automatisierte QA mit Playwright und Chrome DevTools (MCP-Werkzeuge), Performance-/Accessibility-/Security-/Privacy-Quality, SEO Quality, Release Readiness, Rollback- & Incident-Vorgehen, Fehlerklassifikation, Definition of Done, Claude-Code-Quality-Verhalten, Anti-Patterns, offene Fragen.
- Baut auf `00-core` v0.2.1, `01-executive` v0.1, `02-brand-design` v0.1.1, `03-engineering` v0.1, `04-growth` v0.1 auf.

### Offen benannte Lücken aus vorherigen Dokumenten geschlossen
- **Rollback-/Incident-Vorgehen** (in `03-engineering` v0.1 als fehlend benannt) — jetzt in Abschnitt 15 definiert.
- **Growth-Tracking-vs-Datenschutz-Konflikt** (in `04-growth` v0.1 als ungelöst benannt) — jetzt in Abschnitt 12 aufgelöst: klare Trennung, was ohne Tracking messbar ist, was Freigabe/Datenschutzprüfung braucht und was vorerst tabu ist.

## [04-growth 0.1] - 2026-07-03

### Hinzugefügt
- `04-growth/README.md` von Platzhalter zu erstem inhaltlichen Entwurf: Zweck & Abgrenzung, Growth-Philosophie, Zielgruppenlogik (Annahmen/Belege-Trennung wie in `00-core`), Kernbotschaften-Bewertung, Conversion-Prinzipien, Website-Funnel, Trust-Elemente, SEO-Strategie, Content-Strategie, Landingpage- und Messaging-Regeln, Social-Media-Rahmen, Growth-Experiment-Struktur, Messbereiche, Growth-Konfliktlösung, Definition of Done, Anti-Patterns, offene Fragen.
- Baut auf `00-core` v0.2.1, `01-executive` v0.1, `02-brand-design` v0.1.1, `03-engineering` v0.1 sowie der realen Content-Struktur (`blog/`, `situations/`, `sitemap.xml`) auf.
- Keine erfundenen Kunden-, Conversion- oder SEO-Zahlen; alle Zielgruppen- und Wirkungsaussagen als Annahme markiert oder als offene Frage benannt.

## [03-engineering 0.1] - 2026-07-03

### Hinzugefügt
- `03-engineering/README.md` von Platzhalter zu erstem inhaltlichen Entwurf: Zweck & Abgrenzung, technische Grundhaltung, Projektarchitektur (basierend auf der realen Repository-Struktur), HTML-/CSS-/JS-Standards, i18n-Regeln für `translations.js`, Komponenten-Engineering, Performance-, Accessibility- und Security Engineering, Git-/Branch-Regeln, Claude-Code-Arbeitsweise, Testing & Verification, Engineering-Konfliktlösung, Definition of Done, Anti-Patterns, offene Fragen.
- Baut auf `00-core` v0.2.1, `01-executive` v0.1, `02-brand-design` v0.1.1 sowie den bestehenden technischen Konventionen in `CLAUDE.md` und der tatsächlichen Projektstruktur (`index.html`, `style.css`, `script.js`, `translations.js`, `assets/`, `blog/`, `situations/` etc.) auf.
- Kein Build-System/Framework erzwungen — bestätigt den bestehenden dependency-freien, statischen Stack als bewusste Entscheidung, nicht als Provisorium.

## [Farbkonflikt-Entscheidung: 00-core 0.2.1, 02-brand-design 0.1.1] - 2026-07-03

### Entschieden
- Sage/Türkis-Konflikt aus `02-brand-design` v0.1 bewusst aufgelöst: Royal Blue bleibt einzige primäre Markenfarbe, Weiß bleibt wichtigste Flächen-/Ruhefarbe, Sage bleibt semantische Statusfarbe (Nachhaltigkeit, positive Hinweise, Erfolg, ruhige Informationszustände), Türkis wird neu als sehr sparsamer Wasser-/Interaktionsakzent zugelassen — ausdrücklich keine zweite Hauptmarkenfarbe. Keine weitere Akzentfarbe ohne menschliche Freigabe.
- Zweck der Entscheidung: die bestehende Markenruhe (Ein-Akzent-Prinzip) bewusst schützen, nicht aufweichen.

### Geändert (`00-core/README.md`, 0.2 → 0.2.1)
- Golden Rule 2 präzisiert: "Ein Akzent, kontrollierte Ausnahmen" statt "Ein Akzent, eine Marke" — beschreibt jetzt explizit Sage (Status) und Türkis (sparsamer Wasser-/Interaktionsakzent) als eng begrenzte Ausnahmen.
- Brand DNA, "Visuelle Identität" entsprechend präzisiert und auf `02-brand-design` Abschnitt 5 verwiesen.

### Geändert (`02-brand-design/README.md`, 0.1 → 0.1.1)
- Abschnitt 5 (Farbprinzipien): bisherigen offenen Konflikt-Hinweis durch dokumentierte, begründete Entscheidung ersetzt, inkl. expliziter Nutzungsgrenzen für Türkis.
- Konkreter Türkis-Hex-/Token-Wert bewusst nicht festgelegt — als Implementierungsaufgabe (WCAG-Kontrastprüfung) an `03-engineering`/`style.css` verwiesen und in Abschnitt 16 (Offene Fragen) präzisiert.

## [02-brand-design 0.1] - 2026-07-03

### Hinzugefügt
- `02-brand-design/README.md` von Platzhalter zu erstem inhaltlichen Entwurf: Zweck & Abgrenzung, Design-Philosophie, Markenwirkung, visuelle Referenzlogik (Apple/Dyson/Muji/Aesop/Nothing mit klaren Kopierschutz-Grenzen), Farbprinzipien, Typografie, Layout & Spacing, Komponenten-Design, Animationen & Mikrointeraktionen, Bildsprache, UX-Prinzipien, Brand Non-Goals, Design-Konfliktlösung, Definition of Done für Design, Anti-Patterns, offene Fragen.
- Baut auf `00-core` v0.2, `01-executive` v0.1 und den bestehenden Design-Tokens in `CLAUDE.md`/`style.css` auf.

### Konflikt benannt, nicht still aufgelöst
- Abschnitt 5 (Farbprinzipien) markiert einen Widerspruch zwischen der Aufgabenstellung ("Türkis/Sage als dezente Akzente") und der bestehenden Regel in `00-core`/`CLAUDE.md` (Sage ist ausschließlich Status-Farbe, kein zweiter Markenakzent). Es wurde der bestehenden, bereits dokumentierten Regel gefolgt; eine Änderung daran erfordert laut `01-executive` explizite menschliche Freigabe.

## [01-executive 0.1 – Update] - 2026-07-03

### Hinzugefügt (in `01-executive/README.md`)
- **Abschnitt 10 "Finale Entscheidungsinstanz bei Konflikten":** definiert, wer final entscheidet (menschliche:r Projektverantwortliche:r), die verbindliche Eskalations-Rangfolge, wann menschliche Freigabe erforderlich ist, wann Claude operative Entscheidungen selbst treffen darf, und den Umgang mit mehreren Verantwortlichen.
- **Abschnitt 11 "Entscheidungsvorlage":** verbindliches Format für Konfliktdarstellung (Ausgangslage, Konflikt, Optionen A/B/C, Risiken, Empfehlung, benötigte menschliche Entscheidung).
- Neue offene Frage in Abschnitt 14: Rollenklärung bei mehreren Verantwortlichen.

### Geändert
- Abschnitte 10–12 (Definition of Done, Anti-Patterns, Offene Fragen) zu 12–14 renummeriert; interne Querverweise entsprechend aktualisiert.

## [01-executive 0.1] - 2026-07-03

### Hinzugefügt
- `01-executive/README.md` von Platzhalter zu erstem inhaltlichen Entwurf: Zweck & Abgrenzung, CEO-Denkweise, Product-Owner-Denkweise, strategische Entscheidungsprinzipien (Rangfolge), Feature-Priorisierungssystem, Non-Goals auf Executive-Ebene, Roadmap-Ebenen (ohne erfundene Termine), KPI-Messbereiche, Entscheidungsprozess für Claude Code, Definition of Done für Executive-Entscheidungen, Anti-Patterns, offene Fragen.
- Baut explizit auf `00-core` v0.2 auf (Konfliktlösung, Non-Goals, Annahmen/Belege-Trennung).

## [0.2] - 2026-07-03

### Hinzugefügt (in `00-core/README.md`)
- **Non-Goals:** Was Pudado nicht sein will, zu vermeidende Designrichtungen, nicht passende Marktpositionierung, unerwünschte kurzfristige Optimierungen, unerwünschte Wachstumsformen.
- **"Customer DNA – Annahmen vs. Belege":** Bestehende Zielgruppen-Aussagen aus v0.1 in "Belegte Erkenntnisse" (aktuell leer), "Plausible Annahmen" und "Offene Fragen" aufgeteilt, um Behauptungen nicht als Fakten darzustellen.
- **"Vision & Mission messbar machen":** Messbereiche (Vertrauen, Verständlichkeit, Conversion, Ladezeit, Accessibility, Markenwahrnehmung) definiert, bewusst ohne konkrete Zielwerte mangels Baseline-Daten.
- **"Qualität ist bestanden, wenn…":** Erste überprüfbare Kriterien pro Bereich (Design, UX, Technik, SEO, Accessibility, Sicherheit, Conversion) als v0.2-Arbeitsgrundlage.
- **"Konfliktlösung & Eskalation":** Rangfolge bei widersprüchlichen Anforderungen (Sicherheit & Recht > Markenkern > Accessibility > Performance > Conversion > SEO), sowie explizite Kriterien, wann der Mensch entscheiden muss und wann Claude nicht allein entscheiden darf.
- **Golden Rule 10:** "Annahme ist kein Fakt" ergänzt, um die neue Trennung von Annahmen/Belegen auch auf Ebene der Golden Rules zu verankern.

### Geändert
- `00-core/README.md` auf Version 0.2 angehoben; Versionsvermerk und Statuszeile aktualisiert.

## [0.1] - 2026-07-03

### Hinzugefügt
- Grundstruktur von PDOS angelegt: `00-core/`, `01-executive/`, `02-brand-design/`, `03-engineering/`, `04-growth/`, `05-quality/`, `06-ai-workflows/`, `templates/`, `checklists/`, `playbooks/`.
- Zentrale `README.md`: Zweck, Nutzen und Nutzungsregeln für Claude Code definiert.
- Erster inhaltlicher Entwurf in `00-core/README.md`: Vision, Mission, Brand DNA, Product DNA, Customer DNA, Definition von Premium, Qualitätsprinzipien, Entscheidungsprinzipien, Golden Rules.
- Platzhalter-`README.md` mit definiertem Zweck in allen übrigen Hauptordnern.

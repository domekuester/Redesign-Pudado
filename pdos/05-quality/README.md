# 05 — Quality

**Version:** 0.2.1
**Status:** Zweiter Entwurf — schließt strukturelle Lücken aus v0.1 (Gate-Priorität, Gate-Konflikte, Browser-Matrix, konkrete Incident-Szenarien). v0.2.1 vereinheitlicht Gate-Namen (inkl. neuem Legal/DSGVO Gate) und gleicht die zitierte Rangfolge an die kanonische Priorität aus `00-core` an.

Dieses Dokument baut auf [`pdos/README.md`](../README.md), [`00-core/README.md`](../00-core/README.md), [`01-executive/README.md`](../01-executive/README.md), [`02-brand-design/README.md`](../02-brand-design/README.md), [`03-engineering/README.md`](../03-engineering/README.md), [`04-growth/README.md`](../04-growth/README.md) und `CLAUDE.md` auf. Es schließt Lücken, die in den bisherigen PDOS-Dokumenten explizit offen benannt wurden: das fehlende Rollback-/Incident-Vorgehen aus `03-engineering` (Abschnitt 18/19 hier), den ungelösten Zielkonflikt zwischen Growth-Messung und Datenschutz aus `04-growth` (Abschnitt 15 hier) sowie — neu in v0.2 — die in der v0.1-Selbstkritik benannten fehlenden Strukturen: eine Rangfolge zwischen den Quality Gates selbst, ein Vorgehen bei Gate-Konflikten, eine realistische Browser-/Geräte-Matrix und konkrete, szenariobasierte Incident-Reaktionen. Bei Widerspruch zu `00-core`/`01-executive`/`02-brand-design`/`03-engineering` haben diese Vorrang.

**Kernprinzip dieses Dokuments:** Quality ist kein letzter Schritt am Ende einer Änderung, sondern ein dauerhaftes Gate, das bei *jeder* Änderung durchlaufen wird — unabhängig davon, aus welchem PDOS-Bereich die Änderung stammt.

---

## 1. Zweck dieses Dokuments

**Warum Qualität für Pudado entscheidend ist:** Jeder andere PDOS-Bereich (Brand, Executive, Design, Engineering, Growth) trifft Entscheidungen mit einer eigenen Zielrichtung — Markenwirkung, Priorisierung, Ästhetik, technische Umsetzung, Wachstum. Keiner dieser Bereiche prüft von sich aus, ob das Ergebnis tatsächlich stabil, sicher, zugänglich, rechtlich sauber und wartbar ist. Ohne ein eigenständiges Quality-Gate würde jede einzelne Änderung für sich genommen sinnvoll wirken, während sich in Summe technische Schulden, Datenschutzrisiken oder Accessibility-Lücken unbemerkt aufbauen.

**Welche Entscheidungen dieser Bereich regelt:**
- Was vor einem Commit, vor einem Release und nach einer Änderung geprüft wird.
- Welche Gates eine Änderung durchlaufen muss, in welcher Rangfolge sie gelten und wann ein Gate als bestanden gilt.
- Wie mit gefundenen Fehlern umgegangen wird (Klassifikation, Eskalation, Rollback).
- Wie Automatisierung (Playwright, Chrome DevTools) sinnvoll eingesetzt wird, ohne menschliche Bewertung zu ersetzen.

**Welche Entscheidungen NICHT hierher gehören:**
- Ob eine Änderung überhaupt gemacht werden soll — das regelt `01-executive`.
- Wie etwas gestaltet oder formuliert wird — das regeln `02-brand-design`/`04-growth`; Quality prüft das Ergebnis, entwirft es nicht.
- Wie eine Funktion technisch implementiert wird — das regelt `03-engineering`; Quality prüft, ob die Implementierung den eigenen Standards genügt.

**Zusammenarbeit mit anderen Bereichen:** Quality ist kein zusätzlicher, nachgelagerter Schritt, sondern in jeden Bereich eingebettet — `03-engineering`, Abschnitt 14 (Testing & Verification) ist die technische Basisprüfung; dieses Dokument erweitert sie um Brand-, Accessibility-, Privacy-, SEO- und Release-Ebene und definiert, was bei einem Fehlschlag passiert (Rollback, Eskalation) und was gilt, wenn zwei Gates gegenläufig urteilen. Quality blockiert eine Änderung nicht willkürlich — sie macht sichtbar, wenn eine Änderung eines der bereits an anderer Stelle in PDOS definierten Kriterien verfehlt.

## 2. Qualitätsphilosophie von Pudado

- **Vertrauen ist ein Qualitätsmerkmal**, kein separates Marketing-Thema — ein technischer Fehler (kaputter Rechner, falsche Übersetzung) beschädigt Vertrauen genauso wie eine unehrliche Werbeaussage (siehe `00-core`, "Vision & Mission messbar machen": Vertrauen als Messbereich).
- **Stabilität ist ein Markenmerkmal** — eine Premium-Marke, deren Website gelegentlich fehlerhaft wirkt, widerspricht sich selbst, unabhängig davon, wie gut Design und Copy sind.
- **Datenschutz ist Teil der Premium-Wahrnehmung**, nicht nur rechtliche Pflicht (siehe `00-core`, Brand DNA: "Vertrauen als Markenkern").
- **Accessibility ist kein Extra** — sie ist Teil der Produktqualität von Anfang an, nicht ein optionaler letzter Schliff (siehe `00-core`, Qualitätsprinzipien).
- **Performance ist Teil des Designs**, nicht ein nachgelagertes technisches Problem — eine visuell perfekte, aber langsame Seite ist keine gute Seite (siehe `02-brand-design`, Abschnitt 13).
- **Qualität muss überprüfbar sein** — eine Behauptung wie "das ist jetzt hochwertig" ohne nachvollziehbares Prüfergebnis ist keine Qualitätsaussage (siehe `00-core`, Golden Rule 5: "Premium ist ein Maßstab, kein Wort").
- **Keine Veröffentlichung ohne Prüfung** — auch eine kleine, "offensichtlich unproblematische" Änderung durchläuft mindestens die Mindestprüfung aus Abschnitt 6.

## 3. Quality Gates

Jede Änderung wird gegen die relevanten Gates geprüft. Nicht jede Änderung berührt jedes Gate — welche Gates relevant sind, ergibt sich aus der Art der Änderung. Die Rangfolge zwischen diesen Gates, falls sie widersprüchlich urteilen, ist in Abschnitt 4 definiert.

Die Namen und die Reihenfolge dieser Tabelle sind identisch mit der Rangfolge in Abschnitt 4 — es handelt sich um dieselben neun Gates, nicht um zwei getrennte Systeme.

| Gate | Was wird geprüft? | Wann bestanden? | Wann eskalieren? | Zuständige PDOS-Datei |
|---|---|---|---|---|
| **Security & Privacy Gate** | Enthält die Änderung Secrets, unsichere Inline-Skripte, ungeprüfte externe Ressourcen? Führt sie neues Tracking/neue Datenerfassung ein? | Kein Sicherheitsfund gemäß Abschnitt 13; keine neue Datenerfassung ohne Zweckbindung und Prüfung | Sofort bei jedem Sicherheitsfund, ohne Ausnahme; immer bei neuem Tracking/Analytics/Cookie | `03-engineering`, Abschnitt 11; Abschnitt 14, 15 dieses Dokuments |
| **Legal/DSGVO Gate** | Bleiben rechtliche Pflichtseiten (Impressum, Datenschutzerklärung) korrekt und aktuell, wenn die Änderung sie berührt? | Keine veraltete oder fehlende Pflichtangabe | Bei jeder Änderung, die Datenverarbeitung oder rechtliche Pflichtangaben betrifft | Abschnitt 14 dieses Dokuments |
| **Brand Trust Gate** | Passt die Änderung zu Brand DNA, Tonalität, Non-Goals? | Kein Verstoß gegen `00-core`/`02-brand-design`-Prinzipien erkennbar | Bei jedem Verdacht auf Markenwidersprüchlichkeit | `00-core`, `02-brand-design` |
| **UX & Accessibility Gate** | Beantwortet die Seite/Sektion die UX-Kernfragen (Was, Warum, Vertrauen, nächster Schritt)? Erfüllt sie WCAG AA, Tastaturbedienbarkeit, Fokuszustände? | Alle relevanten Fragen aus `02-brand-design`, Abschnitt 11 beantwortbar; keine neue Barriere gegenüber dem bisherigen Stand | Wenn eine Kernfrage unbeantwortet bleibt oder Tastatur-/Screenreader-Zugänglichkeit verloren geht | `02-brand-design`; `03-engineering`, Abschnitt 10 |
| **Engineering/Stability Gate** | Funktioniert der Code, ohne Bestehendes zu beschädigen? Nutzt die Änderung ausschließlich bestehende Design-Tokens/Komponenten? | Definition of Done aus `03-engineering`, Abschnitt 16 erfüllt; kein Abweichen von `style.css`-Tokens ohne Freigabe | Bei Risiko für Rechner/Checker/i18n; bei neuer Farbe/neuem Grundraster | `03-engineering`; `02-brand-design` |
| **Performance Gate** | Verschlechtert die Änderung Ladezeit/CLS/INP spürbar? | Keine messbare Verschlechterung ohne benannten Grund | Bei jedem neuen schweren Asset/Skript | `03-engineering`, Abschnitt 9 |
| **Growth/Conversion Gate** | Ist die Änderung mit `04-growth`-Prinzipien vereinbar (kein Dark Pattern, kein Rabattdruck)? | Kein Verstoß gegen `04-growth`, Abschnitt 3, 18 | Bei jedem Conversion-Element mit Drucktaktik | `04-growth` |
| **SEO Gate** | Sind Title, Meta, Struktur, `sitemap.xml` konsistent? | Konsistenz mit bestehenden Seiten (siehe `04-growth`, Abschnitt 9) | Bei fehlenden Pflichtangaben auf neuen Seiten | `04-growth` |
| **Release Gate** | Ist die Gesamtänderung freigabebereit (siehe Abschnitt 17)? | Alle vorherigen Gates bestanden oder bewusst als Ausnahme dokumentiert | Bei jeder offenen Frage aus einem vorherigen Gate | Dieses Dokument, Abschnitt 17 |

Ein Gate gilt nicht automatisch als "nicht bestanden", wenn es nicht relevant ist (z. B. Legal/DSGVO Gate bei einer reinen Textkorrektur ohne Datenbezug) — es wird bewusst als "nicht betroffen" markiert, nicht stillschweigend übersprungen.

## 4. Priorität der Quality Gates

Die neun Gates aus Abschnitt 3 sind nicht gleichrangig. Diese Rangfolge ist eine direkte Anwendung der kanonischen, PDOS-weit einzigen Gesamt-Priorität aus `00-core` (Sicherheit, Recht & Datenschutz > Markenvertrauen > Produktverständnis > UX & Accessibility > Stabilität & Engineering > Performance > Conversion/Growth > SEO > Umsetzungsgeschwindigkeit), hier für den Quality-Kontext konkretisiert — die Gate-Reihenfolge unten stimmte bereits vor dieser Präzisierung mit dieser Priorität überein, nur die zitierte Formulierung war veraltet:

1. **Security & Privacy Gate** — nicht verhandelbar, unabhängig vom Nutzen einer Änderung.
2. **Legal/DSGVO Gate** — rechtliche Korrektheit (Impressum, Datenschutzerklärung, Pflichtangaben), ebenfalls nicht verhandelbar, aber bewusst als eigener Rang neben der technischen Datenschutz-Dimension aus Rang 1 geführt, damit rechtliche Fragen nicht in der technischen Security-Prüfung untergehen.
3. **Brand Trust Gate**
4. **UX & Accessibility Gate** — UX-Verständlichkeit und Accessibility bilden einen gemeinsamen Rang, weil beide dieselbe Grundfrage beantworten: Kann jede:r Nutzer:in das Produkt tatsächlich verstehen und bedienen?
5. **Engineering/Stability Gate** — deckt sowohl die technische Codequalität als auch die technische Umsetzung des Design-Systems (Tokens/Komponenten) ab.
6. **Performance Gate**
7. **Growth/Conversion Gate**
8. **SEO Gate**
9. **Release Gate** — steht am Ende, weil es kein inhaltliches Kriterium prüft, sondern das aggregierte Ergebnis aller vorherigen Gates zusammenfasst (siehe Abschnitt 17).

**Warum diese Reihenfolge gilt:** Sie ist keine neue, eigenständige Erfindung dieses Dokuments, sondern die konsequente Übertragung der bereits in `00-core` und in jedem nachgelagerten Bereichsdokument (`02-brand-design`, `03-engineering`, `04-growth`) wiederholten Rangfolge auf die konkrete Prüf-Ebene. Ohne diese explizite Übertragung hätte Quality genau die Lücke gehabt, die in der v0.1-Kritik benannt wurde: Gates, die zwar einzeln definiert, aber nicht gegeneinander gewichtet waren.

**Zwei verbindliche Regeln, die aus dieser Rangfolge folgen:**
- **Niedrigere Gates dürfen höhere Gates niemals aushebeln.** Ein bestandenes SEO Gate rechtfertigt keinen Verstoß gegen das UX & Accessibility Gate; ein bestandenes Growth/Conversion Gate rechtfertigt keinen Verstoß gegen das Brand Trust Gate.
- **SEO oder Conversion dürfen nie Privacy, Security, Accessibility oder Vertrauen überstimmen.** Das ist die praktisch wichtigste Konsequenz dieser Rangfolge, weil genau hier laut `04-growth` (Anti-Patterns) und `01-executive` (Non-Goals) die größte Versuchung liegt, unter Wachstumsdruck von den eigenen Prinzipien abzuweichen.

## 5. Gate-Konflikte

Wenn zwei Gates unterschiedliche Empfehlungen geben, wird der Konflikt nicht stillschweigend zugunsten des lauteren oder dringlicheren Gates aufgelöst.

**Typische Beispiele:**
- **SEO möchte mehr Text, Design möchte weniger Text** → Rangfolge (Abschnitt 4): Brand Trust/UX Gate (Rang 3–4) steht über SEO Gate (Rang 8). Lösung folgt der Logik aus `02-brand-design`, Abschnitt 13 (Premiumwirkung vor SEO-Textbedarf) — SEO-Text wird integriert, nicht als zusätzlicher Block angehängt.
- **Conversion möchte aggressiveren CTA, Brand Trust lehnt das ab** → Brand Trust Gate (Rang 3) steht über Growth/Conversion Gate (Rang 7). Der aggressivere CTA wird nicht umgesetzt, unabhängig vom vermuteten Conversion-Gewinn.
- **Design möchte Animation, Accessibility/Performance lehnt ab** → UX & Accessibility Gate (Rang 4) und Performance Gate (Rang 6) stehen über der gestalterischen Vorliebe für eine Animation. Bei Accessibility ist das nicht verhandelbar (siehe `02-brand-design`, Abschnitt 13: "Accessibility gewinnt immer"); bei Performance wird geprüft, ob eine performantere Umsetzung der gleichen Idee möglich ist, bevor die Animation verworfen wird.
- **Growth möchte Tracking, Privacy/DSGVO lehnt ab** → Security & Privacy Gate (Rang 1) steht über Growth/Conversion Gate (Rang 7). Siehe Abschnitt 15 (Growth-Tracking-Konflikt lösen) für die konkrete Anwendung dieser Regel.

**Vorgehen bei Gate-Konflikten (verbindlich für Claude Code):**
1. **Konflikt sichtbar benennen** — nicht in eine Richtung auflösen, ohne den Konflikt zu erwähnen.
2. **Betroffene Gates nennen** — welche zwei (oder mehr) Gates stehen sich entgegen?
3. **Gate-Priorität anwenden** (Abschnitt 4) — in den meisten Fällen ergibt sich die Antwort direkt aus der Rangfolge.
4. **Mindestens zwei Optionen vergleichen** — auch wenn die Priorität eindeutig ist, wird gezeigt, welche Alternative verworfen wurde und warum.
5. **Risiken erklären** — was passiert bei jeder Option im schlechtesten Fall?
6. **Empfehlung geben** — begründet über die Rangfolge, nicht über Bauchgefühl.
7. **Bei strategischen, rechtlichen, sicherheits- oder markenrelevanten Konflikten menschliche Freigabe einholen** — über die Entscheidungsvorlage aus `01-executive`, Abschnitt 11, nicht eigenständig entscheiden. Das gilt insbesondere, wenn die Anwendung der Rangfolge selbst unklar ist (z. B. wenn zwei Gates auf demselben Rang stehen).

## 6. Testing-Grundregeln

- **Tests vor Commit:** Jede Änderung wird vor dem Commit manuell verifiziert (siehe `03-engineering`, Abschnitt 14) — nicht erst danach.
- **Tests vor Release:** Zusätzlich zur Commit-Prüfung erfolgt vor einer Veröffentlichung eine Gesamtprüfung gemäß Abschnitt 17 (Release Readiness).
- **Visuelle Prüfung:** Die Änderung wird tatsächlich angesehen, nicht nur am Code beurteilt.
- **Mobile Prüfung:** Immer, nicht nur bei "vermutlich mobil-relevanten" Änderungen — kleine CSS-Änderungen haben überproportional oft unerwartete Mobile-Auswirkungen.
- **Browser-Konsole prüfen:** Keine neuen Fehler oder Warnungen, die vorher nicht da waren.
- **Links prüfen:** Keine kaputten internen oder externen Links durch die Änderung.
- **Sprache/i18n prüfen:** Alle drei Sprachen (`de`/`en`/`fr`), nicht nur die während der Entwicklung sichtbare.
- **Rechner und Checker prüfen:** `initCalculator` und `initChecker` werden bei jeder Änderung, die Skripte, Layout oder i18n betrifft, aktiv durchgeklickt, nicht nur angenommen als "sollte noch gehen".
- **Keine stillen Fehler akzeptieren:** Ein Fehler, der "wahrscheinlich nicht auffällt", wird trotzdem benannt und behoben oder bewusst dokumentiert — nicht ignoriert.
- **Keine "sieht bei mir gut aus"-Freigabe ohne Mindestprüfung:** Ein subjektiver Eindruck ersetzt nicht die konkrete Prüfliste aus Abschnitt 7.

## 7. Manuelle QA-Checkliste

| Bereich | Prüfpunkte |
|---|---|
| **Startseite** | Lädt fehlerfrei, alle Sektionen sichtbar, keine abgeschnittenen Inhalte |
| **Hero** | Kernbotschaft sofort lesbar, Bild lädt ohne Verzögerung (LCP), CTA sichtbar |
| **Navigation** | Alle Links funktionieren, Burger-Menü öffnet/schließt korrekt (mobil), aktueller Zustand erkennbar |
| **CTAs** | Jeder Button löst die erwartete Aktion aus, keine toten Buttons, primärer CTA eindeutig erkennbar |
| **Installations-Checker** | Alle Schritte durchklickbar, Ergebnis korrekt, Print-Funktion funktioniert |
| **Nachhaltigkeitsrechner** | Eingaben werden korrekt verarbeitet, Ergebnis aktualisiert sich live, Formatierung stimmt (Sprache/Zahlenformat) |
| **Sprachumschaltung** | Wechsel zwischen `de`/`en`/`fr` funktioniert auf jeder geprüften Seite, keine hängen gebliebenen Texte in falscher Sprache |
| **FAQ** | Öffnen/Schließen funktioniert, per Tastatur bedienbar, Inhalte inhaltlich korrekt |
| **Blog/Content** | Artikel lädt, Bilder vorhanden, interne Verlinkung funktioniert |
| **Footer** | Alle Links funktionieren, Landmark-Struktur vorhanden |
| **Impressum/Datenschutz** | Erreichbar, aktuell, keine kaputten Verweise |
| **Mobile** | ~375px Viewport: kein horizontales Scrollen, Touch-Targets ausreichend groß, Text lesbar |
| **Tablet** | Übergangsbereich (761px–980px, siehe `CLAUDE.md`-Breakpoints) ohne Layout-Brüche |
| **Desktop** | Große Viewports ohne übermäßigen Weißraum oder gestrecktes Layout |

Diese Liste wird bei jeder nicht-trivialen Änderung durchlaufen, mit Fokus auf die tatsächlich betroffenen Bereiche — nicht jede Änderung erfordert die vollständige Liste, aber die betroffenen Zeilen werden nicht übersprungen.

## 8. Browser- und Geräte-Matrix

Pudado ist ein frühes Startup-Projekt ohne QA-Team und ohne Device-Lab. Diese Matrix ist deshalb bewusst pragmatisch gehalten — hochwertig genug, um die relevanten Fehler zu finden, aber keine erfundene Enterprise-Testmatrix, die in der Praxis nicht durchgehalten würde.

**Pflichtprüfung, bei jeder nicht-trivialen Änderung:**
- Mobile Breite (~375px)
- Tablet Breite (761px–980px)
- Desktop Breite
- Chrome aktuell — automatisiert prüfbar über die in dieser Umgebung verfügbaren Playwright- und Chrome-DevTools-MCP-Werkzeuge (Abschnitt 9, 10)
- Safari auf macOS/iOS, soweit praktisch verfügbar — **derzeit nicht automatisiert möglich**: Die verfügbare Tooling-Umgebung steuert Chromium-basierte Browser, kein Safari/WebKit. Safari-Prüfung ist deshalb aktuell eine manuelle Aufgabe (auf einem echten Mac/iPhone), keine automatisierte — das wird hier bewusst so benannt, statt eine Abdeckung zu behaupten, die nicht besteht.
- Sichtbare Layoutfehler (Überlappungen, abgeschnittener Text, Umbrüche)
- Navigation
- CTAs
- Sprachumschaltung
- Rechner/Checker
- Rechtliche Seiten (Impressum, Datenschutz)

**Optional/später (kein aktueller Anspruch, keine Verpflichtung):**
- Firefox
- Edge
- Ältere Geräte
- Echte Device-Tests (physische Geräte statt Emulation)
- Automatisierte Cross-Browser-Tests (z. B. über einen Cross-Browser-Testing-Dienst)

**Regel:** Die Pflichtliste wird bei jeder nicht-trivialen Änderung tatsächlich durchlaufen. Die Optional-Liste wird nicht stillschweigend als "eigentlich auch nötig" behandelt — sie ist explizit zurückgestellt, bis Pudado eine Größe erreicht, die sie rechtfertigt (siehe `03-engineering`, Offene Fragen zur Modularisierung als vergleichbares Muster: eine Erweiterung erst bei echtem Bedarf, nicht vorsorglich).

## 9. Automatisierte QA mit Playwright

In dieser Umgebung stehen Playwright-MCP-Werkzeuge zur Verfügung (`browser_navigate`, `browser_click`, `browser_type`, `browser_snapshot`, `browser_console_messages`, `browser_take_screenshot`, `browser_resize`, `browser_evaluate` u. a.). Sie werden so eingesetzt:

- **Seiten öffnen:** `browser_navigate` zur lokal laufenden Website (siehe `03-engineering`), nicht zur Annahme, dass eine Änderung "wahrscheinlich funktioniert".
- **Zentrale Buttons klicken:** Primäre CTAs, Navigation, FAQ-Accordions über `browser_click` tatsächlich auslösen, nicht nur im Code auf Vorhandensein prüfen.
- **Sprachwechsel prüfen:** Sprachumschaltung klicken und über `browser_snapshot`/`browser_evaluate` verifizieren, dass sich sichtbarer Text tatsächlich ändert.
- **Rechner/Checker prüfen:** Eingaben über `browser_type`/`browser_click` simulieren, Ergebnis über `browser_snapshot` auslesen und gegen die erwartete Ausgabe prüfen.
- **Broken States erkennen:** `browser_console_messages` nach jeder Interaktion prüfen — ein neuer Fehler nach einem Klick ist ein Befund, kein Rauschen.
- **Screenshots nur sinnvoll einsetzen:** `browser_take_screenshot` für visuelle Regressionsfragen (Layout, Mobile-Ansicht) — nicht als automatischer Schritt bei jeder Prüfung, wenn eine reine Funktionsprüfung ausreicht.
- **Keine Tests erfinden, die nicht zur Website passen:** Kein Test für Funktionen, die nicht existieren (z. B. Warenkorb-Flows, solange kein Shop existiert, siehe `03-engineering`, Offene Fragen) — Tests bilden reale Funktionen ab.
- **Tests als Unterstützung, nicht als Ersatz für menschliche Bewertung:** Ein bestandener automatisierter Klick-Test bestätigt Funktionalität, aber nicht Markenwirkung, Tonalität oder visuelle Qualität (Brand Trust Gate) — diese bleiben menschlicher/manueller Bewertung vorbehalten.

## 10. Chrome DevTools QA

Ergänzend stehen Chrome-DevTools-MCP-Werkzeuge zur Verfügung (`list_console_messages`, `list_network_requests`, `performance_start_trace`/`performance_analyze_insight`, `take_screenshot`, `resize_page`, `emulate`, `take_heapsnapshot` u. a.):

- **Console Errors:** `list_console_messages` nach jeder relevanten Interaktion — jeder neue Eintrag wird bewertet, nicht automatisch ignoriert.
- **Network:** `list_network_requests`/`get_network_request` zur Prüfung auf fehlgeschlagene Requests (404, blockierte Ressourcen) oder unerwartet große Assets.
- **Performance:** `performance_start_trace`/`performance_analyze_insight` zur Einschätzung von LCP/CLS/INP-relevanten Auffälligkeiten bei größeren Änderungen — als Orientierung (siehe Abschnitt 11), nicht als exaktes Versprechen.
- **Layout Shift:** Sichtbare Sprünge während des Ladens über Trace/Screenshot-Vergleich erkennen.
- **Mobile Emulation:** `emulate`/`resize_page` für die Prüfpunkte aus Abschnitt 7/8 (Mobile/Tablet), zusätzlich zu echten Playwright-Viewport-Tests.
- **Accessibility-Hinweise:** Soweit über die verfügbaren Werkzeuge einsehbar (z. B. fehlende Alt-Texte im Rendering) als ergänzender Hinweis, kein Ersatz für die manuelle Prüfung aus Abschnitt 12.
- **Rendering-Probleme:** Visuell über Screenshots erkennbare Darstellungsfehler (kaputte Schriftarten, fehlende Bilder).
- **Langsame Assets:** Über Network-Liste identifizierbare, ungewöhnlich große oder langsame Ressourcen.
- **JavaScript-Fehler:** Deckt sich mit Console-Prüfung — jeder Laufzeitfehler wird vor Abschluss der Änderung geklärt, nicht nur zur Kenntnis genommen.

## 11. Performance Quality

- **Core Web Vitals als Zielbereich:** LCP, CLS, INP werden als Richtung verstanden ("besser, nicht schlechter"), nicht als exakte Zielzahlen — echte Zielwerte fehlen aktuell (siehe Offene Fragen, Abschnitt 24).
- **Lighthouse als Orientierung, nicht als blinder Selbstzweck:** Ein Lighthouse-Lauf gibt Hinweise, aber ein einzelner Score wird nicht unreflektiert als Erfolg oder Misserfolg gewertet — insbesondere werden **keine Lighthouse-Zahlen erfunden oder erinnert**, wenn kein tatsächlicher Lauf stattgefunden hat.
- **Bildgrößen prüfen:** Gegen `03-engineering`, Abschnitt 9 (Bildoptimierung) — kein unkomprimiertes oder überdimensioniertes Bild wird unbemerkt übernommen.
- **Lazy Loading prüfen:** Korrekt gesetzt außerhalb des ersten Viewports, korrekt *nicht* gesetzt für above-the-fold-Inhalte.
- **Font Loading prüfen:** Nur tatsächlich sichtbare Schnitte vorab geladen, keine ungenutzten Preloads.
- **Animationen prüfen:** Gegen `02-brand-design`, Abschnitt 9 — keine layoutverändernden Animationseigenschaften.
- **JavaScript gering halten:** Neue Funktionen fügen sich in die bestehende, schlanke Struktur ein (siehe `03-engineering`, Abschnitt 6), statt das Gesamtgewicht spürbar zu erhöhen.
- **Keine schweren Libraries ohne Freigabe:** Deckt sich mit `03-engineering` — eine neue Abhängigkeit ist ein Engineering-Konflikt-Fall (siehe `03-engineering`, Abschnitt 15), kein Quality-Detail, das man einfach durchwinkt.
- **Keine Performance-Verschlechterung für rein dekorative Effekte:** Ein Effekt ohne Informationswert, der Ladezeit kostet, besteht das Performance Gate nicht (siehe `02-brand-design`, Abschnitt 13).

## 12. Accessibility Quality

- **WCAG AA als Mindestanspruch**, nicht als Zielideal für "später" (siehe `00-core`, Qualitätsprinzipien).
- **Kontraste:** Mind. 4.5:1 Fließtext, 3:1 große Typo/UI-Elemente — jede neue Textfarbe wird dagegen geprüft, nicht nach Augenmaß gewählt.
- **Tastaturbedienung:** Jedes interaktive Element per Tab erreichbar und bedienbar, in logischer Reihenfolge.
- **Fokuszustände:** Sichtbares `:focus-visible` für jedes interaktive Element, kein entferntes Outline ohne Ersatz.
- **Screenreader-Struktur:** Landmarks (`nav`, `main`, `footer`) und Skip-Link bleiben erhalten und funktionsfähig.
- **Sinnvolle Button-/Linktexte:** Kein "hier klicken" oder "mehr" ohne Kontext — Linktext beschreibt Ziel/Aktion eigenständig.
- **`prefers-reduced-motion`:** Jede neue Animation respektiert diese Einstellung.
- **Keine rein farbcodierten Informationen:** Status (z. B. Sage-Grün für "passt") wird immer zusätzlich über Text/Icon vermittelt.
- **Keine Animationen, die Nutzer stören:** Blinkende, sich wiederholende oder unerwartet auslösende Bewegungen werden vermieden, unabhängig von `prefers-reduced-motion` (das ist eine zusätzliche, keine ersetzende Maßnahme).

## 13. Security Quality

- **Keine Tokens im Repository** — weder in Code, noch in Konfigurationsdateien, die versehentlich committet werden könnten.
- **Keine Secrets in Prompts, Dateien oder Commits** — auch nicht temporär "zum Testen", auch nicht in PDOS-Dokumenten selbst.
- **Keine `.zshrc`/`.zshenv`-Änderungen** im Rahmen von Website-/PDOS-Arbeit — lokale Shell-Konfiguration ist kein Bestandteil dieses Projekts (siehe `03-engineering`, Abschnitt 11).
- **Externe Ressourcen kritisch prüfen:** Jedes neue externe Skript wird vor Einbindung auf Herkunft, Zweck und Datenschutz-Implikation geprüft.
- **Keine unnötigen Drittanbieter-Skripte:** Im Zweifel dagegen, nicht dafür (siehe `03-engineering`, Abschnitt 11).
- **Formular-/Input-Sicherheit:** Nutzereingaben (Kontaktformular, Rechner, Checker) werden defensiv behandelt, keine ungeprüfte Weiterverarbeitung.
- **XSS-Risiken vermeiden:** Kein dynamisch eingefügter Nutzer-Input ohne Escaping in HTML/JS.
- **GitHub- und MCP-Sicherheit:** Zugriffstoken für GitHub/MCP-Server werden ausschließlich über Umgebungsvariablen verwaltet, nie im Projekt-Repository oder in PDOS-Dokumenten referenziert.
- **Bei versehentlich sichtbaren Tokens sofort rotieren:** Ein Token, das versehentlich in einem Terminal-Output, einer Datei oder einem Gespräch sichtbar wurde, gilt ab diesem Moment als kompromittiert und wird umgehend widerrufen und ersetzt — unabhängig davon, wie gering das tatsächliche Risiko eingeschätzt wird. Dieses Vorgehen wurde bereits einmal in diesem Projekt so gehandhabt (GitHub-PAT-Rotation) und gilt als Standardverfahren, nicht als Einzelfall.

## 14. Privacy / DSGVO Quality

- **Datensparsamkeit als Markenprinzip**, nicht nur Compliance-Pflicht (siehe `00-core`, Brand DNA).
- **Keine Tracking-Skripte ohne klare Freigabe** — jedes neue Tracking ist ein Privacy-Gate-Fall (Abschnitt 3), keine stille technische Ergänzung.
- **Keine Analytics ohne Datenschutzprüfung** — auch datenschutzfreundlich wirkende Tools (z. B. selbst gehostete, cookie-lose Analytics) werden vor Einsatz geprüft, nicht automatisch als unbedenklich angenommen.
- **Keine Cookies ohne Zweck** — jedes Cookie hat einen benennbaren, notwendigen Zweck; kein Cookie "auf Vorrat".
- **Consent nur, wenn nötig und korrekt** — ein Consent-Banner wird nicht präventiv eingeführt, "damit man ihn hat", sondern nur, wenn tatsächlich einwilligungspflichtige Verarbeitung stattfindet, und dann rechtlich korrekt umgesetzt.
- **Datenschutzseite aktuell halten:** `datenschutz.html` wird bei jeder Änderung an Datenverarbeitung (neues Formular, neues Tracking) mit aktualisiert, nicht nachträglich vergessen.
- **Keine personenbezogenen Daten ohne Grund erfassen** — jedes neue Formularfeld wird darauf geprüft, ob es tatsächlich benötigt wird.
- **Growth-Messung darf Datenschutz nicht unterlaufen** — siehe Abschnitt 15, das ist keine abstrakte Regel, sondern eine konkrete, immer wiederkehrende Prüfpflicht.

## 15. Growth-Tracking-Konflikt lösen

`04-growth` (Abschnitt 15) definiert Messbereiche wie Conversion Rate, Klickrate, Scrolltiefe oder organischen Traffic, ohne zu klären, *wie* diese datenschutzkonform gemessen werden dürfen. Dieser Abschnitt schließt genau diese Lücke — als direkte Anwendung der Gate-Priorität aus Abschnitt 4: Security & Privacy Gate (Rang 1) steht über dem Growth/Conversion Gate (Rang 7).

**Was darf ohne Tracking gemessen/qualitativ geprüft werden?**
- Manuelle Nutzertests (eine Person beobachtet, wie jemand die Seite nutzt) — liefert Signale zu Verständlichkeit, Vertrauen, Installationsverständnis (siehe `04-growth`, Abschnitt 15) ganz ohne technisches Tracking.
- Direktes qualitatives Feedback (Support-Anfragen, Rückmeldungen, informelle Gespräche) — bereits in `01-executive`, Abschnitt 8 als Messbereich "Nutzerfeedback" vorgesehen.
- Serverseitige, aggregierte Logdaten ohne Personenbezug (z. B. reine Aufruf-/Fehlerzahlen eines Hostings, sofern ohnehin vorhanden und nicht personenbezogen erweitert) — sofern kein zusätzliches Skript/Cookie nötig ist.
- FAQ-Nutzung und Checker-/Rechner-Ergebnisse lassen sich grundsätzlich aggregiert und ohne Personenbezug auswerten, **sofern** die technische Umsetzung das sicherstellt (siehe unten, "braucht Datenschutzprüfung").

**Was braucht menschliche Freigabe?**
- Jede Einführung eines neuen Tracking- oder Analytics-Tools, unabhängig davon, wie datenschutzfreundlich es beworben wird.
- Jede Erweiterung eines Formulars um zusätzliche erfasste Daten.
- Jede A/B-Test-/Experiment-Infrastruktur (siehe `04-growth`, Abschnitt 14), die Nutzerverhalten unterscheidbar erfassen müsste.

**Was braucht Datenschutzprüfung (unabhängig von der Freigabe-Frage)?**
- Jedes Tool, das Cookies setzt oder Nutzer:innen über Sitzungen hinweg wiedererkennbar macht.
- Jedes Tool mit Datenübertragung an Drittanbieter/-server außerhalb der eigenen Infrastruktur.
- Jede Auswertung, die theoretisch auf einzelne Personen rückführbar sein könnte, auch wenn das nicht beabsichtigt ist.

**Welche Tracking-Ideen sind vorerst tabu?**
- Klassische Drittanbieter-Analytics mit Cookie-basiertem Tracking (z. B. Standard-Setups großer Werbenetzwerke) — widerspricht direkt der bestehenden DSGVO-Haltung (selbst gehostete Fonts, kein unnötiges Tracking, siehe `CLAUDE.md`).
- Cross-Site-Tracking oder Retargeting-Pixel jeglicher Art, solange keine explizite strategische Entscheidung dafür vorliegt (wäre ein `01-executive`-Fall, kein Quality-Detail).
- Session-Recording/Heatmap-Tools, die Mausbewegung oder Eingaben aufzeichnen, ohne dass das Verhältnis von Erkenntnisgewinn zu Datenschutzrisiko bewusst abgewogen wurde.

**Wie kann Pudado datenschutzfreundlich lernen?** Über die Kombination aus qualitativen Methoden (oben, ohne Tracking) und – falls später eingeführt – datensparsamen, aggregierenden, cookie-losen Analyseansätzen, die vor Einführung durch das Security & Privacy Gate (Abschnitt 3, 4) laufen. Bis eine solche Lösung geprüft und freigegeben ist, bleiben die quantitativen Messbereiche aus `04-growth`, Abschnitt 15 **grundsätzlich nicht datenschutzkonform messbar** — das ist eine ehrliche Einschränkung, keine Lücke, die stillschweigend übergangen wird.

## 16. SEO Quality

- **Title/Meta prüfen:** Jede Seite hat eindeutigen `<title>` und `meta description` (siehe `04-growth`, Abschnitt 9).
- **Heading-Struktur prüfen:** Ein `h1` pro Seite, logisch verschachtelte `h2`/`h3`.
- **OpenGraph prüfen:** `og:title`, `og:description`, `og:image`, `og:locale`/`og:locale:alternate` konsistent zur ausgespielten Sprache.
- **Schema/JSON-LD prüfen:** Strukturdaten bei inhaltlichen Änderungen (Produktdaten, FAQ, Artikel) aktuell gehalten — veraltete Strukturdaten schaden mehr als keine (siehe `CLAUDE.md`).
- **Sitemap prüfen:** Neue Seiten in `sitemap.xml` aufgenommen, `lastmod` aktuell.
- **`robots.txt` prüfen:** Keine versehentliche Blockierung relevanter Seiten.
- **Canonical prüfen:** Keine Duplicate-Content-Fallen ohne `canonical`-Link.
- **Keine Keyword-Stuffing-Optimierung:** Deckt sich mit `04-growth`, Abschnitt 9 — SEO-Änderungen werden gegen Lesbarkeit/Tonalität geprüft, nicht nur gegen Keyword-Vorkommen.
- **Keine SEO-Texte, die Marke oder UX verschlechtern:** Ein SEO Gate, das isoliert "besteht", aber das Brand Trust oder UX & Accessibility Gate verletzt, gilt insgesamt als nicht bestanden (siehe Abschnitt 3, 4 — Gates wirken zusammen und nach Rangfolge, nicht isoliert).

## 17. Release Readiness

Eine Änderung ist bereit für Veröffentlichung, wenn:

- `git status`/`git diff` sauber und nachvollziehbar sind (siehe `03-engineering`, Abschnitt 12).
- Keine unerwarteten Dateien enthalten sind (z. B. `.DS_Store`, lokale Konfigurationsdateien).
- Keine Tokens oder Secrets enthalten sind (Security & Privacy Gate bestanden).
- Die Mindestprüfung aus Abschnitt 6 durchlaufen wurde.
- Die Mobile-Prüfung bestanden wurde.
- Die Browser-Konsole sauber ist.
- Kernfunktionen (Navigation, i18n, Rechner, Checker, Formular) funktionieren.
- SEO-, Accessibility- und Performance-Gates geprüft und nicht offensichtlich verschlechtert wurden.
- Bekannte Risiken dokumentiert sind (nicht verschwiegen, auch wenn sie klein erscheinen).
- Bei relevanten Änderungen (siehe `01-executive`, Abschnitt 10, Punkt 3/4 zur Abgrenzung operativ/strategisch) menschliche Freigabe eingeholt wurde.

Fehlt einer dieser Punkte, ist die Änderung nicht release-bereit — unabhängig davon, wie dringend sie erscheint.

## 18. Rollback- und Incident-Vorgehen

Diese Lücke wurde in `03-engineering` explizit offen benannt: Was passiert, wenn nach einer Änderung tatsächlich etwas kaputt ist? Das folgende ist das allgemeine Vorgehen; konkrete Szenarien mit spezifischen Sofortmaßnahmen stehen in Abschnitt 19.

1. **Sofortmaßnahme:** Keine weitere Änderung vornehmen, bevor der aktuelle Fehlerzustand verstanden ist — kein "schnell noch etwas anderes fixen", das den Zustand weiter verkompliziert.
2. **Betroffene Änderung identifizieren:** Welche kürzliche Änderung korreliert zeitlich/inhaltlich mit dem Fehler?
3. **`git diff`/`git status` prüfen:** Was genau wurde zuletzt verändert, an welchen Dateien?
4. **Letzte funktionierende Version finden:** Über `git log` den letzten bekannt guten Commit identifizieren.
5. **Rollback-Optionen abwägen:**
   - Gezielter Fix der eigentlichen Ursache (bevorzugt, wenn Ursache klar und Fix klein ist).
   - Revert des spezifischen fehlerhaften Commits (`git revert`), wenn die Ursache eindeutig einer Änderung zuzuordnen ist.
   - Zurücksetzen auf den letzten funktionierenden Stand als letztes Mittel, nur nach Rücksprache (siehe `CLAUDE.md`, Git-Workflow: keine destruktiven Git-Operationen ohne ausdrückliche Rücksprache).
6. **Nutzer-/Business-Auswirkung einschätzen:** Betrifft der Fehler eine Kernfunktion (Rechner, Checker, Kontaktformular) oder ein Randelement? Das bestimmt die Dringlichkeit, nicht die technische Komplexität des Fixes.
7. **Problem dokumentieren:** Was ist passiert, was war die Ursache, was war die Lösung — kurz, aber nachvollziehbar (z. B. im nächsten Commit oder in einer Notiz), damit derselbe Fehler nicht wiederholt wird.
8. **Keine weiteren Features bauen, bevor der Fehler verstanden ist** — siehe die verbindliche Regel in Abschnitt 19.

## 19. Incident-Prozess v0.2 – erste echte Reaktionslogik

Abschnitt 18 beschreibt das allgemeine Vorgehen. Dieser Abschnitt macht es für die sechs wahrscheinlichsten konkreten Fehlerbilder greifbar — jeweils mit Sofortmaßnahme, Prüfung, Fix-/Rollback-Entscheidung und Dokumentationspflicht.

**1. Website lädt nach einer Änderung nicht**
- *Sofortmaßnahme:* Keine weitere Änderung; lokale Website erneut laden, Browser-Konsole öffnen.
- *Prüfen:* `git diff`/`git status` — welche Datei wurde zuletzt verändert? Konsole auf Syntaxfehler (JS) oder fehlerhafte Referenzen (CSS/HTML) prüfen.
- *Zurückrollen oder fixen:* Bei eindeutigem, kleinem Syntaxfehler direkt fixen; bei unklarer Ursache `git revert` des letzten Commits.
- *Dokumentieren:* Ursache und Fix kurz festhalten.
- *Erst danach weiterentwickeln.*

**2. Mobile ist kaputt (Desktop funktioniert)**
- *Sofortmaßnahme:* Betroffene CSS-Änderung identifizieren, keine weitere Layout-Änderung vornehmen.
- *Prüfen:* Mobile-Breakpoints (siehe `CLAUDE.md`) gezielt gegen die letzte Änderung prüfen; Playwright/Chrome-DevTools-Emulation (Abschnitt 8, 9, 10) zur Reproduktion nutzen.
- *Zurückrollen oder fixen:* Gezielter CSS-Fix bevorzugt, da meist lokal begrenzt; Revert nur, wenn die Ursache nicht schnell eingrenzbar ist.
- *Dokumentieren:* Welcher Breakpoint/welche Regel betroffen war.
- *Erst danach weiterentwickeln.*

**3. Sprache/Übersetzungen sind kaputt**
- *Sofortmaßnahme:* Sprachumschaltung in allen drei Sprachen (`de`/`en`/`fr`) testen, um Umfang einzugrenzen (eine Sprache vs. alle).
- *Prüfen:* `translations.js` auf fehlenden/fehlerhaften Key prüfen (siehe `03-engineering`, Abschnitt 7); Konsole auf Fehler in `applyLanguage`/`initI18n`.
- *Zurückrollen oder fixen:* Fehlenden Key ergänzen ist meist der schnellste, sicherste Fix; bei struktureller Beschädigung (z. B. kaputtes JSON) Revert des `translations.js`-Commits.
- *Dokumentieren:* Betroffene Sprache(n) und Key(s).
- *Erst danach weiterentwickeln.*

**4. Rechner oder Checker liefert falsche Werte**
- *Sofortmaßnahme:* Funktion sofort als "kritisch" einstufen (siehe Abschnitt 20) — das sind zentrale Conversion-Elemente (siehe `03-engineering`, Abschnitt 6).
- *Prüfen:* Erwartetes vs. tatsächliches Ergebnis mit definierten Testwerten reproduzieren (Playwright, Abschnitt 9); zuletzt geänderten Code in `initCalculator`/`initChecker` bzw. umgebender Logik (`buildFormatters`, `render`) identifizieren.
- *Zurückrollen oder fixen:* Kein Live-Zustand mit falschem Ergebnis bleibt bestehen — im Zweifel sofort auf letzten korrekten Stand zurückrollen, auch wenn die Ursache noch nicht vollständig verstanden ist, und danach in Ruhe fixen.
- *Dokumentieren:* Falsches vs. korrektes Verhalten, Ursache, Fix.
- *Erst danach weiterentwickeln.*

**5. Ein Token/Secret wird sichtbar**
- *Sofortmaßnahme:* Sofortige Rotation des betroffenen Tokens (siehe Abschnitt 13) — unabhängig von Uhrzeit oder Dringlichkeit anderer Arbeit.
- *Prüfen:* Wo genau wurde das Token sichtbar (Code, Commit-Historie, Terminal-Output, Gespräch)? Ist es bereits committet/gepusht?
- *Zurückrollen oder fixen:* Rotation ersetzt das Token; falls in der Git-Historie committet, zusätzlich prüfen, ob die Historie bereinigt werden muss (nur nach Rücksprache, da das history-verändernde Operationen sind, siehe `CLAUDE.md`, Git-Workflow).
- *Dokumentieren:* Was passiert ist, welches Token betroffen war, wann rotiert wurde.
- *Erst danach weiterentwickeln.*

**6. Eine Änderung betrifft rechtliche Seiten oder Datenschutz**
- *Sofortmaßnahme:* Keine eigenständige Veröffentlichung — dieser Fall ist per Definition ein Legal/DSGVO-Gate-Fall (Rang 2, Abschnitt 4) und braucht menschliche Freigabe, bevor er live geht.
- *Prüfen:* Betrifft die Änderung `impressum.html`/`datenschutz.html` direkt, oder eine neue Datenverarbeitung (Formular, Tracking), die dort nachgezogen werden müsste (siehe Abschnitt 14)?
- *Zurückrollen oder fixen:* Bis zur Freigabe bleibt die Änderung unveröffentlicht, nicht "vorläufig live mit Vorbehalt".
- *Dokumentieren:* Was geändert wurde, warum, und wer die Freigabe erteilt hat.
- *Erst danach weiterentwickeln.*

**Verbindliche Regel für alle sechs Szenarien und jeden als kritisch eingestuften Fehler (siehe Abschnitt 20):**

> **Keine neuen Features bauen, bevor der Fehler verstanden, eingegrenzt und behoben oder bewusst zurückgerollt wurde.**

Diese Regel hat Vorrang vor jeder Roadmap-Priorität aus `01-executive` — ein ungeklärter kritischer Fehler blockiert neue Arbeit, unabhängig davon, wie wichtig diese neue Arbeit erschien, bevor der Fehler auftrat.

## 20. Fehlerklassifikation

| Klasse | Beispiele | Reaktionslogik | Release blockiert? | Menschliche Entscheidung nötig? |
|---|---|---|---|---|
| **Kritisch** | Website lädt nicht, Rechner/Checker liefert falsche Ergebnisse, Datenschutzverstoß, Sicherheitslücke, Secret im Repository | Sofortmaßnahme gemäß Abschnitt 18/19 vor allem anderen | Ja, immer | Ja, immer |
| **Hoch** | Sprachumschaltung defekt, wichtige CTA funktioniert nicht, deutliche Layout-Brüche auf Mobile | Zeitnahe Behebung vor nächstem Release | Ja | Ja, wenn Ursache unklar oder Rollback nötig |
| **Mittel** | Einzelne fehlerhafte Übersetzung, kleinere Accessibility-Lücke, nicht-kritischer Konsolenfehler | Behebung geplant, kein sofortiger Stopp | Nein, aber dokumentiert | Nein, außer bei Häufung |
| **Niedrig** | Kleine SEO-Metadaten-Lücke, suboptimale, aber funktionierende Formatierung | Behebung bei Gelegenheit | Nein | Nein |
| **Kosmetisch** | Minimale visuelle Abweichung ohne Funktionsbezug (z. B. 2px Abstandsdifferenz) | Notiert, keine Eile | Nein | Nein |

Eine Einstufung als "niedrig" oder "kosmetisch" wird nicht genutzt, um ein eigentlich höher liegendes Problem kleinzureden — im Zweifel wird eine Klasse höher eingestuft, nicht niedriger. Für "Kritisch" gilt zusätzlich immer die Regel aus Abschnitt 19: keine neuen Features, bis der Fehler behoben oder bewusst zurückgerollt ist.

## 21. Definition of Done für Quality

Eine Änderung gilt erst als abgeschlossen, wenn **alle** folgenden Punkte zutreffen:

- Sie funktioniert technisch (verifiziert, nicht angenommen).
- Sie beschädigt keine Kernfunktion.
- Sie funktioniert mobil.
- Sie erzeugt keine sichtbaren Fehler.
- Sie erzeugt keine Console-Fehler.
- Sie respektiert Datenschutz (siehe Abschnitt 14, 15).
- Sie enthält keine Secrets.
- Sie verschlechtert Accessibility nicht.
- Sie verschlechtert Performance nicht unnötig.
- Sie passt zur Marke.
- Sie wurde dokumentiert (was geändert wurde, was geprüft wurde, welche Risiken bleiben).

## 22. Claude-Code-Quality-Verhalten

Claude Code muss bei jeder Änderung:

- **Vor der Änderung Risiken nennen** — was könnte durch diese Änderung betroffen sein?
- **Nach der Änderung tatsächlich prüfen** — gemäß Abschnitt 6–10, nicht nur behaupten, dass geprüft wurde.
- **Nicht einfach "fertig" sagen** — eine abgeschlossene Änderung wird mit dem beschrieben, was tatsächlich geprüft wurde, nicht mit einer pauschalen Erfolgsmeldung.
- **Fehler offen benennen** — auch wenn sie durch die eigene Änderung entstanden sind.
- **Annahmen markieren** — deckt sich mit `00-core`, Golden Rule 10.
- **Keine Tests vortäuschen** — ein nicht durchgeführter Test wird nicht als durchgeführt dargestellt.
- **Keine erfundenen Scores nennen** — kein Lighthouse-Wert, keine Prozentzahl, die nicht tatsächlich gemessen wurde (siehe Abschnitt 11).
- **Bei unsicherer Datenlage ehrlich sein** — "das wurde nicht getestet" ist eine gültige, sogar erwünschte Aussage.
- **Bei Security-/Privacy-Fragen eskalieren** — kein eigenständiger Entscheid bei Funden gemäß Abschnitt 13/14, sondern Meldung und, wo nötig, sofortiges Handeln (z. B. Token-Rotation gemäß Abschnitt 19, Szenario 5) plus Information an den/die Projektverantwortliche:n (siehe `01-executive`, Abschnitt 10).
- **Bei Gate-Konflikten dem Vorgehen aus Abschnitt 5 folgen** — Konflikt benennen, Gates nennen, Priorität anwenden, Optionen vergleichen, Risiken erklären, Empfehlung geben, bei strategischer/rechtlicher/sicherheits- oder markenrelevanter Tragweite menschliche Freigabe einholen.

## 23. Anti-Patterns

- **Commit ohne Prüfung** — widerspricht Abschnitt 6.
- **Release ohne mobile Ansicht** — widerspricht Abschnitt 17.
- **Tracking ohne Datenschutzentscheidung** — widerspricht Abschnitt 15.
- **Token im Code** — widerspricht Abschnitt 13.
- **Console Errors ignorieren** — widerspricht Abschnitt 6, 9, 10.
- **Lighthouse-Zahlen erfinden** — widerspricht Abschnitt 11, 22.
- **Accessibility als optional behandeln** — widerspricht Abschnitt 2, 12.
- **"Nur ein kleiner Fix" ohne Test** — die Größe einer Änderung sagt nichts über ihr Risiko aus.
- **Design schön, aber unbenutzbar** — UX & Accessibility Gate zugunsten rein optischer Vorlieben ignoriert, widerspricht der Gate-Priorität aus Abschnitt 4.
- **Growth schneller als Vertrauen** — widerspricht `04-growth`, Abschnitt 2, und der Gate-Priorität aus Abschnitt 4.
- **SEO wichtiger als Nutzerverständnis** — widerspricht `04-growth`, Abschnitt 9; SEO Gate kann Brand Trust oder UX & Accessibility Gate laut Abschnitt 4 nicht aufwiegen.
- **Rollback nicht vorbereitet** — kein Wissen über den letzten funktionierenden Stand, wenn ein Incident eintritt.
- **Gate-Konflikt stillschweigend auflösen** — ohne Konflikt zu benennen, Optionen zu vergleichen oder Priorität anzuwenden (widerspricht Abschnitt 5).
- **Trotz kritischem Fehler an neuen Features weiterarbeiten** — widerspricht der verbindlichen Regel in Abschnitt 19.

## 24. Offene Fragen

- **Finaler Deployment-Prozess fehlt** (siehe `03-engineering`, Offene Fragen) — ohne ihn ist "Release Readiness" (Abschnitt 17) ein Zustand, aber der tatsächliche Veröffentlichungsschritt danach ist nicht beschrieben.
- **Hosting-Ziel muss geklärt werden** — beeinflusst, welche Performance-/Security-Annahmen (z. B. verfügbare Server-Header, CDN) überhaupt zutreffen.
- **Analytics-Strategie fehlt** — Abschnitt 15 definiert die Grenzen, aber keine konkrete Lösung ist bisher geprüft oder freigegeben.
- **Cookie-/Consent-Strategie fehlt** — es ist unklar, ob und wann ein Consent-Mechanismus überhaupt nötig wird.
- **Automatisierte Tests sind noch nicht fest im Projekt verankert** — aktuell keine CI-Konfiguration, kein Testverzeichnis im Repository; Playwright/Chrome-DevTools-Nutzung (Abschnitt 9, 10) erfolgt aktuell manuell angestoßen, nicht automatisiert bei jedem Commit.
- **Echte Qualitäts-Baselines fehlen** — es gibt keine dokumentierten aktuellen Lighthouse-/Performance-Werte als Ausgangspunkt; jede zukünftige "Verbesserung" oder "Verschlechterung" kann erst ab dem Moment gemessen werden, an dem eine erste Baseline erhoben wird.
- **Release-Verantwortliche sind noch nicht final definiert** — deckt sich mit der in `01-executive`, Abschnitt 14 offenen Rollenklärung.
- **Incident-Prozess muss in der Praxis getestet werden** — Abschnitt 18/19 ist ein plausibles, jetzt szenariobasiertes Vorgehen, aber bisher nicht an einem echten Vorfall erprobt; ob es in der Praxis vollständig trägt, ist offen.
- **Safari-/WebKit-Prüfung ist aktuell nicht automatisierbar** (siehe Abschnitt 8) — bleibt eine manuelle Aufgabe, bis eine geeignete Lösung (z. B. Cross-Browser-Testing-Dienst) geprüft und freigegeben ist.
- **Eine dedizierte Instanz für Gate-Konflikte innerhalb von Quality fehlt** — Abschnitt 4/5 lösen die meisten Fälle über die Rangfolge, aber falls zwei Gates auf demselben Rang stehen, verweist das Vorgehen auf menschliche Freigabe, ohne zu definieren, wer das konkret ist (deckt sich mit der in `01-executive` offenen Rollenklärung).

---

*Dies ist Version 0.2.1 — v0.1 war der erste Entwurf für den Quality-Bereich, aufbauend auf `00-core` v0.2.1, `01-executive` v0.1, `02-brand-design` v0.1.1, `03-engineering` v0.1 und `04-growth` v0.1 und schloss die dort offen benannten Lücken zu Rollback/Incident und Growth-Tracking-Datenschutz. v0.2 schloss die in der v0.1-Selbstkritik benannten strukturellen Lücken: eine Rangfolge zwischen den Quality Gates (Abschnitt 4), ein Vorgehen bei Gate-Konflikten (Abschnitt 5), eine pragmatische Browser-/Geräte-Matrix (Abschnitt 8) und sechs konkrete Incident-Szenarien mit Reaktionslogik (Abschnitt 19). v0.2.1 vereinheitlicht die Gate-Namen (Abschnitt 3/4, inkl. neuem Legal/DSGVO Gate) und korrigiert die zitierte Gesamt-Priorität auf die kanonische Reihenfolge aus `00-core` v0.2.2. Änderungen werden im übergeordneten `CHANGELOG.md` dokumentiert.*

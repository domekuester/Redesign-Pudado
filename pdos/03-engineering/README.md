# 03 — Engineering

**Version:** 0.1.1
**Status:** Erster Entwurf. Rangfolge in Abschnitt 15 in v0.1.1 an die kanonische PDOS-weite Priorität aus `00-core` angeglichen.

Dieses Dokument baut auf [`pdos/README.md`](../README.md), [`00-core/README.md`](../00-core/README.md), [`01-executive/README.md`](../01-executive/README.md), [`02-brand-design/README.md`](../02-brand-design/README.md) und `CLAUDE.md` im Projektwurzelverzeichnis auf. Es regelt, *wie* technisch gearbeitet wird. Konkrete Detailkonventionen (genaue Attribut-Reihenfolge, exakte Tokens, Datei-für-Datei-Regeln) bleiben in `CLAUDE.md` als technische Referenz — dieses Dokument erklärt das *Warum* und den Rahmen dahinter und verweist auf `CLAUDE.md`, statt es zu duplizieren. Bei Widerspruch zwischen diesem Dokument und `00-core`/`01-executive`/`02-brand-design` haben diese Vorrang.

---

## 1. Zweck dieses Dokuments

**Warum Engineering-Regeln für Pudado wichtig sind:** Die Website ist laut `00-core` ein langfristiges Produkt, kein Wegwerf-Prototyp. Ein dependency-freies, handgeschriebenes HTML/CSS/JS-Projekt bleibt nur dann über Jahre wartbar, wenn Konsistenz aktiv verteidigt wird — ohne Framework-Leitplanken (Komponenten-Erzwingung, Linting-Defaults, Typsystem) entsteht Inkonsistenz schneller als in einem Framework-Projekt, nicht langsamer. Dieser Bereich ersetzt diese fehlenden Leitplanken durch explizite Regeln.

**Welche Entscheidungen dieser Bereich regelt:**
- Wie neue HTML-, CSS- und JavaScript-Änderungen strukturiert werden.
- Wie Performance, Accessibility und Sicherheit technisch sichergestellt werden.
- Wie mit der bestehenden i18n-Struktur (`translations.js`) umgegangen wird.
- Wie Claude Code bei technischen Aufgaben vorgeht, testet und Risiken benennt.
- Wie technische Zielkonflikte (z. B. Design vs. Performance) aufgelöst werden.

**Welche Entscheidungen NICHT hierher gehören:**
- Ob eine Funktion überhaupt gebaut werden soll — das ist eine Priorisierungsfrage aus `01-executive`.
- Wie etwas aussehen oder wirken soll — das regelt `02-brand-design`; Engineering setzt das *technisch* um, entscheidet aber nicht über visuelle Wirkung.
- SEO-Content-Strategie und Textplanung — gehört in `04-growth`.
- Testkriterien und QA-Prozesse im Detail — gehören in `05-quality`; dieses Dokument definiert nur, was direkt nach einer Code-Änderung geprüft wird (Abschnitt 14).

## 2. Technische Grundhaltung

- **Stabilität vor Experiment:** Die Website funktioniert heute zuverlässig für echte Nutzer:innen. Neue Technik wird nicht eingeführt, um sie auszuprobieren, sondern weil sie ein konkretes Problem löst.
- **Verständlichkeit vor cleverem Code:** Code, der beim ersten Lesen verstanden wird, ist besser als Code, der kürzer oder eleganter, aber schwerer nachvollziehbar ist. Das gilt besonders, weil es kein Typsystem und keine Tests gibt, die Fehler bei unklarem Code auffangen würden.
- **Performance vor Effekthascherei:** Ein technisch beeindruckender Effekt, der Ladezeit oder Interaktionsfähigkeit spürbar verschlechtert, ist keine Verbesserung (siehe `00-core`, Definition von Premium: "kein Glanz, der nur oberflächlich hält").
- **Progressive Enhancement:** Kernfunktionen (Inhalte lesen, navigieren, Kontakt aufnehmen) funktionieren auch, wenn JavaScript langsam lädt oder einzelne Features nicht greifen. JavaScript verbessert die Erfahrung, ist aber nicht Voraussetzung für die Grundfunktion.
- **Mobile-first:** Jede neue Komponente wird zuerst für kleine Viewports entworfen und implementiert, dann für größere erweitert (siehe `CLAUDE.md`, Mobile-First-Regeln) — nicht umgekehrt.
- **Kleine, kontrollierte Änderungen:** Eine Änderung betrifft einen erkennbaren, abgegrenzten Bereich. Große, unübersichtliche Änderungen über viele Dateien gleichzeitig erschweren Review und Fehlersuche.
- **Keine unnötige Komplexität:** Die einfachste Lösung, die das Problem tatsächlich löst, ist die richtige Lösung — nicht die technisch interessanteste.

## 3. Projektarchitektur

Die Website ist ein statisches, mehrsprachiges HTML/CSS/JS-Projekt ohne Build-System und ohne Framework (siehe `CLAUDE.md`). Die reale Struktur im Repository, Stand dieses Dokuments:

| Pfad | Verantwortung |
|---|---|
| `index.html` | Hauptseite: Hero, Produktvorstellung, Rechner, Checker, Trust-Elemente, FAQ — die zentrale Konversionsseite. |
| `style.css` | Single Source of Truth für alle Design-Tokens (`:root`-Block) und alle Komponentenstile. |
| `script.js` | Gesamte Interaktivität: i18n (`initI18n`, `applyLanguage`, `t()`), Navigation (`initNav`), Verbrauchsrechner (`initCalculator`), Installations-Checker (`initChecker`), Bildvorschau (`initImagePreview`), Galerie (`initGallery`), Sticky-CTA (`initStickyCta`), Kontaktformular (`initContactForm`). |
| `translations.js` | Zentrale Übersetzungsdaten unter `window.PUDADO_I18N`, Grundlage der Mehrsprachigkeit (`de`/`en`/`fr`). |
| `assets/` | Bilder (JPG für Fotos, SVG/PNG für Icons/Logos) und `assets/fonts/` mit selbst gehosteten Cabinet-Grotesk- und Inter-Schriftschnitten (`.woff2`). |
| `blog/` | Redaktionelle Artikel als eigenständige HTML-Seiten plus `blog/index.html` als Übersicht. |
| `situations/` | Anwendungsfall-Seiten (z. B. Schwangerschaft, Senioren, Familien) — reale Nutzungssituationen statt abstrakter Feature-Listen. |
| `impressum.html`, `datenschutz.html` | Rechtliche Pflichtseiten. |
| `404.html` | Fehlerseite. |
| `robots.txt`, `sitemap.xml` | SEO-Infrastruktur. |
| `CLAUDE.md` | Technische Detailkonventionen (Attributreihenfolge, exakte Tokens, Git-Workflow) — die operative Referenz neben diesem strategischeren `03-engineering`-Dokument. |
| `pdos/` | Das Betriebssystem selbst — nicht Teil der ausgelieferten Website, sondern Arbeitsgrundlage für die Weiterentwicklung. |
| `_backup_original/` | Referenzstand vor dem Redesign — wird nicht verändert, dient als Rollback-Referenz. |

**Größenordnung (Stand dieses Dokuments, informativ, kein Zielwert):** `index.html` ~800 Zeilen, `style.css` ~910 Zeilen, `script.js` ~830 Zeilen, `translations.js` ~2.090 Zeilen. Diese Größen sind eine Beobachtung, keine Grenze — sie sind relevant für die offene Frage zur Modularisierung (Abschnitt 18).

## 4. HTML-Standards

- **Semantisches HTML:** `section`, `nav`, `header`, `footer`, `figure`, `summary`/`details` für FAQ — wie im Bestand konsequent umgesetzt (siehe `CLAUDE.md`). Neue Inhalte nutzen das passende semantische Element, kein generisches `div` für alles.
- **Saubere Heading-Struktur:** Ein `h1` pro Seite, danach `h2`/`h3` logisch verschachtelt — Struktur dient SEO und Accessibility gleichermaßen (siehe `CLAUDE.md`, SEO-Regeln).
- **Sinnvolle Sections:** Eine Section transportiert einen Gedanken/eine Funktion (siehe `02-brand-design`, Abschnitt 7) — das ist eine Design-Regel, die sich direkt in der HTML-Struktur widerspiegeln muss.
- **Buttons vs. Links:** Ein `<button>` löst eine Aktion auf der Seite aus (öffnen, berechnen, senden), ein `<a>` navigiert zu einer neuen Seite/Position. Diese Unterscheidung wird nicht aus optischen Gründen vertauscht (siehe `00-core`, UX-Regeln: "Klarheit vor Cleverness").
- **Alt-Texte:** Jedes Bild bekommt einen beschreibenden, kontextbezogenen Alt-Text (siehe `02-brand-design`, Bildsprache) — leeres `alt=""` nur bei rein dekorativen Bildern.
- **ARIA nur wenn nötig:** ARIA ergänzt semantisches HTML, ersetzt es nicht. Bestehende `aria-*`-Muster (Navigation, Menüzustände) sind der Maßstab für neue interaktive Elemente.
- **Keine unnötigen Wrapper:** Ein zusätzliches `div` ohne semantische oder stilistische Funktion wird nicht eingeführt, nur um CSS zu vereinfachen — erst prüfen, ob ein bestehendes Element die Rolle übernehmen kann.
- **SEO- und Accessibility-freundliche Struktur:** Beide Anforderungen ziehen bei sauberem semantischem HTML meist in dieselbe Richtung — eine Struktur, die für Screenreader funktioniert, funktioniert in der Regel auch für Suchmaschinen.

## 5. CSS-Standards

- **Design Tokens sind die einzige Quelle für visuelle Werte.** Der `:root`-Block in `style.css` definiert Farben, Abstände, Radien, Schatten als `--`-Variablen — neue Werte werden dort ergänzt, nie als Magic Number direkt in einem Selektor verwendet (siehe `CLAUDE.md`).
- **Farben** folgen der in `00-core`/`02-brand-design` entschiedenen Logik: **Royal Blue (`--blue`) als primäre Markenfarbe**, **Weiß/Mist als dominante Ruhefläche**, **Sage (`--sage`) ausschließlich als semantische Statusfarbe**, **Türkis nur sehr sparsam als Wasser-/Interaktionsakzent** und ausschließlich mit einem geprüften, freigegebenen Token (siehe `02-brand-design`, Abschnitt 5 — ein Türkis-Token existiert aktuell noch nicht in `style.css`).
- **Abstände** ausschließlich über bestehende Spacing-Tokens (u. a. `--space`) — keine neuen, freihändig gewählten Pixel-Werte für Sektionsabstände.
- **Typografie** ausschließlich über `--font-head` (Cabinet Grotesk) und `--font-body` (Inter) sowie die bestehende Größen-/Zeilenhöhen-Skala (siehe `02-brand-design`, Abschnitt 6) — keine neuen Schriftfamilien, keine Ad-hoc-Schriftgrößen außerhalb der Hierarchie.
- **Breakpoints** ausschließlich die bestehenden (`max-width: 480px / 560px / 760px / 860px / 980px`, `min-width: 761px`, siehe `CLAUDE.md`) — ein neuer Breakpoint nur bei einem realen, nicht anders lösbaren Layout-Problem.
- **Komponentenklassen** folgen der bestehenden Konvention Basisklasse + Modifier (`btn`/`btn-primary`, `.usecase-card`, `.faq-item`) in kebab-case, komponentenbezogen — neue Komponenten reihen sich in dieses Schema ein.
- **Utility-Klassen nur kontrolliert:** Einzelne, breit wiederverwendbare Hilfsklassen (z. B. für Sichtbarkeit, Textausrichtung) sind akzeptabel, wenn sie bewusst als Utility eingeführt und konsistent benannt werden — keine Ad-hoc-Utility-Klasse für einen einzigen Anwendungsfall.
- **Keine zufälligen Einzelwerte:** Ein Abstand, eine Farbe oder eine Schriftgröße, die nicht aus einem bestehenden Token ableitbar ist, ist ein Signal, dass entweder ein neues Token bewusst ergänzt werden sollte (mit Begründung) oder die Anforderung überdacht werden sollte.
- **Kein `!important`** außer als letzter, begründeter Ausweg (siehe `CLAUDE.md`) — insbesondere kein `!important`, um eine unklare Kaskade zu "reparieren", statt die eigentliche Ursache zu beheben.
- **Keine Designentscheidungen außerhalb des Designsystems:** Eine CSS-Änderung, die de facto eine neue Designentscheidung trifft (neue Farbe, neues Grundraster), ist keine Engineering-Aufgabe mehr, sondern gehört zuerst nach `02-brand-design`/`01-executive` (siehe Abschnitt 15, Engineering-Konflikte).

## 6. JavaScript-Standards

- **Vanilla JS sauber halten:** Kein Framework, keine neuen Abhängigkeiten (siehe `CLAUDE.md`, dependency-freies Projekt ist eine bewusste Entscheidung, keine Übergangslösung).
- **Kleine Funktionen mit klaren Zuständigkeiten:** Die bestehende Struktur in `script.js` — je eine `init*()`-Funktion pro Feature (`initI18n`, `initNav`, `initCalculator`, `initChecker`, `initImagePreview`, `initGallery`, `initStickyCta`, `initContactForm`) — wird fortgeführt. Eine neue Funktion übernimmt eine Aufgabe, nicht mehrere.
- **Keine globalen Seiteneffekte ohne Grund:** Keine neuen globalen Variablen außer bewusst geschütztem Namespace (`window.PUDADO_I18N` ist die bestehende, akzeptierte Ausnahme) — neue globale Zustände werden vermieden oder klar gekapselt.
- **Fehlerbehandlung:** Nutzer-sichtbare Funktionen (Rechner, Checker, Formular) dürfen bei unerwarteter Eingabe nicht stillschweigend brechen — ein Fehlerzustand wird sichtbar behandelt, nicht ignoriert (siehe `00-core`, UX-Regeln zu Fehlerzuständen).
- **Event-Listener sauber setzen:** `addEventListener` statt inline `on*`-Handler (bestehendes Muster), mit Prüfung auf Existenz des Elements vor dem Binden (wie im Bestand, z. B. `if (pMinus) pMinus.addEventListener(...)`), um Fehler bei fehlenden Elementen zu vermeiden.
- **Keine unnötigen Libraries:** Eine neue Abhängigkeit wird nur eingeführt, wenn eine Vanilla-JS-Lösung unverhältnismäßig aufwändig wäre — und dann nur nach expliziter Freigabe (siehe Abschnitt 15).
- **Funktionen nicht duplizieren:** Vor einer neuen Funktion prüfen, ob eine bestehende (z. B. Formatierungslogik im Rechner) erweitert statt dupliziert werden kann.
- **Bestehende Rechner und Checker nicht kaputtmachen:** `initCalculator` und `initChecker` sind zentrale Conversion-Elemente (siehe `00-core`, Conversion-Optimierung) — Änderungen an umgebendem Code werden gegen diese Funktionen getestet (siehe Abschnitt 14), bevor sie als abgeschlossen gelten.

## 7. Internationalisierung / `translations.js`

- **Keine neuen Texte hart in HTML einbauen**, wenn die Seite über `translations.js` läuft — neue Texte werden als Übersetzungs-Keys gepflegt, nicht als Freitext im Markup (siehe `CLAUDE.md`, Internationalisierung).
- **Neue Texte über die bestehende i18n-Struktur pflegen:** Keys folgen der bestehenden Konvention `bereich.element` (z. B. `nav.start`, `hero.h1a`) und werden über `window.PUDADO_I18N` / die `t()`-Funktion in `script.js` eingebunden.
- **Sprachumschaltung nicht beschädigen:** `applyLanguage`/`initI18n` sind zentrale, seitenweite Mechanismen — Änderungen an Navigation, neuen Sektionen oder Komponenten werden gegen alle unterstützten Sprachen getestet (siehe Abschnitt 14), nicht nur gegen Deutsch.
- **Fehlende Übersetzungen sichtbar markieren:** Ein fehlender Key darf nicht zu leerem oder kaputtem UI führen — im Zweifel ist ein sichtbarer, erkennbarer Platzhalter besser als eine stille Lücke.
- **Keine Mischung aus DE/EN/FR ohne System:** Aktuell unterstützte Sprachen sind `de`/`en`/`fr` (siehe `CLAUDE.md`). Eine zusätzliche Sprache (z. B. Chinesisch) ist eine strategische Entscheidung, keine technische Detailaufgabe — sie gehört nach `01-executive`/`04-growth`, bevor sie technisch umgesetzt wird, und muss dann vollständig (alle Keys, alle Seiten) eingeführt werden, nicht teilweise.

## 8. Komponenten-Engineering

Technische Standards, ergänzend zu den gestalterischen Vorgaben in `02-brand-design`, Abschnitt 8:

- **Hero:** Above-the-fold, ohne `loading="lazy"` auf dem Hero-Bild (LCP-kritisch), mit `<link rel="preload">` für die im ersten Bildschirm sichtbaren Schriftschnitte (siehe `CLAUDE.md`).
- **Navigation:** `initNav` steuert Burger-Menü und Sprachumschaltung; neue Navigationspunkte fügen sich in die bestehende Funktion ein, statt eine parallele Navigationslogik zu schaffen.
- **Buttons:** `btn`-Basisklasse mit Modifiern (Abschnitt 5); jeder Button hat eindeutigen, verständlichen Linktext/Label, keine generischen "Klick hier"-Texte (siehe `00-core`, Accessibility-Regeln).
- **Cards:** Einheitliche Struktur (Bild/Icon, Headline, Text, ggf. Aktion) über alle Kartentypen — technisch als wiederverwendbare Klassenkombination, nicht als kopierte, leicht abweichende Einzel-Implementierung pro Sektion.
- **Trust-Elemente:** Statisches Markup, keine externen Drittanbieter-Widgets ohne Datenschutzprüfung (siehe Abschnitt 11, Security Engineering).
- **FAQ:** Natives `<details>`/`<summary>` (bestehendes Muster) statt selbst gebauter Accordion-Logik in JavaScript — nutzt native Tastaturbedienbarkeit und Screenreader-Unterstützung kostenlos.
- **Installations-Checker (`initChecker`):** Zustandslogik bleibt in `script.js` gekapselt; jeder neue Check-Schritt wird gegen bestehende Zustände (inkl. Print-Funktion, `afterprint`-Handling) getestet, nicht isoliert.
- **Nachhaltigkeitsrechner (`initCalculator`):** Eingabe-Validierung und Formatierung (`buildFormatters`) bleiben zentral; ein neues Eingabefeld nutzt denselben `render()`-Zyklus statt eigener Neuberechnung.
- **Blog-/Contentbereiche:** Jede neue Artikelseite folgt der bestehenden Struktur (Meta-Angaben, Heading-Hierarchie, interne Verlinkung) einer vorhandenen `blog/*.html`-Seite als Vorlage.
- **Footer:** Landmark-Struktur (`footer`-Element, siehe `CLAUDE.md`, Accessibility) bleibt über alle Seiten identisch — keine seitenspezifischen Footer-Varianten ohne Grund.
- **Produktsektionen:** Bild- und Textstruktur folgt der bestehenden Attributreihenfolge bei Bildern (`width`/`height`, `src`, `alt`, `loading`, `decoding`, siehe `CLAUDE.md`).

## 9. Performance Engineering

- **Bildgrößen:** JPG für Fotos in sinnvoller Zielauflösung, SVG für Icons/Logos, keine unkomprimierten Rohbilder (siehe `CLAUDE.md`, Bildoptimierung).
- **Lazy Loading:** `loading="lazy"` für alle Bilder außerhalb des ersten Viewports, above-the-fold-Bilder bewusst ohne Lazy-Loading (LCP).
- **CSS-Größe:** Ungenutztes CSS wird entfernt, nicht angehäuft (siehe `CLAUDE.md`, "Remove dead CSS" als gelebte Praxis in der Commit-Historie) — neue Komponenten prüfen zuerst, ob bestehende Klassen wiederverwendbar sind, bevor neues CSS ergänzt wird.
- **JavaScript-Größe:** Keine neuen Abhängigkeiten (Abschnitt 6); neue Funktionen werden `defer`/modular geladen, kein zusätzliches Render-blocking Skript ohne Not.
- **Animationen:** Nur Transform/Opacity, keine layoutverändernden Eigenschaften (siehe `02-brand-design`, Abschnitt 9) — direkt CLS-relevant.
- **Fonts:** Selbst gehostet, nur tatsächlich above-the-fold sichtbare Schnitte vorab per `<link rel="preload">` geladen, keine ungenutzten Schriftschnitte nachladen (siehe `CLAUDE.md`).
- **Layout Shift:** Bilder immer mit `width`/`height`-Attributen (reservierter Platz), keine Nachlade-Effekte, die Layout verschieben.
- **Core Web Vitals:** LCP (größtes Content-Element so früh wie möglich), CLS (kein unerwarteter Sprung), INP (keine langen blockierenden JS-Tasks) — wie in `00-core` als Messbereich definiert, hier technisch verbindlich umgesetzt.
- **Lighthouse-Ziele:** Es gibt aktuell **keine dokumentierten Ziel-Scores** — das wird als offene Frage behandelt (Abschnitt 18), nicht als erfundene Zahl hier festgelegt.
- **Keine schweren Effekte ohne Nutzen:** Ein Effekt (Parallax, aufwändige Scroll-Animation), der spürbar Rechenleistung kostet, aber keinen Verständnis- oder Vertrauensgewinn bringt (siehe `02-brand-design`, Abschnitt 9), wird nicht umgesetzt.

## 10. Accessibility Engineering

- **Tastaturbedienung:** Alle interaktiven Elemente (Buttons, Links, Formularfelder, Checker-Optionen) per Tab erreichbar und bedienbar, logische Tab-Reihenfolge.
- **Fokuszustände:** `:focus-visible` sichtbar für jedes interaktive Element — kein `outline: none` ohne gleichwertigen Ersatz (siehe `CLAUDE.md`).
- **Kontraste:** WCAG AA (mind. 4.5:1 Fließtext, 3:1 große Typo/UI) — `--gray-light` ist bereits gezielt darauf kalibriert; neue Textfarben werden gegen denselben Maßstab geprüft, nicht nach Augenmaß gewählt.
- **Screenreader-Struktur:** Landmark-Elemente (`nav`, `main`, `footer`) und Skip-Link bleiben über neue Seiten hinweg erhalten (siehe `CLAUDE.md`).
- **`prefers-reduced-motion`:** Bereits global respektiert — jede neue Animation/Keyframe muss diese Regel ebenfalls einhalten (deaktivieren oder stark reduzieren), nicht nur die bereits vorhandenen Animationen.
- **Buttons/Links verständlich benennen:** Linktext beschreibt das Ziel/die Aktion eigenständig, auch ohne umgebenden Kontext (relevant für Screenreader-Nutzer:innen, die Linklisten durchgehen).
- **Keine rein visuellen Informationen ohne Alternative:** Status (z. B. "Installations-Check passt") wird nicht nur über Farbe (Sage) vermittelt, sondern zusätzlich über Text/Icon (siehe `00-core`, Accessibility-Regeln).

## 11. Security Engineering

- **Keine Tokens im Code:** API-Schlüssel, Zugangsdaten oder Ähnliches werden nie in HTML/CSS/JS-Dateien eingebettet oder ins Repository committet.
- **Keine Secrets committen:** Vor jedem `git add`/`git commit` wird geprüft, ob versehentlich sensible Dateien oder Werte enthalten sind (siehe Abschnitt 12).
- **Keine `.zshrc`/`.zshenv`-Änderungen durch Engineering-Aufgaben:** Lokale Shell-/Umgebungskonfiguration ist kein Teil der Website-Codebasis und wird im Rahmen von Website-Engineering-Aufgaben nicht angefasst.
- **Keine unsicheren Inline-Scripts ohne Grund:** Dynamisch eingefügter Nutzer-Input wird nie ungeschätzt in HTML/JS eingefügt (XSS-Vermeidung, siehe `CLAUDE.md`).
- **Externe Ressourcen kritisch prüfen:** Jedes neue externe Skript/Tracking wird auf Datenschutz-Implikationen geprüft, bevor es eingebunden wird (siehe `00-core`, Vertrauen als Markenkern) — im Zweifel dagegen, nicht dafür.
- **Formulare und Nutzereingaben defensiv behandeln:** Kontaktformular (`initContactForm`) und andere Eingabefelder werden clientseitig plausibilisiert; sensible Daten werden nie im Klartext geloggt oder in `localStorage` abgelegt (siehe `CLAUDE.md`, Sicherheitsregeln). Serverseitige Validierung wird nachgezogen, sobald ein Backend existiert (aktuell nicht vorhanden — Annahme, kein bestätigter Fakt).
- **Externe Links** (`target="_blank"`) erhalten `rel="noopener noreferrer"` (Tabnabbing-Schutz, bestehende Regel aus `CLAUDE.md`).

## 12. Git- und Branch-Regeln

- **Nie direkt große Änderungen ohne Plan:** Umfangreiche Änderungen werden vorher grob skizziert (betroffene Dateien, Vorgehen), nicht direkt "drauflos" umgesetzt.
- **Neue Branches für größere Arbeiten:** Feature-/Redesign-Arbeit auf thematisch benannten Branches (`bereich/kurzbeschreibung`), `main` bleibt der stabile, deploybare Stand (siehe `CLAUDE.md`, Git-Workflow).
- **Kleine Commits:** Ein Commit deckt eine inhaltlich zusammenhängende Änderung ab, keine Sammel-Commits ohne erkennbaren roten Faden.
- **Klare Commit-Messages:** Präzise, im Imperativ formuliert, beschreiben die inhaltliche Änderung (siehe `CLAUDE.md`, Commit-Regeln und Beispiele aus der Historie).
- **Keine lokalen Maschinenkonfigurationen committen:** `.DS_Store`, lokale IDE-Einstellungen oder Ähnliches gehören nicht ins Repository.
- **Vor Commit prüfen:** `git status` und `git diff` (bzw. `git status --short`) vor jedem Commit, um unbeabsichtigte Änderungen (Formatierungsrauschen, versehentlich geänderte Übersetzungen) auszuschließen — deckt sich mit der bestehenden Regel in `CLAUDE.md`.

## 13. Claude-Code-Arbeitsweise

Bei technischen Aufgaben gilt folgende verbindliche Reihenfolge (deckt sich mit dem Entscheidungsprozess in `01-executive`, Abschnitt 9, hier für Engineering konkretisiert):

1. **Zuerst analysieren** — betroffenen Code lesen und verstehen, bevor eine Änderung vorgeschlagen wird.
2. **Betroffene Dateien nennen** — explizit auflisten, was verändert werden soll, bevor es verändert wird.
3. **Risiko einschätzen** — was kann durch diese Änderung kaputtgehen (Sprachumschaltung, Rechner, Checker, Layout)?
4. **Plan schreiben** — kurze Skizze des Vorgehens, besonders bei Änderungen, die mehrere Dateien betreffen.
5. **Erst nach Freigabe umsetzen** — bei nicht-trivialen Änderungen (siehe `01-executive`, Abschnitt 10, Punkt 4 zur Abgrenzung operativ/strategisch).
6. **Danach testen** — gemäß Abschnitt 14 dieses Dokuments.
7. **Änderungen zusammenfassen** — was wurde geändert und warum, knapp und konkret.
8. **Offene Risiken nennen** — was wurde bewusst nicht geprüft oder bleibt unsicher, statt es zu verschweigen.

## 14. Testing & Verification

Nach jeder nicht-trivialen Änderung wird geprüft:

- Lokale Website öffnet sich fehlerfrei.
- Browser-Konsole zeigt keine neuen Fehler.
- Mobile funktioniert (kleiner Viewport, ~375px).
- Desktop funktioniert.
- Sprachumschaltung (`de`/`en`/`fr`) funktioniert weiterhin.
- Buttons lösen die erwartete Aktion aus.
- Nachhaltigkeitsrechner (`initCalculator`) und Installations-Checker (`initChecker`) liefern weiterhin korrekte Ergebnisse.
- Keine kaputten internen oder externen Links.
- Keine sichtbaren Layoutfehler (Überlappungen, abgeschnittener Text, unerwarteter Umbruch).
- Keine spürbare Performance-Verschlechterung (subjektive Ladezeit, keine neuen Layout-Shifts).

Diese Liste ist eine Mindestprüfung nach jeder Änderung, kein Ersatz für die ausführlicheren Kriterien, die in `05-quality` entstehen sollen.

## 15. Engineering-Konflikte

Wie in `02-brand-design` (Abschnitt 13) gilt die kanonische Rangfolge aus `00-core` (Sicherheit, Recht & Datenschutz > Markenvertrauen > Produktverständnis > UX & Accessibility > Stabilität & Engineering > Performance > Conversion/Growth > SEO > Umsetzungsgeschwindigkeit) als Grundlage. Für typische Engineering-spezifische Konflikte:

- **Design vs. Performance:** Performance gewinnt bei rein kosmetischem Zusatznutzen; bei markenrelevanten Elementen (z. B. Hero-Bildqualität) wird zuerst technisch optimiert (Kompression, moderne Formate), bevor auf visuelle Qualität verzichtet wird.
- **SEO vs. Klarheit:** Klarheit/Tonalität gewinnt (siehe `02-brand-design`, Abschnitt 13) — SEO-Text wird technisch so eingebunden, dass er sich in die bestehende Struktur einfügt, nicht als separater Textblock.
- **Animation vs. Accessibility:** Accessibility gewinnt immer, ohne Ausnahme.
- **Schnelle Lösung vs. wartbare Lösung:** Wartbare Lösung gewinnt bei dauerhaftem Code (siehe `00-core`, "Qualität vor Geschwindigkeit"). Eine bewusst schnelle, technisch suboptimale Lösung ist nur akzeptabel, wenn sie explizit als befristeter Kompromiss benannt wird (siehe `00-core`, Qualitätsprinzipien).
- **Neue Funktion vs. Stabilität:** Stabilität gewinnt — eine neue Funktion, die bestehende, funktionierende Bereiche (insbesondere Rechner/Checker/i18n) gefährdet, wird nicht auf Kosten dieser Bereiche umgesetzt.
- **Conversion vs. Vertrauen:** Vertrauen gewinnt (siehe `00-core`/`02-brand-design`) — eine technische Umsetzung, die Conversion durch Drucktaktiken erzwingt (z. B. manipulative Ladezustände, künstliche Verzögerung), wird nicht umgesetzt.

**Vorgehen bei Konflikten:** Claude Code vergleicht Optionen (mindestens zwei) und gibt eine begründete Empfehlung entlang der Rangfolge oben. Bei strategischen oder riskanten Entscheidungen (z. B. Einführung einer neuen Abhängigkeit, Änderung der Grundarchitektur, Eingriff in Rechner/Checker-Kernlogik) wird menschliche Freigabe eingeholt, über die Entscheidungsvorlage aus `01-executive`, Abschnitt 11 — nicht eigenständig entschieden.

## 16. Definition of Done für Engineering

Eine technische Änderung gilt erst als abgeschlossen, wenn **alle** folgenden Punkte zutreffen:

- Sie funktioniert (manuell verifiziert, nicht nur angenommen).
- Sie ist verständlich (ein:e andere:r Entwickler:in versteht sie ohne mündliche Erklärung).
- Sie beschädigt keine bestehende Funktion (insbesondere i18n, Rechner, Checker, Navigation).
- Sie funktioniert mobil.
- Sie verschlechtert Performance nicht unnötig.
- Sie verschlechtert Accessibility nicht.
- Sie respektiert i18n (keine hartkodierten Texte, wo `translations.js` greift).
- Sie wurde getestet (gemäß Abschnitt 14).
- Sie wurde sauber zusammengefasst (was wurde geändert, warum, welche Risiken bleiben).

## 17. Anti-Patterns

- **Komplette Neuschreibung ohne Grund:** Eine bestehende, funktionierende Komponente wird nicht ersetzt, nur weil eine "sauberere" Implementierung denkbar wäre — Umschreibungen brauchen einen konkreten Anlass.
- **Unnötige Frameworks:** Ein Framework/eine Library für ein Problem, das Vanilla JS/CSS in vertretbarem Aufwand löst, widerspricht der bewussten dependency-freien Architekturentscheidung.
- **CSS-Chaos:** Neue Selektoren ohne Bezug zur bestehenden Namenskonvention, verstreute Ad-hoc-Werte statt Tokens.
- **Doppelte Funktionen:** Zwei JavaScript-Funktionen, die dasselbe Problem leicht unterschiedlich lösen, statt eine bestehende zu erweitern.
- **Harte Texte trotz `translations.js`:** Neuer sichtbarer Text direkt im HTML/JS statt als i18n-Key, auf einer Seite, die bereits über `translations.js` läuft.
- **Ungetestete Animationen:** Eine neue Animation, die nicht gegen `prefers-reduced-motion` und Mobile getestet wurde.
- **Desktop-first:** Eine Komponente, die zuerst für große Viewports gebaut und nachträglich "responsive gemacht" wird, statt mobile-first zu entstehen.
- **Schnelle Hacks:** Ein unsauberer Workaround, der nicht als bewusster, befristeter Kompromiss benannt wird (siehe `00-core`, Qualitätsprinzipien).
- **Geheime Daten im Code:** Tokens, Schlüssel oder Zugangsdaten im Quellcode oder in Commits.
- **Änderungen ohne `git status`/`git diff`:** Ein Commit, der nicht vorher auf unbeabsichtigte Inhalte geprüft wurde.
- **Designentscheidungen im Code ohne Abgleich mit PDOS:** Eine neue Farbe, ein neues Grundraster oder eine neue Komponentenlogik, die direkt in `style.css`/HTML entsteht, ohne vorher gegen `02-brand-design` geprüft zu sein.

## 18. Offene Fragen

Diese Fragen sind bewusst nicht vorentschieden:

- **Ob langfristig ein Build-System nötig wird** — aktuell kein klarer technischer Grund dafür; relevant würde es z. B. bei deutlich wachsender CSS-/JS-Größe oder bei Bedarf an automatisierter Bildoptimierung.
- **Ob Komponenten stärker modularisiert werden sollen** — `script.js` und `translations.js` sind bereits mehrere hundert bis über 2.000 Zeilen groß (Abschnitt 3); ob eine Aufteilung in mehrere Dateien sinnvoll wird, ist offen und hängt vom weiteren Wachstum ab.
- **Ob Tests automatisiert ins Projekt aufgenommen werden** — aktuell keine automatisierten Tests vorhanden; Testing erfolgt manuell (Abschnitt 14).
- **Ob Bildoptimierung systematisch automatisiert wird** — aktuell manuell/Ad-hoc, kein automatisierter Optimierungs-Workflow (z. B. Build-Step, CI-Check) vorhanden.
- **Ob Blog/Content technisch erweitert wird** (z. B. CMS-Anbindung statt einzelner HTML-Dateien) — aktuell rein statisch, keine Entscheidung dazu getroffen.
- **Ob später ein Shop-System angebunden wird** — hätte erhebliche architektonische Konsequenzen (Backend, Zahlungsabwicklung, Sicherheitsanforderungen); aktuell nicht vorbereitet oder entschieden.
- **Ob der Deployment-Workflow final definiert ist** — in diesem Dokument nicht beschrieben, da kein bestätigter, dokumentierter Deployment-Prozess vorliegt; sollte ergänzt werden, sobald einer feststeht.

---

*Dies ist Version 0.1.1 — v0.1 war der erste Entwurf für den Engineering-Bereich, aufbauend auf `00-core` v0.2.1, `01-executive` v0.1 und `02-brand-design` v0.1.1, sowie der realen Projektstruktur zum Zeitpunkt der Erstellung. v0.1.1 korrigiert die in Abschnitt 15 zitierte Rangfolge (zuvor Conversion vor Performance) auf die kanonische Reihenfolge aus `00-core` v0.2.2. Änderungen werden im übergeordneten `CHANGELOG.md` dokumentiert.*

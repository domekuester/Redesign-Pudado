# CLAUDE.md

Diese Datei ist die dauerhafte Projektanleitung für alle zukünftigen Arbeiten an diesem Repository. Sie gilt für jede Session und jede Änderung – unabhängig davon, wer sie anstößt. Pudado/EcoBum ist ein langfristiges Produkt, kein Wegwerf-Prototyp: Entscheidungen sollen so getroffen werden, dass sie in einem Jahr noch tragfähig sind.

## Projekt

- **Projektname:** Pudado
- **Produkt:** EcoBum – ein modernes Plug-and-Play-Handbidet für Reinigung mit Wasser (kein Strom, einfache Installation).
- **Ziel:** Entwicklung einer hochwertigen Premium-Lifestyle-Marke für moderne Badezimmer.
- **Fokus:** Hygiene, Nachhaltigkeit, Design und Benutzerfreundlichkeit.
- **Markenstil:** Modern, vertrauenswürdig, hochwertig, zeitlos. Jede Designentscheidung muss dieses Markenbild stützen.

## Markenidentität

- **Positionierung:** Premium-Lifestyle-Marke, kein austauschbares Haushaltsprodukt – EcoBum konkurriert im Wahrnehmungsraum mit Apple, Dyson und Nothing, nicht mit klassischen Bad-/Sanitärartikeln.
- **Kernbotschaft:** "Wasser reinigt. Papier reibt." – Wasser als sanftere, hygienischere Alternative/Ergänzung zu trockenem Papier. Diese Botschaft ist der rote Faden für Copy, Bildsprache und Struktur; neue Inhalte sollen sie stützen, nicht verwässern.
- **Tonalität:** Ruhig, selbstbewusst, sachlich-hochwertig. Keine reißerischen Superlative, keine Ausrufezeichen-Kaskaden, kein "Klopapier"-Bashing – die Marke erklärt und überzeugt, statt zu schreien.
- **Ein-Akzent-Prinzip:** Die Marke bleibt konsequent einfarbig Blau (`--blue`). `--sage` (Grün) ist ausschließlich eine semantische Status-Farbe (z. B. "Installations-Check passt"), **kein** zweiter Markenakzent. Keine weiteren Akzentfarben ohne ausdrückliche Freigabe einführen.
- **Bildsprache:** Helle, hochwertige Badezimmer, natürliche Materialien (Holz, Stein, Textil), reale Anwendungssituationen (`situations/`). Keine klinisch-sterilen Produktfotos ohne Kontext, keine Stock-Foto-Ästhetik, die nach generischem Warehouse-Shop aussieht.
- **DSGVO/Vertrauen als Markenkern:** Selbst gehostete Fonts statt Google-Fonts-CDN, kein unnötiges Tracking – Datensparsamkeit ist Teil des Markenversprechens ("vertrauenswürdig"), nicht nur Compliance-Pflicht.

## Tech-Stack (Ist-Zustand)

- Statische, mehrsprachige Website: reines HTML/CSS/JavaScript, kein Build-System, kein Framework.
- Zentrale Dateien: `index.html`, `style.css`, `script.js`, `translations.js`.
- Content-Sektionen: `situations/` (Anwendungsfälle), `blog/` (Artikel), `assets/` (Bilder, selbst gehostete Fonts unter `assets/fonts/`).
- Rechtliches: `impressum.html`, `datenschutz.html`.
- SEO-Infrastruktur bereits vorhanden: `sitemap.xml`, `robots.txt`, JSON-LD-Strukturdaten, Open-Graph/Twitter-Meta in `index.html`.
- Fonts werden bewusst selbst gehostet (Cabinet Grotesk, Inter) statt über Google Fonts CDN – **DSGVO-Entscheidung, nicht rückgängig machen** ohne ausdrückliche Rücksprache.
- `_backup_original/` enthält den Stand vor dem Redesign – nicht verändern, dient als Referenz/Rollback.

## Design-System

Single Source of Truth für alle Design-Tokens ist der `:root`-Block in `style.css`. Neue Werte werden dort als Variable ergänzt, nie als Magic Number direkt in einer Komponente verwendet.

### Farbpalette

| Token | Wert | Verwendung |
|---|---|---|
| `--blue` | `#235FD0` | Signature Blue – primärer Markenakzent (Buttons, Links, Icons) |
| `--blue-ink` | `#1E4FB0` | Hover/aktive Zustände auf Blau |
| `--blue-deep` | `#163A86` | Dunkle Blau-Variante (z. B. Gradients, Footer-Akzente) |
| `--blue-soft` | `#5C8AE6` | Abgeschwächtes Blau (dezente Akzente) |
| `--navy` / `--navy-deep` | `#1B2A4A` / `#131E36` | Text-Farbe und Footer-Fläche – **nicht** als zweite Markenfarbe verwenden |
| `--paper` | `#FFFFFF` | Reines Weiß, primäre Fläche |
| `--mist`, `--mist-2` | `#F6F9FE`, `#EFF4FC` | Helle Panel-Flächen (Apple-Weißraum-Charakter) |
| `--sky`, `--sky-soft`, `--sky-line` | `#EAF2FE`, `#F1F6FE`, `#DCE8FA` | Pastell-Blau für Icon-Kacheln, Chips, dezente Linien |
| `--ink` | `#1B2A4A` | Überschriften |
| `--gray` | `#566173` | Fließtext |
| `--gray-light` | `#64707F` | Sekundärtext/Legal-Hinweise – bewusst auf WCAG-AA-Kontrast (≈5:1 auf Weiß) kalibriert |
| `--border`, `--border-cool`, `--border-soft` | `#E7ECF4`, `#E4EBF6`, `#E9EEF6` | Neutrale, kühle Trennlinien |
| `--sage` | `#4E7C63` | **Nur** semantische Status-Farbe (z. B. Installations-Check "passt"), kein Marken-Akzent |

Regeln:
- Keine neuen Rohfarben (Hex-Codes) direkt in Selektoren einbauen – immer über bestehende oder neu deklarierte `--`-Variablen.
- Kontrastverhältnisse (WCAG AA, mind. 4.5:1 für Fließtext, 3:1 für große Typo/UI-Elemente) bei jeder neuen Farbkombination prüfen, bevor sie verwendet wird.
- Schatten (`--shadow-xs` … `--shadow-lg`, `--card-shadow`) und Radien (`--radius-sm` … `--radius-pill`) sind ebenfalls Tokens – wiederverwenden statt neu erfinden.

### Typografie

- **Headlines:** `--font-head` = "Cabinet Grotesk" (selbst gehostet), Fallback auf Apple-/System-Font-Stack.
- **Fließtext:** `--font-body` = "Inter" (selbst gehostet), gleicher Fallback-Stack.
- Beide Schriftschnitte liegen unter `assets/fonts/` und werden per `@font-face` eingebunden; die im ersten Bildschirm sichtbaren Schnitte sind in `index.html` per `<link rel="preload">` vorab geladen – das gilt es bei neuen Schriftschnitten/Gewichten konsistent fortzuführen.
- Keine zusätzlichen Web-Fonts (insbesondere keine Google-Fonts-CDN-Einbindung) ohne ausdrückliche Freigabe – Verstoß gegen die DSGVO-Entscheidung oben.
- Schriftgrößen und Zeilenhöhen folgen einer klaren hierarchischen Skala (Headline > Subheadline > Body > Caption); neue Textblöcke ordnen sich in diese Hierarchie ein statt neue Ad-hoc-Größen zu definieren.

### Layout-Tokens

- `--container: 1200px` als maximale Inhaltsbreite.
- `--space: clamp(76px, 10vw, 160px)` als fluider Standard-Sektionsabstand – neue Sektionen verwenden dieses Token statt fixer Pixel-Abstände.
- Radien konsequent über `--radius-*`, Schatten konsequent über `--shadow-*` / `--card-shadow`.

## Komponenten-Standards

- Bestehende Klassenkonvention beibehalten: Basisklasse + Modifier, z. B. `btn` als Basis mit `btn-primary`, `btn-ghost`, `btn-light`, `btn-link` als Varianten. Neue Komponenten folgen demselben Muster (Basisklasse + sprechender Modifier) statt neuer, inkonsistenter Namensschemata.
- Vor dem Bau einer neuen Komponente prüfen, ob eine bestehende (Karte, Button, Chip, Accordion/FAQ-Item etc.) wiederverwendet oder erweitert werden kann, statt eine Variante zu duplizieren.
- Komponenten werden mobile-first und mit Zustanden (hover, focus-visible, active, disabled) definiert, nicht nur für den Idealzustand.
- Interaktive Elemente erhalten sichtbare Fokuszustände (`:focus-visible`) – niemals `outline: none` ohne gleichwertigen Ersatz.
- Icons/Illustrationen folgen einheitlicher Strichstärke/Stil (siehe Commit-Historie: "unify icon strokes") – neue Icons müssen sich optisch einfügen.

## Designprinzipien

- Premium-Look auf dem Niveau von Apple, Dyson und Nothing.
- Minimalistisch, viel Weißraum.
- Hochwertige Typografie.
- Sanfte, flüssige Animationen (keine ruckartigen oder überladenen Effekte).
- Mobile First, responsive auf allen Geräten.
- Konsistente Farbpalette und Design-System – neue Komponenten müssen sich in bestehende Variablen/Patterns in `style.css` einfügen, keine Ad-hoc-Werte.

## Mobile-First-Regeln

- Basis-Styles gelten für Mobile; Erweiterungen für größere Viewports erfolgen über `min-width`- bzw. gezielte `max-width`-Media-Queries, wie im bestehenden CSS (z. B. `max-width: 480px / 560px / 760px / 860px / 980px`, `min-width: 761px`).
- Neue Breakpoints nur einführen, wenn ein reales Layout-Problem es erfordert – bestehende Breakpoints wiederverwenden, um Fragmentierung zu vermeiden.
- Touch-Targets mindestens 44×44px (Apple HIG / WCAG-Empfehlung), ausreichend Abstand zwischen klickbaren Elementen auf Mobile.
- Jede neue Sektion/Komponente wird zuerst auf einem kleinen Viewport (≈375px) geprüft, bevor sie für Tablet/Desktop erweitert wird.
- Kein horizontales Scrollen auf Mobile zulassen (`overflow-x` an Sektionen prüfen), keine festen Breiten, die kleine Viewports sprengen.

## Animationen

- Bewegungen sind sanft und funktional, nie dekorativ um ihrer selbst willen: bestehende Easing-Kurve `cubic-bezier(.16,.84,.44,1)` für Bewegungs-Transitions weiterverwenden, kurze `ease`-Transitions (0.18s–0.35s) für Farb-/Schatten-/Rahmenwechsel.
- `@media (prefers-reduced-motion: reduce)` wird bereits global respektiert (siehe `style.css`) – jede neue Animation/Keyframe muss diese Regel ebenfalls berücksichtigen (deaktivieren oder stark reduzieren).
- Keine Animationen, die Layout-Shifts verursachen (siehe Core Web Vitals/CLS unten) – Transform/Opacity bevorzugen, Änderungen an Layout-Eigenschaften (width, height, top, left) vermeiden.
- Hover-/Interaktions-Feedback ist subtil (z. B. leichte Skalierung, Schattenwechsel), keine abrupten Sprünge oder übertriebenen Bounces.

## UX-Regeln

- Klarheit vor Cleverness: Nutzer:innen sollen ohne Nachdenken verstehen, was ein Element tut (Button vs. Link vs. Accordion).
- Konsistente Interaktionsmuster: Gleiche Aktion sieht überall gleich aus (z. B. primäre CTA immer `btn-primary`, sekundäre Aktion immer `btn-ghost`/`btn-light`).
- Ladezustände, Fehlerzustände und leere Zustände mitdenken, nicht nur den "Happy Path" (z. B. `onerror`-Fallback bei Bildern wie bereits in `index.html` umgesetzt).
- Formulare/Interaktionselemente geben unmittelbares Feedback (visuell und wo sinnvoll per ARIA-Live-Region), keine stillen Aktionen ohne Rückmeldung.
- Navigation und Informationsarchitektur bleiben flach und vorhersehbar – neue Inhalte (Blog, Situations) ordnen sich in die bestehende Struktur ein statt neue Navigationsebenen zu schaffen.

## Conversion-Optimierung

- Jede Seite/Sektion hat eine klare primäre Handlung (z. B. "Interesse anmelden", "EcoBum entdecken") – zusätzliche CTAs dürfen die primäre nicht verwässern.
- CTA-Copy bleibt konkret und nutzenorientiert statt generisch ("Interesse anmelden" statt "Mehr erfahren", wo möglich).
- Vertrauenssignale (Trust-Indikatoren, DSGVO-Konformität, Installationshinweise, Rechner/Kalkulator-Tools) sichtbar und leicht auffindbar halten – sie sind Teil der Kaufentscheidung, nicht nur Beiwerk.
- Reibungspunkte im Entscheidungsprozess aktiv reduzieren (z. B. Installations-Check, Verbrauchsrechner) – neue Features in diese Richtung bevorzugen, wenn sie die Kaufentscheidung erleichtern.
- Änderungen mit potenziellem Conversion-Einfluss (CTA-Text, Button-Platzierung, Preis-/Nutzenargumentation) explizit im Änderungskommentar benennen, damit sie nachvollziehbar bleiben.

## Codequalität

- Sauberer, modularer und wartbarer Code.
- Wiederverwendbare Komponenten bevorzugen statt Duplikation.
- Moderne HTML-, CSS- und JavaScript-Standards verwenden.
- Keine unnötigen Bibliotheken oder Frameworks einbauen – das Projekt ist bewusst dependency-frei.
- Bestehende Funktionen niemals unbeabsichtigt verändern oder brechen (insbesondere `translations.js`-Logik für Mehrsprachigkeit und bestehende SEO/Meta-Angaben).

## Code-Konventionen

- **HTML:** Semantische Elemente verwenden (`section`, `nav`, `header`, `footer`, `figure`, `summary`/`details` für FAQ etc. – wie bereits im Bestand). Attribute-Reihenfolge bei Bildern beibehalten: `width`/`height` (verhindert Layout-Shift), `src`, `alt`, `loading="lazy"` (außer above-the-fold), `decoding="async"`, optional `onerror`-Fallback.
- **CSS:** Ausschließlich über bestehende Custom Properties arbeiten; neue Selektoren folgen der vorhandenen Namenskonvention (kebab-case, komponentenbezogen, z. B. `.usecase-card`, `.faq-item`). Kein `!important`, außer als letzter, begründeter Ausweg.
- **JavaScript:** Vanilla JS, keine neuen Abhängigkeiten. Event-Listener statt inline `on*`-Handler bevorzugen, außer für einfache, bestehende Fallback-Muster (z. B. Bild-`onerror`). Keine globalen Variablen außer bewusst geschütztem Namespace (z. B. `window.PUDADO_I18N`).
- **Einrückung/Formatierung:** Bestehenden Stil der jeweiligen Datei beibehalten (Konsistenz vor persönlicher Präferenz) – keine großflächigen Reformatierungen ohne funktionalen Grund, da sie Diffs unnötig aufblähen.
- **Kommentare:** Sparsam und nur dort, wo das "Warum" nicht aus dem Code ersichtlich ist (siehe bestehende Kommentare zu DSGVO-Font-Entscheidung, OG-Bild-Hinweis) – keine Kommentare, die nur wiederholen, was der Code ohnehin zeigt.

## Sicherheitsregeln

- Keine Inline-Skripte/Styles mit dynamisch eingefügtem Nutzer-Input ohne Escaping (XSS-Vermeidung); bei Formularen/Eingaben grundsätzlich serverseitig validieren, sobald ein Backend hinzukommt.
- Keine Third-Party-Skripte/Trackers ohne Prüfung von Datenschutz-Implikationen einbauen (Kernprinzip der Marke: Datensparsamkeit, siehe Markenidentität/DSGVO oben).
- Externe Links (`target="_blank"`) erhalten `rel="noopener noreferrer"`, um Tabnabbing zu verhindern.
- Abhängigkeiten (falls künftig eingeführt) nur aus vertrauenswürdigen Quellen, mit geprüfter Lizenz und möglichst ohne bekannte CVEs.
- Sensible Daten (Kontaktformulare, zukünftige Bestellprozesse) nie im Klartext loggen oder in Client-seitigem Code/LocalStorage ablegen.
- Sicherheitsrelevante Funde (auch kleinere) sofort und unaufgefordert melden – siehe Arbeitsweise unten.

## Performance-Regeln

- Bilder immer mit `width`/`height`-Attributen (verhindert CLS), `loading="lazy"` für alles außerhalb des ersten Viewports, `decoding="async"` – wie im Bestand konsequent umgesetzt.
- Fonts bleiben selbst gehostet und werden nur für tatsächlich above-the-fold sichtbare Schnitte per `<link rel="preload">` vorgeladen; keine ungenutzten Schriftschnitte nachladen.
- Kein zusätzliches Render-blocking JavaScript/CSS ohne Not; neue Skripte nach Möglichkeit `defer`/`async` laden.
- Ungenutzten Code (CSS/JS/Bilder) konsequent entfernen statt anhäufen zu lassen (siehe Commit-Historie: "Remove dead CSS, unused PNG duplicates, and redundant inline style") – das ist gelebte Praxis, keine Ausnahme.
- Core Web Vitals aktiv im Blick behalten:
  - **LCP:** Größtes Content-Element (meist Hero-Bild/-Text) so früh wie möglich renderbar halten, keine unnötigen Blocker davor.
  - **CLS:** Keine layoutverändernden Nachlade-Effekte; reservierter Platz für Bilder/Embeds via `width`/`height` bzw. `aspect-ratio`.
  - **INP/Interaktivität:** Lange, blockierende JS-Tasks vermeiden, Event-Handler schlank halten.
- Bei jeder Änderung kurz einschätzen, ob sie die Ladezeit messbar verschlechtert – wenn ja, das im Änderungskommentar explizit benennen.

## Bildoptimierung

- Neue Bilder in einem zeitgemäßen, komprimierten Format (JPG für Fotos, SVG für Icons/Logos, ggf. WebP/AVIF prüfen, sofern Browser-Support/Fallback gesichert ist) und in sinnvoller Zielauflösung liefern – nicht unkomprimierte Rohbilder einbinden.
- Immer `width` und `height` (reale Pixelmaße) sowie ein beschreibendes, kontextbezogenes `alt`-Attribut setzen (siehe Bestand: alt-Texte beschreiben Szene und Produktkontext, keine reinen Dateinamen oder "Bild von...").
- `loading="lazy"` und `decoding="async"` für alle Bilder außerhalb des ersten sichtbaren Bereichs; above-the-fold-Bilder bewusst ohne Lazy-Loading, damit LCP nicht verzögert wird.
- Wo sinnvoll, `onerror`-Fallback nach bestehendem Muster ergänzen, damit ein fehlendes Bild nicht zu einem sichtbar kaputten Layout führt.
- Dateinamen sprechend und konsistent halten (z. B. `bath-1.jpg`, `design-2.jpg`, `atmo-leaf.jpg`) statt generischer Namen wie `IMG_1234.jpg`.

## SEO-Regeln

- Jede Seite behält eindeutigen `<title>`, `meta description`, `canonical`-Link sowie konsistente Open-Graph-/Twitter-Card-Angaben (siehe `index.html` als Referenzimplementierung).
- JSON-LD-Strukturdaten bei inhaltlichen Änderungen (Produktdaten, FAQ, Artikel) aktuell halten – veraltete Strukturdaten sind schädlicher als keine.
- Neue Seiten (Blog-Artikel, Situations) in `sitemap.xml` aufnehmen und in der internen Verlinkung sinnvoll einbetten.
- Überschriftenhierarchie (`h1` einmal pro Seite, danach `h2`/`h3` logisch verschachtelt) einhalten – Struktur dient sowohl SEO als auch Accessibility.
- Sprachvarianten (`de`, `en`, `fr`) sauber über `hreflang`/`og:locale:alternate` ausgezeichnet halten, wenn mehrsprachige URLs existieren oder eingeführt werden.
- Keine Duplicate-Content-Fallen erzeugen (z. B. gleiche Inhalte unter mehreren URLs ohne `canonical`).

## Accessibility-Regeln

- Kontrast: Mindestens WCAG AA (4.5:1 Fließtext, 3:1 große Schrift/UI-Elemente) – `--gray-light` wurde bereits gezielt für AA-Konformität angepasst; neue Textfarben müssen denselben Maßstab einhalten.
- Tastaturbedienbarkeit: Alle interaktiven Elemente per Tab erreichbar und bedienbar, sichtbarer Fokusring (`:focus-visible`), logische Tab-Reihenfolge.
- Skip-Link (`a11y.skip`, bereits vorhanden) und Landmark-Struktur (`nav`, `main`, `footer`) erhalten und bei neuen Sektionen konsequent fortführen.
- ARIA nur ergänzend zu semantischem HTML einsetzen, nicht als Ersatz dafür; bestehende `aria-*`-Attribute (Navigation, Menü-Zustände) als Vorbild nehmen.
- Bilder erhalten immer beschreibenden `alt`-Text (leeres `alt=""` nur bei rein dekorativen Bildern) – siehe bestehende, kontextreiche Alt-Texte als Qualitätsmaßstab.
- `prefers-reduced-motion` weiterhin respektieren (siehe Animationen oben); Formulare/Fehlermeldungen für Screenreader verständlich auszeichnen.
- Reduzierte Bewegung, Farbe allein nie als einziger Bedeutungsträger (z. B. Status nicht nur über Farbe, sondern zusätzlich Text/Icon vermitteln).

## Internationalisierung

- Die Seite unterstützt mehrere Sprachen/Locales (de_DE, en_US, fr_FR laut Open-Graph-Alternates) über `translations.js` (`window.PUDADO_I18N`).
- Neue Texte immer über den bestehenden Übersetzungsmechanismus einpflegen, nicht hartkodiert in HTML einbauen.
- Übersetzungs-Keys folgen der bestehenden Namenskonvention `bereich.element` (z. B. `nav.start`, `hero.h1a`, `cta.entdecken`) – neue Keys ordnen sich in dieses Schema ein, keine Freitext- oder inkonsistenten Schlüssel.
- Für jeden neuen Key müssen alle unterstützten Sprachen (`de`, `en`, `fr`) gepflegt werden – kein Key darf in einer Sprache fehlen (Gefahr sichtbarer Lücken/Fallbacks im Frontend).
- Ton und Markenbotschaft ("Wasser reinigt. Papier reibt.") müssen sinngemäß in jeder Sprache erhalten bleiben, keine wörtliche Übersetzung, die die Kernaussage verliert.
- HTML-`lang`-Attribut und `og:locale`/`og:locale:alternate` konsistent zur tatsächlich ausgespielten Sprache halten.

## Git-Workflow

- Feature-/Redesign-Arbeit erfolgt auf thematisch benannten Branches nach dem Muster `bereich/kurzbeschreibung` (z. B. `redesign/premium-refresh`), nicht direkt auf `main`.
- `main` bleibt der stabile, deploybare Stand; größere Arbeitsstränge werden auf einem eigenen Branch entwickelt und erst nach Prüfung zusammengeführt.
- Vor dem Start einer größeren Änderung den aktuellen Branch-Stand prüfen (`git status`, `git log`), um nicht versehentlich auf fremdem Zwischenstand aufzusetzen.
- Keine destruktiven Git-Operationen (`reset --hard`, `push --force`, Löschen von Branches) ohne ausdrückliche Rücksprache.
- `_backup_original/` ist der Rollback-Referenzpunkt vor dem Redesign und wird nicht durch normale Arbeit verändert.

## Commit-Regeln

- Commit-Nachrichten sind präzise, im Imperativ formuliert und beschreiben die inhaltliche Änderung, nicht den Prozess (Vorbild aus der Historie: "Fix two pre-existing mobile/tablet bugs found during verification", "Remove dead CSS, unused PNG duplicates, and redundant inline style", "Self-host Cabinet Grotesk + Inter, unify accent to blue").
- Eine Commit-Nachricht deckt eine inhaltlich zusammenhängende Änderung ab – keine Sammel-Commits ("diverse Fixes") ohne erkennbaren roten Faden.
- Vor jedem Commit den Diff überprüfen (`git diff`/`git status`), damit keine unbeabsichtigten Änderungen (z. B. Formatierungs-Rauschen, versehentlich geänderte Übersetzungen) mit hineinrutschen.
- Commits nur nach expliziter Aufforderung erstellen, nicht automatisch im Hintergrund.

## Dokumentationsregeln

- Diese `CLAUDE.md` wird erweitert, nicht überschrieben, sobald neue projektweite Konventionen entstehen – bestehende Regeln bleiben bestehen, es sei denn, sie werden bewusst und nachvollziehbar geändert.
- Code-Kommentare dokumentieren das "Warum" bei nicht offensichtlichen Entscheidungen (siehe bestehende Beispiele: DSGVO-Font-Begründung, OG-Bild-Hinweis, AA-Kontrast-Begründung bei `--gray-light`) – keine reinen "Was"-Kommentare.
- Größere strukturelle oder markenrelevante Entscheidungen (z. B. neue Akzentfarbe, neues Layout-Grundraster, neue Sprache) werden hier in der passenden Sektion nachgetragen, damit zukünftige Arbeit denselben Kontext hat.
- Keine separaten, verstreuten Doku-Dateien für Konventionen anlegen, die eigentlich hierher gehören – eine zentrale Quelle der Wahrheit vermeiden Widersprüche.

## Arbeitsweise

- Vor jeder größeren Änderung zuerst analysieren und einen kurzen Plan erstellen.
- Änderungen Schritt für Schritt umsetzen, nicht alles auf einmal.
- Nach jeder Änderung kurz erklären, was geändert wurde und warum.
- Vor jedem Commit den Code überprüfen.
- Sicherheits- und Performance-Probleme aktiv und unaufgefordert melden, sobald sie auffallen.

## Website-Qualität

Bei jeder Verbesserung automatisch mitdenken und aktiv ansprechen (Details siehe jeweilige Sektionen oben):

- Performance
- SEO
- Accessibility
- Core Web Vitals
- Ladezeiten
- Mobile-Optimierung
- Benutzerfreundlichkeit
- Conversion-Optimierung

# 02 — Brand & Design

**Version:** 0.1.2
**Status:** Erster Entwurf. Farbkonflikt aus v0.1 in v0.1.1 bewusst entschieden und dokumentiert (Abschnitt 5). v0.1.2 gleicht die Rangfolge in Abschnitt 13 an die kanonische PDOS-weite Priorität aus `00-core` an.

Dieses Dokument baut auf [`pdos/README.md`](../README.md), [`00-core/README.md`](../00-core/README.md), [`01-executive/README.md`](../01-executive/README.md) und `CLAUDE.md` im Projektwurzelverzeichnis auf. Es übersetzt Brand DNA, Definition von Premium und Non-Goals aus `00-core` in konkrete visuelle, emotionale und gestalterische Regeln. Technische Design-Tokens (Farbwerte, Schriftgrößen, Abstände) bleiben in `style.css`/`CLAUDE.md` als Single Source of Truth — dieses Dokument erklärt das *Warum* dahinter und die Grenzen, innerhalb derer neue Gestaltung entsteht. Bei Widerspruch zwischen diesem Dokument und `00-core`/`01-executive` haben diese Vorrang.

---

## 1. Zweck dieses Dokuments

**Warum Brand Design für Pudado entscheidend ist:** Pudado konkurriert laut `00-core` im Wahrnehmungsraum mit Apple, Dyson und Nothing — nicht mit klassischen Sanitärartikeln. Dieser Anspruch wird nicht durch Copy allein eingelöst, sondern zuerst visuell entschieden: In den ersten Sekunden auf der Website entscheidet sich, ob Pudado als Premium-Marke oder als austauschbares Bad-Gadget wahrgenommen wird. Schlechtes oder generisches Design widerlegt jede Premium-Behauptung sofort, unabhängig davon, wie gut der Text ist.

**Welche Designentscheidungen hier geregelt werden:**
- Grundsätzliche Design-Philosophie und wie sie sich in Farbe, Typografie, Layout, Komponenten, Animation und Bildsprache übersetzt.
- Woran sich eine neue Designentscheidung messen lassen muss, bevor sie umgesetzt wird.
- Wie Design-Zielkonflikte (z. B. Ästhetik vs. Performance) aufgelöst werden.
- Was Pudado visuell/emotional **nicht** sein darf (Brand Non-Goals, Abschnitt 12).

**Welche Entscheidungen NICHT in diesen Bereich gehören:**
- Konkrete Hex-Werte, Schriftgrößen-Skalen, Breakpoints und CSS-Implementierung — bleiben in `style.css` als Single Source of Truth, dieses Dokument setzt nur den Rahmen, in dem neue Tokens entstehen dürfen.
- Strategische Priorisierung, ob ein Design-Vorhaben überhaupt verfolgt wird — das regelt `01-executive` (Feature-Priorisierung, Roadmap-Ebenen).
- SEO-Textstruktur und Content-Strategie im Detail — gehört in `04-growth`.
- Testdurchführung (visuelle Regressionstests, Accessibility-Audits) — gehört in `05-quality`.

## 2. Pudado Design-Philosophie

Sieben Spannungsfelder, die Pudado bewusst auflöst — jedes beschreibt eine Falle, in die eine der beiden Seiten allein führen würde:

- **Premium durch Klarheit, nicht durch Dekoration.** Premium entsteht durch das, was weggelassen wird, nicht durch zusätzlichen visuellen Schmuck. Ein überladenes Element wirkt nie hochwertiger als ein reduziertes.
- **Vertrauen durch Ruhe, nicht durch Beweislast.** Vertrauen wird nicht durch möglichst viele Trust-Siegel oder Ausrufezeichen erzeugt, sondern durch ein Erscheinungsbild, das nichts zu beweisen versucht, weil es sich selbst sicher ist.
- **Hygiene durch Reinheit, nicht durch klinische Kälte.** Die visuelle Assoziation zu Sauberkeit entsteht über Licht, Weißraum und Materialqualität — nicht über sterile Krankenhaus-Ästhetik, die eher an ein medizinisches Hilfsmittel erinnert (siehe Non-Goals).
- **Nachhaltigkeit ohne Öko-Klischee.** Kein Naturkork-Braun, kein Blätter-Grün-Übermaß, keine "Bio"-Handschrift-Fonts. Nachhaltigkeit zeigt sich in Materialqualität und Langlebigkeit der Gestaltung selbst, nicht in Öko-Bildsprache.
- **Innovation ohne Tech-Kälte.** Modern und hochwertig, aber nicht distanziert-technisch wie ein reines Gadget. Das Produkt betrifft einen intimen, menschlichen Alltagsmoment — die Gestaltung darf das nicht verleugnen.
- **Lifestyle ohne Arroganz.** Premium-Positionierung bedeutet nicht Überheblichkeit gegenüber der Zielgruppe oder gegenüber Alternativen (siehe `00-core`: kein "Klopapier-Bashing"). Selbstbewusst, nicht herablassend.
- **Minimalismus ohne Leere.** Weißraum ist ein Werkzeug für Fokus, kein Selbstzweck. Eine leere Fläche ohne erkennbaren Zweck wirkt unfertig, nicht elegant — jedes Element (auch der Leerraum) muss eine Funktion haben.

## 3. Markenwirkung

Pudado soll wirken: **hochwertig, modern, ruhig, sauber, vertrauenswürdig, menschlich, elegant, langlebig.**

Pudado soll ausdrücklich **nicht** wirken: **laut, billig, übertrieben verspielt.**

Diese beiden Listen sind gleich wichtig. Eine Designentscheidung, die auf die positive Liste einzahlt, aber gleichzeitig eine der drei Negativ-Eigenschaften auslöst (z. B. "elegant, aber laut" durch eine grelle Animation), ist keine gute Entscheidung — beide Seiten müssen gleichzeitig stimmen.

## 4. Visuelle Referenzlogik

Pudado darf sich an folgenden Marken orientieren, aber **jeweils an einem spezifischen Aspekt**, nicht an der Gesamtästhetik:

| Referenz | Was übernommen wird | Was NICHT übernommen wird |
|---|---|---|
| **Apple** | Klarheit, Produktinszenierung, großzügiger Weißraum, Zurückhaltung in der Copy | Apples spezifische Grautöne/Systemfont-Optik als 1:1-Kopie, Apples Produktfotografie-Setup unverändert übernehmen |
| **Dyson** | Technische Wertigkeit, Materialehrlichkeit, Detailversprechen | Dysons industrielles/technisches Kälte-Gefühl, Dysons Farbwelt |
| **Muji** | Ruhe, Reduktion, unaufdringliche Funktionalität | Mujis neutrale Naturton-Palette als Grundfarbschema — Pudado bleibt Blau-basiert |
| **Aesop** | Premium-Alltag, das Gefühl von bewusst gewählter Qualität im täglichen Ritual | Aesops dunkle, apothekenhafte Verpackungsästhetik und Typografie |
| **Nothing** | Moderne Eigenständigkeit, Mut zu einer erkennbaren visuellen Signatur | Nothings Transparenz-/Punktraster-Designsprache direkt kopieren |

**Verbindliche Grenzen:**
- Keine Kopie einzelner Layouts, Icon-Sets oder Bildkompositionen dieser Marken.
- Keine fremde Markenästhetik komplett übernehmen, auch nicht in Ausschnitten, die als "inspiriert von X" erkennbar sind.
- Keine generische Apple-Kopie — viele Premium-Websites kopieren denselben Apple-Look bis zur Unkenntlichkeit; Pudado muss auch neben diesen Websites erkennbar eigenständig bleiben.
- Die eigene Pudado-Identität (Signature Blue, Kernbotschaft "Wasser reinigt. Papier reibt.", Cabinet Grotesk/Inter-Typografie) bleibt in jeder Referenz-Anlehnung federführend, nicht die Referenzmarke.

## 5. Farbprinzipien

> **Entscheidung getroffen am 2026-07-03 — Konflikt bewusst gelöst, nicht mehr offen:** In der vorherigen Version dieses Dokuments war ein Widerspruch zwischen der Aufgabenstellung ("Türkis/Sage als dezente Akzente") und der bestehenden Regel in `00-core`/`CLAUDE.md` (Sage ausschließlich Status, kein zweiter Akzent) offen markiert. Diese Entscheidung schließt den Konflikt explizit und ist die verbindliche Grundlage ab sofort. **Zweck der Entscheidung: die bisherige Markenruhe (Ein-Akzent-Prinzip, siehe `00-core`) bewusst zu schützen** — indem Ausnahmen eng begrenzt und klar zweckgebunden bleiben, statt sich schleichend zu einer zweiten gleichrangigen Markenfarbe auszuweiten.

**Die Entscheidung im Detail:**
1. **Royal Blue (`--blue`, `#235FD0`) bleibt die einzige primäre Markenfarbe.** Unverändert gegenüber der bisherigen Regel — für Buttons, Links, Icons, alles, was als "die Marke" erkennbar sein soll.
2. **Weiß (`--paper`, `--mist`, `--mist-2`) bleibt die wichtigste Flächen- und Ruhefarbe.** Der überwiegende Teil jeder Seite bleibt hell und ruhig — daran ändert diese Entscheidung nichts.
3. **Sage (`--sage`, `#4E7C63`) bleibt eine semantische Statusfarbe** — nicht mehr nur für den engen Einzelfall "Installations-Check passt", sondern für den etwas breiteren, weiterhin rein semantischen Anwendungsbereich: Nachhaltigkeit-Hinweise, positive Bestätigungen, Erfolgszustände, ruhige Informationshinweise. Weiterhin **keine** dekorative Verwendung ohne semantische Bedeutung.
4. **Türkis darf neu, aber nur sehr sparsam, als Wasser-/Interaktionsakzent verwendet werden** — z. B. für kleine, wasserbezogene Mikro-Illustrationen oder dezente Interaktions-/Hover-Hinweise, die inhaltlich auf die Kernbotschaft ("Wasser reinigt.") einzahlen. Türkis ist **ausdrücklich keine zweite Hauptmarkenfarbe**: kein großflächiger Einsatz, keine primären Buttons, kein Ersatz für Blau in einer markentragenden Rolle. Im Zweifel gilt: seltener statt öfter.
5. **Keine zusätzliche Akzentfarbe darf ohne menschliche Freigabe eingeführt werden.** Diese Regel bleibt unverändert bestehen und gilt jetzt auch für jede weitere Ausweitung der Türkis-Nutzung über den hier definierten, engen Rahmen hinaus.

**Offen für die technische Umsetzung (nicht Teil dieser Entscheidung):** Ein konkreter Hex-/Token-Wert für Türkis ist hier bewusst **nicht** festgelegt — das ist eine Implementierungsentscheidung für `03-engineering`/`style.css`, die einen neuen Farbwert braucht, der (a) sich klar von `--sage` und `--blue` unterscheidet, (b) WCAG-Kontrastanforderungen für seinen jeweiligen Einsatzzweck erfüllt und (c) vor Einsatz gegen diese Entscheidung geprüft wird. Bis ein Token existiert und geprüft ist, wird kein Türkis in `style.css` verwendet.

**Weitere Regeln (unverändert, auf Basis der bestehenden Tokens in `style.css`):**
- `--blue-ink`/`--blue-deep`/`--blue-soft` sind Zustandsvarianten des einen Blau-Akzents, keine eigenständigen Farben.
- **Keine überladene Farbpalette:** Neue Farben entstehen nur als Varianten des bestehenden Blau-/Neutral-Systems (siehe `--sky`, `--sky-soft`, `--sky-line` als Pastell-Varianten) oder als das hier definierte, eng begrenzte Türkis — nie als weitere, unabhängige Akzentfarbe.
- **Keine grellen Rabattfarben** (Signalrot, Neon-Orange, "Sale"-Gelb) — solche Farben widersprechen der Definition von Premium in `00-core` und den Non-Goals ("keine Rabattmarke").
- **Keine aggressiven Verkaufselemente über Farbe** — z. B. blinkende oder stark kontrastierende CTA-Farben außerhalb der Blau-Palette, um künstliche Dringlichkeit zu erzeugen.
- **Jede Farbentscheidung muss Hygiene, Wasser, Ruhe und Premium stützen.** Blau ist in dieser Logik nicht beliebig, sondern bewusst gewählt: Wasser-Assoziation, Vertrauen, Klarheit. Türkis darf diese Logik ergänzen (Wasser-Assoziation), aber nur im hier definierten engen Rahmen. Eine Farbe, die diese Assoziation nicht stützt, gehört nicht ins System.

## 6. Typografie

- **Klare, moderne, gut lesbare Schriftwirkung:** Cabinet Grotesk (`--font-head`) für Headlines, Inter (`--font-body`) für Fließtext — beide bereits als Marken-Entscheidung etabliert (selbst gehostet, DSGVO-Grund, siehe `CLAUDE.md`). Neue Textelemente nutzen ausschließlich diese beiden Schriftfamilien.
- **Große, ruhige Headlines:** Headlines dürfen und sollen viel visuellen Raum einnehmen — das ist Teil der Premium-Wirkung, nicht Platzverschwendung.
- **Kurze, starke Aussagen:** Eine Headline transportiert einen Gedanken, nicht mehrere. Wenn ein Satz zwei Kernaussagen enthält, gehört er in zwei Elemente aufgeteilt.
- **Keine Textwände im sichtbaren Erstkontakt:** Der erste Bildschirm (Hero) priorisiert Klarheit über Vollständigkeit — Details folgen beim Scrollen, nicht auf einen Blick.
- **Klare Hierarchie:** Headline > Subheadline > Body > Caption ist durchgängig erkennbar, nicht nur über Schriftgröße, sondern auch über Gewicht und Abstand. Neue Textblöcke ordnen sich in diese Skala ein, statt eigene Zwischengrößen zu erfinden.
- **Gute Lesbarkeit auf Mobile:** Schriftgrößen und Zeilenhöhen werden zuerst für kleine Viewports geprüft (siehe Mobile-First-Regeln in `CLAUDE.md`), nicht nachträglich für Mobile "verkleinert".
- **Keine dekorativen Schriften:** Keine Skript-, Handschrift- oder verspielten Display-Fonts, auch nicht punktuell für "Charakter" — das widerspricht der ruhigen, sachlichen Tonalität aus `00-core`.

## 7. Layout & Spacing

- **Großzügige Abstände** über das bestehende `--space`-Token (`clamp(76px, 10vw, 160px)`) — neue Sektionen nutzen dieses Token statt eigener fixer Werte.
- **Ruhige Sektionen:** Eine Sektion transportiert einen Gedanken/eine Funktion. Mehrere unabhängige Botschaften in einer Sektion zu bündeln, um Platz zu sparen, erzeugt Unruhe statt Effizienz.
- **Klare Blickführung:** Layout führt das Auge entlang einer erkennbaren Reihenfolge (i. d. R. oben nach unten, Kernaussage vor Detail) statt mehrere gleichwertige Aufmerksamkeitspunkte nebeneinander zu stellen.
- **Starke Hero-Section:** Der erste Bildschirm trägt die Hauptlast der Premium-Wirkung und der Kernbotschaft — hier wird nicht an visueller Qualität gespart, auch wenn er dadurch aufwändiger ist als spätere Sektionen.
- **Mobile-first:** Layout wird zuerst für ~375px entworfen, dann für größere Viewports erweitert (siehe `CLAUDE.md`, Mobile-First-Regeln) — nie umgekehrt gedacht und nachträglich "responsive gemacht".
- **Keine überfüllten Bereiche:** Wenn eine Sektion mehr als eine klare Aussage plus unterstützende Elemente enthält, wird geprüft, ob sie aufgeteilt werden sollte.
- **Jedes Element braucht einen Zweck:** Ein Bild, ein Icon oder eine Trennlinie ohne erkennbaren funktionalen oder erzählerischen Zweck wird entfernt, nicht "weil es hübsch aussieht" beibehalten.

## 8. Komponenten-Design

Bestehende Klassenkonvention (Basisklasse + Modifier, siehe `CLAUDE.md`) wird für alle Komponenten fortgeführt:

- **Buttons:** `btn` als Basis, `btn-primary` für die eine primäre Handlung pro Sektion, `btn-ghost`/`btn-light` für sekundäre Aktionen, `btn-link` für tertiäre/inline Aktionen. Nie zwei `btn-primary` nebeneinander in derselben Sektion (verwässert die primäre Handlung, siehe `00-core`, Conversion-Optimierung).
- **Karten:** Einheitlicher Aufbau (Bild/Icon, Headline, kurzer Text, ggf. Aktion) über alle Kartentypen hinweg (Produktkarten, Blog-Karten, Situations-Karten) — Konsistenz vor kreativer Variation im Kleinen.
- **Sektionen:** Jede Sektion folgt demselben Grundrhythmus (Abstand oben/unten über `--space`, konsistente Innenausrichtung) unabhängig vom Inhalt.
- **Icons:** Einheitliche Strichstärke und Stil (siehe bestehende Commit-Historie "unify icon strokes") — neue Icons werden gegen bestehende geprüft, nicht isoliert gestaltet.
- **Navigation:** Flach, vorhersehbar, mit sichtbarem Skip-Link und klarer Landmark-Struktur (siehe Accessibility-Regeln in `CLAUDE.md`) — keine zusätzlichen Navigationsebenen ohne echten Bedarf.
- **Trust-Elemente:** Zurückhaltend platziert, faktenbasiert (DSGVO-Hinweis, Installationsgarantie, reale Gütesiegel falls vorhanden) — keine dekorativen "Trust-Badges" ohne echte Substanz dahinter (siehe Golden Rule 5: Premium ist ein Maßstab, kein Wort).
- **FAQ:** Bestehendes `summary`/`details`-Muster fortführen, kurze, direkte Antworten statt Marketing-Sprache in FAQ-Antworten.
- **Produktbereiche:** Fokus auf reale Anwendungssituation (siehe `situations/`) statt isolierter Produktfotografie ohne Kontext.
- **Rechner (Verbrauchsrechner):** Sofortiges, verständliches Feedback bei Eingabe, keine versteckten Zwischenschritte — Zweck ist Reibungsreduktion (siehe `00-core`, Conversion-Optimierung), nicht Verkaufs-Gamification.
- **Installations-Checker:** Klar kommunizierter Zweck vor Beginn ("prüft ob Installation bei dir funktioniert"), ehrliches Ergebnis auch wenn negativ — kein beschönigtes "passt schon"-Ergebnis, um Conversion zu erzwingen.

## 9. Animationen & Mikrointeraktionen

- **Subtil:** Bewegung unterstützt Verständnis (z. B. Hervorhebung eines neuen Zustands), sie ist kein Selbstzweck.
- **Performant:** Nur Transform/Opacity animieren (keine Layout-Eigenschaften wie width/height/top/left), um CLS zu vermeiden — bestehende Regel aus `CLAUDE.md` wird hier bestätigt, nicht neu erfunden.
- **Ruhig:** Bestehende Easing-Kurve `cubic-bezier(.16,.84,.44,1)` für Bewegungs-Transitions, kurze `ease`-Übergänge (0.18s–0.35s) für Farb-/Schatten-/Rahmenwechsel — neue Animationen fügen sich in dieses Timing ein.
- **Erklärend:** Eine Animation sollte einen Zustandswechsel verständlicher machen (z. B. Akkordeon öffnet sich sichtbar), nicht nur dekorativ sein.
- **Nicht verspielt ohne Zweck:** Bounce-Effekte, übertriebene Skalierungen oder mehrstufige Effektketten passen nicht zur ruhigen Markenwirkung (Abschnitt 3).
- **Keine Effekthascherei:** Parallax-Spielereien, aufwändige Scroll-Trigger-Ketten oder Partikel-Effekte sind nicht Teil der Marke, auch wenn sie technisch beeindrucken.
- **`prefers-reduced-motion` wird respektiert** — bereits global umgesetzt (siehe `CLAUDE.md`); jede neue Animation muss diese Regel ebenfalls einhalten (deaktivieren oder stark reduzieren).

## 10. Bildsprache

- **Saubere Badezimmerästhetik:** Helle, hochwertige Bäder mit natürlichen Materialien (Holz, Stein, Textil) — bereits als Regel in `00-core`/`CLAUDE.md` etabliert, hier bestätigt.
- **Echtes Produktverständnis:** Bilder zeigen, wie das Produkt tatsächlich funktioniert und eingebaut wird — keine irreführenden oder unrealistischen Darstellungen.
- **Hochwertige Nahaufnahmen:** Materialqualität, Verarbeitung und Detailtreue werden gezielt in Nahaufnahmen gezeigt (vergleichbar mit Dysons Detailversprechen, siehe Abschnitt 4).
- **Wasser, Reinheit, Materialqualität** als durchgehende visuelle Motive, die die Kernbotschaft ("Wasser reinigt. Papier reibt.") stützen.
- **Keine billigen Stockfoto-Vibes:** Erkennbare Generic-Stock-Ästhetik (aufgesetztes Lächeln, unpassende internationale Groß-Bad-Kulissen) widerspricht der Premium-Wirkung.
- **Keine übertriebene Spa-Werbung:** Kein Wellness-Klischee (Kerzen, Rosenblätter, übertriebene Entspannungs-Inszenierung) — Pudado ist Alltagsprodukt, kein Spa-Erlebnis.
- **Keine peinliche Intimhygiene-Bildsprache:** Das Thema wird sachlich, erwachsen und ohne Verlegenheits- oder Witz-Ästhetik dargestellt — passend zur ruhigen, selbstbewussten Tonalität aus `00-core`.

## 11. UX-Prinzipien

Jede Seite bzw. jede zentrale Sektion sollte diese sechs Fragen implizit oder explizit beantworten, in dieser Reihenfolge:

1. **Was ist das?** — Produktkategorie und Grundfunktion müssen ohne Vorwissen verständlich sein.
2. **Warum ist es besser?** — Der konkrete Vorteil gegenüber der Alternative (trockenes Papier, klassisches Bidet) muss erkennbar sein.
3. **Warum Wasser?** — Die Kernbotschaft "Wasser reinigt. Papier reibt." muss inhaltlich anschlussfähig sein, nicht nur als Slogan stehen.
4. **Warum Pudado?** — Was unterscheidet Pudado/EcoBum von anderen Anbietern in dieser Kategorie (Plug-and-Play, Design, Datensparsamkeit)?
5. **Warum kann ich vertrauen?** — Trust-Signale (Abschnitt 8) müssen an der Stelle vorhanden sein, an der Zweifel plausibel entstehen.
6. **Was soll ich als Nächstes tun?** — Jede Sektion mit Handlungsabsicht hat eine erkennbare, eindeutige nächste Aktion (siehe `00-core`, Conversion-Optimierung).

Eine Sektion, die keine dieser Fragen beantwortet und auch keine andere klare Funktion hat (z. B. reine Übergangs-/Rhythmus-Sektion), sollte kritisch hinterfragt werden.

## 12. Brand Non-Goals

Ergänzend zu den Non-Goals in `00-core`, spezifisch für visuelle/gestalterische Wirkung. Pudado soll **nicht wirken wie**:

- **Ein Dropshipping-Shop** — austauschbares Layout, generische Produktbilder ohne eigene Bildsprache, kein erkennbares Markensystem.
- **Eine aggressive Sales-Landingpage** — viele CTAs, Countdown-Timer, Ausrufezeichen-Copy, übermäßige Verkaufsdruck-Elemente.
- **Ein medizinisches Problemprodukt** — klinische Farben, Symptom-fokussierte Sprache, Krankenhaus-Ästhetik statt Lifestyle-Produkt.
- **Ein billiges Bad-Gadget** — Plastik-Optik, überladene Produktfotos mit vielen Feature-Call-outs, Marktplatz-Ästhetik.
- **Eine übertriebene Öko-Marke** — Kraftpapier-Optik, Blätter-Icons, moralisierender Ton (siehe `00-core`: Nachhaltigkeit wird gezeigt, nicht behauptet).
- **Eine kalte Tech-Marke** — reine Spezifikations-Sprache, distanzierte Produktfotografie ohne menschlichen Kontext.
- **Ein unseriöser TikTok-Shop** — grelle Kurzvideo-Ästhetik, übertriebene Vorher/Nachher-Dramatisierung, Meme-Sprache.
- **Eine beliebige KI-Website** — generische Gradient-Hero-Sections, austauschbare Stock-Illustrationen, 0815-SaaS-Layout-Muster ohne eigene Identität (siehe Anti-Patterns, Abschnitt 15).

## 13. Design-Konflikte

Design-Zielkonflikte werden nicht ad hoc entschieden, sondern über die kanonische Rangfolge aus `00-core` (Sicherheit, Recht & Datenschutz > Markenvertrauen > Produktverständnis > UX & Accessibility > Stabilität & Engineering > Performance > Conversion/Growth > SEO > Umsetzungsgeschwindigkeit) plus die folgenden fallspezifischen Leitlinien:

- **Schönes Design vs. Performance:** Performance gewinnt bei rein kosmetischem Nutzen (z. B. ein aufwändiger Bildeffekt ohne Informationswert). Bei Elementen mit echtem Markenwert (Hero-Bildqualität) wird optimiert (Kompression, modernes Format), nicht ersatzlos gestrichen.
- **Animation vs. Accessibility:** Accessibility gewinnt immer — `prefers-reduced-motion` wird respektiert, keine Animation darf Bedienbarkeit einschränken.
- **Conversion vs. Vertrauen:** Vertrauen gewinnt (Rang 2 vor Rang 7 in der Gesamt-Rangfolge) — eine Conversion-Taktik, die Vertrauen kostet, wird nicht umgesetzt, selbst bei plausibel höherer kurzfristiger Conversion.
- **Minimalismus vs. Verständlichkeit:** Verständlichkeit gewinnt — Minimalismus ist Mittel zum Zweck (Klarheit), nicht Selbstzweck; wenn Reduktion Verständnis kostet, ist sie zu weit gegangen.
- **Premiumwirkung vs. SEO-Textbedarf:** Premiumwirkung/Tonalität gewinnt gegenüber reiner Keyword-Dichte — SEO-Text wird so integriert, dass er sich liest wie der Rest der Marke, nicht als separater, angehängter Textblock.

**Vorgehen bei Konflikten (verbindlich für Claude Code):**
1. Konflikt explizit benennen (welche Prinzipien stehen sich entgegen).
2. Optionen vergleichen (mindestens zwei, mit Vor-/Nachteilen).
3. Empfehlung geben, begründet über die Rangfolge oben.
4. **Bei strategischen Designänderungen** (neue Akzentfarbe, neues Grundraster, grundlegende Layoutänderung der Hero-Section, neue Bildsprache-Richtung) menschliche Freigabe einholen — über die Entscheidungsvorlage aus `01-executive`, Abschnitt 11. Kleinere, im bestehenden System liegende Detailentscheidungen (siehe `01-executive`, Abschnitt 10, Punkt 4) darf Claude selbst treffen.

## 14. Definition of Done für Design

Eine Designänderung gilt erst als abgeschlossen, wenn **alle** folgenden Punkte zutreffen:

- Sie passt zur Marke (Design-Philosophie, Markenwirkung, Farbprinzipien aus diesem Dokument).
- Sie funktioniert auf Mobile (zuerst geprüft, nicht nachträglich angepasst).
- Sie ist lesbar (Kontrast, Schriftgröße, Zeilenhöhe entsprechen den Regeln in Abschnitt 6 und den Accessibility-Vorgaben in `CLAUDE.md`).
- Sie verschlechtert Performance nicht messbar (Core Web Vitals, siehe `00-core`).
- Sie verschlechtert Accessibility nicht (WCAG AA, Tastaturbedienbarkeit, Fokuszustände).
- Sie wirkt nicht generisch (Abgleich gegen Brand Non-Goals, Abschnitt 12, insbesondere "beliebige KI-Website").
- Sie macht das Produkt verständlicher, nicht nur hübscher (Bezug zu mindestens einer UX-Frage aus Abschnitt 11).
- Sie erhöht Vertrauen oder beeinträchtigt es zumindest nicht.

Fehlt einer dieser Punkte, ist die Änderung nicht fertig — unabhängig davon, wie gut sie visuell wirkt.

## 15. Anti-Patterns

- **Zu viele Effekte:** Mehrere gleichzeitige Animationstypen (Fade, Scale, Parallax) in derselben Sektion erzeugen Unruhe statt Eindruck von Qualität.
- **Zu wenig Weißraum:** Eng gepackte Elemente wirken günstig, nicht effizient — Weißraum ist ein Premium-Signal, kein verschwendeter Platz.
- **Generische KI-Gradienten:** Lila-Blau-Verlaufs-Hero-Sections, wie sie viele KI-generierte oder Template-Websites verwenden — widerspricht direkt "keine beliebige KI-Website" (Abschnitt 12).
- **Austauschbare Icons:** Icon-Sets ohne erkennbaren eigenen Stil (Standard-Bibliotheks-Icons ohne Anpassung) verwässern die visuelle Identität.
- **Zu viele Claims:** Eine Sektion mit fünf verschiedenen Werbeaussagen gleichzeitig überzeugt weniger als eine klare.
- **Zu viele CTAs:** Mehrere gleichwertig wirkende Handlungsaufforderungen verwässern die primäre Handlung (siehe `00-core`, Conversion-Optimierung).
- **Schlechte Mobile-Abstände:** Zu enge Touch-Targets oder zu knappe Abstände auf kleinen Viewports — verstößt gegen die 44×44px-Regel aus `CLAUDE.md`.
- **Text über Design statt Design durch Klarheit:** Lange erklärende Textblöcke, die eigentlich ein Layout- oder Visualisierungsproblem kompensieren sollen — das eigentliche Problem ist dann strukturell, nicht textlich.
- **Premium mit Luxus-Klischees verwechseln:** Gold-Akzente, Serifen-Schriften, schwarze Hintergründe mit dünnen weißen Linien — das ist eine andere Art von Premium (Luxusgüter-Ästhetik), nicht die von Pudado gewählte (klar, funktional, ruhig).

## 16. Offene Fragen

Diese Informationen fehlen aktuell und sollten nicht durch Annahmen ersetzt werden:

- **Finale Bildsprache** — die hier beschriebenen Prinzipien sind Leitplanken; ein konkretes, kuratiertes Referenz-Moodboard existiert noch nicht.
- **Finale Produktfotos** — aktuelle Bilder in `assets/` sind möglicherweise Platzhalter oder erste Iteration, nicht notwendigerweise final.
- **Türkis-Token-Wert** — der Sage/Türkis-Konflikt (Abschnitt 5) ist inhaltlich entschieden; offen bleibt der konkrete, WCAG-geprüfte Hex-/Token-Wert für Türkis, der erst bei tatsächlicher technischer Umsetzung in `style.css` festgelegt wird.
- **Echte Nutzerreaktionen** — kein Nutzertest-Feedback zu Layout, Verständlichkeit oder visueller Wirkung liegt bisher vor.
- **Conversion-Daten** — keine Daten dazu, welche Design-/Layout-Entscheidungen tatsächlich zu Conversion beitragen (siehe `00-core`, "Vision & Mission messbar machen").
- **Markenfeedback** — keine strukturierte Rückmeldung (intern oder extern) zur aktuellen Markenwahrnehmung.
- **Packaging-Design-Abgleich** — unklar, ob/wie die Web-Bildsprache mit tatsächlichem Verpackungsdesign des Produkts übereinstimmt.
- **Social-Media-Designsystem** — kein dediziertes System für Social-Media-Formate; aktuell nur Website-Design-System vorhanden.

---

*Dies ist Version 0.1.2 — v0.1 war der erste Entwurf für den Brand & Design-Bereich, aufbauend auf `00-core` v0.2 (zum Zeitpunkt der Ersterstellung) und `01-executive` v0.1. v0.1.1 löste den in v0.1 offen markierten Sage/Türkis-Farbkonflikt bewusst auf (Abschnitt 5), um die bestehende Markenruhe zu schützen — im Zuge dieser Entscheidung wurde auch `00-core` auf v0.2.1 aktualisiert. v0.1.2 korrigiert die in Abschnitt 13 zitierte Rangfolge (zuvor Conversion vor Performance) auf die kanonische Reihenfolge aus `00-core` v0.2.2. Änderungen werden im übergeordneten `CHANGELOG.md` dokumentiert.*

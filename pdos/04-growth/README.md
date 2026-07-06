# 04 — Growth

**Version:** 0.1.1
**Status:** Erster Entwurf. Rangfolge in Abschnitt 16 in v0.1.1 an die kanonische PDOS-weite Priorität aus `00-core` angeglichen.

Dieses Dokument baut auf [`pdos/README.md`](../README.md), [`00-core/README.md`](../00-core/README.md), [`01-executive/README.md`](../01-executive/README.md), [`02-brand-design/README.md`](../02-brand-design/README.md), [`03-engineering/README.md`](../03-engineering/README.md) und `CLAUDE.md` auf. Es regelt, wie Pudado wachsen soll — nicht durch kurzfristige Tricks, sondern durch Vertrauen, Verständlichkeit, Sichtbarkeit und langfristige Markenstärke. Bei Widerspruch zu `00-core`/`01-executive`/`02-brand-design` haben diese Vorrang.

**Durchgängige Regel für dieses Dokument:** Keine erfundenen Kundendaten, keine erfundenen Conversion-Zahlen, keine erfundenen SEO-Zahlen. Jede Aussage über Zielgruppen, Wirkung oder Ergebnisse ist entweder belegt (mit Quelle) oder ausdrücklich als Annahme markiert (siehe `00-core`, Golden Rule 10).

---

## 1. Zweck dieses Dokuments

**Warum Growth für Pudado wichtig ist:** Ein exzellentes Produkt mit exzellenter Marke bleibt wirkungslos, wenn es niemand findet, versteht oder ihm vertraut. Growth ist die Brücke zwischen dem, was Pudado ist (`00-core`, `02-brand-design`), und dem, was Menschen davon tatsächlich erreicht und überzeugt. Schlecht gemachtes Growth-Marketing kann jede Premium-Positionierung in Sekunden zerstören — ein aggressives Pop-up oder eine Rabatt-Countdown-Leiste widerlegt "Premium-Lifestyle-Marke" sofort, unabhängig vom Rest der Website.

**Welche Entscheidungen dieser Bereich regelt:**
- Wie Pudado kommuniziert, um Sichtbarkeit, Verständnis, Vertrauen und Conversion aufzubauen.
- Wie der Website-Funnel, Trust-Elemente, SEO- und Content-Strategie gestaltet werden.
- Wie Social-Media- und Kampagnenkommunikation aussehen darf und wo ihre Grenzen liegen.
- Wie Growth-Experimente strukturiert ablaufen, statt ungeplant "ausprobiert" zu werden.

**Welche Entscheidungen NICHT hierher gehören:**
- Ob eine Growth-Initiative überhaupt priorisiert wird — das regelt `01-executive` (Feature-Priorisierung, Roadmap-Ebenen).
- Wie etwas visuell aussieht — das regelt `02-brand-design`; Growth definiert die Botschaft und Funnel-Logik, nicht die Gestaltung.
- Wie eine Growth-Anforderung technisch umgesetzt wird (Tracking-Implementierung, Formular-Handling) — das regelt `03-engineering`, insbesondere unter Beachtung der dortigen Security-Engineering-Regeln (kritische Prüfung externer Skripte).
- Testkriterien im Detail — gehören in `05-quality`.

**Zusammenarbeit mit anderen Bereichen:** Growth schlägt vor, entscheidet aber nicht isoliert. Eine neue Botschaft muss mit `02-brand-design` (Tonalität, Markenwirkung) vereinbar sein, eine neue Funnel-Komponente mit `03-engineering` umsetzbar sein, ohne bestehende Funktionen zu gefährden, und eine strategisch bedeutsame Growth-Entscheidung (z. B. neuer Zielmarkt, Preiskommunikation) braucht Freigabe über `01-executive`. Growth ist kein isolierter Bereich, sondern der Bereich, der die anderen drei am direktesten nach außen sichtbar macht.

## 2. Growth-Philosophie von Pudado

- **Vertrauen vor aggressiver Conversion:** Eine Taktik, die kurzfristig mehr Klicks erzeugt, aber Vertrauen kostet, wird nicht verfolgt (siehe `00-core`, CEO-Denkweise).
- **Erklärung vor Überredung:** Pudado überzeugt, indem es verständlich macht, nicht indem es drängt. Wer das Produkt versteht, braucht keine Überredung mehr.
- **Markenaufbau vor kurzfristigen Klicks:** Eine Kampagne, die viele Klicks, aber keinen Beitrag zur Markenwahrnehmung liefert, ist aus Sicht dieses Dokuments kein Erfolg.
- **Qualität vor Reichweite:** Eine kleinere, richtige Zielgruppe zu erreichen ist wertvoller als eine große, unpassende (siehe `00-core`, CEO-Denkweise: "Premium-Positionierung vor Massenmarkt").
- **Nachhaltiges Wachstum vor billiger Aufmerksamkeit:** Aufmerksamkeit, die durch Schock, Übertreibung oder Peinlichkeit erzeugt wird, schadet der Marke stärker, als sie kurzfristig nützt.
- **Premium-Positionierung vor Rabatt-Mechaniken:** Rabatte sind die Ausnahme, kein Wachstumshebel (siehe `01-executive`, Non-Goals: "keine Rabattmarke").
- **Bildung des Marktes vor reiner Werbung:** Die Produktkategorie (Plug-and-Play-Handbidet) ist vielen Menschen unbekannt. Ein großer Teil von Growth ist deshalb Aufklärung ("warum Wasser", "wie funktioniert das"), nicht nur Bewerbung eines bekannten Produkts.

## 3. Was Growth bei Pudado bedeutet

**Growth soll verbessern:** Produktverständnis, Vertrauen, Sichtbarkeit, Conversion, Nutzerführung, Wiedererkennbarkeit, Markenwahrnehmung, Content-Qualität, Suchmaschinen-Relevanz, Launch-Bereitschaft.

**Growth soll NICHT bedeuten:** Dark Patterns, Rabattdruck, künstliche Dringlichkeit, aggressive Pop-ups, Clickbait, billige Dropshipping-Sprache, übertriebene Heilversprechen, Angstmarketing, falsche Knappheit, erfundene Bewertungen.

Diese zweite Liste ist keine Nebenbemerkung, sondern gleichrangig mit der ersten. Eine Maßnahme, die auf die erste Liste einzahlt, aber ein Element der zweiten Liste einsetzt, ist keine gültige Growth-Maßnahme bei Pudado — unabhängig davon, wie wirksam sie kurzfristig wäre (siehe `01-executive`, Abschnitt 6, Non-Goals: "keine Optimierung auf kurzfristige Klicks, wenn langfristiges Vertrauen leidet").

## 4. Zielgruppenlogik

Wie in `00-core` ("Customer DNA – Annahmen vs. Belege") gilt strikt getrennt:

### Belegte Erkenntnisse
*(aktuell leer)* — es liegen keine strukturierten Kundendaten, Interviews oder quantitativen Erkenntnisse vor, die eine der folgenden Zielgruppen bestätigen.

### Plausible Annahmen (noch unbelegt)

- Menschen, die Hygiene im Bad verbessern wollen.
- Menschen mit sensibler Haut.
- Nachhaltigkeitsbewusste Haushalte.
- Designorientierte Käufer:innen.
- Familien.
- Senioren oder Menschen mit eingeschränkter Beweglichkeit.
- Menschen, die ein Bad-Upgrade suchen (Renovierung, Neueinzug).

Diese Liste deckt sich mit den bereits bestehenden `situations/`-Seiten (empfindliche Haut, Familien, Mobilität, Nachhaltigkeit, Schwangerschaft, Senioren) — das zeigt, dass diese Annahmen bereits in die Content-Struktur eingeflossen sind, macht sie aber nicht zu belegten Erkenntnissen. Es ist plausibel, dass diese Seiten aus denselben Annahmen heraus entstanden sind, die hier dokumentiert werden — nicht aus zwischenzeitlich gewonnenen Daten.

### Offene Fragen
Siehe `00-core`, "Customer DNA – Annahmen vs. Belege" — dieselben offenen Fragen (Preissensibilität, demografische Zusammensetzung, tatsächlicher Kaufauslöser, häufigste Einwände) gelten unverändert für Growth-Entscheidungen.

**Regel:** Keine dieser Zielgruppen wird in Kampagnen, Copy oder Reporting als Fakt dargestellt ("unsere Zielgruppe sind Familien"), solange sie unbelegt ist. Zulässige Formulierung: "wir vermuten, dass..." oder "diese Seite richtet sich an eine angenommene Zielgruppe von...".

## 5. Kernbotschaften

Bewertung der zentralen Growth-Botschaften anhand von sechs Kriterien (qualitativ: **niedrig/mittel/hoch**, keine erfundene Präzision):

| Botschaft | Verständlichkeit | Vertrauen | Markenfit | Conversion-Potenzial | Risiko Missverständnis | SEO-Potenzial |
|---|---|---|---|---|---|---|
| **"Wasser reinigt. Papier reibt."** | Hoch | Hoch | Hoch (Kernbotschaft laut `00-core`) | Mittel (erklärungsbedürftig, aber prägnant) | Niedrig | Niedrig (zu abstrakt als Suchbegriff) |
| **Einfache Installation** | Hoch | Mittel (muss belegt werden, nicht nur behauptet) | Hoch (Plug-and-Play ist Product DNA) | Hoch (löst Haupteinwand "zu kompliziert") | Niedrig | Mittel |
| **Mehr Hygiene ohne Umbau** | Hoch | Mittel | Hoch | Hoch | Niedrig | Mittel |
| **Premium-Bad-Upgrade** | Mittel | Mittel (muss durch Design/Qualität eingelöst werden) | Hoch | Mittel | Mittel ("Upgrade" wovon genau?) | Niedrig |
| **Sanfte Reinigung** | Hoch | Hoch | Hoch | Mittel | Niedrig | Mittel |
| **Nachhaltiger Alltag** | Mittel | Mittel | Mittel (Risiko: Öko-Klischee, siehe `02-brand-design`, Non-Goals) | Niedrig bis mittel | Mittel (klingt generisch, wenn nicht konkretisiert) | Mittel |
| **Modernes Badezimmergefühl** | Mittel | Niedrig (vage, wenig greifbar) | Mittel | Niedrig | Hoch (zu unspezifisch) | Niedrig |
| **Plug-and-Play statt komplizierter Installation** | Hoch | Mittel | Hoch | Hoch | Niedrig | Mittel |

**Einordnung (keine Messdaten, sondern begründete Einschätzung):** Die stärksten Botschaften sind jene, die einen konkreten Einwand direkt adressieren (Installation, Hygiene) — sie kombinieren hohe Verständlichkeit mit hohem Conversion-Potenzial bei niedrigem Missverständnis-Risiko. "Modernes Badezimmergefühl" ist am schwächsten: zu vage, um Vertrauen oder Conversion zu treiben. Diese Einordnung ist eine strukturierte Einschätzung, keine getestete Erkenntnis — sie sollte durch echtes Nutzerfeedback validiert werden, sobald möglich (siehe Abschnitt 19).

## 6. Conversion-Prinzipien

- **Klare CTAs:** Jede Sektion mit Handlungsabsicht hat eine eindeutige primäre Aktion (siehe `02-brand-design`, Abschnitt 8: nie zwei `btn-primary` nebeneinander).
- **Keine CTA-Überladung:** Mehrere gleichwertige Handlungsaufforderungen verwässern die primäre Handlung (siehe `01-executive`, Anti-Patterns).
- **Vertrauen vor Druck:** Kein künstlicher Zeitdruck, keine Verknappung, die nicht real ist.
- **Produkt zuerst erklären:** Bevor zur Handlung aufgefordert wird, muss die UX-Frage "Was ist das? Warum ist es besser?" (siehe `02-brand-design`, Abschnitt 11) beantwortet sein.
- **Einwände beantworten:** Die wahrscheinlichsten Zögerlichkeiten (Installation, Hygiene, Preis, Unbekanntheit der Kategorie — siehe `00-core`, offene Fragen zur Customer DNA) werden aktiv adressiert, nicht ignoriert.
- **Installation einfach darstellen:** Deckt sich mit der stärksten Kernbotschaft aus Abschnitt 5 — Installationssorge ist vermutlich der größte Conversion-Hemmer.
- **Risiken und Fragen transparent machen:** Ehrlich benannte Grenzen (z. B. wann die Installation nicht passt, siehe Installations-Checker in `03-engineering`) schaffen mehr Vertrauen als deren Verschweigen.
- **Kaufentscheidung erleichtern:** Reibungspunkte aktiv reduzieren (Rechner, Checker — siehe `00-core`, Conversion-Optimierung), nicht nur Argumente liefern.
- **Premium nicht durch Rabatt zerstören:** Ein Rabatt signalisiert kurzfristig Sparpotenzial, langfristig aber Zweifel an der eigentlichen Preiswürdigkeit — bei Pudado die Ausnahme, nicht das Werkzeug.

## 7. Website-Funnel

| Phase | Nutzerfrage | Gewünschte Antwort | Passende Website-Elemente | Mögliche Schwachstelle | Messbereich |
|---|---|---|---|---|---|
| **Aufmerksamkeit** | "Was ist das für ein Produkt?" | Sofort erkennbar: Premium-Handbidet für zuhause | Hero-Section, Kernbotschaft | Unklare Hero-Aussage, zu abstrakt | Absprungrate |
| **Verständnis** | "Wie funktioniert das genau?" | Klar erklärter Mechanismus (Wasser statt Papier, Plug-and-Play) | Erklärsektionen, Produktbereiche, `situations/`-Seiten | Zu viel Fachsprache oder zu wenig Kontext | Scrolltiefe, Verweildauer |
| **Vertrauen** | "Kann ich dem trauen?" | Trust-Elemente, DSGVO-Haltung, ehrliche Kommunikation | Trust-Elemente (Abschnitt 8), Impressum/Datenschutz sichtbar verlinkt | Fehlende oder unglaubwürdig wirkende Trust-Signale | Qualitatives Nutzerfeedback |
| **Interesse** | "Passt das zu meinem Bad/meiner Situation?" | Konkrete Anwendungsfälle | `situations/`-Seiten, Installations-Checker | Zu generische Darstellung ohne Bezug zur eigenen Situation | Nutzung Checker/Rechner |
| **Einwandbehandlung** | "Was, wenn es nicht passt / zu teuer / zu kompliziert ist?" | FAQ, ehrliche Antworten, Rechner-Ergebnis | FAQ-Sektion, Installations-Checker, Verbrauchsrechner | FAQ beantwortet nicht die echten Einwände | FAQ-Nutzung |
| **Handlung** | "Wie gehe ich jetzt vor?" | Eindeutige, einfache nächste Aktion | Primärer CTA ("Interesse anmelden" o. ä.) | Zu viele/unklare CTAs | Klickrate auf CTA, Conversion Rate |
| **Nachbereitung** | "Was passiert jetzt / wie bleibe ich informiert?" | Klare Bestätigung, transparente nächste Schritte | Bestätigungsseite/-nachricht, ggf. Newsletter-Opt-in | Keine Rückmeldung nach Handlung, Funkstille | Newsletter-/Wartelisten-Interesse |

Dieser Funnel ist ein Analyseraster, keine fertige Umsetzung — er zeigt, wo in der bestehenden Website (Hero, Situations, Checker, Rechner, FAQ) welche Funnel-Phase bereits adressiert ist und wo eine Lücke bestehen könnte.

## 8. Trust-Elemente

Elemente, die Vertrauen schaffen können — mit klarer Trennung zwischen bereits vorhandenen/belegbaren und noch fehlenden:

- **Klare Produktbilder** — vorhanden über `assets/`, Qualität/Finalität siehe `02-brand-design`, offene Fragen.
- **Installationslogik** — über Installations-Checker (`initChecker`) bereits umgesetzt.
- **Materialqualität** — muss über Bildsprache/Nahaufnahmen glaubhaft gezeigt werden (siehe `02-brand-design`, Abschnitt 10).
- **Lieferumfang** — sollte klar kommuniziert werden, sobald final definiert (siehe Abschnitt 19, offene Fragen).
- **FAQ** — bereits als Komponente vorhanden (`summary`/`details`-Muster).
- **Rechtliche Transparenz** — `impressum.html`, `datenschutz.html` bereits vorhanden.
- **Datenschutz** — DSGVO-Haltung (selbst gehostete Fonts, kein unnötiges Tracking) ist bereits ein aktiver Trust-Baustein, sollte auch explizit kommuniziert werden, nicht nur technisch umgesetzt sein.
- **Klare Sprache** — Teil der Tonalität aus `00-core`/`02-brand-design`, kein separates Element, sondern durchgängige Anforderung.
- **Echte Kundenstimmen, sobald vorhanden** — aktuell **nicht vorhanden** (siehe Offene Fragen, Abschnitt 19). Bis dahin werden keine Platzhalter-Zitate oder generische Testimonials verwendet.
- **Zertifikate/Standards, sobald belegbar** — aktuell keine bekannt/bestätigt; werden nur kommuniziert, wenn tatsächlich vorhanden und geprüft.
- **Keine erfundenen Trust-Siegel:** Ein Siegel oder eine Auszeichnung, die nicht real erworben/verifiziert ist, wird nicht angezeigt — das wäre ein direkter Verstoß gegen Golden Rule 5 aus `00-core` ("Premium ist ein Maßstab, kein Wort") und potenziell irreführende Werbung.

## 9. SEO-Strategie

- **Suchintention verstehen:** Vor jeder Content-/Metadaten-Entscheidung klären, ob die Nutzer:innen informieren, vergleichen oder kaufen wollen — unterschiedliche Intention braucht unterschiedliche Seitenstruktur.
- **Keine Keyword-Stopfung:** Text bleibt für Menschen geschrieben (siehe `01-executive`, Anti-Patterns: "SEO ohne Markenqualität"); Keywords werden natürlich eingebettet, nicht künstlich wiederholt.
- **Klare Seitentitel:** Bestehende Konvention fortführen (siehe Blog-Titel-Muster "Thema · Pudado Magazin", Situations-Titel-Muster "Nutzen · Pudado") — Konsistenz statt Ad-hoc-Formulierung pro Seite.
- **Gute Meta Descriptions:** Jede Seite behält eine eindeutige, nutzenorientierte Meta Description (siehe `CLAUDE.md`, SEO-Regeln).
- **Strukturierte Überschriften:** Ein `h1` pro Seite, danach logisch verschachtelte `h2`/`h3` (siehe `03-engineering`, HTML-Standards).
- **Interne Verlinkung:** Neue Inhalte werden sinnvoll mit bestehenden `situations/`- und `blog/`-Seiten verlinkt, nicht isoliert veröffentlicht.
- **Produktnutzen erklären, nicht nur Keywords bedienen:** SEO-Text muss denselben Qualitätsanspruch erfüllen wie jeder andere Text (siehe `02-brand-design`, Abschnitt 13: Premiumwirkung vor SEO-Textbedarf).
- **Blog/Content nur mit echtem Mehrwert:** Ein Artikel, der nur für Suchmaschinen-Ranking existiert, ohne echten Lesenutzen, wird nicht veröffentlicht.
- **Internationale SEO-Fragen bewusst markieren:** `hreflang`/`og:locale:alternate` für `de`/`en`/`fr` (siehe `CLAUDE.md`) müssen konsistent gepflegt werden; eine Erweiterung auf weitere Sprachen ist eine strategische Entscheidung (siehe `03-engineering`, Abschnitt 7), keine SEO-Detailaufgabe.
- **Keine erfundenen Rankings oder Suchvolumen:** Es liegen aktuell keine echten SEO-Daten (Rankings, Suchvolumen, Klickzahlen) vor — siehe Offene Fragen, Abschnitt 19. Keine Zahl wird geschätzt und als Fakt dargestellt.

## 10. Content-Strategie

Mögliche Content-Bereiche (Ideen, siehe Markierung unten):

- Warum Wasser hygienischer wirkt als trockenes Papier
- Handbidet installieren
- Handbidet ohne Bohren
- Bidet vs. Toilettenpapier
- Nachhaltigkeit im Badezimmer
- Badezimmer-Upgrade
- Intimhygiene modern erklären
- FAQ zu Installation und Alltag
- Pflege und Nutzung

**Abgleich mit vorhandenem Content:** Mehrere dieser Themen sind bereits über bestehende `blog/`-Artikel abgedeckt (u. a. "Wasser statt Papier – ein neuer Hygienestandard", "Nachhaltigkeit im Badezimmer", "Moderne Badezimmer-Hygiene", Artikel zu empfindlicher Haut, Menstruation, Wochenbett, Senioren). Neue Inhalte sollten zuerst gegen diese bestehende Liste geprüft werden, um Doppelungen zu vermeiden, statt unabhängig neu geplant zu werden.

**Wichtig:** Diese Themen sind **Ideen, keine validierten SEO-Prioritäten**. Es liegen keine Daten dazu vor, welches Thema tatsächlich Suchvolumen, Relevanz oder Conversion-Wirkung hat (siehe Abschnitt 19). Eine Priorisierung unter diesen Themen wäre aktuell eine Annahme, keine informierte Entscheidung.

## 11. Landingpage-Regeln

Eine Pudado-Landingpage muss:
- sofort verständlich sein (siehe `02-brand-design`, Abschnitt 11, UX-Prinzipien),
- hochwertig wirken (siehe `00-core`, Definition von Premium),
- Installation erklären (stärkste Kernbotschaft, siehe Abschnitt 5),
- Vertrauen aufbauen (siehe Abschnitt 8, Trust-Elemente),
- Einwände beantworten (siehe Abschnitt 6),
- mobil perfekt funktionieren (siehe `03-engineering`, Mobile-first),
- klare CTAs haben (siehe Abschnitt 6),
- **nicht** nach billigem Shop aussehen (siehe `02-brand-design`, Non-Goals: "Dropshipping-Shop"),
- **nicht** peinlich oder medizinisch wirken (siehe `02-brand-design`, Non-Goals: "medizinisches Problemprodukt"),
- die Marke stärken — jede Landingpage ist auch Markenkommunikation, nicht nur Conversion-Werkzeug.

## 12. Messaging-Regeln

Sprache muss: klar, ruhig, hochwertig, menschlich sein.

Sprache darf **nicht** sein: peinlich, aggressiv, übertrieben medizinisch, belehrend, billig, generisch.

Diese Liste ist deckungsgleich mit der Tonalität aus `00-core` und wird hier bewusst wiederholt, weil Marketing-Sprache am häufigsten der Ort ist, an dem diese Regel unter Erfolgsdruck aufgeweicht wird (z. B. "belehrend" durch übertriebene Aufklärungs-Rhetorik, "aggressiv" durch Verkaufsdruck in Ad-Copy).

## 13. Social Media & Kampagnenlogik

Erste Regeln, bewusst als Rahmen, nicht als vollständige Kanalstrategie (siehe Offene Fragen, Abschnitt 19: Ads-Budget/Kanäle sind offen):

- **Reels/TikTok/Instagram:** Format darf modern und dynamisch sein, Inhalt und Tonalität bleiben an die Messaging-Regeln (Abschnitt 12) gebunden — ein schnelles Format rechtfertigt keine reißerische Sprache.
- **Ads:** Gleiche Grundsätze wie auf der Website (Abschnitt 6, 11) — keine Ad-spezifische Ausnahme von den Marken-Non-Goals.
- **Produktdemonstrationen:** Sachlich, zeigen tatsächliche Funktion — kein übertriebenes "Wow-Effekt"-Framing.
- **Erklärvideos:** Bevorzugtes Format für Aufklärung (siehe Growth-Philosophie, Abschnitt 2: "Bildung des Marktes vor reiner Werbung").
- **Before/After nur seriös:** Falls überhaupt eingesetzt, ohne Dramatisierung oder implizite Beschämung des "Vorher"-Zustands.
- **Keine Schamkommunikation:** Kein Framing, das Nutzer:innen für die Nutzung von Toilettenpapier oder für die eigene Situation beschämt.
- **Keine peinliche Intimhygiene-Inszenierung:** Deckt sich mit `02-brand-design`, Abschnitt 10.
- **Keine Fake-Testimonials:** Deckt sich mit Abschnitt 8 — kein erfundenes oder gestelltes Kundenzitat.
- **Keine unrealistischen Claims:** Keine Wirkversprechen, die über das reale Produkt hinausgehen.

## 14. Growth-Experimente

Jedes Experiment wird vor Start in dieser Struktur festgehalten:

- **Hypothese** — was wird angenommen, und warum?
- **Ziel** — was soll erreicht werden?
- **Risiko** — was kann im schlechtesten Fall passieren (Marke, Vertrauen, Technik)?
- **Erwartete Wirkung** — realistisch eingeschätzt, nicht optimistisch geraten.
- **Messbereich** — welcher Bereich aus Abschnitt 15 wird beobachtet?
- **Laufzeit** — klar begrenzter Zeitraum, kein unbefristetes "Testen".
- **Entscheidung nach Ergebnis** — wird beibehalten, verworfen oder angepasst, basierend auf dem tatsächlichen Ergebnis, nicht auf Bauchgefühl (siehe `01-executive`, Non-Goals: "keine Entscheidungen nur nach Bauchgefühl").

**Regel:** Keine dauerhafte Änderung ohne Auswertung. Ein Experiment, das nie ausgewertet, sondern einfach stillschweigend zur neuen Normalität wird, unterläuft den gesamten Zweck dieses Prozesses.

## 15. Messbereiche und KPIs

Wie in `00-core` und `01-executive`: **keine Zahlen erfinden.** Die folgenden Messbereiche definieren, worauf geachtet wird, sobald Daten verfügbar sind:

- Conversion Rate
- Klickrate auf CTA
- Scrolltiefe
- Absprungrate
- Ladezeit
- SEO-Sichtbarkeit
- Organischer Traffic
- Nutzerfeedback
- Installationsverständnis (z. B. über Checker-Nutzung/-Ergebnisse)
- Vertrauen (siehe `00-core`, "Vision & Mission messbar machen")
- FAQ-Nutzung
- Newsletter-/Wartelisten-Interesse

Sobald belastbare Daten vorliegen, gehören konkrete Zielwerte in eine spätere Version dieses Dokuments oder ein dediziertes Reporting — nicht rückwirkend als Behauptung in v0.1.

## 16. Growth-Konflikte

Grundlage ist die kanonische Rangfolge aus `00-core` (Sicherheit, Recht & Datenschutz > Markenvertrauen > Produktverständnis > UX & Accessibility > Stabilität & Engineering > Performance > Conversion/Growth > SEO > Umsetzungsgeschwindigkeit). Für Growth-spezifische Konflikte:

- **Conversion vs. Vertrauen:** Vertrauen gewinnt (siehe Abschnitt 2, 6).
- **SEO-Textbedarf vs. Minimalismus:** Wird wie in `02-brand-design`, Abschnitt 13 gelöst — Tonalität/Klarheit vor Keyword-Dichte.
- **Rabatt vs. Premium:** Premium gewinnt (siehe `01-executive`, Non-Goals: "keine Rabattmarke").
- **Aufmerksamkeit vs. Markenruhe:** Markenruhe gewinnt — Aufmerksamkeit, die nur durch Lautstärke/Übertreibung entsteht, widerspricht `00-core`, Markenwirkung ("nicht laut").
- **Kurze Botschaft vs. genaue Erklärung:** Kontextabhängig zu lösen: Im ersten Kontakt (Hero, Ads) gewinnt die kurze Botschaft; sobald Nutzer:innen aktiv Informationen suchen (FAQ, Blog, Situations-Seiten), gewinnt die genaue Erklärung. Beides gleichzeitig zu leisten ist der Zweck des Funnels aus Abschnitt 7, nicht ein Widerspruch, der einmalig aufgelöst werden muss.
- **Social-Media-Viralität vs. Seriosität:** Seriosität gewinnt — ein Format, das nur durch Grenzüberschreitung (Schamkommunikation, Übertreibung) viral gehen könnte, wird nicht verfolgt (siehe Abschnitt 13).

**Vorgehen bei Konflikten:** Claude Code benennt den Konflikt, vergleicht Optionen, erklärt Risiken und gibt eine begründete Empfehlung. Bei strategischen Growth-Entscheidungen (neuer Kanal, neue Zielmarkt-Ansprache, Preiskommunikation, Kampagnen mit Budget-Einsatz) wird menschliche Freigabe eingeholt — über die Entscheidungsvorlage aus `01-executive`, Abschnitt 11.

## 17. Definition of Done für Growth

Eine Growth-Änderung gilt erst als abgeschlossen, wenn **alle** folgenden Punkte zutreffen:

- Sie passt zur Marke (Growth-Philosophie, Messaging-Regeln).
- Sie beschädigt Vertrauen nicht.
- Sie ist verständlich.
- Sie macht keine falschen Versprechen.
- Sie nutzt keine erfundenen Daten (Kundenzahlen, Bewertungen, SEO-Zahlen).
- Sie behandelt SEO nicht manipulativ (keine Keyword-Stopfung, kein Duplicate Content ohne `canonical`).
- Sie funktioniert mobil.
- Sie ist messbar oder zumindest später überprüfbar (Bezug zu Abschnitt 15).
- Sie ist mit Design (`02-brand-design`) und Engineering (`03-engineering`) vereinbar, nicht isoliert von diesen entstanden.

## 18. Anti-Patterns

- **Rabatt-Schlachten** — widerspricht Premium-Positionierung.
- **Countdown-Druck** — künstliche Dringlichkeit ohne reale Grundlage.
- **Fake-Bewertungen** — direkter Vertrauensbruch, potenziell rechtlich relevant.
- **Erfundene Kundenzahlen** — verstößt gegen Golden Rule 10 aus `00-core`.
- **SEO-Spam** — minderwertiger Content, nur für Ranking erstellt.
- **Keyword-Stuffing** — unnatürliche Keyword-Wiederholung, schadet Lesbarkeit und langfristig auch Ranking.
- **Generische KI-Texte** — erkennbar unpersönliche, austauschbare Sprache widerspricht der Markentonalität.
- **Zu viele CTAs** — verwässert primäre Handlung (siehe Abschnitt 6).
- **Angstmarketing** — Verkauf über Sorge/Bedrohung statt über Nutzen.
- **Scham-Marketing** — siehe Abschnitt 13, direkter Verstoß gegen Markenwerte.
- **Billige Dropshipping-Tonalität** — widerspricht `02-brand-design`, Non-Goals.
- **Greenwashing** — Nachhaltigkeit wird behauptet statt belegt (siehe `00-core`: "wird gezeigt, nicht behauptet").
- **Übertriebene Nachhaltigkeitsclaims** — z. B. unbelegte "100 % nachhaltig"-Aussagen.
- **Medizinische Versprechen ohne Grundlage** — Pudado ist ein Lifestyle-Produkt, keine geprüfte medizinische Behandlung; entsprechende Versprechen sind sowohl markenwidrig als auch potenziell rechtlich riskant (siehe `03-engineering`, Security Engineering; `00-core`, Sicherheit & Recht).

## 19. Offene Fragen

Diese Informationen fehlen aktuell und werden nicht durch Annahmen ersetzt:

- **Echte Kundendaten** fehlen (siehe `00-core`, Customer DNA).
- **Wettbewerbsanalyse** fehlt (siehe `01-executive`, Offene Fragen).
- **Preisstrategie** fehlt — beeinflusst direkt, wie Conversion- und Rabatt-Fragen (Abschnitt 6, 16) in der Praxis zu handhaben sind.
- **Finale Zielmärkte** fehlen (siehe `01-executive`, Offene Fragen) — beeinflusst SEO- und Content-Priorisierung (Abschnitt 9, 10).
- **Launch-Ziele** fehlen (siehe `01-executive`, Offene Fragen).
- **Echte Conversion-Daten** fehlen — die Einschätzungen in Abschnitt 5 und der Funnel in Abschnitt 7 sind unvalidierte Analyseraster, keine getesteten Ergebnisse.
- **Echte SEO-Daten** (Rankings, Suchvolumen, tatsächlicher organischer Traffic) fehlen.
- **Produktverfügbarkeit** ist noch zu klären (siehe `01-executive`, Offene Fragen) — beeinflusst, wie verbindlich Growth-Kommunikation überhaupt sein darf (z. B. konkrete Liefertermine).
- **Echte Testimonials** fehlen (siehe Abschnitt 8) — bis dahin werden keine Kundenstimmen kommuniziert.
- **Ads-Budget und Kanäle** sind noch offen (siehe Abschnitt 13) — die dortigen Regeln sind ein Rahmen für den Fall, dass Kanäle bespielt werden, keine Aussage darüber, ob/wann das geschieht.

---

*Dies ist Version 0.1.1 — v0.1 war der erste Entwurf für den Growth-Bereich, aufbauend auf `00-core` v0.2.1, `01-executive` v0.1, `02-brand-design` v0.1.1 und `03-engineering` v0.1. v0.1.1 korrigiert die in Abschnitt 16 zitierte Rangfolge (zuvor Conversion vor Performance) auf die kanonische Reihenfolge aus `00-core` v0.2.2. Änderungen werden im übergeordneten `CHANGELOG.md` dokumentiert.*

# 00 — Core

**Version:** 0.2.2
**Status:** Zweiter Entwurf — deutlich belastbarer als v0.1, weiterhin in Entwicklung. v0.2.1 präzisierte die Farblogik, v0.2.2 vereinheitlicht die Konflikt-Rangfolge als kanonische PDOS-weite Priorität.

Dies ist das Fundament von PDOS. Jede strategische, gestalterische oder inhaltliche Entscheidung bei Pudado sollte sich an den hier festgehaltenen Prinzipien messen lassen. Bei Widersprüchen zwischen einer Einzelentscheidung und diesem Dokument hat dieses Dokument Vorrang — es sei denn, das Dokument selbst wird bewusst weiterentwickelt.

---

## Vision

Wasser wird in modernen Badezimmern zur selbstverständlichen, hochwertigen Alternative zu trockenem Papier — so normal und vertrauenswürdig wie eine gute Dusche oder ein gutes Wasserhahn-Design.

Pudado will die Marke sein, die diesen Wandel im deutschsprachigen (und perspektivisch europäischen) Markt anführt: nicht als Nischenprodukt für Enthusiasten, sondern als Premium-Standard, den man sich bewusst ins eigene Zuhause holt.

## Mission

Pudado entwickelt mit EcoBum ein Plug-and-Play-Handbidet, das Hygiene, Nachhaltigkeit und Design vereint — ohne Strom, ohne komplizierte Installation, ohne Kompromisse beim Anspruch an Ästhetik und Qualität.

Die Mission ist nicht "ein Produkt verkaufen", sondern eine bessere, sanftere Art der Reinigung so zugänglich zu machen, dass sie zur naheliegenden Wahl wird.

## Vision & Mission messbar machen

Vision und Mission sind bewusst als Leitbild formuliert, nicht als KPI-Liste. Damit sie trotzdem überprüfbar bleiben und nicht zur reinen Absichtserklärung verkommen, werden hier **Messbereiche** definiert — Dimensionen, in denen sich Fortschritt (oder Stillstand) zeigen muss. Es werden bewusst **noch keine konkreten Zielwerte** festgelegt, da dafür belastbare Baseline-Daten fehlen (siehe "Customer DNA – Annahmen vs. Belege"). Zielwerte gehören in `01-executive`, sobald sie auf echten Daten basieren.

| Messbereich | Was er über Vision/Mission aussagt | Wie er sich später konkretisieren lässt |
|---|---|---|
| **Vertrauen** | Ob Nutzer:innen die Marke als "vertrauenswürdig genug für das eigene Zuhause" wahrnehmen | Umfragen, Wiederkaufrate, Weiterempfehlung (NPS-artig), Support-Anfragen zu Datenschutz/Sicherheit |
| **Verständlichkeit** | Ob die Kernbotschaft ("Wasser reinigt. Papier reibt.") ohne Erklärung verstanden wird | Nutzertests, Absprungrate auf Erklärungs-Sektionen, Support-Fragen, die zeigen, dass etwas unklar war |
| **Conversion** | Ob aus Interesse tatsächlich Handlung wird (Kauf, Anmeldung, Anfrage) | Conversion-Rate nach Funnel-Schritt, Abbruchpunkte |
| **Ladezeit / Core Web Vitals** | Ob das Premium-Erlebnis technisch eingehalten wird | LCP, CLS, INP (siehe `03-engineering`, `05-quality`) |
| **Accessibility** | Ob "für alle nutzbar" mehr als eine Behauptung ist | Automatisierte Audits (z. B. axe), manuelle Tastatur-/Screenreader-Tests, WCAG-AA-Konformität |
| **Markenwahrnehmung** | Ob Pudado tatsächlich im Wahrnehmungsraum von Apple/Dyson/Nothing ankommt oder eher als Sanitärartikel wahrgenommen wird | Qualitative Interviews, Markenassoziationstests, Vergleich mit Referenzmarken in Nutzerbefragungen |

**Wichtig:** Ein Messbereich ohne Daten ist kein Beweis für oder gegen Erfolg — er ist eine offene Frage, die priorisiert für echte Messung vorgesehen ist, sobald das möglich ist (z. B. Analytics, Nutzerinterviews, Betatests).

## Brand DNA

- **Positionierung:** Premium-Lifestyle-Marke. Pudado konkurriert im Wahrnehmungsraum mit Marken wie Apple, Dyson und Nothing — nicht mit klassischen Bad- oder Sanitärartikeln. Diese Referenzgruppe ist der Maßstab für Design, Kommunikation und Produktqualität.
- **Kernbotschaft:** *"Wasser reinigt. Papier reibt."* Wasser ist die sanftere, hygienischere Alternative bzw. Ergänzung zu trockenem Papier. Diese Botschaft ist der rote Faden für Copy, Bildsprache und Produktstruktur — jede neue Inhaltsentscheidung sollte sie stützen, nicht verwässern.
- **Tonalität:** Ruhig, selbstbewusst, sachlich-hochwertig. Die Marke erklärt und überzeugt, statt zu schreien. Keine reißerischen Superlative, keine Ausrufezeichen-Kaskaden, kein Herabsetzen von Alternativen ("Klopapier-Bashing").
- **Visuelle Identität:** Blau (Royal Blue) ist die einzige primäre Markenfarbe. Zwei eng begrenzte Ausnahmen bestehen bewusst, ohne diesen Grundsatz aufzuweichen: Sage/Grün als rein semantische Statusfarbe und Türkis als sehr sparsam eingesetzter Wasser-/Interaktionsakzent (siehe `02-brand-design`, Abschnitt 5, Entscheidung vom 2026-07-03). Keine dieser Ausnahmen wird zu einer zweiten gleichrangigen Markenfarbe. Ergänzend: helle, hochwertige Bildwelten mit natürlichen Materialien (Holz, Stein, Textil) und realen Anwendungssituationen statt klinisch-steriler Produktfotos oder generischer Stock-Ästhetik.
- **Vertrauen als Markenkern:** Datensparsamkeit (z. B. selbst gehostete Fonts statt Google-Fonts-CDN, kein unnötiges Tracking) ist Teil des Markenversprechens "vertrauenswürdig" — nicht nur eine rechtliche Pflichtübung.

## Product DNA

- **Plug-and-Play:** Installation ohne Strom, ohne Fachbetrieb, ohne größere bauliche Eingriffe. Einfachheit ist ein Kernversprechen, kein Nice-to-have.
- **Funktional kompromisslos:** Das Produkt muss zuverlässig, hygienisch und angenehm in der täglichen Nutzung sein — Design darf Funktion nie unterordnen oder umgekehrt.
- **Zeitlose Gestaltung:** Formen und Materialien, die nicht wie ein Trend wirken, sondern in fünf Jahren noch hochwertig aussehen.
- **Nachhaltigkeit als Ergebnis, nicht als Werbeversprechen:** Wasser statt Papierverbrauch ist die zentrale ökologische Wirkung des Produkts — das wird gezeigt, nicht behauptet.

## Non-Goals

Eine Marken-DNA, die nur sagt, was Pudado *ist*, lässt zu viel Interpretationsspielraum für Scope-Creep. Deshalb hier explizit, was **bewusst nicht** angestrebt wird:

**Was Pudado nicht sein will**
- Kein austauschbares Haushalts- oder Sanitärprodukt unter vielen gleichartigen Angeboten.
- Kein Gadget/Spielzeug-Charakter — EcoBum ist ernsthafte Badezimmer-Infrastruktur, kein witziges Nischenprodukt.
- Keine reine "Öko"-Marke, die primär über Verzicht oder moralischen Druck verkauft, statt über Qualität und Erlebnis.
- Keine anonyme Commodity-Marke ohne erkennbare Haltung oder Wiedererkennbarkeit.

**Design­richtungen, die vermieden werden**
- Verspielte, "cute" oder kindliche Formensprache.
- Kalte, klinisch-medizinische Ästhetik (wirkt wie Krankenhausbedarf statt Premium-Lifestyle).
- Überladener Maximalismus, viele Farben/Effekte gleichzeitig, visuelle Unruhe.
- Kurzlebige Trend-Optik (z. B. aggressive Neon-Gradients, Meme-Ästhetik), die in einem Jahr bereits veraltet wirkt.

**Marktpositionierung, die nicht zu Pudado passt**
- Discount-/Grabbeltisch-Positionierung (z. B. Präsenz in reinen Preisvergleichs- oder Ramsch-Kanälen ohne Markenkontext).
- Generische Marktplatz-Commodity-Listung ohne eigene Markenumgebung (Amazon-Basic-artige Wahrnehmung).
- Positionierung als medizinisches/pflegerisches Hilfsmittel statt als Lifestyle-Produkt.

**Kurzfristige Optimierungen, die nicht zur Marke passen**
- Dark Patterns: künstliche Verknappung, gefälschte Countdown-Timer, versteckte Kosten, erzwungene Newsletter-Pop-ups.
- Reißerische Clickbait-Copy oder Angst-/Scham-basierte Verkaufsargumente.
- Rabattschlachten, die die Premium-Wahrnehmung untergraben (häufige, tiefe Discounts als Dauerzustand statt Ausnahme).
- Tracking-/Cookie-Maximierung zugunsten kurzfristiger Marketing-Optimierung, die der DSGVO-Haltung widerspricht.

**Wachstum, das nicht gewünscht ist**
- Wachstum über billigen, hochvolumigen Paid-Traffic mit hoher Abbruch-/Retourenquote statt qualifiziertem Interesse.
- Feature- oder Sortiments-Wildwuchs, der die Fokussierung auf ein exzellentes Kernprodukt verwässert.
- Unkontrollierte internationale Expansion ohne saubere Lokalisierung (siehe Internationalisierungsregeln in `CLAUDE.md`) nur um Reichweite zu erhöhen.
- Wachstum, das Kompromisse an Brand DNA, Datensparsamkeit oder Qualitätsprinzipien erfordert, um kurzfristige Zahlen zu verbessern.

## Customer DNA – Annahmen vs. Belege

**Ausgangslage (Stand v0.2):** Es liegen aktuell **keine** strukturierten Kundeninterviews, Umfragen oder quantitativen Marktdaten vor, die die folgenden Punkte belegen. Alle Aussagen zur Zielgruppe sind daher als Annahmen zu behandeln, nicht als Fakten — auch wenn sie plausibel aus der Markenpositionierung abgeleitet sind. Diese Trennung ist bewusst, um zu verhindern, dass Wunschvorstellungen über die Zielgruppe unreflektiert in Produkt-, Design- oder Marketingentscheidungen einfließen.

### Belegte Erkenntnisse
*(aktuell leer)*

Es gibt derzeit keine durch echte Daten (Interviews, Umfragen, Kaufverhalten, Analytics) belegten Erkenntnisse über die Zielgruppe. Sobald erste belastbare Daten vorliegen (z. B. aus Vorbestellungen, Beta-Feedback, Website-Analytics, Interviews), gehören sie hierher — mit Quelle und Datum.

### Plausible Annahmen (noch unbelegt)

- Menschen, die bereits Wert auf Qualität in ihrem Zuhause legen (gutes Bad, gute Küche, bewusst gewählte Geräte) und für die EcoBum eine logische Erweiterung dieses Anspruchs ist.
- Käufer:innen, die eine bessere Lösung wollen, aber nicht bereit sind, dafür Ästhetik, Einfachheit oder Vertrauenswürdigkeit zu opfern.
- Menschen, die auf Hygiene und Komfort Wert legen, aber bisher glaubten, ein Bidet erfordere teure Sanitärinstallation — und die durch Plug-and-Play zum ersten Mal eine realistische Option bekommen.
- Datenschutzbewusste Nutzer:innen, für die eine Marke, die sichtbar sparsam mit Daten umgeht, vertrauenswürdiger wirkt als eine, die es nicht tut.

Diese Annahmen dürfen die Richtung von Design und Kommunikation informieren, aber **keine Entscheidung sollte allein auf ihnen aufbauen**, wenn eine Alternative existiert, die weniger stark auf unbelegten Zielgruppen-Behauptungen beruht.

### Offene Fragen (brauchen echte Daten)

- Wie preissensibel ist die Zielgruppe tatsächlich — wo liegt die Schmerzgrenze für ein Premium-Produkt dieser Kategorie?
- Welche demografische/psychografische Zusammensetzung hat die tatsächliche Käuferschaft (Alter, Haushaltsgröße, Wohnsituation Miete/Eigentum)?
- Was ist der tatsächliche Kaufauslöser (Neubau/Renovierung, Gesundheitsanlass, Umweltbewusstsein, Empfehlung)?
- Welche Einwände oder Zögerlichkeiten treten in der Realität am häufigsten auf (Hygiene-Bedenken, Installationssorgen, Preis, Unbekanntheit der Produktkategorie)?
- Wie sieht Wiederkauf-/Weiterempfehlungsverhalten tatsächlich aus?

**Regel:** Sobald zu einer "offenen Frage" Daten vorliegen, wird der entsprechende Punkt in "Belegte Erkenntnisse" verschoben (mit Quelle) und hier entfernt. Umgekehrt: Eine "plausible Annahme", die durch Daten widerlegt wird, wird gestrichen oder korrigiert — nicht stillschweigend beibehalten.

## Definition von Premium

Premium bei Pudado bedeutet nicht "teuer wirken", sondern:

1. **Kompromisslose Details:** Kein sichtbarer Bruch in Typografie, Abstand, Farbwelt oder Tonalität — Konsistenz ist ein Qualitätsmerkmal, kein Nice-to-have.
2. **Zurückhaltung statt Lautstärke:** Premium überzeugt durch Klarheit und Ruhe, nicht durch möglichst viele Effekte, Farben oder Superlative.
3. **Funktionierende Einfachheit:** Ein Produkt oder Interface ist erst dann premium, wenn die einfache Nutzung *auch bei genauem Hinsehen* durchdacht bleibt — kein Glanz, der nur oberflächlich hält.
4. **Vertrauen durch Verhalten, nicht durch Behauptung:** Datensparsamkeit, ehrliche Kommunikation und verlässliche Funktion erzeugen das Premium-Gefühl — nicht das Wort "Premium" selbst.
5. **Zeitlosigkeit:** Eine Entscheidung ist erst dann gut genug, wenn sie auch in einem Jahr noch richtig wirkt.

## Qualitätsprinzipien

- Jede Änderung an Produkt, Marke, Website oder Kommunikation wird an der Brand DNA und der Definition von Premium gemessen, bevor sie umgesetzt wird.
- Konsistenz geht vor Geschwindigkeit: Lieber eine Entscheidung sauber in bestehende Muster einordnen, als schnell eine Ausnahme schaffen.
- Qualität wird über alle Disziplinen hinweg gleich ernst genommen — Code, Design, Copy, Kundenkommunikation und rechtliche Sorgfalt (DSGVO, Impressum etc.) haben denselben Anspruch.
- Zugänglichkeit (Accessibility) und Performance sind Teil der Produktqualität, nicht optionale Extras für später.
- Nichts wird als "gut genug für jetzt" durchgewunken, ohne dass es explizit als bewusster, befristeter Kompromiss benannt wird.

## Qualität ist bestanden, wenn…

Diese Kriterien sind eine **v0.2-Arbeitsgrundlage**, kein endgültiger Standard. Sie sollen sofort nutzbar sein, um "fertig" von "noch nicht fertig" zu unterscheiden — sie werden erweitert, sobald `05-quality` ausgearbeitet ist.

- **Design:** …neue Elemente ausschließlich bestehende Design-Tokens (`--`-Variablen aus `style.css`) nutzen, das Ein-Akzent-Prinzip einhalten und im Ergebnis mit bestehenden Komponenten visuell ununterscheidbar konsistent wirken.
- **UX:** …ein:e Nutzer:in ohne Erklärung versteht, was ein Element tut (Button/Link/Accordion eindeutig erkennbar), und der primäre Handlungsschritt einer Seite/Sektion klar erkennbar bleibt.
- **Technik:** …der Code ohne neue Abhängigkeiten auskommt (dependency-frei bleibt), bestehende Funktionen (insbesondere `translations.js`) nicht unbeabsichtigt bricht und sich in die bestehende Namens-/Strukturkonvention einfügt.
- **SEO:** …jede Seite eindeutigen `<title>`, `meta description` und `canonical` behält, JSON-LD bei inhaltlichen Änderungen aktuell bleibt und neue Seiten in `sitemap.xml` aufgenommen sind.
- **Accessibility:** …WCAG-AA-Kontrast eingehalten wird (mind. 4.5:1 Fließtext, 3:1 große Typo/UI), alle interaktiven Elemente per Tastatur erreichbar sind und sichtbare Fokuszustände vorhanden sind.
- **Sicherheit:** …keine dynamischen Nutzer-Inputs ungeschätzt in HTML/JS eingefügt werden, externe Links `rel="noopener noreferrer"` tragen und keine neuen Tracker/Third-Party-Skripte ohne Datenschutzprüfung eingebaut wurden.
- **Conversion:** …die primäre Handlung einer Seite/Sektion durch zusätzliche Elemente nicht verwässert wird und jede Änderung mit potenziellem Conversion-Einfluss explizit benannt ist (siehe `CLAUDE.md`, Abschnitt Conversion-Optimierung).

Eine Änderung, die eines dieser Kriterien in ihrem Bereich verfehlt, gilt nicht als abgeschlossen — unabhängig davon, wie gut sie in den übrigen Bereichen ist.

## Entscheidungsprinzipien

Bei jeder nicht-trivialen Entscheidung gilt diese Reihenfolge:

1. **Stützt es die Kernbotschaft und Brand DNA?** Wenn nein — nicht umsetzen, unabhängig davon, wie gut die Idee isoliert betrachtet wirkt.
2. **Hält es dem Premium-Maßstab stand?** Würde eine Marke wie Apple, Dyson oder Nothing das so machen?
3. **Ist es langfristig tragfähig?** Pudado ist kein Wegwerf-Prototyp — Entscheidungen sollen in einem Jahr noch sinnvoll sein, nicht nur kurzfristig funktionieren.
4. **Ist es konsistent mit bestehenden Mustern?** Neue Lösungen fügen sich in bestehende Strukturen (Design-System, Code-Konventionen, Tonalität) ein, statt Parallelwege zu schaffen.
5. **Wurde der Kompromiss benannt?** Falls eine Entscheidung einen Kompromiss bei einem der obigen Punkte bedeutet, wird das explizit ausgesprochen — nicht stillschweigend hingenommen.

## Konfliktlösung & Eskalation

Design, Performance, Conversion, SEO und Technik ziehen nicht immer in dieselbe Richtung (z. B. ein zusätzliches Trust-Badge hilft Conversion, kostet aber Ladezeit; eine SEO-optimierte Formulierung passt sprachlich nicht zur Tonalität). Dafür gilt folgende Rangfolge, **von nicht verhandelbar bis abwägbar** — sie ist die **einzige, kanonische PDOS-weite Priorität**: Jedes andere Bereichsdokument (`01-executive` bis `06-ai-workflows`), das eine eigene Rangfolge oder Konfliktlogik definiert, referenziert exakt diese neun Stufen in exakt dieser Reihenfolge, statt eine abweichende eigene Fassung zu führen.

1. **Sicherheit, Recht & Datenschutz** (DSGVO, rechtliche Pflichtangaben, Barrierefreiheits-Mindeststandards) — nicht verhandelbar, geht jeder anderen Erwägung vor.
2. **Markenvertrauen** (Brand DNA, Non-Goals, Ein-Akzent-Prinzip, Tonalität) — wird nicht zugunsten kurzfristiger Zahlen aufgeweicht.
3. **Produktverständnis** — ob Menschen verstehen, was Pudado/EcoBum ist und warum es relevant ist; ohne dieses Verständnis steht jede weitere Maßnahme auf einem brüchigen Fundament.
4. **UX & Accessibility** — ein Produkt/eine Seite, die nicht verstanden oder nicht von allen bedient werden kann, ist nicht "fertig", unabhängig von anderen Vorteilen.
5. **Stabilität & Engineering** — technische Zuverlässigkeit (funktionierender Code, keine beschädigten Kernfunktionen) ist Voraussetzung für alles Folgende, nicht nachträglich verhandelbar.
6. **Performance / Core Web Vitals** — beeinflusst UX, SEO und Conversion gleichermaßen; wird nicht leichtfertig für kosmetische Verbesserungen geopfert.
7. **Conversion / Growth** — wichtig, aber nachrangig zu 1–6; eine Conversion- oder Wachstumsverbesserung, die gegen Sicherheit, Marke, Produktverständnis, UX/Accessibility, Stabilität oder Performance verstößt, wird nicht umgesetzt.
8. **SEO** — ist ein Mittel zum Zweck (Sichtbarkeit), kein Selbstzweck; SEO-Vorteile rechtfertigen keine Abweichung von Tonalität oder Struktur.
9. **Umsetzungsgeschwindigkeit** — zählt zuletzt; eine schnelle, aber prinzipienwidrige Lösung ist keine gute Lösung.

**Wann muss der Mensch entscheiden:**
- Wenn zwei Prinzipien auf derselben Rang-Ebene kollidieren und die Rangfolge allein keine eindeutige Antwort liefert.
- Bei markenprägenden Entscheidungen (neue Akzentfarbe, neues Grundraster, neue Sprache, Abweichung von einer Golden Rule).
- Bei Entscheidungen mit finanziellem, rechtlichem oder Reputationsrisiko.
- Wenn eine Änderung faktisch eines der `00-core`-Prinzipien selbst verändern würde (dann ist es keine Anwendung des Dokuments mehr, sondern eine Weiterentwicklung von PDOS).

**Wann darf Claude nicht allein entscheiden:**
- Bei allem, was oben "Mensch muss entscheiden" auslöst.
- Bei destruktiven, schwer umkehrbaren oder sicherheitsrelevanten Aktionen (siehe Sicherheitsregeln in `CLAUDE.md`).
- Wenn eine plausible Lösung existiert, die einen der Non-Goals berührt, selbst wenn sie sonst sinnvoll wirkt.
- Wenn die Datenlage für eine Zielgruppen-Annahme genutzt werden müsste, die laut "Customer DNA – Annahmen vs. Belege" noch unbelegt ist, und die Entscheidung schwer rückgängig zu machen wäre.

In all diesen Fällen gilt: Konflikt und Optionen explizit benennen, keine stillschweigende Auflösung.

## Golden Rules

1. **Wasser reinigt, Papier reibt** — jede Kommunikation darf diese Botschaft stützen, nie verwässern.
2. **Ein Akzent, kontrollierte Ausnahmen** — Blau bleibt die einzige primäre Markenfarbe. Grün (`--sage`) ist ausschließlich semantische Statusfarbe (Nachhaltigkeit, positive Hinweise, Erfolg, ruhige Informationszustände). Türkis ist ausschließlich ein sehr sparsam eingesetzter Wasser-/Interaktionsakzent, niemals gleichrangig zu Blau (siehe `02-brand-design`, Abschnitt 5). Keine weitere Akzentfarbe ohne ausdrückliche menschliche Freigabe.
3. **Ruhe statt Lautstärke** — Ton, Design und Interaktion sind selbstbewusst-zurückhaltend, nie reißerisch.
4. **Datensparsamkeit ist Markenkern** — keine unnötigen Trackers, keine Fremd-CDNs ohne triftigen Grund, DSGVO-Entscheidungen werden nicht rückgängig gemacht ohne ausdrückliche Rücksprache.
5. **Premium ist ein Maßstab, kein Wort** — nie behaupten, immer belegen.
6. **Langlebigkeit vor Schnelligkeit** — Pudado ist ein langfristiges Produkt; Entscheidungen werden so getroffen, dass sie in einem Jahr noch tragfähig sind.
7. **Konsistenz vor Kreativität im Kleinen** — neue Komponenten, Texte und Entscheidungen ordnen sich in bestehende Muster ein, statt sie zu fragmentieren.
8. **Kompromisse werden benannt, nicht versteckt** — jede bewusste Abweichung von diesen Prinzipien wird explizit gemacht.
9. **Nichts Kritisches ohne Rücksprache** — sicherheitsrelevante, destruktive oder markenprägende Entscheidungen werden nicht im Alleingang getroffen.
10. **Annahme ist kein Fakt** — Zielgruppen- und Marktbehauptungen ohne Beleg werden als Annahme gekennzeichnet, nie als gesicherte Erkenntnis kommuniziert oder verkauft.

---

*Dies ist Version 0.2.2 — v0.2 erweiterte v0.1 um Non-Goals, die Trennung von Annahmen und Belegen in der Customer DNA, messbare Bereiche für Vision/Mission, einen Konfliktlösungsmechanismus und erste Qualitäts-Bestehenskriterien. v0.2.1 präzisierte die Farblogik (Ein-Akzent-Prinzip mit zwei eng begrenzten Ausnahmen: Sage als Status, Türkis als sparsamer Wasser-/Interaktionsakzent). v0.2.2 vereinheitlicht die Konfliktlösung & Eskalation als kanonische, PDOS-weit einzige Rangfolge (neun Stufen), nachdem nachgelagerte Dokumente eine leicht abweichende Reihenfolge zitiert hatten — Details siehe `CHANGELOG.md`. Änderungen werden im übergeordneten `CHANGELOG.md` dokumentiert.*

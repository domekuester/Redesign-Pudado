# 01 — Executive

**Version:** 0.1.1
**Status:** Erster Entwurf. Rangfolge in Abschnitt 4/10 in v0.1.1 an die kanonische PDOS-weite Priorität aus `00-core` angeglichen.

Dieses Dokument baut auf [`pdos/README.md`](../README.md) und [`00-core/README.md`](../00-core/README.md) auf. Es setzt Vision, Mission, Brand DNA, Non-Goals und Golden Rules aus `00-core` nicht außer Kraft, sondern übersetzt sie in die Denkweise, mit der strategische Entscheidungen bei Pudado getroffen werden. Bei jedem Widerspruch zwischen diesem Dokument und `00-core` hat `00-core` Vorrang.

---

## 1. Zweck dieses Dokuments

**Warum der Executive-Bereich existiert:** Pudado trifft laufend Entscheidungen, die nicht auf Ebene eines einzelnen Features, einer Seite oder einer Codezeile liegen, sondern die Richtung des gesamten Produkts betreffen — was priorisiert wird, was liegen bleibt, welches Risiko akzeptabel ist, wann eine Idee zur Marke passt und wann nicht. Ohne einen expliziten Rahmen dafür würden solche Entscheidungen situativ, inkonsistent oder rein reaktiv getroffen. Dieser Bereich ist der Ort, an dem CEO- und Product-Owner-Perspektive dokumentiert sind, damit sie wiederholbar angewendet werden können — von Menschen wie von Claude Code.

**Welche Entscheidungen hier getroffen werden:**
- Priorisierung zwischen Website, Produkt, Marketing und Technik, wenn Ressourcen oder Aufmerksamkeit begrenzt sind.
- Bewertung neuer Feature- oder Initiativ-Ideen auf strategischer Ebene (siehe Abschnitt 5).
- Umgang mit Zielkonflikten zwischen Disziplinen (Design vs. Performance vs. Conversion vs. SEO), sofern die Konfliktlösung aus `00-core` keine eindeutige Antwort liefert.
- Freigabe bewusster, begründeter Abweichungen von bestehenden Prinzipien, wenn ein strategischer Grund dafür vorliegt.
- Einordnung, ob eine Idee bald umgesetzt, beobachtet oder verworfen wird (siehe Roadmap-Ebenen, Abschnitt 7).

**Welche Entscheidungen NICHT hier getroffen werden:**
- Technische Implementierungsdetails und Architekturentscheidungen — gehören in `03-engineering`.
- Visuelle Detailentscheidungen innerhalb des bestehenden Design-Systems (Farbnuancen, Abstände, Komponentendetails) — gehören in `02-brand-design` bzw. `style.css` direkt.
- Operative Tagesarbeit: einzelne Bugfixes, einzelne Textkorrekturen, einzelne SEO-Metadaten-Anpassungen — gehören in die jeweilige Fachdomäne (`03-engineering`, `04-growth`).
- Testdurchführung und QA-Kriterien im Detail — gehören in `05-quality`.
- Grundprinzipien der Marke selbst (Vision, Mission, Brand DNA) — die werden in `00-core` weiterentwickelt, nicht hier vorausgesetzt oder umgangen.

## 2. CEO-Denkweise

Diese fünf Abwägungen gelten als Standardhaltung für strategische Entscheidungen. Sie sind Prioritäten, keine Absolutwerte — im Zweifel schwerer wiegend, nicht das jeweils andere ausschließend.

- **Langfristige Marke vor kurzfristigem Effekt:** Eine Maßnahme, die kurzfristig Zahlen verbessert, aber der Markenwahrnehmung schadet (siehe `00-core`, Definition von Premium), wird nicht umgesetzt, ohne dass dieser Trade-off explizit benannt und akzeptiert wird.
- **Qualität vor Geschwindigkeit:** Schneller liefern ist kein Wert an sich. Eine Lösung, die das "Qualität ist bestanden, wenn…"-Kriterium aus `00-core` verfehlt, ist nicht fertig — unabhängig vom Zeitdruck.
- **Vertrauen vor aggressiver Conversion:** Conversion-Maßnahmen, die kurzfristig wirken, aber Vertrauen kosten (Drucktaktiken, künstliche Verknappung, irreführende Formulierungen), verstoßen gegen die Non-Goals aus `00-core` und werden nicht verfolgt, selbst wenn sie nachweislich Conversion steigern würden.
- **Nachhaltiges Wachstum vor schnellem Wachstum:** Wachstum, das die Fähigkeit gefährdet, das Premium-Versprechen einzuhalten (z. B. Überlastung, Qualitätsverlust durch zu schnelle Skalierung), wird gebremst statt erzwungen.
- **Premium-Positionierung vor Massenmarkt:** Reichweite, die nur durch Verwässerung der Premium-Positionierung erreichbar wäre, ist kein Ziel. Lieber eine kleinere, richtige Zielgruppe erreichen als eine große, falsche.

## 3. Product-Owner-Denkweise

Vier Leitfragen, die vor jeder größeren Produkt- oder Feature-Entscheidung beantwortet werden müssen:

- **Welche Probleme lösen wir wirklich?** Jede Initiative muss auf ein konkretes, benennbares Problem zurückführbar sein — nicht auf "das machen andere auch" oder "das könnte interessant sein". Wenn das Problem nicht in einem Satz klar benannt werden kann, ist die Initiative noch nicht entscheidungsreif.
- **Welche Features zahlen auf Marke, Produktverständnis oder Conversion ein?** Eine Initiative sollte mindestens eine dieser drei Dimensionen sichtbar stärken. Wenn keine betroffen ist, ist unklar, warum sie Priorität verdient.
- **Welche Features sind Ablenkung?** Ablenkung sind Initiativen, die technisch machbar und isoliert betrachtet nicht schlecht sind, aber weder ein echtes Kundenproblem lösen noch Marke, Verständnis oder Conversion stärken — typischerweise, weil sie intern interessant wirken ("das wäre cool zu bauen"), aber ohne externen Bezug.
- **Wie wird zwischen Website, Produkt, Marketing und Technik priorisiert?** Über die Rangfolge in Abschnitt 4 und das Bewertungssystem in Abschnitt 5 — nicht danach, welcher Bereich gerade am lautesten oder dringlichsten wirkt.

## 4. Strategische Entscheidungsprinzipien

Diese Liste ist **identisch** mit der kanonischen Konfliktlösung & Eskalation aus `00-core` — es gibt eine einzige PDOS-weite Rangfolge, nicht eine separate strategische und eine separate operative Version. Frühere Fassungen dieses Dokuments führten eine leicht abweichende eigene Reihenfolge (Conversion vor Performance); das war eine unbeabsichtigte Inkonsistenz und wurde korrigiert (siehe `CHANGELOG.md`).

1. **Sicherheit, Recht & Datenschutz** — DSGVO, rechtliche Pflichtangaben. Nicht verhandelbar, unabhängig vom strategischen Nutzen einer Idee.
2. **Markenvertrauen** — Deckt sich mit Brand DNA und Non-Goals aus `00-core`. Eine strategisch attraktive Idee, die Markenvertrauen untergräbt, wird nicht verfolgt.
3. **Produktverständnis** — Ob Kund:innen verstehen, was Pudado/EcoBum ist und warum es relevant ist. Ohne Verständnis wirkt jede weitere Maßnahme (Conversion, SEO) auf ein brüchiges Fundament.
4. **UX & Accessibility** — Wie sich die Nutzung tatsächlich anfühlt und ob sie für alle bedienbar ist, über reine Funktionalität hinaus.
5. **Stabilität & Engineering** — Technische Zuverlässigkeit ist Voraussetzung für alles Folgende; eine instabile Grundlage untergräbt Performance, Conversion und SEO gleichermaßen.
6. **Performance** — Technische Grundlage für Nutzererlebnis, SEO und Conversion; wird nicht für rein kosmetische Vorteile geopfert.
7. **Conversion / Growth** — Wichtig, aber nachrangig zu den sechs vorherigen Punkten.
8. **SEO** — Sichtbarkeit ist Mittel zum Zweck, kein Selbstzweck.
9. **Umsetzungsgeschwindigkeit** — Zählt zuletzt. Eine schnelle, aber prinzipienwidrige Lösung ist keine gute Lösung.

**Verhältnis zur Konfliktlösung in `00-core`:** Es ist dieselbe Rangfolge, hier mit executive-spezifischen Begründungen versehen. `00-core` ist die kanonische Quelle (siehe dort); dieses Dokument übersetzt sie in strategische Priorisierungssprache, ändert aber weder Reihenfolge noch Inhalt.

## 5. Feature-Priorisierung

Bewertungssystem für neue Ideen, bevor sie in eine Roadmap-Ebene (Abschnitt 7) eingeordnet werden. Jede Dimension wird qualitativ als **Niedrig / Mittel / Hoch** eingeschätzt — bewusst kein Scoring mit erfundener Präzision (z. B. "7,3 von 10"), da dafür keine belastbare Datengrundlage existiert.

| Dimension | Leitfrage |
|---|---|
| **Kundennutzen** | Löst es ein reales, benanntes Problem für die in `00-core` beschriebene Zielgruppe — inklusive Kennzeichnung, ob das auf belegten Erkenntnissen oder Annahmen beruht? |
| **Markenwirkung** | Stärkt oder schwächt es die Premium-Positionierung und Brand DNA? |
| **Technische Komplexität** | Wie aufwändig ist die Umsetzung im bestehenden, dependency-freien Stack? |
| **Risiko** | Was passiert im schlechtesten Fall (technisch, rechtlich, markenseitig)? |
| **Conversion-Potenzial** | Gibt es einen plausiblen Wirkmechanismus auf Conversion — und ist er belegt oder angenommen? |
| **Wartbarkeit** | Erhöht es dauerhaft Komplexität/Pflegeaufwand, oder fügt es sich sauber in Bestehendes ein? |
| **SEO-Auswirkung** | Verbessert, verschlechtert oder verändert es Sichtbarkeit nicht? |
| **Datenlage / Belege** | Beruht die Einschätzung auf echten Daten (siehe `00-core`, "Customer DNA – Annahmen vs. Belege") oder auf Annahme? |
| **Dringlichkeit** | Gibt es einen konkreten Grund für Eile, oder ist die Dringlichkeit gefühlt? |

**Entscheidungsregel:**
- Eine Idee mit **Hoch** bei Risiko *und* **Niedrig** bei Datenlage/Belege wird nicht direkt umgesetzt, sondern zuerst validiert (z. B. kleiner Test, Recherche) — siehe auch Abschnitt 9.
- Eine Idee, die einen Non-Goal aus `00-core` oder Abschnitt 6 berührt, wird unabhängig von sonstigem Score nicht verfolgt.
- Niedrige Datenlage senkt nicht automatisch die Priorität, macht aber jede andere Einschätzung in derselben Bewertung unsicherer — das muss bei der Einordnung in Abschnitt 7 explizit mitgedacht werden.

## 6. Non-Goals auf Executive-Ebene

Ergänzend zu den Non-Goals in `00-core`, spezifisch für strategische Entscheidungen:

- **Keine Rabattmarke** — Preisnachlässe sind kein strategisches Standardwerkzeug, sondern die Ausnahme.
- **Kein billiger Dropshipping-Auftritt** — Weder in Optik noch in Erfüllungsprozess (Lieferzeiten, Kommunikation, Verpackung) darf der Eindruck eines austauschbaren Reseller-Produkts entstehen.
- **Keine hektische Feature-Flut** — Viele gleichzeitige, halbfertige Initiativen sind kein Zeichen von Fortschritt, sondern von fehlender Priorisierung.
- **Keine Dark Patterns** — Deckt sich mit `00-core`; wird hier bewusst wiederholt, da Dark Patterns oft aus Executive-getriebenem Kurzfrist-Druck entstehen.
- **Keine Entscheidungen nur nach Bauchgefühl** — Eine strategische Entscheidung ohne nachvollziehbare Begründung (siehe Abschnitt 12) ist keine gültige Entscheidung, auch wenn sie sich richtig anfühlt.
- **Keine Optimierung auf kurzfristige Klicks, wenn langfristiges Vertrauen leidet** — Klickzahlen, Sitzungsdauer oder ähnliche Vanity-Metriken rechtfertigen keine Maßnahme, die Markenvertrauen (Rang 2 in Abschnitt 4) beschädigt.

## 7. Erste Roadmap-Struktur

Bewusst ohne erfundene Termine oder Zeiträume. Die Einordnung einer Initiative in eine Ebene ist selbst eine Entscheidung, die anhand Abschnitt 5 begründet werden sollte.

| Ebene | Kriterium |
|---|---|
| **Jetzt wichtig** | Betrifft Sicherheit, Recht, Markenvertrauen oder ein bereits als real erkanntes, blockierendes Problem. Keine Alternative, es zu verschieben, ohne Schaden. |
| **Bald wichtig** | Klarer Nutzen erkennbar (Kundennutzen, Markenwirkung oder Conversion), aber nicht blockierend — Umsetzung ist absehbar, aber nicht die nächste sinnvolle Priorität. |
| **Später wichtig** | Grundsätzlich sinnvoll, aber abhängig von Vorbedingungen (z. B. Datenlage, technische Grundlage, Ressourcen), die noch nicht gegeben sind. |
| **Nur beobachten** | Idee mit Potenzial, aber Kundennutzen, Markenwirkung oder Risiko noch zu unklar für eine Priorisierungsentscheidung. Wird nicht aktiv verfolgt, aber auch nicht verworfen. |
| **Nicht verfolgen** | Widerspricht Non-Goals, Brand DNA oder liefert bei nüchterner Bewertung (Abschnitt 5) keinen ausreichenden Nutzen im Verhältnis zu Aufwand/Risiko. |

Konkrete Initiativen werden hier bewusst noch nicht eingeordnet — das würde echte Priorisierungsentscheidungen voraussetzen, die derzeit nicht auf ausreichender Datengrundlage getroffen werden können (siehe Abschnitt 14).

## 8. KPIs und Messbereiche

Wie in `00-core` ("Vision & Mission messbar machen") werden bewusst **keine Zielwerte erfunden**. Die folgenden Messbereiche definieren, *worauf* strategisch geachtet wird, sobald Daten verfügbar sind:

| Messbereich | Wofür es ein Signal ist |
|---|---|
| **Vertrauen** | Ob die Marke als glaubwürdig genug für eine Kaufentscheidung wahrgenommen wird |
| **Verständlichkeit** | Ob Produkt und Kernbotschaft ohne Erklärungsaufwand verstanden werden |
| **Conversion** | Ob Interesse tatsächlich zu Handlung führt |
| **Ladezeit** | Technische Grundlage für Nutzererlebnis, SEO und Conversion (Core Web Vitals) |
| **Accessibility** | Ob das Produkt tatsächlich für alle nutzbar ist, nicht nur behauptet |
| **SEO-Sichtbarkeit** | Ob relevante Zielgruppen die Marke überhaupt finden |
| **Markenwahrnehmung** | Ob Pudado im gewünschten Wahrnehmungsraum (Premium-Lifestyle) ankommt |
| **Nutzerfeedback** | Direktes qualitatives Signal, das quantitative Metriken einordnen hilft |
| **Fehlerquote** | Technische und prozessuale Zuverlässigkeit (Bugs, fehlgeschlagene Bestellungen, Support-Volumen) |
| **Wartbarkeit** | Ob die Codebasis und Prozesse mit wachsendem Produkt handhabbar bleiben |

Sobald belastbare Daten für einzelne Bereiche vorliegen, gehören konkrete Zielwerte in eine spätere Version dieses Dokuments oder in ein dediziertes Reporting — nicht rückwirkend als Behauptung in v0.1.

## 9. Entscheidungsprozess für Claude Code

Bei strategischen Aufgaben (nicht bei operativen Detailänderungen) gilt folgende verbindliche Reihenfolge:

1. **Problem zuerst verstehen** — Was ist das eigentliche Problem, nicht nur die vorgeschlagene Lösung? Bei Unklarheit nachfragen, bevor Lösungen entworfen werden.
2. **Annahmen markieren** — Jede Aussage, die nicht durch Daten belegt ist, wird explizit als Annahme gekennzeichnet (siehe `00-core`, Golden Rule 10).
3. **Datenlage prüfen** — Existieren bereits Erkenntnisse (siehe `00-core`, "Customer DNA – Annahmen vs. Belege")? Wenn nicht, wird das offen benannt statt stillschweigend übergangen.
4. **Mindestens drei Lösungswege vergleichen** — Keine strategische Empfehlung ohne erkennbare Alternativen; "es gibt nur eine sinnvolle Option" ist selten wahr und muss begründet werden, wenn behauptet.
5. **Risiken benennen** — Für jeden Lösungsweg: Was kann schiefgehen, wie schwer wiegt es, wie leicht ist es umkehrbar?
6. **Empfehlung begründen** — Eine Empfehlung ohne nachvollziehbare Begründung entlang Abschnitt 4 und 5 dieses Dokuments ist unvollständig.
7. **Keine Umsetzung ohne Freigabe bei strategischen Änderungen** — Sobald eine Entscheidung Rang 1–4 aus Abschnitt 4 berührt, eine Non-Goal-Grenze streift oder schwer umkehrbar ist, wird sie vorgeschlagen, nicht eigenständig umgesetzt (deckt sich mit der Eskalationsregel in `00-core` und wird in Abschnitt 10 für Pudado konkretisiert).

## 10. Finale Entscheidungsinstanz bei Konflikten

Dieser Abschnitt schließt die Lücke, die in `00-core` bewusst offengelassen wurde: *Wer* entscheidet final, wenn eine Rangfolge allein keine eindeutige Antwort liefert oder mehrere sinnvolle Optionen bestehen.

### 1. Wer entscheidet final?

Eine finale menschliche Entscheidung ist erforderlich, wenn mindestens einer der folgenden Fälle vorliegt:
- Marke, Produkt, Design, Conversion, Technik oder SEO sind uneinig — d. h. unterschiedliche Disziplinen würden zu unterschiedlichen Lösungen kommen.
- Claude Code sieht mehrere sinnvolle, nicht eindeutig überlegene Optionen.
- Ein Konflikt lässt sich nicht eindeutig durch die Rangfolgen in `00-core` (Konfliktlösung & Eskalation) oder in Abschnitt 4 dieses Dokuments auflösen — etwa weil zwei Optionen auf derselben Rangstufe stehen oder die Anwendung der Rangfolge selbst strittig ist.

In all diesen Fällen entscheidet **nicht** Claude Code allein (siehe Punkt 3 und 5).

### 2. Entscheidungslogik

Für alle strategischen Konflikte gilt dieselbe Rangfolge wie in Abschnitt 4 (und in `00-core`), hier als verbindliche Eskalationslogik wiederholt:

1. Sicherheit, Recht & Datenschutz — immer Vorrang, ohne Ausnahme.
2. Markenvertrauen
3. Produktverständnis
4. UX & Accessibility
5. Stabilität & Engineering
6. Performance
7. Conversion / Growth
8. SEO
9. Umsetzungsgeschwindigkeit

Diese Reihenfolge löst den Konflikt, sooft sie eindeutig anwendbar ist. Bleibt trotz Anwendung dieser Logik echte Unsicherheit (z. B. weil zwei Optionen auf derselben Stufe liegen oder die Einstufung selbst umstritten ist), greift Punkt 1 (finale menschliche Entscheidung) statt einer erzwungenen Auflösung durch Claude.

### 3. Menschliche Freigabe

Claude Code darf bei strategischen Konflikten **keine finale Entscheidung allein treffen**. Stattdessen muss Claude:

1. den Konflikt explizit benennen (welche Prinzipien/Disziplinen widersprechen sich, und warum reicht die Rangfolge allein nicht aus),
2. mindestens 2–3 Optionen darstellen,
3. Vor- und Nachteile je Option erklären,
4. eine Empfehlung geben — mit Begründung entlang Abschnitt 4 und 9,
5. **auf menschliche Freigabe warten**, bevor eine der Optionen umgesetzt wird.

Das Format dafür ist die Entscheidungsvorlage in Abschnitt 11.

### 4. Operative Entscheidungen

Claude Code darf kleinere technische oder redaktionelle Entscheidungen **selbst treffen**, wenn **alle** folgenden Bedingungen zutreffen:
- Keine Website-Funktion wird gefährdet.
- Keine Marke/Positionierung wird verändert.
- Keine rechtlichen oder sicherheitsrelevanten Auswirkungen entstehen.
- Keine großen Designentscheidungen sind betroffen (Detailanpassungen innerhalb bestehender Design-Tokens sind unkritisch, siehe `00-core`).

Trifft auch nur eine dieser Bedingungen nicht zu, handelt es sich nicht mehr um eine operative, sondern um eine strategische Entscheidung — dann gilt Punkt 3.

### 5. Finaler Entscheider

Für Pudado gilt bis zur späteren Rollenklärung: **Der menschliche Projektverantwortliche entscheidet final.**

Falls mehrere Gründer:innen oder Verantwortliche beteiligt sind, gilt zusätzlich: Claude Code macht den Konflikt sichtbar und liefert eine Entscheidungsvorlage (Abschnitt 11), trifft aber **nicht selbst** eine Auswahl zwischen den beteiligten Personen oder deren Positionen. Wer unter mehreren Verantwortlichen final entscheidet, ist eine organisatorische Frage, die außerhalb von PDOS geklärt werden muss — dieses Dokument erzwingt keine Antwort darauf, sondern macht sichtbar, dass sie noch offen ist (siehe Abschnitt 14, Offene Fragen).

## 11. Entscheidungsvorlage

Wenn ein strategischer Konflikt gemäß Abschnitt 10 entsteht, stellt Claude Code ihn in genau dieser Struktur dar — nicht als Fließtext, sondern in dieser Reihenfolge:

- **Ausgangslage** — Was ist die Situation, worum geht es konkret?
- **Konflikt** — Welche Prinzipien, Disziplinen oder Ziele stehen sich entgegen, und warum löst die Rangfolge aus Abschnitt 4/10 es nicht eindeutig auf?
- **Option A** — Beschreibung, Vor- und Nachteile.
- **Option B** — Beschreibung, Vor- und Nachteile.
- **Option C** (falls sinnvoll) — Beschreibung, Vor- und Nachteile. Wird nur ergänzt, wenn eine dritte Option echten Mehrwert bietet, nicht um künstlich drei Optionen zu erzwingen.
- **Risiken** — Je Option, mit Einschätzung, wie schwerwiegend und wie umkehrbar.
- **Empfehlung** — Welche Option Claude für am sinnvollsten hält, und warum, unter Bezug auf Abschnitt 4 und die CEO-/Product-Owner-Denkweise (Abschnitt 2, 3).
- **Benötigte menschliche Entscheidung** — Was genau muss der/die Projektverantwortliche freigeben oder entscheiden, um fortzufahren?

Diese Struktur gilt unabhängig vom Umfang des Konflikts — auch ein kleinerer strategischer Konflikt wird vollständig, aber knapp durchlaufen, statt Schritte auszulassen.

## 12. Definition of Done für Executive-Entscheidungen

Eine strategische Entscheidung gilt erst als abgeschlossen, wenn **alle** folgenden Punkte zutreffen:

- Sie passt nachweislich zur Marke (Brand DNA, Non-Goals aus `00-core` und Abschnitt 6).
- Sie löst ein echtes, benanntes Problem (nicht nur eine Vermutung oder einen Trend).
- Sie ist begründet — die Begründung folgt Abschnitt 9, nicht nachträglicher Rechtfertigung.
- Sie ignoriert keine benannten wichtigen Risiken (auch nicht "der Einfachheit halber").
- Sie ist umsetzbar — mit den tatsächlich verfügbaren Ressourcen und im bestehenden technischen Rahmen.
- Sie ist messbar oder zumindest später überprüfbar — über einen oder mehrere Messbereiche aus Abschnitt 8.

Fehlt einer dieser Punkte, ist die Entscheidung nicht "fertig, aber akzeptabel" — sie ist unvollständig und wird als solche benannt.

## 13. Anti-Patterns

Wiederkehrende Fehler, die aktiv vermieden werden — sowohl von Menschen als auch von Claude Code:

- **Generische Startup-Sprache:** Floskeln wie "disruptiv", "revolutionär", "game-changing" ohne konkreten Inhalt dahinter. Widerspricht der ruhigen, sachlichen Tonalität aus `00-core`.
- **Erfundene Kundendaten:** Zielgruppen-Aussagen, Zitate oder Statistiken, die wie Fakten klingen, aber nicht belegt sind. Verstößt direkt gegen Golden Rule 10.
- **Zu viele Features auf einmal:** Parallele Initiativen ohne klare Priorisierung verwässern Fokus und Qualität gleichermaßen.
- **Design ohne Strategie:** Visuelle Änderungen, die gut aussehen, aber keinem in Abschnitt 3 benannten Zweck dienen.
- **Conversion ohne Vertrauen:** Taktiken, die kurzfristig Zahlen heben, aber Rang 2 aus Abschnitt 4 unterlaufen.
- **SEO ohne Markenqualität:** Inhalte, die primär für Suchmaschinen statt für Menschen geschrieben sind und die Tonalität der Marke verwässern.
- **Technik ohne Produktnutzen:** Technisch interessante Lösungen, die auf kein reales Problem aus Abschnitt 3 einzahlen ("Ablenkung").

## 14. Offene Fragen

Diese Informationen fehlen aktuell und sollten nicht durch Annahmen ersetzt werden, bis echte Antworten vorliegen:

- **Rollenklärung bei mehreren Verantwortlichen** — falls mehr als eine Person final entscheidungsbefugt ist: wer das im Konfliktfall konkret ist, ist noch nicht definiert (siehe Abschnitt 10, Punkt 5).
- **Echte Kundendaten** — siehe `00-core`, "Customer DNA – Annahmen vs. Belege".
- **Wettbewerbsanalyse** — wer sind die tatsächlichen Alternativen aus Kundensicht, nicht nur die naheliegenden Sanitärartikel-Wettbewerber?
- **Preisstrategie** — wo positioniert sich Pudado preislich, und wie verträgt sich das mit der Premium-Positionierung?
- **Launch-Ziele** — was bedeutet "erfolgreich" für den nächsten relevanten Meilenstein, konkret und nicht nur qualitativ?
- **Produktverfügbarkeit** — Lieferfähigkeit, Lagerhaltung, Skalierbarkeit der Fertigung.
- **Zielmärkte** — über `de`/`en`/`fr` als Sprachen hinaus: welche Länder/Märkte werden tatsächlich priorisiert bearbeitet?
- **Rechtliche Anforderungen je Markt** — über die DSGVO-Grundlage hinaus: produktspezifische Zulassungen, Gewährleistungsregeln, Verpackungs-/Entsorgungsvorschriften je Zielmarkt.

Bis diese Fragen beantwortet sind, gelten alle darauf aufbauenden Aussagen in diesem Dokument als vorläufig.

---

*Dies ist Version 0.1.1 — v0.1 war der erste Entwurf für den Executive-Bereich, aufbauend auf `00-core` v0.2.1. v0.1.1 korrigiert die Rangfolge in Abschnitt 4/10, die zuvor Conversion vor Performance einordnete und damit von der kanonischen Reihenfolge aus `00-core` abwich. Änderungen werden im übergeordneten `CHANGELOG.md` dokumentiert.*

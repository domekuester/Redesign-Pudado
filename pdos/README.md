# PDOS — Pudado Development Operating System

**Version:** 0.1.1
**Status:** Erster Entwurf. Versionierungsübersicht in v0.1.1 auf den tatsächlichen Ausarbeitungsstand aller sechs Bereiche aktualisiert.

## Was ist PDOS?

PDOS ist das zentrale Betriebssystem für die Entwicklung von Pudado/EcoBum. Es ist keine einzelne Datei und kein einzelnes Dokument, sondern eine strukturierte Sammlung von Wissen, Prinzipien, Standards, Vorlagen und Prozessen, die festlegen, *wie* bei Pudado gearbeitet wird — über alle Disziplinen hinweg: Produkt, Marke, Design, Engineering, Wachstum, Qualität und die Zusammenarbeit mit KI-Werkzeugen wie Claude Code.

PDOS ersetzt nicht die einzelnen Arbeitsdokumente (z. B. `CLAUDE.md` für technische Konventionen der Website). Es ist die übergeordnete Ebene, aus der sich diese Dokumente ableiten und mit der sie konsistent bleiben müssen.

## Warum existiert PDOS?

Pudado ist ein langfristiges Produkt, kein Wegwerf-Prototyp. Je mehr Menschen, Werkzeuge und KI-Agenten an Pudado mitarbeiten, desto größer wird das Risiko, dass Entscheidungen inkonsistent, vergessen oder widersprüchlich getroffen werden — unterschiedliche Tonalität in Texten, abweichende Designentscheidungen, wechselnde Qualitätsmaßstäbe, verlorenes Kontextwissen zwischen Sessions.

PDOS existiert, um dieses Risiko strukturell zu reduzieren: eine einzige, versionierte, nachvollziehbare Quelle der Wahrheit für *warum* Pudado so ist, wie es ist, und *wie* neue Arbeit daran anschließen soll.

## Wie hilft PDOS Pudado?

- **Konsistenz:** Jede neue Entscheidung — ob Copy, Design, Feature oder Code — lässt sich an denselben Prinzipien messen, unabhängig davon, wer oder was sie trifft.
- **Geschwindigkeit ohne Qualitätsverlust:** Statt jede Frage neu zu durchdenken, kann auf etablierte Antworten (Prinzipien, Checklisten, Playbooks) zurückgegriffen werden.
- **Onboarding:** Neue Mitarbeitende, Freelancer oder KI-Agenten verstehen den Markenkern und die Arbeitsweise schnell, ohne dass Wissen mündlich weitergegeben werden muss.
- **Skalierbarkeit:** Mit wachsendem Team und wachsendem Produkt bleibt die strategische und gestalterische Kohärenz erhalten, statt mit der Größe zu erodieren.
- **Nachvollziehbarkeit:** Entscheidungen werden dokumentiert statt nur getroffen — spätere Arbeit versteht *warum*, nicht nur *was*.

## Wie soll Claude Code diese Dokumente nutzen?

- PDOS ist bei jeder nicht-trivialen Aufgabe an Pudado als Kontext heranzuziehen — insbesondere `00-core/README.md` für grundlegende Prinzipien, bevor inhaltliche, gestalterische oder strategische Entscheidungen getroffen werden.
- Bei Konflikten zwischen einer Ad-hoc-Anweisung und einem PDOS-Prinzip: den Konflikt aktiv benennen, nicht stillschweigend auflösen.
- Neue, wiederkehrende Erkenntnisse oder Entscheidungen gehören in das passende PDOS-Verzeichnis eingepflegt, nicht in verstreute Einzeldateien (siehe `CHANGELOG.md` für die Historie dieser Weiterentwicklung).
- Technische Detailkonventionen für die Website (HTML/CSS/JS-Regeln, Git-Workflow etc.) bleiben in `CLAUDE.md` im Projektwurzelverzeichnis — PDOS liefert den strategischen und gestalterischen Rahmen, `CLAUDE.md` die technische Umsetzung. Beide müssen konsistent zueinander sein.
- Änderungen an PDOS-Dokumenten sind bewusst vorzunehmen, mit kurzer Begründung, und nur nach Rücksprache zu committen.

## Struktur

| Verzeichnis | Zweck |
|---|---|
| `00-core/` | Fundament: Vision, Mission, Brand/Product/Customer DNA, Prinzipien, Golden Rules |
| `01-executive/` | Strategische Ausrichtung, Ziele, Entscheidungen auf Unternehmensebene |
| `02-brand-design/` | Markenidentität, visuelles Design, Ton & Sprache |
| `03-engineering/` | Technische Standards, Architektur, Entwicklungsprozesse |
| `04-growth/` | Marketing, SEO, Conversion, Wachstumsstrategie |
| `05-quality/` | Qualitätssicherung, Testing, Review-Standards |
| `06-ai-workflows/` | Wie KI-Werkzeuge (u. a. Claude Code) bei Pudado eingesetzt werden |
| `templates/` | Wiederverwendbare Vorlagen für Dokumente, Briefings, Reports |
| `checklists/` | Konkrete Prüflisten für wiederkehrende Aufgaben |
| `playbooks/` | Schritt-für-Schritt-Anleitungen für definierte Szenarien |

## Bedeutung: Pudado, kein austauschbares Produkt

PDOS ist die langfristige Arbeitsgrundlage für Produktentwicklung, Website, Marke, SEO, Design, Testing und Releases bei Pudado. Es wächst mit dem Produkt und wird erweitert, nicht ersetzt.

## Versionierung

Jeder Bereich wird unabhängig versioniert. Aktueller Stand:

| Bereich | Version | Stand |
|---|---|---|
| `00-core` | 0.2.2 | Inhaltlich ausgearbeitet — Fundament, Non-Goals, Annahmen/Belege-Trennung, kanonische Konfliktlösung & Eskalation |
| `01-executive` | 0.1.1 | Inhaltlich ausgearbeitet — Entscheidungslogik, finale Entscheidungsinstanz, Entscheidungsvorlage |
| `02-brand-design` | 0.1.2 | Inhaltlich ausgearbeitet — Design-Philosophie, Farbentscheidung (Sage/Türkis), Konfliktlösung |
| `03-engineering` | 0.1.1 | Inhaltlich ausgearbeitet — technische Standards, Projektarchitektur, Testing-Basis |
| `04-growth` | 0.1.1 | Inhaltlich ausgearbeitet — Growth-Philosophie, Annahmen/Belege-Trennung, Anti-Patterns |
| `05-quality` | 0.2.1 | Inhaltlich ausgearbeitet — Quality Gates mit Rangfolge, Rollback-/Incident-Prozess |
| `06-ai-workflows` | 0.2.1 | Inhaltlich ausgearbeitet — schließt den Kreis zu allen anderen Bereichen |
| `templates/`, `checklists/`, `playbooks/` | 0.1 | Bewusst offen — Zweck definiert, Inhalt noch nicht ausgearbeitet |

Kein Bereich gilt als vollständig oder final — "inhaltlich ausgearbeitet" bedeutet einen belastbaren, mehrfach überarbeiteten ersten bis zweiten Entwurf, keinen abgeschlossenen Endzustand. Änderungen werden in `CHANGELOG.md` festgehalten; dort steht auch die genaue Historie jeder Versionsänderung.

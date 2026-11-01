/*
 * Produktdaten und Erklärtexte – getrennt von der Darstellung.
 *
 * Jede technische Aussage trägt einen Status (siehe STATUS). Wenn der Hersteller
 * Angaben bestätigt, hier den Status auf "confirmed" setzen und ggf. "source"
 * ergänzen; die Oberfläche übernimmt das automatisch.
 *
 * Stand: 30.10.2026 – Prototyp, keine Freigabe.
 */

export const STATUS = {
  confirmed: {
    label: 'Bestätigt',
    description: 'Vom Hersteller schriftlich bestätigt.',
  },
  planned: {
    label: 'Planungsstand',
    description: 'Aus der Lieferantenanfrage. Vom Hersteller noch nicht bestätigt.',
  },
  design: {
    label: 'Gestaltungsannahme',
    description: 'Aus den Bildvorlagen abgeleitet. Keine technische Angabe.',
  },
  open: {
    label: 'Offen',
    description: 'Technisch noch zu klären.',
  },
};

export const META = {
  title: 'EcoBum Home',
  subtitle: 'Handbidet-Set · Prototyp',
  stand: '30.10.2026',
  disclaimer:
    'Interaktiver Gestaltungsprototyp. Darstellungen sind nicht maßstäblich und keine technische Zeichnung. Derzeit sind keine Eigenschaften vom Hersteller bestätigt.',
};

export const FINISH = {
  name: 'Arctic Brushed Silver',
  code: 'KS-01',
  hex: '#B7B4AE',
  status: 'design',
  note: 'Gebürstete silberne Ausführung als erster Gestaltungsstand. Werkstoff und Oberfläche sind noch nicht bestätigt.',
};

/* Bauteile des Sets. "id" verbindet Text und 3D-Objekt. */
export const COMPONENTS = [
  {
    id: 'handbidet',
    number: 1,
    name: 'Handbidet',
    short: 'Gibt das Wasser ab',
    role:
      'Das Handbidet gibt das Wasser über die Düsenfläche ab. Der Knopf am Griff gibt den Wasserfluss frei, solange er gedrückt wird.',
    facts: [
      { label: 'Form', value: 'Nach freigegebener Bildvorlage', status: 'design' },
      { label: 'Bedienung', value: 'Knopf gedrückt halten', status: 'design' },
      { label: 'Anschluss', value: 'Passend zum geplanten G1/2-Innengewinde des Schlauchs', status: 'planned' },
      { label: 'Werkstoff, Oberfläche', value: 'Noch nicht bestätigt', status: 'open' },
    ],
  },
  {
    id: 'hose',
    number: 2,
    name: 'Brauseschlauch',
    short: 'Langer Schlauch vom T-Ventil zum Handbidet',
    role:
      'Der lange Brauseschlauch verbindet den absperrbaren Abzweig des T-Ventils mit dem Handbidet. Er ist nicht zu verwechseln mit dem kurzen Anschlussschlauch.',
    facts: [
      { label: 'Länge', value: 'Bevorzugt 1,5 m', status: 'planned' },
      { label: 'Anschlüsse', value: 'Beidseitig G1/2 innen', status: 'planned' },
      { label: 'Darstellung', value: 'Im Set-Bild verkürzt dargestellt, Länge nicht maßstäblich', status: 'design' },
    ],
  },
  {
    id: 'bracket',
    number: 3,
    name: 'Halterung',
    short: 'Hält das Handbidet an der Wand',
    role:
      'Die Halterung nimmt das Handbidet nach der Benutzung auf, damit es griffbereit an der Wand hängt.',
    facts: [
      { label: 'Montage', value: 'Klebe- und Schraubmontage vorgesehen', status: 'planned' },
      { label: 'Form, Farbe', value: 'Nach Bildvorlage, Ausführung offen', status: 'design' },
    ],
  },
  {
    id: 'tvalve',
    number: 4,
    name: 'T-Ventil',
    short: 'Zweigt Wasser für das Handbidet ab',
    role:
      'Das T-Ventil wird am vorhandenen Eckventil eingesetzt. Es leitet das Wasser zum bestehenden Anschluss weiter – am WC zum Spülkasten, in der noch zu prüfenden Waschtischvariante zur Armatur – und zweigt einen absperrbaren Anschluss für den Brauseschlauch ab.',
    facts: [
      { label: 'Zum Eckventil', value: 'G3/8 innen', status: 'planned' },
      { label: 'Zum bestehenden Anschluss (Spülkasten bzw. Armatur)', value: 'G3/8 außen', status: 'planned' },
      { label: 'Zum Brauseschlauch', value: 'G1/2 außen', status: 'planned' },
      { label: 'Absicherung der Wasserzufuhr', value: 'Technisch noch zu klären', status: 'open' },
    ],
  },
  {
    id: 'flexhose',
    number: 5,
    name: 'Anschlussschlauch',
    short: 'Flexschlauch vom T-Ventil zum bestehenden Anschluss',
    role:
      'Der zusätzliche flexible Anschlussschlauch verbindet das T-Ventil mit dem bestehenden Anschluss, zum Beispiel dem Spülkasten. Bei einer passenden Installation ersetzt er eine zugängliche, austauschbare starre Anschlussleitung, damit das T-Ventil eingebunden werden kann.',
    facts: [
      { label: 'Bestandteil des Sets', value: 'Vorgesehen', status: 'planned' },
      { label: 'Schlauchlänge', value: 'Noch festzulegen', status: 'open' },
      { label: 'Anschlussmaße', value: 'Noch festzulegen', status: 'open' },
      { label: 'Erforderliche Adapter', value: 'Noch festzulegen', status: 'open' },
      { label: 'Sicherheitsausführung', value: 'Noch festzulegen', status: 'open' },
      { label: 'Einsatz in der Waschtischvariante', value: 'Zu prüfen', status: 'open' },
    ],
  },
];

/* Ansicht „Entdecken“: Detailansichten */
export const DETAILS = [
  {
    id: 'overview',
    name: 'Gesamt',
    title: 'Gesamtansicht',
    text: 'Zylindrischer Kopf mit Düsenfläche, geschwungener Griff, Bedienknopf seitlich am Griff.',
  },
  {
    id: 'nozzle',
    name: 'Düse',
    title: 'Düsenfläche',
    text: 'In der Mitte ein dunkler Einsatz mit Noppen, außen ein Ring feiner Öffnungen. Anordnung nach Bildvorlage, das Strahlbild ist nicht festgelegt.',
  },
  {
    id: 'grip',
    name: 'Griff',
    title: 'Griff und Knopf',
    text: 'Der Griff ist unter dem Kopf schlank und wird zur Hand hin voller. Der Knopf sitzt seitlich im oberen Griffbereich (Lage nach Bildvorlage).',
  },
  {
    id: 'port',
    name: 'Gewinde',
    title: 'Gewinde am Griffende',
    text: 'Am Griffende sitzt das Außengewinde für den Brauseschlauch. Die Gewindeausführung ist noch nicht vom Hersteller bestätigt; das Modell zeigt stilisierte Rillen.',
  },
];

export const WATER = {
  label: 'Wasser testen',
  hint: 'Gedrückt halten',
  notice: 'Illustrative Demo – kein gemessenes Sprühbild.',
};

/* Ansicht „Anschluss verstehen“
 * Zwei schematische Badsituationen (scenarios). Jeder Schritt hat einen Grundtext für das WC;
 * unter "basin" stehen die abweichenden Inhalte für den Waschtisch (nur geänderte Felder).
 * focus: Kamerapreset der Bühne; highlight: hervorgehobene Teile
 * (angle = Eckventil mit T-Ventil, consumer = bestehender Zulauf);
 * flows: sichtbare Wasserwege (supply, consumer, branch).
 * Für eine spätere, geprüfte Montageanleitung ist INSTALL_GUIDE vorgesehen. */
export const CONNECTION = {
  notice: 'Anschlusskonzept in Entwicklung. Keine freigegebene Montageanleitung.',
  intro:
    'Schematische Erklärung des geplanten Anschlussprinzips: Bauteile und Voraussetzungen, keine Arbeitsschritte. Abstände im Schema sind übliche Badmaße, keine Planungsvorgabe.',
  scenarios: [
    {
      id: 'wc',
      label: 'Am WC',
      status: 'planned',
      note: 'Geplantes Konzept: Plug & Play für klar definierte, geprüfte Anschlusssituationen ist Entwicklungsziel, nicht bestätigt.',
    },
    {
      id: 'basin',
      label: 'Unter dem Waschbecken',
      status: 'open',
      note: 'Zu prüfendes Konzept. Keine bestätigte Kompatibilität des Pudado-Sets.',
    },
  ],
  // Kurze Beschriftungen direkt im 3D-Bild; Varianten je Badsituation
  labels: {
    angle: { wc: 'Eckventil (vorhanden)', basin: 'Kaltwasser-Eckventil' },
    consumer: { wc: 'Spülkasten (vorhanden)', basin: 'Leitung zur Armatur (vorhanden)' },
    tvalve: 'T-Ventil',
    flexhose: 'Anschlussschlauch → Spülkasten',
    hose: 'Brauseschlauch → Handbidet',
    handbidet: 'Handbidet in Halterung',
    rigid: 'Starre Anschlussleitung (vorhanden, Beispiel)',
    warm: 'Warmwasser',
    drain: 'Abfluss – kein Anschluss',
  },
  steps: [
    {
      id: 'overview',
      labels: ['tvalve', 'flexhose', 'hose', 'drain', 'consumer'],
      title: 'Das Prinzip',
      text: 'Ein T-Ventil sitzt am vorhandenen Eckventil neben dem WC. Der kurze Anschlussschlauch führt weiter zum Spülkasten, der lange Brauseschlauch zum Handbidet in der Halterung.',
      basin: {
        text: 'Denkbar wäre das T-Ventil unter dem Waschbecken, zwischen Eckventil und Zulauf der Waschtischarmatur. Der Schlauch führt zur Halterung neben dem WC.',
      },
      focus: 'overview',
      highlight: ['angle', 'tvalve', 'consumer', 'flexhose', 'hose', 'handbidet', 'bracket'],
      flows: ['supply', 'consumer', 'branch'],
      facts: [],
    },
    {
      id: 'supply',
      labels: ['angle', 'drain', 'warm', 'tvalve'],
      title: 'Wasserzulauf',
      text: 'Das Wasser kommt aus der Wandleitung über das vorhandene Eckventil neben dem WC. Leitung und Eckventil gehören nicht zum Set und sind schematisch dargestellt.',
      basin: {
        text: 'Unter dem Waschbecken gibt es meist je ein Eckventil für Kalt- und Warmwasser sowie den Abfluss. Das T-Ventil wäre am Kaltwasser-Eckventil vorgesehen; Warmwasser und Abfluss bleiben unverändert.',
        facts: [
          { label: 'Dargestellt am Kaltwasser-Eckventil', value: 'Schematisches Beispiel', status: 'design' },
          { label: 'Passung am Eckventil des Waschtischs', value: 'Zu prüfen', status: 'open' },
          { label: 'Abfluss (Siphon)', value: 'Kein Anschlusspunkt für das Set', status: 'design' },
        ],
      },
      focus: 'angle',
      highlight: ['angle', 'tvalve'],
      flows: ['supply'],
      facts: [
        { label: 'T-Ventil zum Eckventil', value: 'G3/8 innen', status: 'planned' },
        { label: 'Passt zum vorhandenen Eckventil?', value: 'Hängt von dessen Anschluss ab – vorab prüfen', status: 'open' },
      ],
    },
    {
      id: 'swap',
      labels: ['tvalve', 'flexhose', 'consumer'],
      labelsBefore: ['angle', 'rigid', 'consumer', 'drain'],
      title: 'Vorher und nachher',
      text: 'Vorher: Eine zugängliche, austauschbare starre Anschlussleitung verbindet Eckventil und Spülkasten. Nachher, bei einer passenden Installation: Das T-Ventil sitzt am Eckventil, der zusätzliche Anschlussschlauch des Sets ersetzt die starre Leitung.',
      basin: {
        text: 'Vorher: Die Zuleitung der Armatur führt direkt zum Eckventil. Nachher würde das T-Ventil dazwischen sitzen. Ist die Zuleitung fest mit der Armatur verbunden, ist sie nicht als austauschbar vorgesehen.',
        facts: [
          { label: 'Fest verbundene Zuleitungen der Armatur', value: 'Nicht als austauschbar vorgesehen', status: 'design' },
          { label: 'Einbindung am Waschtisch', value: 'Zu prüfen', status: 'open' },
          { label: 'Einsatz des Anschlussschlauchs hier', value: 'Zu prüfen', status: 'open' },
        ],
      },
      focus: 'swap',
      highlight: ['angle', 'tvalve', 'consumer', 'flexhose'],
      flows: ['supply', 'consumer'],
      compare: true,
      facts: [
        { label: 'Austauschbar nur', value: 'Zugängliche Anschlussleitung zwischen Eckventil und Spülkasten', status: 'design' },
        { label: 'Fest eingebaute Wandrohre', value: 'Nicht als austauschbar vorgesehen', status: 'design' },
        { label: 'Passende Installation', value: 'Kriterien noch festzulegen', status: 'open' },
      ],
    },
    {
      id: 'tee',
      labels: ['tvalve', 'flexhose', 'consumer', 'hose'],
      title: 'Das T-Ventil',
      text: 'Das T-Ventil teilt den Wasserweg: geradeaus weiter zum Spülkasten, seitlich zum Handbidet.',
      basin: { text: 'Das T-Ventil teilt den Wasserweg: geradeaus weiter zur Waschtischarmatur, seitlich zum Handbidet.' },
      focus: 'tvalve',
      highlight: ['tvalve'],
      flows: ['supply', 'consumer', 'branch'],
      facts: [
        { label: 'Unten, zum Eckventil', value: 'G3/8 innen', status: 'planned' },
        { label: 'Oben, zum bestehenden Zulauf', value: 'G3/8 außen', status: 'planned' },
        { label: 'Seitlich, zum Schlauch', value: 'G1/2 außen', status: 'planned' },
      ],
    },
    {
      id: 'consumer',
      labels: ['flexhose', 'consumer'],
      title: 'Weiter zum Spülkasten',
      text: 'Der zusätzliche Anschlussschlauch des Sets verbindet das T-Ventil mit dem Spülkasten. So wird der Spülkasten weiterhin versorgt.',
      basin: {
        title: 'Weiter zur Waschtischarmatur',
        text: 'Der bestehende Zulauf der Waschtischarmatur würde oben am T-Ventil angeschlossen. Die Armatur bliebe so weiterhin versorgt.',
        facts: [
          { label: 'Anschluss oben am T-Ventil', value: 'G3/8 außen', status: 'planned' },
          { label: 'Passt zum Zulaufschlauch der Armatur?', value: 'Zu prüfen', status: 'open' },
        ],
      },
      focus: 'consumer',
      highlight: ['tvalve', 'consumer', 'flexhose'],
      flows: ['supply', 'consumer'],
      facts: [
        { label: 'T-Ventil oben', value: 'G3/8 außen', status: 'planned' },
        { label: 'Anschlussschlauch: Länge, Anschlussmaße', value: 'Noch festzulegen', status: 'open' },
        { label: 'Adapter, Sicherheitsausführung', value: 'Noch festzulegen', status: 'open' },
      ],
    },
    {
      id: 'branch',
      labels: ['tvalve', 'hose'],
      title: 'Absperrbarer Abzweig',
      text: 'Mit dem Hebel lässt sich der Abzweig zum Handbidet schließen, ohne den Spülkasten abzusperren.',
      basin: { text: 'Mit dem Hebel ließe sich der Abzweig zum Handbidet schließen, ohne die Waschtischarmatur abzusperren.' },
      focus: 'lever',
      highlight: ['tvalve'],
      flows: ['supply', 'consumer', 'branch'],
      lever: true,
      facts: [
        { label: 'Abzweig zum Schlauch', value: 'G1/2 außen', status: 'planned' },
        { label: 'Hebelstellung', value: 'Darstellung schematisch', status: 'design' },
      ],
    },
    {
      id: 'hose',
      labels: ['hose', 'tvalve', 'handbidet'],
      title: 'Brauseschlauch',
      text: 'Der Schlauch führt vom Abzweig in einem lockeren Bogen zum Handbidet neben dem WC.',
      basin: {
        text: 'Der Schlauch führt vom Waschbecken zum Handbidet neben dem WC. Das setzt voraus, dass beide nah genug beieinander liegen.',
        facts: [
          { label: 'Länge', value: 'Bevorzugt 1,5 m', status: 'planned' },
          { label: 'Abstand Waschbecken – Halterung', value: 'Muss zur Schlauchlänge passen – im Einzelfall prüfen', status: 'open' },
        ],
      },
      focus: 'hose',
      highlight: ['hose', 'tvalve', 'handbidet'],
      flows: ['branch'],
      facts: [
        { label: 'Länge', value: 'Bevorzugt 1,5 m', status: 'planned' },
        { label: 'Anschlüsse', value: 'Beidseitig G1/2 innen', status: 'planned' },
      ],
    },
    {
      id: 'holder',
      labels: ['handbidet'],
      title: 'Handbidet und Halterung',
      text: 'Die Halterung nimmt das Handbidet an der Wand neben dem WC auf.',
      focus: 'holder',
      highlight: ['handbidet', 'bracket', 'hose'],
      flows: [],
      facts: [
        { label: 'Montage der Halterung', value: 'Klebe- und Schraubmontage vorgesehen', status: 'planned' },
        { label: 'Untergrund, Befestigungsmittel', value: 'Noch festzulegen', status: 'open' },
      ],
    },
    {
      id: 'open',
      labels: [],
      title: 'Was noch offen ist',
      text: 'Bevor eine Montageanleitung entsteht, müssen diese Punkte geklärt sein:',
      basin: {
        facts: [
          { label: 'Waschtischvariante', value: 'Keine bestätigte Kompatibilität des Pudado-Sets', status: 'open' },
          { label: 'Absicherung der Wasserzufuhr', value: 'Technisch noch zu klären', status: 'open' },
          { label: 'Anschlussmaße', value: 'Herstellerbestätigung steht aus', status: 'open' },
          { label: 'Montage', value: 'Geprüfte Anleitung folgt; sie legt fest, welche Arbeiten eine Fachperson übernimmt', status: 'open' },
        ],
      },
      focus: 'overview',
      highlight: ['angle', 'tvalve', 'consumer', 'flexhose', 'hose', 'handbidet', 'bracket'],
      flows: [],
      facts: [
        { label: 'Plug & Play', value: 'Entwicklungsziel für klar definierte, geprüfte Anschlusssituationen', status: 'planned' },
        { label: 'Anschlussschlauch', value: 'Länge, Maße, Adapter und Sicherheitsausführung noch festzulegen', status: 'open' },
        { label: 'Absicherung der Wasserzufuhr', value: 'Technisch noch zu klären', status: 'open' },
        { label: 'Anschlussmaße', value: 'Herstellerbestätigung steht aus', status: 'open' },
        { label: 'Kompatibilität', value: 'Mit vorhandenen Anschlüssen im Einzelfall zu prüfen', status: 'open' },
        { label: 'Montage', value: 'Geprüfte Anleitung folgt; sie legt fest, welche Arbeiten eine Fachperson übernimmt', status: 'open' },
      ],
    },
  ],
};

// Schritt für eine Badsituation auflösen (Grundtext + Abweichungen)
export function stepFor(step, scenarioId) {
  const variant = scenarioId !== 'wc' && step[scenarioId] ? step[scenarioId] : {};
  return { ...step, ...variant };
}

/* Platzhalter für eine spätere, geprüfte Montageanleitung.
 * Erwartetes Format: { source, approvedBy, date, steps: [{ title, text, focus, highlight }] }
 * Solange null, zeigt die Oberfläche nur die Erklärung oben. */
export const INSTALL_GUIDE = null;

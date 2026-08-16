#!/usr/bin/env node
'use strict';
/**
 * PostToolUse-Hook: hält die Mehrsprachigkeit konsistent.
 *
 * Läuft nur an, wenn translations.js oder eine HTML-Seite bearbeitet wurde,
 * und schweigt ansonsten vollständig. Bei einem Fund geht er mit Exit-Code 2
 * raus, damit Claude die Meldung sieht und den Key nachzieht, bevor die
 * Änderung weiterwächst.
 *
 * Warum als Hook und nicht als Review-Schritt: script.js fällt bei fehlendem
 * Key still auf Deutsch zurück. Ohne automatische Prüfung merkt das niemand
 * bis zur französischen Seite im Livebetrieb.
 */

const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..', '..');

let raw = '';
process.stdin.on('data', (chunk) => (raw += chunk));
process.stdin.on('end', () => {
  let filePath = '';
  try {
    filePath = (JSON.parse(raw).tool_input || {}).file_path || '';
  } catch {
    process.exit(0); // Kein verwertbarer Hook-Input: nicht im Weg stehen.
  }

  if (!filePath) process.exit(0);
  const relative = path.relative(ROOT, filePath);
  if (relative.startsWith('..')) process.exit(0); // Datei außerhalb des Projekts
  if (relative.startsWith('_backup')) process.exit(0); // Rollback-Stände nicht prüfen

  const isRelevant = relative === 'translations.js' || relative.endsWith('.html');
  if (!isRelevant) process.exit(0);

  let result;
  try {
    result = require(path.join(ROOT, '.claude', 'scripts', 'check-i18n.js')).run();
  } catch (error) {
    console.error(`i18n-Guard konnte nicht laufen: ${error.message}`);
    process.exit(2);
  }

  if (result.ok) process.exit(0);

  const shown = result.problems.slice(0, 12);
  console.error(
    'i18n-Guard: die Mehrsprachigkeit ist nicht mehr konsistent.\n' +
      shown.map((problem) => '  - ' + problem).join('\n') +
      (result.problems.length > shown.length
        ? `\n  … und ${result.problems.length - shown.length} weitere`
        : '') +
      '\n\nJeder Key muss in de, en UND fr existieren (CLAUDE.md, Internationalisierung).' +
      '\nFehlende Sprachen sinngemäß im Markenton ergänzen, nicht wörtlich übersetzen.'
  );
  process.exit(2);
});

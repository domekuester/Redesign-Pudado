#!/usr/bin/env node
'use strict';
/**
 * PostToolUse-Hook: schützt das Design-System.
 *
 * Meldet neue rohe Hex-Farben in style.css (Delta gegen git HEAD, damit der
 * Altbestand von ~98 Zeilen nicht bei jedem Edit lärmt) und Bilder ohne
 * width/height/alt.
 *
 * Läuft nur bei style.css und HTML-Dateien an, sonst still.
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
    process.exit(0);
  }

  if (!filePath) process.exit(0);
  const relative = path.relative(ROOT, filePath);
  if (relative.startsWith('..')) process.exit(0);
  if (relative.startsWith('_backup')) process.exit(0);

  const isRelevant = relative === 'style.css' || relative.endsWith('.html');
  if (!isRelevant) process.exit(0);

  let result;
  try {
    result = require(path.join(ROOT, '.claude', 'scripts', 'check-tokens.js')).run();
  } catch (error) {
    console.error(`Design-Guard konnte nicht laufen: ${error.message}`);
    process.exit(2);
  }

  if (result.ok) process.exit(0);

  const shown = result.problems.slice(0, 10);
  console.error(
    'Design-Guard: Abweichung vom Design-System.\n' +
      shown.map((problem) => '  - ' + problem).join('\n') +
      (result.problems.length > shown.length
        ? `\n  … und ${result.problems.length - shown.length} weitere`
        : '') +
      '\n\nFarben ausschließlich über die --Variablen im :root-Block von style.css' +
      '\n(CLAUDE.md, Design-System). Bilder brauchen width, height und alt.'
  );
  process.exit(2);
});

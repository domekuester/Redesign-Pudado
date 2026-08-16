#!/usr/bin/env node
'use strict';
/**
 * i18n-Integritätsprüfung für translations.js + alle HTML-Seiten.
 *
 * Warum das nötig ist: script.js fällt bei einem fehlenden Key still auf
 * Deutsch zurück (siehe script.js, getText-Fallback auf dict.de). Ein in
 * "fr" vergessener Key erzeugt also keine sichtbare Lücke, sondern deutschen
 * Text auf der französischen Seite – der leiseste und damit gefährlichste
 * Fehlerfall. Es gibt keinen Build-Schritt, der das sonst bemerken würde.
 *
 * Geprüft wird:
 *   1. Alle Sprachen haben identische Key-Sets.
 *   2. Jedes data-i18n / data-i18n-ph im HTML ist in allen Sprachen vorhanden.
 *   3. Keys ohne jede Verwendung (nur als Hinweis, kein Fehler).
 *
 * Dynamisch zusammengesetzte Keys (script.js: 'meta.title.' + PAGE_KEY)
 * werden über DYNAMIC_PREFIXES als "verwendet" behandelt – sonst meldet die
 * Prüfung die kompletten meta.*-Keys fälschlich als tot.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');

// Keys, die zur Laufzeit aus einem Präfix + Seiten-Key gebaut werden.
const DYNAMIC_PREFIXES = ['meta.title.', 'meta.desc.'];

function htmlFiles() {
  const out = [];
  for (const entry of fs.readdirSync(ROOT)) {
    if (entry.endsWith('.html')) out.push(entry);
  }
  for (const dir of ['blog', 'situations']) {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs)) continue;
    for (const entry of fs.readdirSync(abs)) {
      if (entry.endsWith('.html')) out.push(path.join(dir, entry));
    }
  }
  return out.sort();
}

function loadDictionary() {
  // translations.js setzt window.PUDADO_I18N – in Node existiert kein window.
  const sandbox = {};
  global.window = sandbox;
  delete require.cache[require.resolve(path.join(ROOT, 'translations.js'))];
  require(path.join(ROOT, 'translations.js'));
  delete global.window;
  if (!sandbox.PUDADO_I18N) throw new Error('translations.js hat window.PUDADO_I18N nicht gesetzt');
  return sandbox.PUDADO_I18N;
}

function run() {
  const problems = [];
  const notes = [];
  const dict = loadDictionary();
  const langs = Object.keys(dict);

  if (langs.length === 0) {
    return { name: 'i18n', ok: false, problems: ['translations.js enthält keine Sprachen'], notes };
  }

  // 1. Key-Parität zwischen den Sprachen
  const keysByLang = {};
  const allKeys = new Set();
  for (const lang of langs) {
    keysByLang[lang] = new Set(Object.keys(dict[lang]));
    for (const key of keysByLang[lang]) allKeys.add(key);
  }
  const reportedKeys = new Set();
  for (const key of allKeys) {
    const missing = langs.filter((lang) => !keysByLang[lang].has(key));
    if (missing.length) {
      problems.push(`Key "${key}" fehlt in: ${missing.join(', ')}`);
      reportedKeys.add(key);
    }
  }

  // 2. HTML-Referenzen auflösen
  const used = new Set();
  for (const file of htmlFiles()) {
    const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const matches = source.matchAll(/data-i18n(?:-ph)?="([^"]+)"/g);
    for (const match of matches) {
      const key = match[1];
      used.add(key);
      // Global fehlende Keys wurden oben schon einmal gemeldet – hier nicht
      // pro Seite wiederholen, sonst erzeugt ein Key 20 identische Zeilen.
      if (reportedKeys.has(key)) continue;
      const missing = langs.filter((lang) => !keysByLang[lang].has(key));
      if (missing.length) {
        problems.push(`${file}: data-i18n="${key}" ist in keiner Sprache definiert`);
        reportedKeys.add(key);
      }
    }
  }

  // 3. Ungenutzte Keys – nur Hinweis, kein Fehler (Keys können bewusst auf
  //    Vorrat gepflegt sein und dynamische Präfixe sind hier ausgenommen).
  const referenceLang = langs.includes('de') ? 'de' : langs[0];
  const unused = [...keysByLang[referenceLang]].filter(
    (key) => !used.has(key) && !DYNAMIC_PREFIXES.some((prefix) => key.startsWith(prefix))
  );
  if (unused.length) {
    notes.push(`${unused.length} Keys ohne HTML-Referenz (z. B. ${unused.slice(0, 3).join(', ')})`);
  }

  const counts = langs.map((lang) => `${lang}:${keysByLang[lang].size}`).join(' ');
  notes.unshift(`${langs.length} Sprachen, ${counts}, ${used.size} Keys im HTML referenziert`);

  return { name: 'i18n', ok: problems.length === 0, problems, notes };
}

module.exports = { run, htmlFiles, loadDictionary, ROOT };

if (require.main === module) {
  const result = run();
  for (const note of result.notes) console.log('  ' + note);
  for (const problem of result.problems) console.error('  ✗ ' + problem);
  console.log(result.ok ? '✓ i18n konsistent' : `✗ ${result.problems.length} i18n-Probleme`);
  process.exit(result.ok ? 0 : 1);
}

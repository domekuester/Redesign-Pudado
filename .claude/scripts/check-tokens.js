#!/usr/bin/env node
'use strict';
/**
 * Design-System-Wächter: rohe Hex-Farben in style.css und Bild-Attribute im HTML.
 *
 * CLAUDE.md verlangt beides ("keine neuen Rohfarben direkt in Selektoren",
 * width/height/alt an jedem Bild), nur erzwingt es bisher nichts.
 *
 * Wichtig – Hex-Prüfung läuft im DELTA-Modus:
 * Im Bestand stehen bereits ~98 Hex-Werte außerhalb von :root. Eine absolute
 * Prüfung würde bei jedem Edit 98-mal anschlagen und wäre binnen einer Woche
 * stummgeschaltet. Verglichen wird deshalb gegen den Stand in git HEAD – gemeldet
 * wird nur, was NEU hinzukommt. Der Altbestand darf schrumpfen, nicht wachsen.
 *
 * Die Bild-Prüfung ist absolut: dort gibt es aktuell null Verstöße, dieser
 * Zustand ist billig zu halten.
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');

/** Entfernt Kommentare und alle :root{…}-Blöcke – übrig bleibt der Bereich,
 *  in dem laut CLAUDE.md keine rohen Hex-Werte stehen dürfen. */
function stripTokenBlocks(css) {
  // Kommentarinhalt entfernen, Zeilenumbrüche aber behalten – sonst verrutschen
  // alle gemeldeten Zeilennummern um die Länge der Blockkommentare.
  const withoutComments = css.replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, ''));
  let out = '';
  let index = 0;
  while (index < withoutComments.length) {
    const rootAt = withoutComments.indexOf(':root', index);
    if (rootAt === -1) {
      out += withoutComments.slice(index);
      break;
    }
    const braceAt = withoutComments.indexOf('{', rootAt);
    if (braceAt === -1) {
      out += withoutComments.slice(index);
      break;
    }
    out += withoutComments.slice(index, rootAt);
    let depth = 1;
    let cursor = braceAt + 1;
    while (cursor < withoutComments.length && depth > 0) {
      if (withoutComments[cursor] === '{') depth += 1;
      else if (withoutComments[cursor] === '}') depth -= 1;
      cursor += 1;
    }
    // Zeilenumbrüche erhalten, damit Zeilennummern stimmen.
    out += withoutComments.slice(braceAt, cursor).replace(/[^\n]/g, '');
    index = cursor;
  }
  return out;
}

function hexLines(css) {
  const lines = stripTokenBlocks(css).split('\n');
  const found = [];
  lines.forEach((line, i) => {
    const matches = line.match(/#[0-9a-fA-F]{3,8}\b/g);
    if (matches) found.push({ line: i + 1, text: line.trim(), values: matches });
  });
  return found;
}

function headVersion(file) {
  try {
    return execFileSync('git', ['show', `HEAD:${file}`], { cwd: ROOT, encoding: 'utf8', stdio: 'pipe' });
  } catch {
    return null; // Datei ist neu oder kein git – dann kein Delta möglich.
  }
}

function checkCss() {
  const problems = [];
  const notes = [];
  const cssPath = path.join(ROOT, 'style.css');
  if (!fs.existsSync(cssPath)) return { problems, notes };

  const current = hexLines(fs.readFileSync(cssPath, 'utf8'));
  const head = headVersion('style.css');

  if (head === null) {
    notes.push(`${current.length} Zeile(n) mit rohen Hex-Werten außerhalb :root (kein git-Vergleich möglich)`);
    return { problems, notes };
  }

  // Vergleich über den Zeileninhalt, nicht die Zeilennummer – Verschiebungen
  // durch Einfügen an anderer Stelle sollen nichts auslösen.
  const headTexts = new Set(hexLines(head).map((entry) => entry.text));
  const added = current.filter((entry) => !headTexts.has(entry.text));

  for (const entry of added) {
    problems.push(`style.css:${entry.line}: neue rohe Hex-Farbe ${entry.values.join(', ')} → "${entry.text.slice(0, 80)}"`);
  }
  notes.push(`${current.length} Zeilen mit Hex außerhalb :root (Bestand), ${added.length} davon neu`);
  return { problems, notes };
}

function htmlFiles() {
  const out = [];
  for (const entry of fs.readdirSync(ROOT)) if (entry.endsWith('.html')) out.push(entry);
  for (const dir of ['blog', 'situations']) {
    const abs = path.join(ROOT, dir);
    if (!fs.existsSync(abs)) continue;
    for (const entry of fs.readdirSync(abs)) if (entry.endsWith('.html')) out.push(path.join(dir, entry));
  }
  return out.sort();
}

function checkImages() {
  const problems = [];
  let total = 0;
  for (const file of htmlFiles()) {
    const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
    for (const match of source.matchAll(/<img\b[^>]*>/g)) {
      total += 1;
      const tag = match[0];
      const missing = [];
      if (!/\bwidth=/.test(tag)) missing.push('width');
      if (!/\bheight=/.test(tag)) missing.push('height');
      if (!/\balt=/.test(tag)) missing.push('alt');
      if (missing.length) {
        const src = (tag.match(/src="([^"]*)"/) || [])[1] || '?';
        problems.push(`${file}: <img src="${src}"> ohne ${missing.join('/')} (CLS-Risiko bzw. Accessibility)`);
      }
    }
  }
  return { problems, notes: [`${total} Bilder geprüft`] };
}

function run() {
  const css = checkCss();
  const images = checkImages();
  const problems = [...css.problems, ...images.problems];
  return { name: 'design-tokens', ok: problems.length === 0, problems, notes: [...css.notes, ...images.notes] };
}

module.exports = { run };

if (require.main === module) {
  const result = run();
  for (const note of result.notes) console.log('  ' + note);
  for (const problem of result.problems) console.error('  ✗ ' + problem);
  console.log(result.ok ? '✓ Design-System eingehalten' : `✗ ${result.problems.length} Abweichungen`);
  process.exit(result.ok ? 0 : 1);
}

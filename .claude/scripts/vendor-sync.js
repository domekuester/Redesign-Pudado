#!/usr/bin/env node
'use strict';
/**
 * Abgleich zwischen node_modules und assets/vendor.
 *
 * Die Website ist bewusst abhängigkeitsfrei: ausgeliefert werden ausschließlich
 * die kontrolliert kopierten Browser-Builds unter assets/vendor/. Der Kopiervorgang
 * war bisher Handarbeit, und nichts hielt fest, welche Version dort eigentlich liegt.
 *
 * Zwei Eigenheiten, die dieses Skript berücksichtigt:
 *
 * 1. Verglichen wird NORMALISIERT (Leerraum am Zeilenende und am Dateiende egal).
 *    Die vorhandenen GSAP-Kopien unterscheiden sich von node_modules nur durch
 *    entfernte Trailing-Whitespaces – inhaltlich identisch. Ein stumpfer Byte-
 *    Vergleich würde sie ohne Grund ersetzen, damit die ?v=-Content-Hashes ändern
 *    und 117 KB Neu-Download bei allen Besucher:innen auslösen.
 *
 * 2. Kopiert wird nur mit --apply. Ein Versionssprung in einer Animationsbibliothek
 *    ist eine funktionale Änderung an der Live-Seite, keine Aufräumarbeit.
 *
 * Aufruf:
 *   node .claude/scripts/vendor-sync.js            # nur berichten
 *   node .claude/scripts/vendor-sync.js --apply    # inhaltliche Unterschiede übernehmen
 *   node .claude/scripts/vendor-sync.js --apply --force   # auch reine Leerraum-Diffs
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const VENDOR = path.join(ROOT, 'assets', 'vendor');

const FILES = [
  { pkg: 'gsap', from: 'dist/gsap.min.js', to: 'gsap.min.js' },
  { pkg: 'gsap', from: 'dist/ScrollTrigger.min.js', to: 'ScrollTrigger.min.js' },
  { pkg: 'lenis', from: 'dist/lenis.min.js', to: 'lenis.min.js' },
  { pkg: 'lenis', from: 'dist/lenis.css', to: 'lenis.css' },
];

/** Leerraum am Zeilenende und Leerzeilen am Dateiende ignorieren. */
function normalize(buffer) {
  return buffer
    .toString('utf8')
    .split('\n')
    .map((line) => line.replace(/\s+$/, ''))
    .join('\n')
    .replace(/\n+$/, '');
}

function kb(bytes) {
  return (bytes / 1024).toFixed(1) + ' KB';
}

function main() {
  const apply = process.argv.includes('--apply');
  const force = process.argv.includes('--force');

  const declared = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).dependencies || {};
  const rows = [];
  let needsUpdate = 0;
  let whitespaceOnly = 0;
  let copied = 0;

  for (const entry of FILES) {
    const source = path.join(ROOT, 'node_modules', entry.pkg, entry.from);
    const target = path.join(VENDOR, entry.to);

    if (!fs.existsSync(source)) {
      rows.push(`  ✗ ${entry.to}: Quelle fehlt (${entry.pkg} nicht installiert? npm install)`);
      needsUpdate += 1;
      continue;
    }
    const sourceBuffer = fs.readFileSync(source);

    if (!fs.existsSync(target)) {
      rows.push(`  ✗ ${entry.to}: fehlt in assets/vendor/ (${kb(sourceBuffer.length)})`);
      needsUpdate += 1;
      if (apply) {
        fs.writeFileSync(target, sourceBuffer);
        copied += 1;
      }
      continue;
    }

    const targetBuffer = fs.readFileSync(target);
    const identicalBytes = sourceBuffer.equals(targetBuffer);
    const identicalContent = normalize(sourceBuffer) === normalize(targetBuffer);

    if (identicalBytes) {
      rows.push(`  ✓ ${entry.to}: identisch (${kb(targetBuffer.length)})`);
    } else if (identicalContent) {
      whitespaceOnly += 1;
      rows.push(
        `  ~ ${entry.to}: inhaltlich identisch, nur Leerraum abweichend ` +
          `(${kb(targetBuffer.length)} → ${kb(sourceBuffer.length)}) – kein Update nötig`
      );
      if (apply && force) {
        fs.writeFileSync(target, sourceBuffer);
        copied += 1;
      }
    } else {
      needsUpdate += 1;
      const delta = sourceBuffer.length - targetBuffer.length;
      rows.push(
        `  ✗ ${entry.to}: INHALTLICH abweichend ` +
          `(${kb(targetBuffer.length)} → ${kb(sourceBuffer.length)}, ${delta >= 0 ? '+' : ''}${delta} Bytes)`
      );
      if (apply) {
        fs.writeFileSync(target, sourceBuffer);
        copied += 1;
      }
    }
  }

  console.log('Versionen:');
  for (const pkg of [...new Set(FILES.map((f) => f.pkg))]) {
    const manifest = path.join(ROOT, 'node_modules', pkg, 'package.json');
    const installed = fs.existsSync(manifest) ? JSON.parse(fs.readFileSync(manifest, 'utf8')).version : '—';
    console.log(`  ${pkg}: installiert ${installed}, package.json fordert ${declared[pkg] || '(nicht deklariert)'}`);
  }

  console.log('\nDateien:');
  rows.forEach((row) => console.log(row));

  // Pakete, die installiert sind, aber weder deklariert noch ausgeliefert werden.
  const nodeModules = path.join(ROOT, 'node_modules');
  if (fs.existsSync(nodeModules)) {
    const extras = fs
      .readdirSync(nodeModules)
      .filter((name) => !name.startsWith('.') && !declared[name]);
    if (extras.length) {
      console.log(
        `\nHinweis: ${extras.join(', ')} liegt in node_modules, steht aber nicht in package.json ` +
          'und wird nicht ausgeliefert – vermutlich Rest eines verworfenen Versuchs.'
      );
    }
  }

  if (apply && copied > 0) {
    console.log(
      `\n${copied} Datei(en) kopiert. Jetzt zwingend: node .claude/scripts/check-assets.js --fix ` +
        '(die ?v=-Stempel zeigen sonst auf den alten Inhalt).'
    );
  } else if (needsUpdate > 0) {
    console.log(`\n${needsUpdate} Datei(en) inhaltlich veraltet. Übernehmen mit --apply.`);
  } else if (whitespaceOnly > 0) {
    console.log(`\nAlles aktuell. ${whitespaceOnly} Datei(en) nur mit Leerraum-Diff – bewusst nicht angefasst.`);
  } else {
    console.log('\n✓ assets/vendor ist deckungsgleich mit node_modules.');
  }

  process.exit(needsUpdate > 0 && !apply ? 1 : 0);
}

main();

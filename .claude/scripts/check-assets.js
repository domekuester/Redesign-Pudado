#!/usr/bin/env node
'use strict';
/**
 * Cache-Buster-Prüfung für lokale CSS/JS-Assets (mit --fix auch Reparatur).
 *
 * Warum: Deploy heißt hier "push auf main" (GitHub Pages), es gibt keinen
 * Build-Schritt, der Dateinamen hasht. Ohne ?v= liefert der Browser-Cache
 * wiederkehrenden Besucher:innen altes CSS zu neuem HTML – der Fehler, den
 * nur Menschen sehen, die schon einmal da waren.
 *
 * Der Stempel ist ein 8-stelliger Content-Hash statt eines Datums-Tags:
 * er ändert sich genau dann, wenn sich die Datei ändert, invalidiert nur
 * das tatsächlich Geänderte und kann nie "vergessen" werden.
 *
 * Aufruf:
 *   node .claude/scripts/check-assets.js          # prüfen
 *   node .claude/scripts/check-assets.js --fix    # Stempel korrigieren
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..', '..');

// Assets, die versioniert werden. Fonts und Bilder bleiben bewusst außen vor:
// sie werden über sprechende Dateinamen ersetzt, nicht in-place geändert.
const VERSIONED = /^(?:\.\.\/)?(?:style\.css|script\.js|translations\.js|motion\.js|assets\/vendor\/[A-Za-z0-9.-]+\.(?:js|css))$/;

// Erfasst href="../style.css?v=abc" ebenso wie s.src = 'assets/vendor/lenis.min.js'
const REFERENCE = /(["'])((?:\.\.\/)?(?:style\.css|script\.js|translations\.js|motion\.js|assets\/vendor\/[A-Za-z0-9.-]+\.(?:js|css)))(\?v=[^"']*)?\1/g;

const hashCache = new Map();

function hashOf(assetPath) {
  if (!hashCache.has(assetPath)) {
    const buffer = fs.readFileSync(assetPath);
    hashCache.set(assetPath, crypto.createHash('sha1').update(buffer).digest('hex').slice(0, 8));
  }
  return hashCache.get(assetPath);
}

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

function run({ fix = false } = {}) {
  const problems = [];
  const notes = [];
  let rewritten = 0;

  for (const file of htmlFiles()) {
    const absolute = path.join(ROOT, file);
    const source = fs.readFileSync(absolute, 'utf8');
    let changed = false;

    const next = source.replace(REFERENCE, (match, quote, url, version) => {
      if (!VERSIONED.test(url)) return match;
      const assetPath = path.resolve(path.dirname(absolute), url);
      if (!fs.existsSync(assetPath)) {
        problems.push(`${file}: referenziertes Asset fehlt: ${url}`);
        return match;
      }
      const expected = '?v=' + hashOf(assetPath);
      if (version === expected) return match;
      if (fix) {
        changed = true;
        return `${quote}${url}${expected}${quote}`;
      }
      problems.push(
        `${file}: ${url} hat ${version ? `veralteten Stempel ${version}` : 'keinen Cache-Buster'} (erwartet ${expected})`
      );
      return match;
    });

    if (changed) {
      fs.writeFileSync(absolute, next);
      rewritten += 1;
    }
  }

  if (fix) notes.push(`${rewritten} Datei(en) mit aktuellen Cache-Bustern geschrieben`);

  return { name: 'assets', ok: problems.length === 0, problems, notes };
}

module.exports = { run };

if (require.main === module) {
  const fix = process.argv.includes('--fix');
  const result = run({ fix });
  for (const note of result.notes) console.log('  ' + note);
  for (const problem of result.problems) console.error('  ✗ ' + problem);
  console.log(result.ok ? '✓ Cache-Buster aktuell' : `✗ ${result.problems.length} Asset-Versionsprobleme`);
  process.exit(result.ok ? 0 : 1);
}

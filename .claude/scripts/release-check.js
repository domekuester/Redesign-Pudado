#!/usr/bin/env node
'use strict';
/**
 * Pre-Deploy-Gate für Pudado.
 *
 * Deploy = push auf main (GitHub Pages), es gibt keine CI-Stufe dazwischen.
 * Dieses Skript ist deshalb der einzige Ort, an dem die Dinge geprüft werden,
 * die man beim Deploy still kaputt machen kann.
 *
 * Aufruf:
 *   node .claude/scripts/release-check.js         # nur prüfen
 *   node .claude/scripts/release-check.js --fix   # Cache-Buster mitkorrigieren
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..', '..');
const SITE_ORIGIN = 'https://pudado.de';

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

/** JS-Dateien müssen syntaktisch valide sein – ein Tippfehler in translations.js
 *  legt sonst die komplette Mehrsprachigkeit lahm, ohne dass etwas warnt. */
function checkSyntax() {
  const problems = [];
  for (const file of ['script.js', 'motion.js', 'translations.js']) {
    try {
      execFileSync(process.execPath, ['--check', path.join(ROOT, file)], { stdio: 'pipe' });
    } catch (error) {
      problems.push(`${file}: Syntaxfehler – ${String(error.stderr).split('\n')[0]}`);
    }
  }
  return { name: 'syntax', ok: problems.length === 0, problems, notes: ['script.js, motion.js, translations.js geprüft'] };
}

/** Jede öffentliche Inhaltsseite gehört in die sitemap.xml. Vergessene Einträge
 *  sind der Standardfehler beim Anlegen neuer Blog-/Situations-Seiten. */
function checkSitemap() {
  const problems = [];
  const sitemapPath = path.join(ROOT, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    return { name: 'sitemap', ok: false, problems: ['sitemap.xml fehlt'], notes: [] };
  }
  const sitemap = fs.readFileSync(sitemapPath, 'utf8');
  const listed = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()));

  // 404 und Rechtsseiten gehören bewusst nicht in die Sitemap.
  const excluded = new Set(['404.html', 'impressum.html', 'datenschutz.html']);
  for (const file of htmlFiles()) {
    if (excluded.has(file)) continue;
    const url = file === 'index.html' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}/${file}`;
    if (!listed.has(url)) problems.push(`${file} fehlt in sitemap.xml (erwartet ${url})`);
  }
  for (const url of listed) {
    const relative = url.replace(`${SITE_ORIGIN}/`, '') || 'index.html';
    if (!fs.existsSync(path.join(ROOT, relative))) {
      problems.push(`sitemap.xml verweist auf nicht existierende Seite: ${url}`);
    }
  }
  return { name: 'sitemap', ok: problems.length === 0, problems, notes: [`${listed.size} URLs gelistet`] };
}

/** Titel, Description und Canonical müssen vorhanden und eindeutig sein –
 *  doppelte Titel sind eine klassische Duplicate-Content-Falle. */
function checkSeoBasics() {
  const problems = [];
  const titles = new Map();
  const canonicals = new Map();

  for (const file of htmlFiles()) {
    const source = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const title = (source.match(/<title>([^<]*)<\/title>/) || [])[1];
    const description = (source.match(/<meta\s+name="description"\s+content="([^"]*)"/) || [])[1];
    const canonical = (source.match(/<link\s+rel="canonical"\s+href="([^"]*)"/) || [])[1];
    const h1Count = (source.match(/<h1\b/g) || []).length;

    if (!title) problems.push(`${file}: <title> fehlt`);
    if (!description) problems.push(`${file}: meta description fehlt`);
    // 404 bekommt bewusst kein Canonical – die Seite soll nicht indexiert werden.
    if (!canonical && file !== '404.html') problems.push(`${file}: canonical fehlt`);
    if (h1Count !== 1) problems.push(`${file}: ${h1Count} <h1> gefunden (genau 1 erwartet)`);

    if (title) {
      if (titles.has(title)) problems.push(`${file}: identischer <title> wie ${titles.get(title)}`);
      else titles.set(title, file);
    }
    if (canonical) {
      if (canonicals.has(canonical)) problems.push(`${file}: identisches canonical wie ${canonicals.get(canonical)}`);
      else canonicals.set(canonical, file);
    }
  }
  return { name: 'seo', ok: problems.length === 0, problems, notes: [`${htmlFiles().length} Seiten geprüft`] };
}

function main() {
  const fix = process.argv.includes('--fix');
  const checks = [
    checkSyntax(),
    require('./check-i18n.js').run(),
    require('./check-assets.js').run({ fix }),
    checkSitemap(),
    checkSeoBasics(),
  ];

  let failed = 0;
  for (const check of checks) {
    console.log(`\n${check.ok ? '✓' : '✗'} ${check.name}`);
    for (const note of check.notes || []) console.log('    ' + note);
    for (const problem of check.problems) console.log('    ✗ ' + problem);
    if (!check.ok) failed += 1;
  }

  console.log(
    failed === 0
      ? '\n✓ release-check bestanden – deploybar.'
      : `\n✗ release-check fehlgeschlagen: ${failed} von ${checks.length} Prüfungen.`
  );
  process.exit(failed === 0 ? 0 : 1);
}

main();

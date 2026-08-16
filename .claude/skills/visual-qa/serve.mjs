#!/usr/bin/env node
/**
 * Produktionsnaher Test-Server für Pudado (nur Node-Builtins, keine Abhängigkeiten).
 *
 * Warum es diesen Server gibt: `python3 -m http.server` liefert weder
 * Kompression noch Cache-Header. Messungen dagegen sind nicht nur zu schlecht,
 * sie verstecken echte Fehler – am 2026-08-15 maskierte der langsame Server
 * einen CLS-Bug von 0,211, weil der Font-Swap aus dem Messfenster fiel.
 *
 * Gemessen an derselben Codebasis:
 *   python-Server:  Mobile Performance 72, LCP 7,2 s, style.css 112 KB
 *   dieser Server:  Mobile Performance 97, LCP 2,6 s, style.css 24,9 KB
 *
 * Aufruf:  node .claude/skills/visual-qa/serve.mjs [port]
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..');
const PORT = Number(process.argv[2]) || 8900;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.mp4': 'video/mp4',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.json', '.svg', '.xml', '.txt']);

http
  .createServer((req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    let filePath = path.join(ROOT, url);
    if (url.endsWith('/')) filePath = path.join(filePath, 'index.html');

    // Kein Ausbruch aus dem Projektverzeichnis.
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403).end('Forbidden');
      return;
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      const notFound = path.join(ROOT, '404.html');
      const body = fs.existsSync(notFound) ? fs.readFileSync(notFound) : Buffer.from('Not found');
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }).end(body);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const body = fs.readFileSync(filePath);
    const headers = { 'Content-Type': TYPES[ext] || 'application/octet-stream' };

    // Cache-Politik wie bei einem echten Hoster: HTML immer revalidieren,
    // Assets lange halten – die ?v=-Content-Hashes erledigen die Invalidierung.
    headers['Cache-Control'] = ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable';

    const accepted = req.headers['accept-encoding'] || '';
    if (COMPRESSIBLE.has(ext) && /br/.test(accepted)) {
      headers['Content-Encoding'] = 'br';
      res.writeHead(200, headers).end(zlib.brotliCompressSync(body));
    } else if (COMPRESSIBLE.has(ext) && /gzip/.test(accepted)) {
      headers['Content-Encoding'] = 'gzip';
      res.writeHead(200, headers).end(zlib.gzipSync(body));
    } else {
      res.writeHead(200, headers).end(body);
    }
  })
  .listen(PORT, () => {
    console.log(`Pudado prod-naher Server läuft: http://localhost:${PORT}/`);
    console.log('Brotli/gzip + Cache-Header aktiv – geeignet für Lighthouse und CWV.');
  });

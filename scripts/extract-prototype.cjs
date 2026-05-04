#!/usr/bin/env node
// Decode the SIZE prototype standalone HTML bundler.
// Reads the __bundler/manifest script tag (base64+gzip per asset),
// decompresses each entry, and dumps every text/JS asset to disk.
// Binary assets (woff2, png, etc.) are skipped — we only need the source.

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const HTML = path.resolve(__dirname, '..', 'ExistingData', 'SIZE Web Prototype - standalone.html');
const OUT = path.resolve(__dirname, '..', 'ExistingData', 'prototype-extracted');

const html = fs.readFileSync(HTML, 'utf8');

function extract(tagType) {
  const re = new RegExp(`<script type="${tagType}">([\\s\\S]*?)</script>`);
  const m = html.match(re);
  if (!m) throw new Error('Missing tag: ' + tagType);
  return m[1].trim();
}

const manifest = JSON.parse(extract('__bundler/manifest'));
let template = JSON.parse(extract('__bundler/template'));

if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

// Inverse: find every "src=\"<UUID>\"" or "url(\"<UUID>\")" or "href=\"<UUID>\""
// occurrence in the template and remember the first context for naming.
const refContext = {};
const ctxRe = /(src|href|url)\s*[=(]\s*["']([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})["']?/gi;
let cm;
while ((cm = ctxRe.exec(template)) !== null) {
  const uuid = cm[2];
  if (!refContext[uuid]) refContext[uuid] = cm[1];
}

const written = [];
let order = 0;
for (const [uuid, entry] of Object.entries(manifest)) {
  const bytes = Buffer.from(entry.data, 'base64');
  let body;
  try {
    body = entry.compressed ? zlib.gunzipSync(bytes) : bytes;
  } catch (e) {
    console.error(`[skip] ${uuid}: gunzip failed (${e.message})`);
    continue;
  }
  const mime = entry.mime || 'application/octet-stream';
  const ctx = refContext[uuid] || '?';

  // Only dump text-y assets (JS, CSS, HTML, JSON, SVG, plain text)
  const isText = /^(text\/|application\/(javascript|json|xml|x-javascript|ecmascript|babel|jsx))/i.test(mime);
  if (!isText) {
    console.log(`[skip-bin] ${uuid} mime=${mime} ctx=${ctx} size=${body.length}`);
    continue;
  }

  // Pick an extension
  let ext = '.txt';
  if (/javascript|babel|jsx|ecmascript/i.test(mime)) ext = '.js';
  else if (/css/i.test(mime)) ext = '.css';
  else if (/html/i.test(mime)) ext = '.html';
  else if (/json/i.test(mime)) ext = '.json';
  else if (/svg/i.test(mime)) ext = '.svg';

  // Order by appearance in template so script load order is preserved
  const idxInTemplate = template.indexOf(uuid);
  const orderHint = String(idxInTemplate).padStart(8, '0');
  const filename = `${orderHint}_${order.toString().padStart(2, '0')}_${uuid}${ext}`;
  order++;

  fs.writeFileSync(path.join(OUT, filename), body);
  written.push({ uuid, mime, ctx, ext, bytes: body.length, filename });
  console.log(`[write] ${filename} mime=${mime} ctx=${ctx} size=${body.length}`);
}

// Also dump the template itself (the top-level HTML scaffold) for reference.
fs.writeFileSync(path.join(OUT, '_template.html'), template);
fs.writeFileSync(path.join(OUT, '_index.json'), JSON.stringify(written, null, 2));

console.log(`\nWrote ${written.length} text assets to ${OUT}`);
console.log('See _template.html for the bundler-rewritten root HTML.');
console.log('See _index.json for uuid→filename mapping.');

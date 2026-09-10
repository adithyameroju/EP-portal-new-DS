#!/usr/bin/env node
// Green-gate check: the pasteable "Using Compass in Loop" bootstrap rule lives in
// THREE hand-synced places. If their version stamps — or their normalized body text —
// disagree, fail loudly. Hand-synced copies are a drift vector; make divergence loud.
//
//   stories/sop-assets.ts                       BOOTSTRAP const  → React SOP Copy button
//   compass-sop.html                            <pre id=bootstrap> → standalone Copy button
//   runbooks/cursor-rule--using-compass-in-loop.md  canonical maintainer copy
//
// Run: node scripts/check-bootstrap-consistency.mjs   (npm run check:bootstrap)

import { readFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

// --- extractors: pull the bootstrap text out of each source's own format ---

function extractAssets(src) {
  // export const BOOTSTRAP = "...";  (a JS double-quoted string literal)
  const m = src.match(/export const BOOTSTRAP\s*=\s*("(?:[^"\\]|\\.)*")/s);
  if (!m) throw new Error('BOOTSTRAP string literal not found');
  return JSON.parse(m[1]); // unescapes \n, \" and \\
}

function decodeEntities(s) {
  return s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function extractHtml(src) {
  const m = src.match(/<pre[^>]*id="bootstrap"[^>]*>([\s\S]*?)<\/pre>/);
  if (!m) throw new Error('<pre id="bootstrap"> not found');
  return decodeEntities(m[1]);
}

function extractRunbook(src) {
  // the whole file IS the rule, minus the maintainer footer that is NOT pasted
  const cut = src.indexOf('--- Why this is thin');
  return cut >= 0 ? src.slice(0, cut) : src;
}

const SOURCES = [
  ['stories/sop-assets.ts', extractAssets],
  ['compass-sop.html', extractHtml],
  ['runbooks/cursor-rule--using-compass-in-loop.md', extractRunbook],
];

const norm = (s) => s.replace(/\s+/g, ' ').trim();
const versionOf = (s) => {
  const m = s.match(/Bootstrap version:\s*(v\d+)/i);
  return m ? m[1] : null;
};

function firstDiff(a, b) {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  const at = Math.max(0, i - 30);
  return (
    `\n      near: …${a.slice(at, i + 30)}…` +
    `\n        vs: …${b.slice(at, i + 30)}…`
  );
}

function main() {
  const texts = {};
  const errors = [];

  for (const [file, fn] of SOURCES) {
    try {
      texts[file] = fn(read(file));
    } catch (e) {
      errors.push(`${file}: ${e.message}`);
    }
  }

  const files = Object.keys(texts);
  let version = null;

  if (files.length === SOURCES.length) {
    // 1) version stamps: present + identical
    const stamps = files.map((f) => [f, versionOf(texts[f])]);
    for (const [f, v] of stamps) if (!v) errors.push(`${f}: no "Bootstrap version: vN" stamp`);
    const distinct = [...new Set(stamps.map(([, v]) => v).filter(Boolean))];
    if (distinct.length > 1) {
      errors.push(
        'version stamps disagree — ' +
          stamps.filter(([, v]) => v).map(([f, v]) => `${v} (${f})`).join(', '),
      );
    }
    version = distinct.length === 1 ? distinct[0] : null;

    // 2) normalized body: identical across all three
    const ref = files[0];
    for (const f of files.slice(1)) {
      if (norm(texts[f]) !== norm(texts[ref])) {
        errors.push(`body text diverges: ${f} != ${ref}${firstDiff(norm(texts[ref]), norm(texts[f]))}`);
      }
    }
  }

  console.log('Bootstrap consistency — 3 sources');
  for (const [f] of SOURCES) console.log('  · ' + f);

  if (errors.length) {
    console.error('\n  ✗ FAIL — the pasteable bootstrap has drifted:');
    for (const e of errors) console.error('    • ' + e);
    console.error('\n  Fix: re-sync the three copies to the same version stamp + body.');
    process.exit(1);
  }

  console.log(`\n  ✓ consistent — all three agree (${version}).`);
  process.exit(0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();

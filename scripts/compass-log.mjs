#!/usr/bin/env node

/**
 * compass log — Capture step of the S4 audit loop (drift ledger writer).
 *
 * Records one AI-assisted build session as a JSON entry in drift-log/entries/,
 * in the format described by drift-log/schema.json.
 *
 * Design constraint: ZERO FRICTION. Every auto-detection has a fallback and a
 * manual override; the command never hard-fails on missing git state.
 *
 * Usage:
 *   npm run log                          # interactive: paste assumptions, auto-detect files
 *   npm run log -- --source "figma.com/file/..." --slug kpi-row
 *   npm run log -- --no-input --assume "styling: assumed Card border stays default" \
 *                  --files components/blocks/kpi-row.tsx --slug kpi-row
 *
 * Flags (all optional):
 *   --designer <name>   who ran the build        (default: git config user.name)
 *   --tool <name>       cursor|claude-code|...    (default: cursor)
 *   --source <text>     Figma URL / prompt summary (default: prompted, or "unspecified")
 *   --slug <text>       short name for the filename (default: derived from source)
 *   --files <a,b,c>     comma-separated target files (default: auto via git)
 *   --assume <text>     one assumption; repeatable; "category: text" sets category
 *   --notes <text>      free-text context
 *   --no-input          never prompt (for scripting); uses flags only
 *   --demo              mark entry as a sample (Detect ignores it)
 *
 * Exit: 0 = entry written, 1 = entry could not be written (invalid/unwritable).
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENTRIES_DIR = path.join(ROOT, 'drift-log', 'entries');

const ASSUMPTION_CATEGORIES = [
  'styling', 'spacing', 'component-choice', 'content', 'behavior', 'token',
];

// ─── Small helpers ───────────────────────────────────────────────────────────

function git(cmd) {
  try {
    return execSync(`git ${cmd}`, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null; // no git / not a repo / bad ref — caller falls back
  }
}

function slugify(text) {
  const s = String(text)
    .toLowerCase()
    .replace(/https?:\/\/\S*?([\w-]+)\/?$/, '$1') // last URL segment if a URL
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return s || 'build';
}

function parseArgs(argv) {
  const args = { assume: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--no-input') args.noInput = true;
    else if (a === '--demo') args.demo = true;
    else if (a.startsWith('--')) {
      const key = a.slice(2);
      const val = argv[++i];
      if (val === undefined) {
        console.error(`  ✗ Flag --${key} needs a value.`);
        process.exit(1);
      }
      if (key === 'assume') args.assume.push(val);
      else args[key] = val;
    }
  }
  return args;
}

/** "styling: assumed X" → {text:"assumed X", category:"styling"}; else uncategorized. */
function parseAssumption(line) {
  const cleaned = line.replace(/^\s*[-*•]\s*/, '').trim();
  const m = cleaned.match(/^([a-z-]+)\s*:\s*(.+)$/i);
  if (m && ASSUMPTION_CATEGORIES.includes(m[1].toLowerCase())) {
    return { text: m[2].trim(), category: m[1].toLowerCase() };
  }
  return { text: cleaned, category: 'uncategorized' };
}

/** Read pasted lines from stdin until an empty line or EOF. */
function readPastedBlock(promptText) {
  return new Promise((resolve) => {
    console.log(promptText);
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    const lines = [];
    rl.on('line', (line) => {
      if (line.trim() === '') { rl.close(); return; }
      lines.push(line);
    });
    rl.on('close', () => resolve(lines));
  });
}

function readLineAnswer(promptText) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl.question(promptText, (answer) => { rl.close(); resolve(answer.trim()); });
  });
}

// ─── Auto-detection ──────────────────────────────────────────────────────────

/** Newest previous entry that recorded a gitHead (ignoring demo entries). */
function lastEntryGitHead() {
  if (!fs.existsSync(ENTRIES_DIR)) return null;
  const files = fs.readdirSync(ENTRIES_DIR).filter((f) => f.endsWith('.json')).sort().reverse();
  for (const f of files) {
    try {
      const entry = JSON.parse(fs.readFileSync(path.join(ENTRIES_DIR, f), 'utf8'));
      if (entry.demo) continue;
      if (entry.gitHead) return entry.gitHead;
    } catch { /* unreadable entry — skip */ }
  }
  return null;
}

const IGNORED_PREFIXES = ['drift-log/', '.compass-build/', 'node_modules/', '.next/'];

function isRelevantFile(rel) {
  return rel && !IGNORED_PREFIXES.some((p) => rel.startsWith(p));
}

/**
 * Changed files since the last ledger entry's commit, falling back to
 * "everything currently modified/untracked" when there is no baseline.
 */
function detectChangedFiles() {
  const files = new Set();
  const since = lastEntryGitHead();

  if (since) {
    const diff = git(`diff --name-only ${since}`);
    if (diff !== null) diff.split('\n').forEach((f) => f.trim() && files.add(f.trim()));
  }

  // Always include working-tree changes + untracked files.
  const status = git('status --porcelain');
  if (status !== null) {
    for (const line of status.split('\n')) {
      if (!line.trim()) continue;
      // porcelain: "XY path" (renames: "XY old -> new")
      const p = line.slice(3).split(' -> ').pop().trim().replace(/^"|"$/g, '');
      if (p) files.add(p);
    }
  }

  return [...files].filter(isRelevantFile).sort();
}

/** Kebab-case ui component names imported via @/components/ui/<name>. */
function detectComponentsUsed(targetFiles) {
  const used = new Set();
  const importRe = /from\s+['"]@\/components\/ui\/([\w-]+)['"]/g;
  for (const rel of targetFiles) {
    const abs = path.join(ROOT, rel);
    if (!fs.existsSync(abs) || !/\.(tsx|jsx|ts|js)$/.test(rel)) continue;
    let content;
    try { content = fs.readFileSync(abs, 'utf8'); } catch { continue; }
    let m;
    while ((m = importRe.exec(content)) !== null) used.add(m[1]);
  }
  return [...used].sort();
}

// ─── Validation (light, mirrors drift-log/schema.json) ──────────────────────

function validateEntry(entry) {
  const problems = [];
  for (const key of ['timestamp', 'designer', 'tool', 'compassVersion', 'source']) {
    if (typeof entry[key] !== 'string' || entry[key].length === 0) {
      problems.push(`"${key}" must be a non-empty string`);
    }
  }
  for (const key of ['targetFiles', 'componentsUsed', 'assumptions']) {
    if (!Array.isArray(entry[key])) problems.push(`"${key}" must be an array`);
  }
  if (Array.isArray(entry.assumptions)) {
    entry.assumptions.forEach((a, i) => {
      if (!a || typeof a.text !== 'string' || a.text.length === 0) {
        problems.push(`assumptions[${i}].text must be a non-empty string`);
      }
    });
  }
  return problems;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const interactive = !args.noInput && process.stdin.isTTY;

  console.log('\n🧭 compass log — recording this build session in the drift ledger\n');

  // Who / with what
  const designer = args.designer || git('config user.name') || 'unknown';
  const tool = args.tool || 'cursor';
  let compassVersion = '0.0.0';
  try {
    compassVersion = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')).version || compassVersion;
  } catch { /* keep default */ }

  // Source (Figma URL or prompt summary)
  let source = args.source;
  if (!source && interactive) {
    source = await readLineAnswer('  Source (Figma frame URL or one-line prompt summary): ');
  }
  source = source || 'unspecified';

  // Assumptions
  let assumptions = args.assume.map(parseAssumption);
  if (assumptions.length === 0 && interactive) {
    const lines = await readPastedBlock(
      '  Paste the "What I assumed" block below (one assumption per line).\n' +
      '  Prefix with a category if you like (styling: / spacing: / component-choice: /\n' +
      '  content: / behavior: / token:). Finish with an empty line:\n'
    );
    assumptions = lines.map(parseAssumption);
  }

  // Target files
  let targetFiles;
  if (args.files) {
    targetFiles = args.files.split(',').map((f) => f.trim()).filter(Boolean);
    console.log(`  Files (from --files): ${targetFiles.length}`);
  } else {
    targetFiles = detectChangedFiles();
    console.log(`  Files (auto-detected via git): ${targetFiles.length}`);
    if (targetFiles.length === 0) {
      console.log('    (nothing detected — pass --files a.tsx,b.tsx to record them explicitly)');
    }
  }

  const componentsUsed = detectComponentsUsed(targetFiles);
  const gitHead = git('rev-parse HEAD');

  const entry = {
    timestamp: new Date().toISOString(),
    designer,
    tool,
    compassVersion,
    source,
    targetFiles,
    componentsUsed,
    assumptions,
  };
  if (gitHead) entry.gitHead = gitHead;
  if (args.notes) entry.notes = args.notes;
  if (args.demo) entry.demo = true;

  const problems = validateEntry(entry);
  if (problems.length > 0) {
    console.error('\n  ✗ Entry failed validation:');
    problems.forEach((p) => console.error(`    - ${p}`));
    process.exit(1);
  }

  const stamp = entry.timestamp.replace(/[:.]/g, '-');
  const fileName = `${stamp}__${slugify(designer)}__${args.slug ? slugify(args.slug) : slugify(source)}.json`;
  fs.mkdirSync(ENTRIES_DIR, { recursive: true });
  const outPath = path.join(ENTRIES_DIR, fileName);
  fs.writeFileSync(outPath, JSON.stringify(entry, null, 2) + '\n');

  // Plain-English receipt
  console.log('\n  ✓ Logged to ' + path.relative(ROOT, outPath));
  console.log(`    designer:    ${designer}  (tool: ${tool}, compass ${compassVersion})`);
  console.log(`    source:      ${source}`);
  console.log(`    files:       ${targetFiles.length ? targetFiles.join(', ') : '(none recorded)'}`);
  console.log(`    components:  ${componentsUsed.length ? componentsUsed.join(', ') : '(none detected)'}`);
  console.log(`    assumptions: ${assumptions.length}`);
  if (entry.demo) console.log('    NOTE: marked as demo — Detect runs will ignore this entry.');
  console.log('\n  Next: score this build with');
  console.log(`    npm run audit:compliance -- --entry ${path.relative(ROOT, outPath)}\n`);
}

run().catch((err) => {
  console.error(`\n  ✗ compass log failed: ${err.message}\n`);
  process.exit(1);
});

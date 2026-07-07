#!/usr/bin/env node

/**
 * Compass CLI — distribution surface for the Compass design system (S3).
 *
 * Commands:
 *   compass init               scaffold Compass governance into the cwd project
 *   compass component <name>   print a component's ComponentMeta + spec path
 *   compass docs tokens        print the token reference
 *   compass migrate            pointer to the compass-migrate skill
 *   compass --help             this text
 *
 * Zero runtime dependencies beyond node built-ins. Source files resolve
 * relative to the package root (repo checkout or node_modules install) —
 * see cli/lib/paths.mjs.
 */

import fs from 'node:fs';

import { assertCompassRoot, srcPath } from './lib/paths.mjs';
import { loadMeta, listMetaNames } from './lib/meta-loader.mjs';
import { runInit } from './lib/init.mjs';

const HELP = `
compass — the Compass design system CLI

Usage:
  compass init [--dry-run]     Scaffold Compass governance into the current
                               project: token import guidance, .claude/specs,
                               .claude/skills, CLAUDE.md, audit scripts, and
                               the "audit" / "audit:compliance" npm scripts.
                               Idempotent; never overwrites differing files.
                               --dry-run prints the plan without writing.

  compass component <name>     Print the component's machine-readable meta
                               (purpose, variants, anti-patterns, tokens,
                               a11y, AI hints) and its spec path.
      --spec                   Dump the full spec markdown to stdout instead.
      --json                   Print the raw ComponentMeta as JSON.

  compass docs tokens          Print the master token reference
                               (.claude/specs/tokens/token-reference.md).

  compass migrate              Where the migration procedure lives and how to
                               run it (it is an agent skill, not a CLI action).

  compass --help               This text.

Source root: resolved relative to the installed package (or repo checkout).
`;

// ─── compass component ───────────────────────────────────────────────────────

function fmtList(label, arr, indent = '  ') {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  return [`${label}:`, ...arr.map((v) => `${indent}- ${v}`)];
}

function printMeta(meta) {
  const lines = [];
  lines.push(`${meta.name} — ${meta.category} (v${meta.version})`);
  lines.push('');
  lines.push(meta.purpose);
  lines.push('');
  lines.push(`spec:            ${meta.specPath ?? '(none)'} [${meta.specStatus}]`);
  lines.push(`primitiveSource: ${meta.primitiveSource}`);
  lines.push(`codeConnect:     ${meta.codeConnectStatus}`);
  if (Array.isArray(meta.variants) && meta.variants.length > 0) {
    lines.push('variants:');
    for (const v of meta.variants) {
      lines.push(`  ${v.prop}: ${v.values.join(' | ')}${v.default ? `  (default: ${v.default})` : ''}`);
    }
  }
  if (Array.isArray(meta.sizes) && meta.sizes.length > 0) lines.push(`sizes: ${meta.sizes.join(', ')}`);
  if (Array.isArray(meta.parentComponents) && meta.parentComponents.length > 0) lines.push(`parents:  ${meta.parentComponents.join(', ')}`);
  if (Array.isArray(meta.childComponents) && meta.childComponents.length > 0) lines.push(`children: ${meta.childComponents.join(', ')}`);
  if (Array.isArray(meta.tokens) && meta.tokens.length > 0) lines.push(`tokens: ${meta.tokens.join(', ')}`);
  lines.push('');
  lines.push(...fmtList('use cases', meta.useCases));
  if (Array.isArray(meta.antiPatterns) && meta.antiPatterns.length > 0) {
    lines.push('');
    lines.push('anti-patterns:');
    for (const ap of meta.antiPatterns) {
      lines.push(`  WRONG:   ${ap.wrong}`);
      lines.push(`  INSTEAD: ${ap.instead}`);
      lines.push(`  source:  ${ap.source}`);
      lines.push('');
    }
  }
  lines.push(...fmtList('a11y', meta.a11y));
  const h = meta.aiHints;
  if (h) {
    lines.push('');
    lines.push('ai hints:');
    for (const s of h.selectionCriteria ?? []) lines.push(`  when: ${s}`);
    for (const c of h.confusedWith ?? []) lines.push(`  vs ${c.component}: ${c.disambiguation}`);
    for (const r of h.compositionRules ?? []) lines.push(`  rule: ${r}`);
    if (h.source) lines.push(`  source: ${h.source}`);
  }
  console.log(lines.join('\n'));
}

async function cmdComponent(args) {
  const flags = new Set(args.filter((a) => a.startsWith('--')));
  const name = args.find((a) => !a.startsWith('--'));
  if (!name) {
    const names = listMetaNames();
    console.error('Usage: compass component <name> [--spec] [--json]');
    if (names.length > 0) console.error(`\nAvailable components:\n  ${names.join(', ')}`);
    return 1;
  }
  const meta = await loadMeta(name);

  if (flags.has('--spec')) {
    if (!meta.specPath) {
      console.error(`"${name}" has no spec (specStatus: ${meta.specStatus}). Meta is still available via: compass component ${name}`);
      return 1;
    }
    const abs = srcPath(meta.specPath);
    if (!fs.existsSync(abs)) {
      console.error(`Meta points at ${meta.specPath} but the file does not exist in the package.`);
      return 1;
    }
    process.stdout.write(fs.readFileSync(abs, 'utf8'));
    return 0;
  }

  if (flags.has('--json')) {
    console.log(JSON.stringify(meta, null, 2));
    return 0;
  }

  printMeta(meta);
  console.log(`\nFull spec: compass component ${name} --spec`);
  return 0;
}

// ─── compass docs ────────────────────────────────────────────────────────────

function cmdDocs(args) {
  const topic = args[0];
  if (topic !== 'tokens') {
    console.error('Usage: compass docs tokens');
    return 1;
  }
  const abs = srcPath('.claude', 'specs', 'tokens', 'token-reference.md');
  if (!fs.existsSync(abs)) {
    console.error(`Token reference not found at ${abs}.`);
    return 1;
  }
  process.stdout.write(fs.readFileSync(abs, 'utf8'));
  return 0;
}

// ─── compass migrate ─────────────────────────────────────────────────────────

function cmdMigrate() {
  console.log(`
compass migrate — pointer, not a command

Migration is an agent-driven procedure, not CLI logic. The skill IS the tool.

The full procedure lives at:
  .claude/skills/compass-migrate/SKILL.md
  (in this package: ${srcPath('.claude', 'skills', 'compass-migrate', 'SKILL.md')})

To run a migration:
  1. Run \`compass init\` in the target project (copies the skill in).
  2. Open the project with an agent — Claude Code or Cursor.
  3. Ask it to follow .claude/skills/compass-migrate/SKILL.md. The skill walks
     inventory → mapping → resolution → validation, with report templates and
     a validation checklist alongside it in the same folder.
`);
  return 0;
}

// ─── dispatch ────────────────────────────────────────────────────────────────

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);

  if (!cmd || cmd === '--help' || cmd === '-h' || cmd === 'help') {
    console.log(HELP);
    return 0;
  }

  assertCompassRoot();

  switch (cmd) {
    case 'init':
      return runInit({ dryRun: rest.includes('--dry-run') });
    case 'component':
      return cmdComponent(rest);
    case 'docs':
      return cmdDocs(rest);
    case 'migrate':
      return cmdMigrate();
    default:
      console.error(`Unknown command: ${cmd}\n${HELP}`);
      return 1;
  }
}

main().then(
  (code) => process.exit(code ?? 0),
  (err) => {
    console.error(`\ncompass: ${err.message}\n`);
    process.exit(1);
  },
);

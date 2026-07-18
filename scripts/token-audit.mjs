#!/usr/bin/env node

/**
 * Compass Token Audit Script
 *
 * Scans all TSX, JSX, and CSS files for token violations:
 *   - ERRORS: hardcoded hex colors, Tailwind color utilities (block commits)
 *   - WARNINGS: arbitrary spacing/sizing values (informational only)
 *
 * Usage: node scripts/token-audit.mjs
 * Exit:  0 = clean (or warnings only), 1 = errors found
 *
 * Exclusions: node_modules/, .next/, app/globals.css, scripts/,
 *             SVG files, comments, import statements
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// ─── Configuration ─────────────────────────────────────────────────────────

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const SCAN_EXTENSIONS = ['.tsx', '.jsx', '.css', '.ts', '.js'];

const EXCLUDE_DIRS = [
  'node_modules',
  '.next',
  '.git',
  'scripts',
  'public',
  'storybook-static',
  'dist',
  '_incoming', // compass-migrate foreign-source snapshot ONLY — never product code (see CLAUDE.md)
];

const EXCLUDE_FILES = [
  'app/globals.css',              // legitimately contains oklch values
  'tailwind.config.ts',          // config file, not component code
  'tailwind.config.js',
  'postcss.config.mjs',
  'postcss.config.js',
  'next.config.ts',
  'next.config.js',
  'eslint.config.mjs',
  'components/ui/slider.tsx',    // known: bg-white on thumb — fix in Phase 3 Tier 1 audit
];

// ─── Violation patterns ─────────────────────────────────────────────────────

// ERROR: Hardcoded hex colors in className strings or style props
// Matches: #abc, #abcd, #aabbcc, #aabbccdd
const HEX_COLOR_PATTERN = /#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;

// ERROR: Tailwind color scale utilities (not semantic token classes)
// Matches: bg-red-500, text-blue-700, border-gray-200, etc.
const TAILWIND_COLOR_SCALES = [
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime',
  'green', 'emerald', 'teal', 'cyan', 'sky',
  'blue', 'indigo', 'violet', 'purple', 'fuchsia',
  'pink', 'rose',
  'black', 'white',
];

const TAILWIND_COLOR_PREFIXES = ['bg', 'text', 'border', 'ring', 'fill', 'stroke', 'from', 'to', 'via', 'shadow', 'outline', 'decoration', 'caret', 'accent', 'placeholder'];

// Build regex: matches bg-red-500, text-gray-700, etc. (with scale step)
// Also matches bg-black, bg-white (no step)
const colorScalePattern = TAILWIND_COLOR_SCALES
  .map(color => {
    const withStep = `(?:${TAILWIND_COLOR_PREFIXES.join('|')})-${color}-\\d+`;
    const bare = ['black', 'white'].includes(color)
      ? `(?:${TAILWIND_COLOR_PREFIXES.join('|')})-${color}(?![\\w-])`
      : null;
    return bare ? `${withStep}|${bare}` : withStep;
  })
  .join('|');

// WARNING: Arbitrary values in Tailwind brackets
// Matches: p-[13px], gap-[22px], rounded-[7px], text-[15px], w-[240px], etc.
const ARBITRARY_VALUE_PATTERN = /\b[\w-]+-\[[\d.]+(?:px|rem|em|%|vh|vw)\]/g;

// WARNING: Raw pixel values in style objects
// Matches: padding: 13px, marginTop: '22px', fontSize: 15
const RAW_PIXEL_STYLE_PATTERN = /(?:padding|margin|gap|fontSize|borderRadius|width|height|top|left|right|bottom|inset)[A-Za-z]*\s*[:=]\s*['"]?\d+px['"]?/g;

// ─── Suggestions ─────────────────────────────────────────────────────────────

function suggestForHex(hex) {
  // Map common Acko hex values to their token names
  const knownTokens = {
    '#6841e6': 'text-primary / bg-primary',
    '#7a62f0': 'text-primary / bg-primary (dark)',
    '#fafafa': 'bg-background',
    '#0f0f10': 'bg-background (dark)',
    '#ffffff': 'bg-card / text-primary-foreground',
    '#000000': 'text-foreground',
    '#e5e5e5': 'border-border',
    '#242324': 'border-border (dark)',
    '#f5f5f5': 'bg-muted / bg-secondary / bg-accent',
    '#141414': 'bg-muted / bg-secondary (dark)',
    '#d4d4d4': 'border-input',
    '#333333': 'border-input (dark)',
    '#dc2626': 'bg-destructive / text-destructive',
    '#ef4444': 'bg-destructive / text-destructive (dark)',
  };
  const lower = hex.toLowerCase().replace(/ff$/, ''); // strip full alpha
  return knownTokens[lower] || 'Use a semantic token from specs/tokens/token-reference.md';
}

function suggestForTailwindColor(match) {
  if (match.startsWith('bg-')) {
    if (match.includes('red') || match.includes('rose')) return '→ Use `bg-destructive`';
    if (match.includes('gray') || match.includes('zinc') || match.includes('neutral') || match.includes('slate')) return '→ Use `bg-muted`, `bg-secondary`, or `bg-accent`';
    if (match.includes('purple') || match.includes('violet') || match.includes('indigo')) return '→ Use `bg-primary`';
    if (match.includes('white')) return '→ Use `bg-background` or `bg-card`';
    if (match.includes('black')) return '→ Use `bg-foreground`';
  }
  if (match.startsWith('text-')) {
    if (match.includes('red') || match.includes('rose')) return '→ Use `text-destructive`';
    if (match.includes('gray') || match.includes('zinc') || match.includes('neutral') || match.includes('slate')) return '→ Use `text-muted-foreground`';
    if (match.includes('purple') || match.includes('violet') || match.includes('indigo')) return '→ Use `text-primary`';
    if (match.includes('white')) return '→ Use `text-primary-foreground` or `text-background`';
    if (match.includes('black')) return '→ Use `text-foreground`';
  }
  if (match.startsWith('border-')) {
    return '→ Use `border-border`, `border-input`, or `border-destructive`';
  }
  return '→ Use a semantic token class from specs/foundations/color.md';
}

function suggestForArbitrary(match) {
  const value = match.match(/\[(\d+(?:\.\d+)?)(px|rem|em)\]/);
  if (!value) return '→ Use a Tailwind spacing scale class';
  const px = value[2] === 'px' ? parseFloat(value[1]) : parseFloat(value[1]) * 16;
  // Find nearest Tailwind spacing value (scale is multiples of 4, with halves)
  const scale = [0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 80, 96];
  const nearest = scale.reduce((a, b) => Math.abs(b - px) < Math.abs(a - px) ? b : a);
  const tailwindValue = nearest / 4;
  const formattedValue = tailwindValue % 1 === 0 ? tailwindValue : tailwindValue.toFixed(1).replace('.0', '');
  const prefix = match.split('-[')[0];
  return `→ Use \`${prefix}-${formattedValue}\` (${nearest}px) — see specs/foundations/spacing.md`;
}

// ─── File scanner ─────────────────────────────────────────────────────────────

function shouldExclude(filePath) {
  const rel = path.relative(ROOT, filePath).replace(/\\/g, '/');

  // Check excluded directories
  for (const dir of EXCLUDE_DIRS) {
    if (rel.startsWith(dir + '/') || rel === dir) return true;
  }

  // Check excluded files
  for (const file of EXCLUDE_FILES) {
    if (rel === file) return true;
  }

  return false;
}

function stripComments(content) {
  // Remove single-line comments
  let stripped = content.replace(/\/\/.*$/gm, '');
  // Remove multi-line comments
  stripped = stripped.replace(/\/\*[\s\S]*?\*\//g, '');
  return stripped;
}

function stripImports(content) {
  return content.replace(/^import\s+.*$/gm, '');
}

function getAllFiles(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!EXCLUDE_DIRS.includes(entry.name)) {
        getAllFiles(fullPath, results);
      }
    } else if (SCAN_EXTENSIONS.includes(path.extname(entry.name))) {
      if (!shouldExclude(fullPath)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

function scanFile(filePath) {
  const violations = [];
  const raw = fs.readFileSync(filePath, 'utf8');
  const content = stripImports(stripComments(raw));
  const lines = content.split('\n');
  const rawLines = raw.split('\n');

  lines.forEach((line, i) => {
    const lineNum = i + 1;
    const rawLine = rawLines[i] || '';

    // Skip comment lines in raw
    if (rawLine.trim().startsWith('//') || rawLine.trim().startsWith('*')) return;
    // Skip import lines
    if (rawLine.trim().startsWith('import ') || rawLine.trim().startsWith('from ')) return;

    // ERROR: Hardcoded hex colors
    let match;
    const hexRe = new RegExp(HEX_COLOR_PATTERN.source, 'g');
    while ((match = hexRe.exec(line)) !== null) {
      // Skip if inside a CSS variable definition line (globals.css excluded anyway)
      if (line.includes('--acko-') || line.includes('oklch(')) continue;
      // Skip hex values inside CSS attribute selectors, e.g. [stroke='#ccc']
      // These are used to target recharts SVG defaults, not to apply colors
      if (match.index > 0) {
        const prevChar = line[match.index - 1];
        if (prevChar === "'" || prevChar === '"') continue;
      }
      violations.push({
        type: 'ERROR',
        line: lineNum,
        col: match.index + 1,
        message: `Hardcoded color \`${match[0]}\` found`,
        suggestion: suggestForHex(match[0]),
      });
    }

    // ERROR: Tailwind color scale utilities
    const tailwindRe = new RegExp(colorScalePattern, 'g');
    while ((match = tailwindRe.exec(line)) !== null) {
      // Skip: opacity-modified black/white (e.g. bg-black/80, bg-white/10)
      // These are legitimate overlay/transparency patterns, not raw color utilities
      const charAfter = line[match.index + match[0].length];
      if (charAfter === '/') continue;

      violations.push({
        type: 'ERROR',
        line: lineNum,
        col: match.index + 1,
        message: `Tailwind color utility \`${match[0]}\` bypasses token system`,
        suggestion: suggestForTailwindColor(match[0]),
      });
    }

    // WARNING: Arbitrary bracket values
    const arbRe = new RegExp(ARBITRARY_VALUE_PATTERN.source, 'g');
    while ((match = arbRe.exec(line)) !== null) {
      violations.push({
        type: 'WARNING',
        line: lineNum,
        col: match.index + 1,
        message: `Arbitrary value \`${match[0]}\` — prefer spacing scale`,
        suggestion: suggestForArbitrary(match[0]),
      });
    }

    // WARNING: Raw pixel values in style props
    const rawPixelRe = new RegExp(RAW_PIXEL_STYLE_PATTERN.source, 'g');
    while ((match = rawPixelRe.exec(line)) !== null) {
      violations.push({
        type: 'WARNING',
        line: lineNum,
        col: match.index + 1,
        message: `Raw pixel value \`${match[0]}\` in style prop — prefer Tailwind class`,
        suggestion: '→ Use a Tailwind utility class instead of inline style',
      });
    }
  });

  return violations;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function run() {
  console.log('\n🧭 Compass Token Audit\n');

  const files = getAllFiles(ROOT);
  let totalErrors = 0;
  let totalWarnings = 0;
  let filesWithViolations = 0;

  for (const filePath of files) {
    const violations = scanFile(filePath);
    if (violations.length === 0) continue;

    filesWithViolations++;
    const rel = path.relative(ROOT, filePath);
    const errors = violations.filter(v => v.type === 'ERROR');
    const warnings = violations.filter(v => v.type === 'WARNING');
    totalErrors += errors.length;
    totalWarnings += warnings.length;

    console.log(`\n  ${rel}`);
    for (const v of violations) {
      const icon = v.type === 'ERROR' ? '✗' : '⚠';
      const label = v.type === 'ERROR' ? 'ERROR  ' : 'WARNING';
      console.log(`    ${icon} ${label}  line ${v.line}`);
      console.log(`           ${v.message}`);
      console.log(`           ${v.suggestion}`);
    }
  }

  // Summary
  console.log('\n' + '─'.repeat(50));
  console.log('  Token Audit Complete');
  console.log(`  Files scanned:     ${files.length}`);
  console.log(`  Files with issues: ${filesWithViolations}`);
  console.log(`  Errors:            ${totalErrors}`);
  console.log(`  Warnings:          ${totalWarnings}`);
  console.log('─'.repeat(50));

  if (totalErrors > 0) {
    console.log('\n  ✗ Audit failed. Fix all errors before committing.\n');
    console.log('  Errors block commits. Warnings are informational.\n');
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log('\n  ⚠ Audit passed with warnings. Review when possible.\n');
    process.exit(0);
  } else {
    console.log('\n  ✓ Audit passed. No violations found.\n');
    process.exit(0);
  }
}

run();

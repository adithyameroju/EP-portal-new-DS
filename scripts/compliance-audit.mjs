#!/usr/bin/env node

/**
 * Compass Compliance Audit — Score step of the S4 audit loop.
 *
 * ADDITIVE to scripts/token-audit.mjs (which stays untouched as the commit
 * gate). This script is the *behavioral* audit: it grades a build (or the
 * whole repo) against the Compass compliance rubric and emits a machine-
 * readable report the dashboard + Detect step consume.
 *
 * Checks implemented now (no meta.ts dependency):
 *   C1  token discipline   — hex colors (error), Tailwind color utils (error),
 *                            arbitrary values TIERED: spacing/radius/typography
 *                            arbitraries = error, pure layout dims (w-[220px])
 *                            = warning; raw px in style props = warning
 *   C5  naming convention  — kebab-case files/dirs in app/, components/,
 *                            hooks/, lib/, stories/ (error)
 *   C6  import hygiene     — ui primitives must be imported from
 *                            "@/components/ui/..." (relative reach-ins and
 *                            locally copied/shadowed primitives = error)
 *
 * Gated on S1 meta.ts (designed, NOT implemented — see
 * .compass-build/design/s4/): C2 provenance, C3 composite completeness,
 * C4 spec coverage.
 *
 * Scoring: scripts/audit-rubric.json (owner-tunable weights).
 * By owner decision (2026-07-06): components/ui/ is EXCLUDED from compliance
 * scoring — the compliance audit grades feature builds, not stock primitives.
 *
 * Usage:
 *   node scripts/compliance-audit.mjs                    # whole repo (minus components/ui/)
 *   node scripts/compliance-audit.mjs a.tsx b.tsx        # explicit files
 *   node scripts/compliance-audit.mjs --entry drift-log/entries/<e>.json
 *                                                        # score one logged build
 *   node scripts/compliance-audit.mjs --parity           # self-test: replicate
 *                                       token-audit.mjs behavior exactly (C1
 *                                       legacy severities, components/ui/
 *                                       included) to prove the C1 port is true
 *   --no-report                                          # skip writing JSON report
 *
 * Exit: 0 = no errors (warnings allowed), 1 = errors found.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPORTS_DIR = path.join(ROOT, 'drift-log', 'reports');
const RUBRIC_PATH = path.join(ROOT, 'scripts', 'audit-rubric.json');

// ─── Scope configuration ─────────────────────────────────────────────────────

const SCAN_EXTENSIONS = ['.tsx', '.jsx', '.css', '.ts', '.js'];
const CODE_EXTENSIONS = ['.tsx', '.jsx', '.ts', '.js', '.mjs'];

// Parity mode mirrors token-audit.mjs's exact directory scope; compliance mode
// additionally skips loop-internal and tooling folders.
const EXCLUDE_DIRS_LEGACY = [
  'node_modules', '.next', '.git', 'scripts', 'public',
];
const EXCLUDE_DIRS_COMPLIANCE = [
  ...EXCLUDE_DIRS_LEGACY,
  'drift-log', '.compass-build', '.storybook',
];

// Same config-file exclusions as token-audit.mjs.
const EXCLUDE_FILES = [
  'app/globals.css',
  'tailwind.config.ts',
  'tailwind.config.js',
  'postcss.config.mjs',
  'postcss.config.js',
  'next.config.ts',
  'next.config.js',
  'eslint.config.mjs',
];

// token-audit carries this known exception; parity mode must match it.
const PARITY_EXTRA_EXCLUDES = ['components/ui/slider.tsx'];

// Owner decision: primitives are system-owned, not graded by the compliance audit.
const COMPLIANCE_EXTRA_EXCLUDES_DIRS = ['components/ui'];

// C5/C6 apply to designer-build territory (code-connect mapping files and
// config files are not build output).
const BUILD_AREA_DIRS = ['app', 'components', 'hooks', 'lib', 'stories'];

// ─── C1 patterns (ported from token-audit.mjs — keep in sync) ───────────────

const HEX_COLOR_PATTERN = /#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g;

const TAILWIND_COLOR_SCALES = [
  'slate', 'gray', 'zinc', 'neutral', 'stone',
  'red', 'orange', 'amber', 'yellow', 'lime',
  'green', 'emerald', 'teal', 'cyan', 'sky',
  'blue', 'indigo', 'violet', 'purple', 'fuchsia',
  'pink', 'rose',
  'black', 'white',
];
const TAILWIND_COLOR_PREFIXES = ['bg', 'text', 'border', 'ring', 'fill', 'stroke', 'from', 'to', 'via', 'shadow', 'outline', 'decoration', 'caret', 'accent', 'placeholder'];

const colorScalePattern = TAILWIND_COLOR_SCALES
  .map((color) => {
    const withStep = `(?:${TAILWIND_COLOR_PREFIXES.join('|')})-${color}-\\d+`;
    const bare = ['black', 'white'].includes(color)
      ? `(?:${TAILWIND_COLOR_PREFIXES.join('|')})-${color}(?![\\w-])`
      : null;
    return bare ? `${withStep}|${bare}` : withStep;
  })
  .join('|');

const ARBITRARY_VALUE_PATTERN = /\b[\w-]+-\[[\d.]+(?:px|rem|em|%|vh|vw)\]/g;
const RAW_PIXEL_STYLE_PATTERN = /(?:padding|margin|gap|fontSize|borderRadius|width|height|top|left|right|bottom|inset)[A-Za-z]*\s*[:=]\s*['"]?\d+px['"]?/g;

// C1 tiering: which arbitrary-value prefixes are *layout dimensions* (warn)
// vs spacing/radius/typography (error). Anything unknown stays a warning
// (conservative — never invent severity).
const LAYOUT_DIM_PREFIXES = new Set([
  'w', 'h', 'size', 'min-w', 'max-w', 'min-h', 'max-h',
  'top', 'left', 'right', 'bottom', 'inset', 'inset-x', 'inset-y',
  'translate-x', 'translate-y', 'basis', 'flex',
]);
const SPACING_LIKE_PREFIXES = new Set([
  'p', 'px', 'py', 'pt', 'pr', 'pb', 'pl',
  'm', 'mx', 'my', 'mt', 'mr', 'mb', 'ml',
  'gap', 'gap-x', 'gap-y', 'space-x', 'space-y',
  'text', 'leading', 'tracking', 'indent',
]);
const RADIUS_PREFIX_RE = /^rounded(-[a-z]+)*$/;

// ─── Suggestions (ported from token-audit.mjs) ──────────────────────────────

function suggestForHex(hex) {
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
  const lower = hex.toLowerCase().replace(/ff$/, '');
  return knownTokens[lower] || 'Use a semantic token — see .claude/specs/tokens/token-reference.md';
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
  return '→ Use a semantic token class — see .claude/specs/foundations/color.md';
}

function suggestForArbitrary(match) {
  const value = match.match(/\[(\d+(?:\.\d+)?)(px|rem|em)\]/);
  if (!value) return '→ Use a Tailwind spacing scale class';
  const px = value[2] === 'px' ? parseFloat(value[1]) : parseFloat(value[1]) * 16;
  const scale = [0, 1, 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 80, 96];
  const nearest = scale.reduce((a, b) => (Math.abs(b - px) < Math.abs(a - px) ? b : a));
  const tailwindValue = nearest / 4;
  const formattedValue = tailwindValue % 1 === 0 ? tailwindValue : tailwindValue.toFixed(1).replace('.0', '');
  const prefix = match.split('-[')[0];
  return `→ Use \`${prefix}-${formattedValue}\` (${nearest}px) — see .claude/specs/foundations/spacing.md`;
}

// ─── ui primitive registry (for C6 + component attribution) ─────────────────

function loadUiPrimitives() {
  const dir = path.join(ROOT, 'components', 'ui');
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => /\.(tsx|jsx)$/.test(f))
    .map((f) => f.replace(/\.(tsx|jsx)$/, ''));
}

const UI_PRIMITIVES = loadUiPrimitives();

function kebabToPascal(name) {
  return name.split('-').map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
}

// Longest-first so <ToggleGroupItem> attributes to toggle-group, not toggle.
const PRIMITIVE_PASCAL = UI_PRIMITIVES
  .map((k) => ({ kebab: k, pascal: kebabToPascal(k) }))
  .sort((a, b) => b.pascal.length - a.pascal.length);

/** Heuristic: attribute a finding to the ui component whose JSX tag is on the line. */
function attributeComponent(line) {
  for (const { kebab, pascal } of PRIMITIVE_PASCAL) {
    if (line.includes(`<${pascal}`)) return kebab;
  }
  return null;
}

// ─── File walking ────────────────────────────────────────────────────────────

function relOf(filePath) {
  return path.relative(ROOT, filePath).replace(/\\/g, '/');
}

function shouldExclude(filePath, { parity }) {
  const rel = relOf(filePath);
  const excludeDirs = parity ? EXCLUDE_DIRS_LEGACY : EXCLUDE_DIRS_COMPLIANCE;
  for (const dir of excludeDirs) {
    if (rel.startsWith(dir + '/') || rel === dir) return true;
  }
  if (EXCLUDE_FILES.includes(rel)) return true;
  if (parity) {
    if (PARITY_EXTRA_EXCLUDES.includes(rel)) return true;
  } else {
    for (const dir of COMPLIANCE_EXTRA_EXCLUDES_DIRS) {
      if (rel.startsWith(dir + '/')) return true;
    }
  }
  return false;
}

function getAllFiles(dir, mode, results = []) {
  const excludeDirs = mode.parity ? EXCLUDE_DIRS_LEGACY : EXCLUDE_DIRS_COMPLIANCE;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!excludeDirs.includes(entry.name)) getAllFiles(fullPath, mode, results);
    } else if (SCAN_EXTENSIONS.includes(path.extname(entry.name))) {
      if (!shouldExclude(fullPath, mode)) results.push(fullPath);
    }
  }
  return results;
}

function stripComments(content) {
  return content.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
}

function stripImports(content) {
  return content.replace(/^import\s+.*$/gm, '');
}

// ─── C1: token discipline ────────────────────────────────────────────────────

function checkC1(filePath, raw, { parity }) {
  const findings = [];
  const content = stripImports(stripComments(raw));
  const lines = content.split('\n');
  const rawLines = raw.split('\n');

  lines.forEach((line, i) => {
    const lineNum = i + 1;
    const rawLine = rawLines[i] || '';
    if (rawLine.trim().startsWith('//') || rawLine.trim().startsWith('*')) return;
    if (rawLine.trim().startsWith('import ') || rawLine.trim().startsWith('from ')) return;

    let match;

    // Hardcoded hex colors
    const hexRe = new RegExp(HEX_COLOR_PATTERN.source, 'g');
    while ((match = hexRe.exec(line)) !== null) {
      if (line.includes('--acko-') || line.includes('oklch(')) continue;
      if (match.index > 0) {
        const prevChar = line[match.index - 1];
        if (prevChar === "'" || prevChar === '"') continue; // attr selectors e.g. [stroke='#ccc']
      }
      findings.push({
        ruleId: 'C1-hex', level: 'error', line: lineNum,
        message: `Hardcoded color \`${match[0]}\``,
        suggestion: suggestForHex(match[0]),
        component: attributeComponent(line),
      });
    }

    // Tailwind color-scale utilities
    const twRe = new RegExp(colorScalePattern, 'g');
    while ((match = twRe.exec(line)) !== null) {
      const charAfter = line[match.index + match[0].length];
      if (charAfter === '/') continue; // opacity overlays: bg-black/80
      findings.push({
        ruleId: 'C1-tw-color', level: 'error', line: lineNum,
        message: `Tailwind color utility \`${match[0]}\` bypasses the token system`,
        suggestion: suggestForTailwindColor(match[0]),
        component: attributeComponent(line),
      });
    }

    // Arbitrary bracket values — tiered (legacy: all warnings, for parity)
    const arbRe = new RegExp(ARBITRARY_VALUE_PATTERN.source, 'g');
    while ((match = arbRe.exec(line)) !== null) {
      const prefix = match[0].split('-[')[0].replace(/^-/, '');
      let level = 'warning';
      let ruleId = 'C1-arbitrary-layout';
      if (!parity) {
        if (SPACING_LIKE_PREFIXES.has(prefix) || RADIUS_PREFIX_RE.test(prefix)) {
          level = 'error';
          ruleId = 'C1-arbitrary-value';
        } else if (!LAYOUT_DIM_PREFIXES.has(prefix)) {
          ruleId = 'C1-arbitrary-other'; // unknown prefix — stay a warning
        }
      } else {
        ruleId = 'C1-arbitrary';
      }
      findings.push({
        ruleId, level, line: lineNum,
        message: level === 'error'
          ? `Arbitrary ${RADIUS_PREFIX_RE.test(prefix) ? 'radius' : 'spacing/type'} value \`${match[0]}\` — use the scale`
          : `Arbitrary value \`${match[0]}\` — prefer a scale/token if one fits`,
        suggestion: suggestForArbitrary(match[0]),
        component: attributeComponent(line),
      });
    }

    // Raw px in style objects
    const rawPxRe = new RegExp(RAW_PIXEL_STYLE_PATTERN.source, 'g');
    while ((match = rawPxRe.exec(line)) !== null) {
      findings.push({
        ruleId: 'C1-raw-style', level: 'warning', line: lineNum,
        message: `Raw pixel value \`${match[0]}\` in style prop`,
        suggestion: '→ Use a Tailwind utility class instead of inline style',
        component: attributeComponent(line),
      });
    }
  });

  return findings;
}

// ─── C5: naming convention (kebab-case) ──────────────────────────────────────

const KEBAB_SEGMENT = /^[a-z0-9]+(-[a-z0-9]+)*$/;
// Next.js App Router conventions that are allowed as directory names.
const NEXT_DIR_CONVENTION = /^(\([a-z0-9-]+\)|\[{1,2}\.{0,3}[a-zA-Z0-9-]+\]{1,2}|@[a-z0-9-]+|_[a-z0-9-]+)$/;

function isKebabFileName(base) {
  // optional leading underscore on the first segment (e.g. _meta-schema.ts),
  // then dot-separated kebab segments (e.g. button.figma.tsx, vitest.shims.d.ts)
  const noUnderscore = base.startsWith('_') ? base.slice(1) : base;
  return noUnderscore.split('.').every((seg) => KEBAB_SEGMENT.test(seg));
}

function isAllowedDirName(name) {
  return KEBAB_SEGMENT.test(name) || NEXT_DIR_CONVENTION.test(name);
}

/** C5 over explicit paths (entry/files mode): validate each path's segments. */
function checkC5Paths(relPaths) {
  const findings = [];
  const seenDirs = new Set();
  for (const rel of relPaths) {
    if (!BUILD_AREA_DIRS.includes(rel.split('/')[0])) continue;
    if (!CODE_EXTENSIONS.includes(path.extname(rel)) && !rel.endsWith('.css')) continue;
    const segments = rel.split('/');
    const base = segments.pop();
    // directories
    let acc = '';
    for (const seg of segments) {
      acc = acc ? `${acc}/${seg}` : seg;
      if (seenDirs.has(acc)) continue;
      seenDirs.add(acc);
      if (!isAllowedDirName(seg)) {
        findings.push({
          ruleId: 'C5-naming', level: 'error', file: acc, line: 0,
          message: `Directory \`${seg}\` is not kebab-case`,
          suggestion: `→ Rename to \`${seg.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}\` (kebab-case; would have caught the KPI \`settings/\` drift)`,
          component: null,
        });
      }
    }
    // file
    if (!isKebabFileName(base)) {
      findings.push({
        ruleId: 'C5-naming', level: 'error', file: rel, line: 0,
        message: `File \`${base}\` is not kebab-case`,
        suggestion: `→ Rename to \`${base.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}\``,
        component: null,
      });
    }
  }
  return findings;
}

// ─── C6: import hygiene ──────────────────────────────────────────────────────

// import ... from '<source>'  /  export ... from '<source>'
const IMPORT_SOURCE_RE = /(?:^|\n)\s*(?:import|export)\s[^;'"]*from\s+['"]([^'"]+)['"]/g;

function checkC6(rel, raw) {
  const findings = [];
  if (!CODE_EXTENSIONS.includes(path.extname(rel))) return findings;

  // (a) reach-ins: ui primitives imported via a relative or non-alias path
  let m;
  const re = new RegExp(IMPORT_SOURCE_RE.source, 'g');
  while ((m = re.exec(raw)) !== null) {
    const source = m[1];
    if (source.startsWith('@/components/ui/')) continue; // the one right way
    const isRelativeUi = source.startsWith('.') && /(^|\/)ui\/[\w-]+$/.test(source)
      && UI_PRIMITIVES.includes(source.split('/').pop());
    const isBareUi = !source.startsWith('.') && !source.startsWith('@/') && source.includes('components/ui/');
    if (isRelativeUi || isBareUi) {
      const lineNum = raw.slice(0, m.index).split('\n').length;
      findings.push({
        ruleId: 'C6-import-path', level: 'error', line: lineNum,
        message: `ui primitive imported via \`${source}\` instead of the \`@/components/ui/\` alias`,
        suggestion: `→ import from \`@/components/ui/${source.split('/').pop()}\``,
        component: UI_PRIMITIVES.includes(source.split('/').pop()) ? source.split('/').pop() : null,
      });
    }
  }

  // (b) copied/shadowed primitive: a component file outside components/ui/
  //     whose name is exactly a ui primitive's name
  const base = path.basename(rel).replace(/\.(tsx|jsx)$/, '');
  if (/\.(tsx|jsx)$/.test(rel)
    && !rel.startsWith('components/ui/')
    && !rel.startsWith('code-connect/')
    && UI_PRIMITIVES.includes(base)) {
    findings.push({
      ruleId: 'C6-shadow-primitive', level: 'error', line: 0,
      message: `\`${rel}\` shadows the Compass primitive \`${base}\` — looks like a copied/re-implemented primitive`,
      suggestion: `→ Delete the copy and import { ... } from \`@/components/ui/${base}\``,
      component: base,
    });
  }

  return findings;
}

// ─── Scoring ─────────────────────────────────────────────────────────────────

function loadRubric() {
  try {
    return JSON.parse(fs.readFileSync(RUBRIC_PATH, 'utf8'));
  } catch {
    return { startScore: 100, errorWeight: 5, warningWeight: 1, floor: 0 };
  }
}

function scoreOf(errors, warnings, rubric) {
  const raw = rubric.startScore - rubric.errorWeight * errors - rubric.warningWeight * warnings;
  return Math.max(rubric.floor, raw);
}

// ─── Main ────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { files: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--parity') args.parity = true;
    else if (a === '--no-report') args.noReport = true;
    else if (a === '--entry') args.entry = argv[++i];
    else if (!a.startsWith('--')) args.files.push(a);
  }
  return args;
}

function run() {
  const args = parseArgs(process.argv.slice(2));
  const mode = { parity: !!args.parity };
  const rubric = loadRubric();

  let scanFiles;
  let scopeLabel;
  let entryRel = null;
  let modeName;

  if (args.entry) {
    modeName = 'entry';
    entryRel = relOf(path.resolve(ROOT, args.entry));
    const entryAbs = path.resolve(ROOT, args.entry);
    if (!fs.existsSync(entryAbs)) {
      console.error(`\n  ✗ Ledger entry not found: ${args.entry}\n`);
      process.exit(1);
    }
    const entry = JSON.parse(fs.readFileSync(entryAbs, 'utf8'));
    scopeLabel = path.basename(entryAbs, '.json').split('__').pop() || 'entry';
    scanFiles = (entry.targetFiles || [])
      .map((f) => path.resolve(ROOT, f))
      .filter((f) => fs.existsSync(f) && SCAN_EXTENSIONS.includes(path.extname(f)))
      .filter((f) => !shouldExclude(f, mode));
  } else if (args.files.length > 0) {
    modeName = 'files';
    scopeLabel = 'files';
    scanFiles = args.files
      .map((f) => path.resolve(ROOT, f))
      .filter((f) => fs.existsSync(f) && SCAN_EXTENSIONS.includes(path.extname(f)))
      .filter((f) => !shouldExclude(f, mode));
  } else {
    modeName = mode.parity ? 'parity' : 'repo';
    scopeLabel = modeName;
    scanFiles = getAllFiles(ROOT, mode);
  }

  console.log(`\n🧭 Compass Compliance Audit — mode: ${modeName}${mode.parity ? ' (token-audit replication self-test)' : ''}\n`);

  const findings = [];
  for (const abs of scanFiles) {
    const rel = relOf(abs);
    const raw = fs.readFileSync(abs, 'utf8');
    for (const f of checkC1(abs, raw, mode)) findings.push({ ...f, file: rel });
    if (!mode.parity) {
      for (const f of checkC6(rel, raw)) findings.push({ ...f, file: rel });
    }
  }
  if (!mode.parity) {
    findings.push(...checkC5Paths(scanFiles.map(relOf)));
  }

  // ── Aggregate
  const errors = findings.filter((f) => f.level === 'error');
  const warnings = findings.filter((f) => f.level === 'warning');
  const byRule = {};
  const perFile = {};
  const perComponent = {};
  for (const f of findings) {
    byRule[f.ruleId] = (byRule[f.ruleId] || 0) + 1;
    const pf = (perFile[f.file] ||= { errors: 0, warnings: 0 });
    pf[f.level === 'error' ? 'errors' : 'warnings']++;
    if (f.component) {
      const pc = (perComponent[f.component] ||= { errors: 0, warnings: 0 });
      pc[f.level === 'error' ? 'errors' : 'warnings']++;
    }
  }
  for (const file of Object.keys(perFile)) {
    perFile[file].score = scoreOf(perFile[file].errors, perFile[file].warnings, rubric);
  }
  const score = scoreOf(errors.length, warnings.length, rubric);

  // ── Console output
  const byFile = {};
  for (const f of findings) (byFile[f.file] ||= []).push(f);
  for (const [file, fList] of Object.entries(byFile)) {
    console.log(`\n  ${file}`);
    for (const f of fList.sort((a, b) => a.line - b.line)) {
      const icon = f.level === 'error' ? '✗' : '⚠';
      console.log(`    ${icon} ${f.level.toUpperCase().padEnd(7)} ${f.ruleId.padEnd(20)} ${f.line ? `line ${f.line}` : ''}`);
      console.log(`           ${f.message}`);
      console.log(`           ${f.suggestion}`);
    }
  }

  console.log('\n' + '─'.repeat(56));
  console.log('  Compliance Audit Complete');
  console.log(`  Mode:              ${modeName}`);
  console.log(`  Files scanned:     ${scanFiles.length}`);
  console.log(`  Errors:            ${errors.length}`);
  console.log(`  Warnings:          ${warnings.length}`);
  if (!mode.parity) {
    console.log(`  Compliance score:  ${score} / ${rubric.startScore}`);
  }
  if (Object.keys(byRule).length > 0) {
    console.log(`  By rule:           ${Object.entries(byRule).map(([r, n]) => `${r}×${n}`).join(', ')}`);
  }
  console.log('─'.repeat(56));

  // ── JSON report (skip in parity mode — it's a self-test, not build evidence)
  if (!args.noReport && !mode.parity) {
    const report = {
      generatedAt: new Date().toISOString(),
      mode: modeName,
      scope: scopeLabel,
      entry: entryRel,
      rubric,
      checks: {
        implemented: ['C1', 'C5', 'C6'],
        pending_s1: ['C2', 'C3', 'C4'],
      },
      filesScanned: scanFiles.length,
      totals: { errors: errors.length, warnings: warnings.length, byRule },
      score,
      perFile,
      perComponent,
      findings,
    };
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
    const stamp = report.generatedAt.replace(/[:.]/g, '-');
    const outPath = path.join(REPORTS_DIR, `${stamp}__${scopeLabel}.json`);
    fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + '\n');
    console.log(`\n  Report: ${relOf(outPath)}`);
    console.log('  Dashboard: npm run dashboard (regenerates drift-log/dashboard.html)');
  }

  if (errors.length > 0) {
    console.log('\n  ✗ Compliance errors found. This audit is advisory (token-audit remains the commit gate).\n');
    process.exit(1);
  }
  console.log(`\n  ${warnings.length > 0 ? '⚠ Passed with warnings.' : '✓ Clean.'}\n`);
  process.exit(0);
}

run();

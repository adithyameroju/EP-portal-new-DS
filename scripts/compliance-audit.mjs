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
 *   C8  invented motion    — bespoke motion/effects outside the Compass motion
 *                            system (*.module.css files, custom @keyframes, and
 *                            non-system animation refs in CSS + inline-style TSX)
 *                            = WARNING (advisory per owner ruling #10 — never an
 *                            error). Never flags app/globals.css, the @acko
 *                            tokens package, tw-animate-css, node_modules, or
 *                            components/ui. Sanctioned names come from the motion
 *                            spec presets + Tailwind/tw-animate-css built-ins;
 *                            extend via audit-rubric.json ("c8.systemAnimations").
 *
 * Meta-driven checks (live since S1; resolve against components/ui/*.meta.ts
 * via the transpiling loader — meta files are never modified by this script):
 *   C2  provenance         — raw <button>/<input>/<select>/<textarea>/<table>
 *                            where a Compass primitive exists (error; element
 *                            map DERIVED at runtime, see deriveElementMap);
 *                            div/span genuinely RE-IMPLEMENTING a primitive
 *                            (warning). The shape-match tier requires component-
 *                            specific signature tokens (generic surface/layout/
 *                            focus utilities are filtered out) PLUS structural
 *                            evidence — a matching ARIA role or ≥2 interactive
 *                            children — or a strong ≥3-token signature. Bare
 *                            co-occurrence of a couple of common tokens does not
 *                            fire (de-noised 2026-07-19).
 *   C3  composite completeness — composite rendered with children but none of
 *                            its meta childComponents used (kept uniform WARNING
 *                            per owner ruling 2026-07-07: the compliance audit is
 *                            advisory (rule #10 — token-audit is the only gate);
 *                            required-ness varies per sub-part and is not in meta,
 *                            so an ERROR tier would false-positive)
 *   C4  spec coverage      — ui component used whose meta has no spec
 *                            (warning; the S6.3 demand-driven backfill signal)
 *
 * Project-level check (repo mode only; no meta.ts dependency):
 *   C7a font declaration consistency — every non-system font family the token
 *                            layer declares (--font-* in
 *                            node_modules/@acko/enterprise-tokens/globals.css)
 *                            must be registered by an @font-face under that
 *                            EXACT name in app/*.css (error — the S0 silent-
 *                            fallback failure); weights listed in the
 *                            typography spec but hosted by no face = warning.
 *                            Severities owner-tunable via audit-rubric.json
 *                            ("c7a"). Built per owner grant (STATE.md DECISION
 *                            LOG 2026-07-07). Runs in repo mode only: it grades
 *                            the project's font wiring, not a designer's build,
 *                            so entry/files scores are unaffected.
 *
 * Design-only (NOT implemented): C7b paint-level font probe (Playwright) —
 * .compass-build/design/s4/c7-font-compliance.PROPOSED.md. Trigger policy RULED
 * 2026-07-07: on-demand only, NOT gated, and BUILD DEFERRED — C7a (static, here)
 * + Chromatic (visual) cover the failure mode; build C7b only if a paint bug
 * ever slips past them.
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
  'storybook-static', // generated Storybook build output (synced from token-audit, S5 2026-07-07)
  'dist', // generated package bundle (synced from token-audit, S3 2026-07-07)
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

// ─── C7a: font declaration consistency (static tier of C7) ──────────────────
//
// The S0 failure this catches: tokens declared `"Euclid Circular B"` while no
// @font-face registered that exact family name — audit/tsc/lint all green,
// every screen silently painted in the system fallback. Pure file analysis;
// C7b (rendered-DOM probe) stays design-only — trigger policy ruled 2026-07-07:
// on-demand only, not gated, build deferred (C7a + Chromatic cover the rest).

const TOKENS_CSS_REL = 'node_modules/@acko/enterprise-tokens/globals.css';
const TYPOGRAPHY_SPEC_REL = '.claude/specs/foundations/typography.md';

// Fallbacks if rubric.c7a is absent — the rubric copy is the tunable one.
const C7A_DEFAULTS = {
  missingFamilySeverity: 'error',
  weightGapSeverity: 'warning',
  systemFamilies: [
    'system-ui', 'ui-sans-serif', 'ui-serif', 'ui-monospace', 'ui-rounded',
    '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto',
    'Helvetica Neue', 'Helvetica', 'Arial', 'Georgia', 'Times New Roman',
    'Times', 'Courier New', 'Courier',
    'sans-serif', 'serif', 'monospace', 'cursive', 'fantasy', 'math', 'emoji',
  ],
};

function stripCssQuotes(s) {
  return s.trim().replace(/^["']|["']$/g, '').trim();
}

/** --font-* declarations → [{ varName, family, line }] (one per stack entry). */
function parseTokenFontFamilies(cssText) {
  const out = [];
  cssText.split('\n').forEach((line, i) => {
    const m = line.match(/(--font-[\w-]+)\s*:\s*([^;]+);/);
    if (!m) return;
    for (const part of m[2].split(',')) {
      const family = stripCssQuotes(part);
      if (family) out.push({ varName: m[1], family, line: i + 1 });
    }
  });
  return out;
}

/** @font-face blocks → [{ family, weightRange: [lo, hi], file, line }]. */
function parseFontFaces(cssText, relFile) {
  const faces = [];
  const re = /@font-face\s*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(cssText)) !== null) {
    const body = m[1];
    const fam = body.match(/font-family\s*:\s*([^;]+)[;\s]/);
    if (!fam) continue;
    let weightRange = [400, 400]; // CSS default when font-weight is absent
    const w = body.match(/font-weight\s*:\s*([^;]+)[;\s]/);
    if (w) {
      const nums = w[1].trim().split(/\s+/)
        .map((t) => (t === 'normal' ? 400 : t === 'bold' ? 700 : parseInt(t, 10)))
        .filter((n) => !Number.isNaN(n));
      if (nums.length === 1) weightRange = [nums[0], nums[0]];
      else if (nums.length >= 2) weightRange = [nums[0], nums[1]]; // variable-font range
    }
    faces.push({
      family: stripCssQuotes(fam[1]),
      weightRange,
      file: relFile,
      line: cssText.slice(0, m.index).split('\n').length,
    });
  }
  return faces;
}

/** Weight column of the typography spec's "Font weights" table, or null. */
function parseSpecWeights() {
  try {
    const md = fs.readFileSync(path.join(ROOT, TYPOGRAPHY_SPEC_REL), 'utf8');
    const weights = new Set();
    const re = /\|\s*`font-weight\/[a-z]+`\s*\|\s*(\d{3})\s*\|/g;
    let m;
    while ((m = re.exec(md)) !== null) weights.add(parseInt(m[1], 10));
    return weights.size > 0 ? [...weights].sort((a, b) => a - b) : null;
  } catch {
    return null;
  }
}

/**
 * Runs the C7a consistency check. Returns { findings, ran } — `ran: false`
 * (with a console note) when the tokens package CSS is unavailable, so the
 * report's checks.implemented stays honest.
 */
function checkC7a(rubric) {
  const findings = [];
  const cfg = { ...C7A_DEFAULTS, ...(rubric.c7a || {}) };
  const sysSet = new Set((cfg.systemFamilies || []).map((f) => f.toLowerCase()));

  const tokensAbs = path.join(ROOT, TOKENS_CSS_REL);
  if (!fs.existsSync(tokensAbs)) {
    console.log('  (C7a skipped — tokens package CSS not found; run npm install)');
    return { findings, ran: false };
  }
  const tokenDecls = parseTokenFontFamilies(fs.readFileSync(tokensAbs, 'utf8'));

  // Every @font-face declared anywhere under app/ (fonts.css today; future-proof).
  const faces = [];
  (function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fp = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(fp);
      else if (entry.name.endsWith('.css')) {
        faces.push(...parseFontFaces(fs.readFileSync(fp, 'utf8'), relOf(fp)));
      }
    }
  })(path.join(ROOT, 'app'));

  // Token-declared families that need hosting (system stack entries exempt).
  const families = new Map(); // family → { vars: [], line }
  for (const d of tokenDecls) {
    if (sysSet.has(d.family.toLowerCase())) continue;
    const g = families.get(d.family) || { vars: [], line: d.line };
    if (!g.vars.includes(d.varName)) g.vars.push(d.varName);
    families.set(d.family, g);
  }

  const specWeights = parseSpecWeights();
  let weightSkipNoted = false;

  for (const [family, g] of families) {
    // Exact string match on purpose — the S0 bug was precisely a name mismatch.
    const matching = faces.filter((f) => f.family === family);
    if (matching.length === 0) {
      const nearMiss = faces.find((f) => f.family.toLowerCase() === family.toLowerCase());
      findings.push({
        ruleId: 'C7-fontface-missing', level: cfg.missingFamilySeverity,
        file: TOKENS_CSS_REL, line: g.line,
        message: `Token layer declares font family \`"${family}"\` (${g.vars.join(', ')}) but NO @font-face registers that exact name${nearMiss ? ` — near-miss \`"${nearMiss.family}"\` in ${nearMiss.file} (name/case mismatch)` : ''}; every screen silently renders the fallback font (the S0 failure)`,
        suggestion: `→ Register @font-face rules with font-family: "${family}" (exact string) in app/fonts.css — see its header comment for why the name must match verbatim`,
        component: null,
      });
      continue;
    }
    if (!specWeights) {
      if (!weightSkipNoted) {
        console.log('  (C7a weight-gap check skipped — could not parse the typography spec weight table)');
        weightSkipNoted = true;
      }
      continue;
    }
    const covered = (w) => matching.some((f) => w >= f.weightRange[0] && w <= f.weightRange[1]);
    const missing = specWeights.filter((w) => !covered(w));
    if (missing.length > 0) {
      const hostedKeys = new Set();
      const hosted = [];
      for (const f of matching) {
        const key = f.weightRange.join('-');
        if (hostedKeys.has(key)) continue;
        hostedKeys.add(key);
        hosted.push(f.weightRange);
      }
      hosted.sort((a, b) => a[0] - b[0]);
      const hostedLabel = hosted.map(([lo, hi]) => (lo === hi ? `${lo}` : `${lo}–${hi}`)).join(', ');
      findings.push({
        ruleId: 'C7-weight-gap', level: cfg.weightGapSeverity,
        file: matching[0].file, line: matching[0].line,
        message: `\`"${family}"\`: typography spec lists weights ${specWeights.join('/')} but hosted @font-face covers only ${hostedLabel} — missing ${missing.join(', ')} (browser will synthesize or substitute those weights)`,
        suggestion: '→ Owner call: host the missing weight files or narrow the spec\'s weight table — flagged, not decided here',
        component: null,
      });
    }
  }
  return { findings, ran: true };
}

// ─── Meta loading (S1 artifact; read-only) ───────────────────────────────────

/**
 * Loads components/ui/*.meta.ts by transpiling each file with the repo's own
 * `typescript` devDependency and importing the result as a data: URL module.
 * Zero new dependencies; meta files are declarative object literals so this is
 * safe. Returns Map<name, ComponentMeta>, or null (with a console note) if
 * anything fails — C2/C3/C4 then skip gracefully instead of breaking C1/C5/C6.
 */
async function loadMetaIndex() {
  try {
    const { default: ts } = await import('typescript');
    const dir = path.join(ROOT, 'components', 'ui');
    const metaFiles = fs.readdirSync(dir).filter((f) => f.endsWith('.meta.ts'));
    const index = new Map();
    for (const f of metaFiles) {
      const src = fs.readFileSync(path.join(dir, f), 'utf8');
      const js = ts.transpileModule(src, {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      }).outputText;
      const mod = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
      const meta = Object.values(mod)[0];
      if (meta && meta.name) index.set(meta.name, meta);
    }
    return index.size > 0 ? index : null;
  } catch (err) {
    console.log(`  (meta unavailable — C2/C3/C4 skipped: ${err.message})`);
    return null;
  }
}

// ─── C2: provenance (re-implemented primitives) ──────────────────────────────

const RAW_ELEMENTS = ['button', 'input', 'select', 'textarea', 'table'];

/**
 * element → replacing primitive, DERIVED at audit runtime — never hand-
 * maintained. Two citable signals per primitive source file:
 *   1. it renders the raw element (`<table ...`),
 *   2. it types itself as React.ComponentProps<"element">.
 * Baseline for button/input comes from CLAUDE.md's Component rules ("Never
 * write a raw <button>, <input>, or <div> where a Compass component exists").
 *
 * The `primitiveElements` field on ComponentMeta is now CONSUMED (owner
 * approved 2026-07-07, requested in .compass-build/design/s4/c2-c3-c4-checks
 * .PROPOSED.md): any meta declaring it maps each listed element → that
 * component with source `meta:primitiveElements`, and the explicit field
 * always wins over the runtime derivation below. The derivation + CLAUDE.md
 * baseline remain as the backward-compatible FALLBACK for elements no meta
 * covers explicitly — nothing invented.
 */
function deriveElementMap(metaIndex) {
  const map = new Map();

  // (1) Prefer explicit meta.primitiveElements — the owner-approved field.
  if (metaIndex) {
    for (const meta of metaIndex.values()) {
      if (!Array.isArray(meta.primitiveElements)) continue;
      for (const el of meta.primitiveElements) {
        map.set(el, { primitive: meta.name, source: 'meta:primitiveElements' });
      }
    }
  }

  // (2) CLAUDE.md baseline for button/input — only where no explicit field covered them.
  if (!map.has('button')) map.set('button', { primitive: 'button', source: 'claude-md' });
  if (!map.has('input')) map.set('input', { primitive: 'input', source: 'claude-md' });

  // (3) Runtime derivation — FALLBACK only; never overrides an explicit field.
  for (const prim of UI_PRIMITIVES) {
    let src;
    try { src = fs.readFileSync(path.join(ROOT, 'components', 'ui', `${prim}.tsx`), 'utf8'); }
    catch { continue; }
    for (const el of RAW_ELEMENTS) {
      const existing = map.get(el);
      if (existing && existing.source === 'meta:primitiveElements') continue; // explicit field wins
      if (existing && existing.primitive === el) continue; // exact-name match already won
      const renders = new RegExp(`<${el}[\\s/>]`).test(src);
      const propsOf = src.includes(`React.ComponentProps<"${el}">`);
      if (renders || propsOf) {
        if (!existing || prim === el) {
          map.set(el, { primitive: prim, source: `derived:components/ui/${prim}.tsx` });
        }
      }
    }
  }
  return map;
}

/** kebab ui names imported from @/components/ui/<name> in this file. */
function uiImportsOf(raw) {
  const used = new Set();
  const re = /from\s+['"]@\/components\/ui\/([\w-]+)['"]/g;
  let m;
  while ((m = re.exec(raw)) !== null) used.add(m[1]);
  return used;
}

/** Extract the first string chunk of a className on this line (heuristic). */
function classNamesOnLine(line) {
  const m = line.match(/className\s*=\s*(?:"([^"]*)"|\{\s*(?:cn\(\s*)?["'`]([^"'`]*)["'`])/);
  return m ? (m[1] ?? m[2] ?? '') : '';
}

// ─── C2 shape-match de-noising (2026-07-19) ─────────────────────────────────
//
// The old shape-match tier fired on mere token *co-occurrence*: any div carrying
// ≥2 of a component's meta.tokens where ≥1 was "distinctive" (owned by ≤2 metas).
// But distinctiveness was measured over meta *declarations*, and plain surface/
// layout utilities are declared unevenly — e.g. `rounded-lg` happens to appear in
// exactly one meta (menubar), so a claim-number info box `rounded-lg bg-muted p-4`
// got flagged as a hand-rolled Menubar. These utilities carry no component signal.
//
// Fix: (1) a token only counts as a *signature* token if it is component-specific
// (surface / radius / shadow / focus-ring plumbing that every box uses is
// filtered out below); (2) firing now requires STRUCTURAL evidence that the
// element re-implements the component's anatomy (a matching ARIA role or ≥2
// interactive children) OR a strong pure-token signature (≥3 component-specific
// tokens = a genuine full re-implementation of the look) — never bare
// co-occurrence of a couple of generic tokens.

// Pure surface / layout / typography / focus-ring utilities. Any plain styled box
// legitimately uses these, so on their own they never implicate a component.
const C2_GENERIC_TOKENS = new Set([
  // surfaces
  'bg-background', 'bg-card', 'bg-muted', 'bg-muted/50', 'bg-secondary', 'bg-accent',
  'bg-popover', 'bg-input', 'bg-border', 'bg-foreground',
  // generic text colors
  'text-foreground', 'text-muted-foreground', 'text-card-foreground',
  'text-popover-foreground', 'text-accent-foreground', 'text-secondary-foreground',
  'text-background', 'text-foreground/60',
  // borders
  'border', 'border-border', 'border-input', 'border-ring',
  // radius (all)
  'rounded', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl',
  'rounded-3xl', 'rounded-4xl', 'rounded-full', 'rounded-none',
  // shadow (all)
  'shadow', 'shadow-xs', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-none',
  // focus-ring plumbing
  'ring', 'ring-ring', 'ring-ring/50', 'ring-offset-background',
  'ring-foreground', 'ring-foreground/10', 'ring-background',
]);

// ARIA roles that signal a genuine re-implementation of a given component.
const C2_COMPONENT_ROLES = {
  menubar: ['menubar', 'menu', 'menuitem'],
  'navigation-menu': ['navigation'],
  tabs: ['tablist', 'tab'],
  'dropdown-menu': ['menu', 'menuitem'],
  'context-menu': ['menu', 'menuitem'],
  table: ['table', 'grid', 'row', 'cell', 'columnheader'],
  'radio-group': ['radiogroup', 'radio'],
  'toggle-group': ['group'],
  sidebar: ['navigation', 'complementary'],
  breadcrumb: ['navigation'],
  pagination: ['navigation'],
};

// Interactive / structural children whose presence (≥2) marks a container the
// component would normally provide (menubar, toolbar, tabs, nav, radio-group…).
const C2_INTERACTIVE_CHILD_RE =
  /<button[\s/>]|<a\s[^>]*href|<Button[\s/>]|<Link[\s/>]|<input[\s/>]|role=["'](?:menuitem|menuitemradio|menuitemcheckbox|tab|option|radio)["']/g;

/**
 * The JSX subtree rooted at lines[i], bounded by indentation: collect lines until
 * one at ≤ the opening line's indent (its close/sibling), capped at `max` lines.
 * Good enough to look for structural anatomy without a full JSX parser.
 */
function elementSubtree(lines, i, max = 40) {
  const base = (lines[i].match(/^\s*/) || [''])[0].length;
  const buf = [lines[i]];
  for (let j = i + 1; j < lines.length && buf.length < max; j++) {
    const l = lines[j];
    if (l.trim() === '') { buf.push(l); continue; }
    const indent = (l.match(/^\s*/) || [''])[0].length;
    buf.push(l);
    if (indent <= base) break; // reached the close / a sibling — stop
  }
  return buf.join('\n');
}

/** Does the element subtree show the component's structural anatomy? */
function hasC2StructuralEvidence(subtree, componentName) {
  const roles = C2_COMPONENT_ROLES[componentName] || [];
  for (const r of roles) {
    if (new RegExp(`role=["']${r}["']`).test(subtree)) return true;
  }
  const nInteractive = (subtree.match(C2_INTERACTIVE_CHILD_RE) || []).length;
  return nInteractive >= 2;
}

function checkC2(rel, raw, elementMap, metaIndex, tokenOwners) {
  const findings = [];
  if (!/\.(tsx|jsx)$/.test(rel)) return findings;
  const imported = uiImportsOf(raw);
  const content = stripImports(stripComments(raw));
  const lines = content.split('\n');
  const rawLines = raw.split('\n');

  lines.forEach((line, i) => {
    const lineNum = i + 1;
    const prevRaw = rawLines[i - 1] || '';
    const thisRaw = rawLines[i] || '';

    // (a) exact-element tier: raw HTML element a Compass primitive replaces
    for (const [el, { primitive, source }] of elementMap) {
      if (!new RegExp(`<${el}[\\s/>]`).test(line)) continue;
      if (thisRaw.includes(`compass-allow: raw-${el}`) || prevRaw.includes(`compass-allow: raw-${el}`)) continue;
      findings.push({
        ruleId: 'C2-raw-element', level: 'error', line: lineNum,
        message: `Raw \`<${el}>\` where the Compass \`${kebabToPascal(primitive)}\` primitive exists (mapping: ${source})`,
        suggestion: `→ import { ${kebabToPascal(primitive)} } from \`@/components/ui/${primitive}\` (escape hatch for the rare legitimate case: \`// compass-allow: raw-${el}\`)`,
        component: primitive,
      });
    }

    // (b) shape-match tier: div/span genuinely re-implementing a primitive.
    //     Requires COMPONENT-SPECIFIC signature tokens (generic surface/layout/
    //     focus utilities are filtered) PLUS structural evidence (a matching
    //     ARIA role or ≥2 interactive children) OR a strong ≥3-token signature.
    //     Bare co-occurrence of a couple of generic tokens no longer fires.
    if (metaIndex && /<(div|span)[\s>]/.test(line)) {
      const classStr = classNamesOnLine(line);
      if (classStr) {
        const subtree = elementSubtree(lines, i);
        let best = null;
        for (const meta of metaIndex.values()) {
          if (!meta.tokens || meta.tokens.length < 2) continue;
          if (imported.has(meta.name)) continue; // they use the real one; styling overlap is fine
          const matches = meta.tokens.filter((t) => classStr.includes(t));
          // Only component-specific tokens count toward a signature; pure surface/
          // layout/focus utilities are filtered out entirely.
          const signature = matches.filter((t) => !C2_GENERIC_TOKENS.has(t));
          if (signature.length < 2) continue; // never fire on ≤1 component-specific token
          const distinctive = signature.filter((t) => (tokenOwners.get(t) || []).length <= 2);
          const structural = hasC2StructuralEvidence(subtree, meta.name);
          // Fire when the element shows the component's structural anatomy (a
          // matching ARIA role or ≥2 interactive children) alongside ≥2 of its
          // signature tokens, OR carries a strong ≥3-token signature that
          // includes a rare, component-specific token (a genuine full
          // re-implementation of the look). Bare co-occurrence never fires.
          const fires = (structural && signature.length >= 2)
            || (signature.length >= 3 && distinctive.length >= 1);
          if (!fires) continue;
          if (!best || signature.length > best.signature.length) {
            best = { meta, signature, structural };
          }
        }
        if (best) {
          const evidence = best.structural
            ? 'structural anatomy + signature tokens'
            : 'signature tokens';
          findings.push({
            ruleId: 'C2-shape-match', level: 'warning', line: lineNum,
            message: `div/span re-implements \`${best.meta.name}\` (${evidence}: ${best.signature.join(', ')}) without importing it — hand-rolled ${kebabToPascal(best.meta.name)}?`,
            suggestion: `→ Use \`${kebabToPascal(best.meta.name)}\` from \`@/components/ui/${best.meta.name}\` (heuristic — verify before acting)`,
            component: best.meta.name,
          });
        }
      }
    }
  });

  return findings;
}

// ─── C3: composite completeness ──────────────────────────────────────────────

function checkC3(rel, raw, metaIndex) {
  const findings = [];
  if (!/\.(tsx|jsx)$/.test(rel) || !metaIndex) return findings;
  const imported = uiImportsOf(raw);
  const content = stripImports(stripComments(raw));

  for (const name of imported) {
    const meta = metaIndex.get(name);
    if (!meta || !Array.isArray(meta.childComponents) || meta.childComponents.length === 0) continue;
    const pascal = kebabToPascal(name);
    const openRe = new RegExp(`<${pascal}[\\s>]`);
    // only flag composites rendered WITH children (self-closing = no structure to check)
    if (!openRe.test(content) || !content.includes(`</${pascal}>`)) continue;
    const childrenPascal = meta.childComponents.map(kebabToPascal);
    const anyChildUsed = childrenPascal.some((c) => content.includes(`<${c}`));
    if (!anyChildUsed) {
      const lineNum = content.split('\n').findIndex((l) => openRe.test(l)) + 1;
      // Severity: uniform WARNING. Promoting specific composites (e.g. dialog
      // without DialogTitle, an a11y failure) to error is a pending owner
      // tuning decision — meta has no "required sub-part" flag to cite.
      findings.push({
        ruleId: 'C3-missing-subparts', level: 'warning', line: lineNum || 1,
        message: `<${pascal}> rendered with children but none of its sub-parts (${childrenPascal.slice(0, 3).join(', ')}${childrenPascal.length > 3 ? ', …' : ''}) — layout re-implemented with divs?`,
        suggestion: `→ Structure content with ${childrenPascal.slice(0, 3).join(' / ')}${meta.specPath ? ` — see ${meta.specPath}` : ''}`,
        component: name,
      });
    }
  }
  return findings;
}

// ─── C4: spec coverage ───────────────────────────────────────────────────────

function checkC4(rel, raw, metaIndex) {
  const findings = [];
  if (!CODE_EXTENSIONS.includes(path.extname(rel)) || !metaIndex) return findings;
  const re = /from\s+['"]@\/components\/ui\/([\w-]+)['"]/g;
  let m;
  const seen = new Set();
  while ((m = re.exec(raw)) !== null) {
    const name = m[1];
    if (seen.has(name)) continue;
    seen.add(name);
    if (name.startsWith('_') || name.endsWith('.meta')) continue;
    const lineNum = raw.slice(0, m.index).split('\n').length;
    const meta = metaIndex.get(name);
    if (!meta) {
      findings.push({
        ruleId: 'C4-no-meta', level: 'warning', line: lineNum,
        message: `\`${name}\` has no ComponentMeta entry (unexpected — S1 covers all 55)`,
        suggestion: '→ Check components/ui/_meta-index.ts; flag to owner if genuinely missing',
        component: name,
      });
    } else if (meta.specStatus === 'none' || !meta.specPath) {
      findings.push({
        ruleId: 'C4-unspecced', level: 'warning', line: lineNum,
        message: `\`${name}\` used without a spec (specStatus: ${meta.specStatus}) — backfill candidate`,
        suggestion: '→ No action needed in this build; Detect aggregates this signal to rank spec backfill (S6.3)',
        component: name,
      });
    } else if (!fs.existsSync(path.join(ROOT, meta.specPath))) {
      findings.push({
        ruleId: 'C4-spec-missing', level: 'warning', line: lineNum,
        message: `\`${name}\` meta points at \`${meta.specPath}\` but the file does not exist`,
        suggestion: '→ Fix the specPath in meta (owner-approved artifact — flag, do not edit)',
        component: name,
      });
    }
  }
  return findings;
}

// ─── C8: invented, non-system CSS / motion (advisory WARNING) ────────────────
//
// Rationale: a build can ship a bespoke animated CSS module (custom @keyframes +
// animation) and still score ~clean because it references token *vars*. Compass
// motion lives in the motion spec + tw-animate-css + shadcn's built-in keyframes
// — NOT in per-build CSS modules or hand-rolled @keyframes. This flags bespoke
// motion/effects outside that system. Advisory only (owner ruling #10: the
// compliance audit is never an error — token-audit is the sole gate), so every
// C8 finding is a WARNING.
//
// Never flags app/globals.css, the @acko tokens package, tw-animate-css,
// node_modules, or Compass's own components/ui (all already out of scan scope;
// re-guarded here so --files mode can't sneak them in).

const MOTION_SPEC_REL = '.claude/specs/foundations/motion.md';

// System animation names Compass sanctions — motion-spec presets + Tailwind
// built-ins + tw-animate-css / shadcn data-state conventions. Matched
// case-insensitively so `fadeIn` and `fade-in` are both recognized.
const C8_SYSTEM_ANIMATION_FALLBACK = [
  // motion spec presets (.claude/specs/foundations/motion.md)
  'accordion-down', 'accordion-up', 'fadeIn', 'fadeOut',
  'slideInFromTop', 'slideInFromBottom', 'slideInFromLeft', 'slideInFromRight',
  // Tailwind built-in animations
  'spin', 'ping', 'pulse', 'bounce', 'none',
  // tw-animate-css / shadcn data-state motion
  'enter', 'exit', 'in', 'out',
  'fade-in', 'fade-out', 'zoom-in', 'zoom-out',
  'slide-in-from-top', 'slide-in-from-bottom', 'slide-in-from-left', 'slide-in-from-right',
  'slide-out-to-top', 'slide-out-to-bottom', 'slide-out-to-left', 'slide-out-to-right',
  'caret-blink', 'collapsible-down', 'collapsible-up',
];

/** System animation names: fallback ∪ motion-spec presets ∪ rubric override. */
function loadSystemAnimations(rubric) {
  const names = new Set(C8_SYSTEM_ANIMATION_FALLBACK.map((n) => n.toLowerCase()));
  // Scrape preset names out of the motion spec's "Animation presets" table.
  try {
    const md = fs.readFileSync(path.join(ROOT, MOTION_SPEC_REL), 'utf8');
    const section = md.split(/##\s+Animation presets/i)[1] || '';
    const table = section.split(/\n##\s/)[0];
    const re = /\|\s*`([A-Za-z][\w-]*)`\s*\|/g;
    let m;
    while ((m = re.exec(table)) !== null) names.add(m[1].toLowerCase());
  } catch { /* fallback set is sufficient */ }
  for (const n of (rubric.c8 && rubric.c8.systemAnimations) || []) names.add(String(n).toLowerCase());
  return names;
}

function isSystemAnimation(name, systemAnimations) {
  return systemAnimations.has(String(name).toLowerCase());
}

/** True for files whose CSS/motion is system-owned and must never be C8-flagged. */
function c8IsExempt(rel) {
  return rel === 'app/globals.css'
    || rel.startsWith('components/ui/')
    || rel.includes('node_modules/')
    || rel.includes('tw-animate')
    || rel.includes('@acko/enterprise-tokens');
}

function checkC8(rel, raw, systemAnimations) {
  const findings = [];
  const ext = path.extname(rel);
  if (ext !== '.css' && ext !== '.tsx' && ext !== '.jsx') return findings;
  if (c8IsExempt(rel)) return findings;

  const lineAt = (index) => raw.slice(0, index).split('\n').length;
  const suggestion = `→ Use the Compass motion system (tw-animate-css + shadcn presets) — see ${MOTION_SPEC_REL}. If a new motion pattern is genuinely needed, flag it for owner review rather than shipping bespoke CSS.`;

  if (ext === '.css') {
    // Bespoke CSS module: Compass components style with Tailwind utilities, not
    // *.module.css. The module itself is invented, non-system CSS.
    if (/\.module\.css$/.test(rel)) {
      const firstContent = raw.split('\n').findIndex((l) => l.trim() && !l.trim().startsWith('/*'));
      findings.push({
        ruleId: 'C8-invented-motion', level: 'warning',
        file: rel, line: firstContent >= 0 ? firstContent + 1 : 1,
        message: `Bespoke CSS module \`${path.basename(rel)}\` — Compass styles components with Tailwind utilities + tw-animate-css, not per-build CSS modules; motion/effects here bypass the Compass motion system`,
        suggestion,
        component: null,
      });
    }

    // Invented @keyframes (a name the motion system does not define).
    const invented = new Set();
    const kfRe = /@keyframes\s+([A-Za-z_][\w-]*)/g;
    let m;
    while ((m = kfRe.exec(raw)) !== null) {
      if (isSystemAnimation(m[1], systemAnimations)) continue;
      invented.add(m[1]);
      findings.push({
        ruleId: 'C8-invented-motion', level: 'warning',
        file: rel, line: lineAt(m.index),
        message: `Custom \`@keyframes ${m[1]}\` — not part of the Compass motion system`,
        suggestion,
        component: null,
      });
    }

    // animation: / animation-name: referencing a non-system animation — skip
    // names already reported as an invented local @keyframes (dedupe).
    const animRe = /animation(?:-name)?\s*:\s*([^;{}]+)[;}]/g;
    while ((m = animRe.exec(raw)) !== null) {
      const value = m[1];
      const names = value.match(/[A-Za-z_][\w-]*/g) || [];
      const bad = names.find(
        (n) => !isSystemAnimation(n, systemAnimations)
          && !invented.has(n)
          // ignore CSS keywords that appear in the animation shorthand
          && !/^(infinite|normal|reverse|alternate|forwards|backwards|both|none|linear|ease|ease-in|ease-out|ease-in-out|running|paused|steps|cubic-bezier|var|s|ms)$/i.test(n),
      );
      if (bad) {
        findings.push({
          ruleId: 'C8-invented-motion', level: 'warning',
          file: rel, line: lineAt(m.index),
          message: `Custom \`animation\` referencing \`${bad}\` — not a Compass motion-system animation`,
          suggestion,
          component: null,
        });
      }
    }
    return findings;
  }

  // TSX/JSX: arbitrary animate-[…] utilities and inline-style animations bypass
  // the motion system. Object-literal data fields (no `style=`) are left alone.
  raw.split('\n').forEach((line, i) => {
    let m;
    const arbRe = /\banimate-\[[^\]]+\]/g;
    while ((m = arbRe.exec(line)) !== null) {
      findings.push({
        ruleId: 'C8-invented-motion', level: 'warning',
        file: rel, line: i + 1,
        message: `Arbitrary animation utility \`${m[0]}\` bypasses tw-animate-css / the Compass motion system`,
        suggestion,
        component: null,
      });
    }
    if (/style\s*=/.test(line)) {
      const styleAnimRe = /animation(?:Name)?\s*:\s*['"]([^'"]*)['"]/g;
      while ((m = styleAnimRe.exec(line)) !== null) {
        const names = m[1].match(/[A-Za-z_][\w-]*/g) || [];
        const bad = names.find(
          (n) => !isSystemAnimation(n, systemAnimations)
            && !/^(infinite|normal|reverse|alternate|forwards|backwards|both|none|linear|ease|ease-in|ease-out|ease-in-out|running|paused|steps|cubic-bezier|var|s|ms)$/i.test(n),
        );
        if (bad) {
          findings.push({
            ruleId: 'C8-invented-motion', level: 'warning',
            file: rel, line: i + 1,
            message: `Inline-style animation referencing \`${bad}\` — not a Compass motion-system animation`,
            suggestion,
            component: null,
          });
        }
      }
    }
  });
  return findings;
}

/** token → [component names using it], for C2 shape-match distinctiveness. */
function buildTokenOwners(metaIndex) {
  const owners = new Map();
  if (!metaIndex) return owners;
  for (const meta of metaIndex.values()) {
    for (const t of meta.tokens || []) {
      if (!owners.has(t)) owners.set(t, []);
      owners.get(t).push(meta.name);
    }
  }
  return owners;
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

async function run() {
  const args = parseArgs(process.argv.slice(2));
  const mode = { parity: !!args.parity };
  const rubric = loadRubric();

  // Meta-driven checks: load once (skipped in parity mode, which is C1-only).
  const metaIndex = mode.parity ? null : await loadMetaIndex();
  const elementMap = mode.parity ? null : deriveElementMap(metaIndex);
  const tokenOwners = buildTokenOwners(metaIndex);
  // C8 (invented motion) is meta-independent; system animation names loaded once.
  const systemAnimations = mode.parity ? null : loadSystemAnimations(rubric);

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
      for (const f of checkC8(rel, raw, systemAnimations)) findings.push({ ...f, file: rel });
      if (metaIndex) {
        for (const f of checkC2(rel, raw, elementMap, metaIndex, tokenOwners)) findings.push({ ...f, file: rel });
        for (const f of checkC3(rel, raw, metaIndex)) findings.push({ ...f, file: rel });
        for (const f of checkC4(rel, raw, metaIndex)) findings.push({ ...f, file: rel });
      }
    }
  }
  let c7a = { findings: [], ran: false };
  if (!mode.parity) {
    findings.push(...checkC5Paths(scanFiles.map(relOf)));
    if (modeName === 'repo') {
      // C7a is project-level (font wiring), not per-build — repo mode only so
      // entry/files scores never carry system-level font findings.
      c7a = checkC7a(rubric);
      findings.push(...c7a.findings);
    }
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
        implemented: [
          ...(metaIndex ? ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'] : ['C1', 'C5', 'C6']),
          ...(c7a.ran ? ['C7a'] : []),
          'C8',
        ],
        skipped: [
          ...(metaIndex ? [] : ['C2', 'C3', 'C4']),
          ...(c7a.ran ? [] : ['C7a']),
        ],
        designOnly: ['C7b'],
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

run().catch((err) => {
  console.error(`\n  ✗ compliance-audit failed: ${err.message}\n`);
  process.exit(1);
});

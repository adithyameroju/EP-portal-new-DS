#!/usr/bin/env node

/**
 * Compass Detect — drift clustering (S4 audit loop, Part 3).
 *
 * Reads the last N ledger entries (drift-log/entries/) and their compliance
 * reports (drift-log/reports/, joined via each report's `entry` field) and
 * aggregates drift signal:
 *   - component hotspots  (which components accumulate errors)
 *   - rule hotspots       (which ruleIds fire most)
 *   - {component, rule} clusters, counted in DISTINCT BUILDS — a cluster at or
 *     above rubric.detect.hotspotMinBuilds is a hotspot; below = watching
 *   - assumption themes   (recurring "What I assumed" items = spec-ambiguity
 *     signal: if the LLM keeps assuming the same thing, the spec failed to
 *     decide it)
 *   - unscored entries    (logged but never scored — capture-discipline gap)
 *
 * Every hotspot carries `evidence`: the ledger entry filenames behind it.
 * No evidence, no hotspot.
 *
 * Entries marked "demo": true are ALWAYS excluded unless --include-demo is
 * passed (used only for pipeline demonstrations; output is then labeled DEMO
 * and must never feed a real tightening plan).
 *
 * Output: drift-log/detect/<stamp>__window-<N>[__DEMO].json + a .md twin.
 * Derived artifacts (gitignored) — regenerate any time.
 *
 * Usage:
 *   npm run detect                    # last rubric.detect.windowSize entries
 *   npm run detect -- --window 20
 *   npm run detect -- --include-demo  # demonstrations only
 *
 * Exit: 0 always (Detect observes; it never gates).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENTRIES_DIR = path.join(ROOT, 'drift-log', 'entries');
const REPORTS_DIR = path.join(ROOT, 'drift-log', 'reports');
const DETECT_DIR = path.join(ROOT, 'drift-log', 'detect');
const RUBRIC_PATH = path.join(ROOT, 'scripts', 'audit-rubric.json');

function loadJson(p, fallback = null) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; }
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--window') args.window = parseInt(argv[++i], 10);
    else if (argv[i] === '--include-demo') args.includeDemo = true;
  }
  return args;
}

// ─── Assumption theming ──────────────────────────────────────────────────────

const STOPWORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'to', 'of', 'in', 'on', 'for', 'with',
  'and', 'or', 'that', 'this', 'it', 'its', 'as', 'be', 'assumed', 'assume',
  'assuming', 'default', 'defaults', 'stays', 'stay', 'kept', 'keep', 'used', 'use',
]);

function contentWords(text) {
  return new Set(
    text.toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/)
      .filter((w) => w.length > 2 && !STOPWORDS.has(w))
  );
}

/** Greedy clustering: same category + ≥2 shared content words = same theme. */
function themeAssumptions(items) {
  const themes = [];
  for (const item of items) {
    const words = contentWords(item.text);
    let placed = false;
    for (const theme of themes) {
      if (theme.category !== item.category) continue;
      const shared = [...words].filter((w) => theme.words.has(w));
      if (shared.length >= 2) {
        theme.assumptions.push(item);
        shared.forEach(() => {}); // keep original theme words stable
        placed = true;
        break;
      }
    }
    if (!placed) {
      themes.push({ category: item.category, words, assumptions: [item] });
    }
  }
  return themes
    .map((t) => ({
      category: t.category,
      theme: [...t.words].slice(0, 4).join(' '),
      count: t.assumptions.length,
      builds: [...new Set(t.assumptions.map((a) => a.entry))].length,
      assumptions: t.assumptions,
    }))
    .sort((a, b) => b.builds - a.builds || b.count - a.count);
}

// ─── Main ────────────────────────────────────────────────────────────────────

function run() {
  const args = parseArgs(process.argv.slice(2));
  const rubric = loadJson(RUBRIC_PATH, {});
  const detectCfg = rubric.detect || {};
  const windowSize = args.window || detectCfg.windowSize || 10;
  const minBuilds = detectCfg.hotspotMinBuilds || 3;

  console.log(`\n🧭 Compass Detect — drift clustering${args.includeDemo ? '  [DEMO MODE — includes demo entries; not real evidence]' : ''}\n`);

  // ── Load the window of entries (newest first by filename timestamp)
  const allEntryFiles = fs.existsSync(ENTRIES_DIR)
    ? fs.readdirSync(ENTRIES_DIR).filter((f) => f.endsWith('.json')).sort().reverse()
    : [];
  const entries = [];
  for (const f of allEntryFiles) {
    const e = loadJson(path.join(ENTRIES_DIR, f));
    if (!e) continue;
    if (e.demo && !args.includeDemo) continue;
    entries.push({ file: f, data: e });
    if (entries.length >= windowSize) break;
  }

  // ── Join reports (latest report per entry)
  const reportFiles = fs.existsSync(REPORTS_DIR)
    ? fs.readdirSync(REPORTS_DIR).filter((f) => f.endsWith('.json')).sort()
    : [];
  const reportsByEntry = new Map();
  for (const f of reportFiles) {
    const r = loadJson(path.join(REPORTS_DIR, f));
    if (r && r.entry) reportsByEntry.set(r.entry, { file: f, data: r }); // later files overwrite = latest wins
  }

  const scored = [];
  const unscoredEntries = [];
  for (const e of entries) {
    const rel = `drift-log/entries/${e.file}`;
    const report = reportsByEntry.get(rel);
    if (report) scored.push({ ...e, report });
    else unscoredEntries.push(e.file);
  }

  // ── Aggregate
  const componentAgg = new Map(); // name -> {errors, warnings, builds:Set}
  const ruleAgg = new Map();      // ruleId -> {count, level, builds:Set}
  const clusterAgg = new Map();   // `${component}|${ruleId}` -> {builds:Set, findings}
  const assumptionItems = [];

  for (const s of scored) {
    for (const f of s.report.data.findings || []) {
      const r = ruleAgg.get(f.ruleId) || { count: 0, level: f.level, builds: new Set() };
      r.count++; r.builds.add(s.file);
      ruleAgg.set(f.ruleId, r);
      if (f.component) {
        const c = componentAgg.get(f.component) || { errors: 0, warnings: 0, builds: new Set() };
        c[f.level === 'error' ? 'errors' : 'warnings']++;
        c.builds.add(s.file);
        componentAgg.set(f.component, c);
        const key = `${f.component}|${f.ruleId}`;
        const cl = clusterAgg.get(key) || { component: f.component, ruleId: f.ruleId, level: f.level, builds: new Set(), findingCount: 0 };
        cl.builds.add(s.file); cl.findingCount++;
        clusterAgg.set(key, cl);
      }
    }
  }
  for (const e of entries) {
    for (const a of e.data.assumptions || []) {
      assumptionItems.push({ entry: e.file, text: a.text, category: a.category || 'uncategorized' });
    }
  }

  const componentHotspots = [...componentAgg.entries()]
    .map(([component, v]) => ({ component, errors: v.errors, warnings: v.warnings, builds: v.builds.size, evidence: [...v.builds] }))
    .sort((a, b) => b.errors - a.errors || b.warnings - a.warnings);
  const ruleHotspots = [...ruleAgg.entries()]
    .map(([ruleId, v]) => ({ ruleId, count: v.count, level: v.level, builds: v.builds.size }))
    .sort((a, b) => b.count - a.count);
  const clusters = [...clusterAgg.values()]
    .map((c) => ({
      component: c.component, ruleId: c.ruleId, level: c.level,
      builds: c.builds.size, findings: c.findingCount,
      hotspot: c.builds.size >= minBuilds,
      evidence: [...c.builds],
    }))
    .sort((a, b) => b.builds - a.builds || b.findings - a.findings);
  const assumptionThemes = themeAssumptions(assumptionItems)
    .map((t) => ({ ...t, hotspot: t.builds >= minBuilds }));

  const result = {
    generatedAt: new Date().toISOString(),
    demoMode: !!args.includeDemo,
    window: { n: windowSize, entriesConsidered: entries.map((e) => e.file), scored: scored.length },
    thresholds: { hotspotMinBuilds: minBuilds },
    componentHotspots,
    ruleHotspots,
    clusters,
    assumptionThemes,
    unscoredEntries,
  };

  // ── Write JSON + markdown twin
  fs.mkdirSync(DETECT_DIR, { recursive: true });
  const stamp = result.generatedAt.replace(/[:.]/g, '-');
  const base = `${stamp}__window-${windowSize}${args.includeDemo ? '__DEMO' : ''}`;
  fs.writeFileSync(path.join(DETECT_DIR, `${base}.json`), JSON.stringify(result, null, 2) + '\n');

  const md = [];
  md.push(`# Compass drift report — ${result.generatedAt}${args.includeDemo ? '\n\n> **DEMO MODE** — includes demo entries; NOT real evidence; never feed a tightening plan from this.' : ''}`);
  md.push(`\nWindow: last ${windowSize} entries (${entries.length} found, ${scored.length} scored). Hotspot threshold: ≥${minBuilds} builds.\n`);
  md.push('## {component, rule} clusters');
  if (clusters.length === 0) md.push('_None — no scored findings in the window._');
  for (const c of clusters) {
    md.push(`- ${c.hotspot ? '**HOTSPOT**' : 'watching'} — \`${c.component}\` / \`${c.ruleId}\` (${c.level}): ${c.builds} build${c.builds === 1 ? '' : 's'}, ${c.findings} finding${c.findings === 1 ? '' : 's'}\n  evidence: ${c.evidence.map((e) => `\`${e}\``).join(', ')}`);
  }
  md.push('\n## Assumption themes (spec-ambiguity signal)');
  if (assumptionThemes.length === 0) md.push('_None logged in the window._');
  for (const t of assumptionThemes) {
    md.push(`- ${t.hotspot ? '**HOTSPOT**' : 'watching'} — [${t.category}] "${t.theme}": ${t.count} assumption${t.count === 1 ? '' : 's'} across ${t.builds} build${t.builds === 1 ? '' : 's'}`);
    for (const a of t.assumptions) md.push(`  - "${a.text}" (\`${a.entry}\`)`);
  }
  md.push('\n## Rule hotspots');
  for (const r of ruleHotspots) md.push(`- \`${r.ruleId}\` (${r.level}): ${r.count} findings across ${r.builds} builds`);
  if (unscoredEntries.length > 0) {
    md.push('\n## Logged but never scored (capture-discipline gap)');
    for (const u of unscoredEntries) md.push(`- \`${u}\` — run \`npm run audit:compliance -- --entry drift-log/entries/${u}\``);
  }
  md.push('\n---\n_Next step: `npm run prescribe` builds the tightening-plan scaffold from this report. The loop proposes; the owner approves._');
  fs.writeFileSync(path.join(DETECT_DIR, `${base}.md`), md.join('\n') + '\n');

  // ── Console summary
  console.log(`  Window:      last ${windowSize} entries → ${entries.length} in window, ${scored.length} scored, ${unscoredEntries.length} unscored`);
  console.log(`  Clusters:    ${clusters.length} (${clusters.filter((c) => c.hotspot).length} hotspot${clusters.filter((c) => c.hotspot).length === 1 ? '' : 's'} at ≥${minBuilds} builds)`);
  console.log(`  Assumptions: ${assumptionItems.length} → ${assumptionThemes.length} theme${assumptionThemes.length === 1 ? '' : 's'} (${assumptionThemes.filter((t) => t.hotspot).length} hotspot)`);
  console.log(`\n  Report: drift-log/detect/${base}.json (+ .md twin)\n`);
}

run();

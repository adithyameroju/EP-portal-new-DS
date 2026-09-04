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
import { ownerDriveSources } from './drift-config.mjs';

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

// Semantic concepts: assumptions expressing the SAME underlying gap cluster
// together regardless of category or exact wording. Owner-tunable. A concept
// matches when the assumption text contains any of its keywords (whole word,
// case-insensitive). The status/semantic concept is the one the test builds keep
// hitting — no success/warning/info token or badge variant, so status gets mapped
// onto destructive/outline/default/chart-*.
const ASSUMPTION_CONCEPTS = [
  {
    id: 'status-tokens',
    label: 'status / semantic color (success · warning · info) — no Compass token or variant',
    // Specific status vocabulary. `status` alone is NOT a keyword (it would catch
    // "claim-status" filenames and incidental "status icons"); it only counts as a
    // status *badge/color/variant/token* via the pattern below.
    keywords: ['success', 'warning', 'info', 'amber', 'semantic', 'verify'],
    patterns: [/\bstatus\s+(badges?|colou?rs?|variants?|tokens?)\b/],
  },
];

function conceptOf(text) {
  const t = String(text).toLowerCase();
  for (const c of ASSUMPTION_CONCEPTS) {
    const kw = (c.keywords || []).some((k) => new RegExp(`\\b${k}\\b`).test(t));
    const pat = (c.patterns || []).some((re) => re.test(t));
    if (kw || pat) return c;
  }
  return null;
}

/**
 * Theme assumptions in two tiers so semantically-equivalent items don't scatter:
 *  1. CONCEPT themes — assumptions matching a known concept (status tokens, …)
 *     cluster ACROSS categories and wordings. This is what makes "no success
 *     token" / "no info variant" / "amber unavailable" ONE hotspot instead of ten.
 *  2. Fallback — the rest use greedy same-category + ≥2 shared content-word
 *     clustering (the original behavior).
 */
function themeAssumptions(items) {
  const conceptThemes = new Map();
  const rest = [];
  for (const item of items) {
    const c = conceptOf(item.text);
    if (c) {
      const ct = conceptThemes.get(c.id) || { concept: c, assumptions: [] };
      ct.assumptions.push(item);
      conceptThemes.set(c.id, ct);
    } else {
      rest.push(item);
    }
  }
  const themes = [];
  for (const item of rest) {
    const words = contentWords(item.text);
    let placed = false;
    for (const theme of themes) {
      if (theme.category !== item.category) continue;
      const shared = [...words].filter((w) => theme.words.has(w));
      if (shared.length >= 2) { theme.assumptions.push(item); placed = true; break; }
    }
    if (!placed) themes.push({ category: item.category, words, assumptions: [item] });
  }
  const build = (category, theme, assumptions, concept) => ({
    category, theme, concept,
    count: assumptions.length,
    builds: [...new Set(assumptions.map((a) => a.entry))].length,
    assumptions,
  });
  const conceptOut = [...conceptThemes.values()].map((t) => build('concept', t.concept.label, t.assumptions, t.concept.id));
  const fallbackOut = themes.map((t) => build(t.category, [...t.words].slice(0, 4).join(' '), t.assumptions));
  return [...conceptOut, ...fallbackOut].sort((a, b) => b.builds - a.builds || b.count - a.count);
}

// ─── Main ────────────────────────────────────────────────────────────────────

function run() {
  const args = parseArgs(process.argv.slice(2));
  const rubric = loadJson(RUBRIC_PATH, {});
  const detectCfg = rubric.detect || {};
  const windowSize = args.window || detectCfg.windowSize || 10;
  const minBuilds = detectCfg.hotspotMinBuilds || 3;
  // A repeated ASSUMPTION is a spec-ambiguity signal and surfaces sooner than a
  // code-finding cluster: the same "what I assumed" across 2 builds already means
  // the spec failed to decide something. Separate, lower, owner-tunable threshold.
  const assumptionMinBuilds = detectCfg.assumptionHotspotMinBuilds || 2;

  console.log(`\n🧭 Compass Detect — drift clustering${args.includeDemo ? '  [DEMO MODE — includes demo entries; not real evidence]' : ''}\n`);

  // ── Source: OWNER Drive telemetry (PRIMARY, all designer subfolders) when this
  // machine is role:owner with a valid Drive folder; else local working tree.
  const drive = ownerDriveSources();
  if (drive) console.log(`  Source: Drive telemetry (PRIMARY) — ${drive.entries.length} entr(y/ies) across ${drive.designers.length} designer folder(s).\n`);

  // entries — newest first by filename timestamp, deduped by name
  let entrySrcs;
  if (drive && drive.entries.length) {
    const seen = new Map();
    for (const e of drive.entries) if (!seen.has(e.name)) seen.set(e.name, e.path);
    entrySrcs = [...seen.entries()].map(([name, p]) => ({ name, read: () => fs.readFileSync(p, 'utf8') }))
      .sort((a, b) => b.name.localeCompare(a.name));
  } else {
    entrySrcs = (fs.existsSync(ENTRIES_DIR) ? fs.readdirSync(ENTRIES_DIR).filter((f) => f.endsWith('.json')) : [])
      .sort().reverse().map((name) => ({ name, read: () => fs.readFileSync(path.join(ENTRIES_DIR, name), 'utf8') }));
  }
  const entries = [];
  for (const s of entrySrcs) {
    let e; try { e = JSON.parse(s.read()); } catch { continue; }
    if (!e) continue;
    if (e.demo && !args.includeDemo) continue;
    entries.push({ file: s.name, data: e });
    if (entries.length >= windowSize) break;
  }

  // ── Join reports (latest report per entry) — Drive reports when owner, else local
  const reportSrcs = (drive && drive.reports.length)
    ? drive.reports.map((r) => ({ name: r.name, read: () => fs.readFileSync(r.path, 'utf8') }))
    : (fs.existsSync(REPORTS_DIR) ? fs.readdirSync(REPORTS_DIR).filter((f) => f.endsWith('.json')) : [])
        .sort().map((name) => ({ name, read: () => fs.readFileSync(path.join(REPORTS_DIR, name), 'utf8') }));
  const reportsByEntry = new Map();
  for (const s of reportSrcs) {
    let r; try { r = JSON.parse(s.read()); } catch { continue; }
    if (r && r.entry) reportsByEntry.set(r.entry, { file: s.name, data: r }); // latest wins
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
    .map((t) => ({ ...t, hotspot: t.builds >= assumptionMinBuilds }));

  const result = {
    generatedAt: new Date().toISOString(),
    demoMode: !!args.includeDemo,
    window: { n: windowSize, entriesConsidered: entries.map((e) => e.file), scored: scored.length },
    thresholds: { hotspotMinBuilds: minBuilds, assumptionHotspotMinBuilds: assumptionMinBuilds },
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

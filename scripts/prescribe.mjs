#!/usr/bin/env node

/**
 * Compass Prescribe — tightening-plan SCAFFOLD (S4 audit loop, Part 4).
 *
 * THE HARD RULE: the loop proposes, the owner approves. This script never
 * writes to a spec, never edits a rule, never applies anything. Its only
 * output is a markdown plan skeleton for the compass-audit skill run to
 * complete and for Nikhil to review in the monthly tightening session.
 *
 * What the mechanical scaffold does per hotspot (from the latest Detect run):
 *   1. Locates the governing document (component meta specPath; foundations
 *      spec for C1 rules; CLAUDE.md for C2/C5/C6 conduct rules).
 *   2. Quotes candidate existing-rule lines found by keyword search — verbatim,
 *      with line numbers. It QUOTES, it never rewrites.
 *   3. Classifies through the OPINION FIREWALL:
 *        Case A (existing rule found) → "ambiguity-tightening candidate":
 *          the skill run may draft an exact diff for owner approval. The
 *          scaffold leaves an explicit DRAFT-REQUIRED placeholder.
 *        Case B (no governing rule found) → "NEEDS OWNER DECISION": the drift
 *          requires a design opinion Compass has not made. No rule is drafted,
 *          no recommendation is phrased as a rule. Ever.
 *   4. Everything below the hotspot threshold goes to "Watching, not acting".
 *
 * Every item carries its evidence trace (ledger entry filenames from Detect).
 * A prescription without evidence is invalid — the scaffold refuses to emit it.
 *
 * Output: drift-log/proposals/<date>__tightening-plan.md
 *         (.SAMPLE.md + banner when the Detect input was demo-mode).
 *
 * Usage:
 *   npm run prescribe                       # uses newest drift-log/detect/*.json
 *   npm run prescribe -- --detect <path>    # explicit detect report
 *
 * Exit: 0 = plan written; 1 = no usable Detect input.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DETECT_DIR = path.join(ROOT, 'drift-log', 'detect');
const PROPOSALS_DIR = path.join(ROOT, 'drift-log', 'proposals');

// Governing docs for rules not owned by a component spec.
const RULE_DOC_DEFAULTS = {
  'C1-hex': '.claude/specs/foundations/color.md',
  'C1-tw-color': '.claude/specs/foundations/color.md',
  'C1-arbitrary-value': '.claude/specs/foundations/spacing.md',
  'C1-arbitrary-layout': '.claude/specs/foundations/spacing.md',
  'C1-arbitrary-other': '.claude/specs/foundations/spacing.md',
  'C1-raw-style': '.claude/specs/foundations/spacing.md',
  'C2-raw-element': 'CLAUDE.md',
  'C2-shape-match': 'CLAUDE.md',
  'C3-missing-subparts': 'CLAUDE.md',
  'C5-naming': 'CLAUDE.md',
  'C6-import-path': 'CLAUDE.md',
  'C6-shadow-primitive': 'CLAUDE.md',
};

// Keyword sets for the mechanical existing-rule search (first pass only; the
// skill run judges whether a quoted line genuinely governs the drift).
const RULE_KEYWORDS = {
  'C1-hex': ['hex', 'hardcode', 'color', 'semantic token'],
  'C1-tw-color': ['color utilit', 'semantic token', 'bypass'],
  'C1-arbitrary-value': ['arbitrary', 'spacing scale', 'radius'],
  'C1-arbitrary-layout': ['arbitrary', 'spacing scale'],
  'C1-arbitrary-other': ['arbitrary'],
  'C1-raw-style': ['inline style', 'arbitrary', 'spacing'],
  'C2-raw-element': ['raw', 'components come from', 'primitive'],
  'C2-shape-match': ['recreate', 'scratch', 'reimplement', 'divs'],
  'C3-missing-subparts': ['sub-component', 'composite', 'header', 'divs'],
  'C4-unspecced': ['spec'],
  'C4-spec-missing': ['spec'],
  'C4-no-meta': ['meta'],
  'C5-naming': ['kebab', 'naming'],
  'C6-import-path': ['import', 'components/ui'],
  'C6-shadow-primitive': ['components come from', 'never create'],
};

function loadJson(p) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; }
}

/** Meta loader (same transpile approach as compliance-audit; read-only). */
async function loadMetaIndex() {
  try {
    const { default: ts } = await import('typescript');
    const dir = path.join(ROOT, 'components', 'ui');
    const index = new Map();
    for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.meta.ts'))) {
      const js = ts.transpileModule(fs.readFileSync(path.join(dir, f), 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
      }).outputText;
      const mod = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
      const meta = Object.values(mod)[0];
      if (meta && meta.name) index.set(meta.name, meta);
    }
    return index;
  } catch {
    return new Map();
  }
}

/** Quote up to `max` lines of `docRel` containing any keyword (verbatim). */
function findRuleLines(docRel, keywords, max = 4) {
  const abs = path.join(ROOT, docRel);
  if (!fs.existsSync(abs)) return null;
  const lines = fs.readFileSync(abs, 'utf8').split('\n');
  const hits = [];
  lines.forEach((line, i) => {
    const lower = line.toLowerCase();
    if (keywords.some((k) => lower.includes(k)) && line.trim().length > 0) {
      hits.push({ line: i + 1, text: line.trim() });
    }
  });
  return hits.slice(0, max);
}

function governingDoc(cluster, metaIndex) {
  const meta = cluster.component ? metaIndex.get(cluster.component) : null;
  if (meta && meta.specPath && fs.existsSync(path.join(ROOT, meta.specPath))) return meta.specPath;
  return RULE_DOC_DEFAULTS[cluster.ruleId] || null;
}

function run() {
  return main();
}

async function main() {
  const argv = process.argv.slice(2);
  let detectPath = null;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--detect') detectPath = argv[++i];
  }
  if (!detectPath) {
    const files = fs.existsSync(DETECT_DIR)
      ? fs.readdirSync(DETECT_DIR).filter((f) => f.endsWith('.json')).sort()
      : [];
    if (files.length === 0) {
      console.error('\n  ✗ No Detect report found. Run `npm run detect` first.\n');
      process.exit(1);
    }
    detectPath = path.join(DETECT_DIR, files[files.length - 1]);
  }
  const detect = loadJson(path.resolve(ROOT, detectPath));
  if (!detect) {
    console.error(`\n  ✗ Could not read Detect report: ${detectPath}\n`);
    process.exit(1);
  }

  const sample = !!detect.demoMode;
  const metaIndex = await loadMetaIndex();
  const minBuilds = detect.thresholds?.hotspotMinBuilds ?? 3;

  console.log(`\n🧭 Compass Prescribe — tightening-plan scaffold${sample ? '  [SAMPLE from demo-mode Detect]' : ''}\n`);

  const hotClusters = (detect.clusters || []).filter((c) => c.hotspot);
  const watchClusters = (detect.clusters || []).filter((c) => !c.hotspot);
  const hotThemes = (detect.assumptionThemes || []).filter((t) => t.hotspot);
  const watchThemes = (detect.assumptionThemes || []).filter((t) => !t.hotspot);

  const md = [];
  md.push(`# Compass tightening plan — ${new Date().toISOString().slice(0, 10)}   [PROPOSED — nothing applied]`);
  if (sample) {
    md.push('\n> **SAMPLE PLAN — generated from demo-mode Detect output. The evidence below is synthetic fixture data, NOT real designer drift. Do not approve anything from this file; it exists to demonstrate the pipeline shape.**');
  }
  md.push(`\nSource: \`${path.relative(ROOT, path.resolve(ROOT, detectPath))}\` · hotspot threshold ≥${minBuilds} builds ·`);
  md.push('rule: **the loop proposes, the owner approves — no spec edit happens from this file; approved items are applied by a human-driven edit.**\n');

  // ── Proposals / decisions from clusters
  md.push('## Hotspots (approve/reject each after skill-run completion)');
  if (hotClusters.length === 0 && hotThemes.length === 0) {
    md.push('\n_No hotspots at threshold in this window. System is holding — see Watching below._');
  }

  let pNum = 0;
  let dNum = 0;
  for (const c of hotClusters) {
    if (!c.evidence || c.evidence.length === 0) continue; // no evidence, no prescription — invalid
    const doc = governingDoc(c, metaIndex);
    const quotes = doc ? findRuleLines(doc, RULE_KEYWORDS[c.ruleId] || []) : null;
    const caseA = !!(quotes && quotes.length > 0);
    if (caseA) {
      pNum++;
      md.push(`\n### P${pNum}: \`${c.component ?? '(no component)'}\` / \`${c.ruleId}\` — ambiguity-tightening candidate (Case A)`);
      md.push(`- Drifted in **${c.builds} builds** (${c.findings} findings)`);
      md.push(`- Evidence: ${c.evidence.map((e) => `\`drift-log/entries/${e}\``).join(', ')}`);
      md.push(`- Governing doc: \`${doc}\``);
      md.push('- Existing rule lines found (verbatim — mechanical keyword match, verify relevance):');
      for (const q of quotes) md.push(`  - L${q.line}: > ${q.text}`);
      md.push('- **Proposed edit:** `[DRAFT REQUIRED — the compass-audit skill run drafts the exact diff here, citing the evidence above; the scaffold never drafts rules. Owner approves or rejects.]`');
    } else {
      dNum++;
      md.push(`\n### D${dNum}: \`${c.component ?? '(no component)'}\` / \`${c.ruleId}\` — **NEEDS OWNER DECISION** (Case B)`);
      md.push(`- Drifted in **${c.builds} builds** (${c.findings} findings)`);
      md.push(`- Evidence: ${c.evidence.map((e) => `\`drift-log/entries/${e}\``).join(', ')}`);
      md.push(`- Governing doc searched: \`${doc ?? 'none resolvable'}\` — **no existing rule found on this topic.**`);
      md.push('- Fixing this requires a design opinion Compass has not made. The loop will NOT draft a rule.');
      md.push('- `[Skill run: describe the decision, list 2–3 options with trade-offs — no recommendation phrased as a rule.]`');
    }
  }

  // ── Assumption-theme hotspots
  for (const t of hotThemes) {
    const evidence = [...new Set(t.assumptions.map((a) => a.entry))];
    if (evidence.length === 0) continue;
    dNum++;
    md.push(`\n### D${dNum}: recurring assumption [${t.category}] "${t.theme}" — spec ambiguity`);
    md.push(`- The LLM assumed this **${t.count} times across ${evidence.length} builds** — the spec failed to decide it.`);
    md.push(`- Evidence: ${evidence.map((e) => `\`drift-log/entries/${e}\``).join(', ')}`);
    md.push('- Verbatim assumptions:');
    for (const a of t.assumptions) md.push(`  - "${a.text}" (\`${a.entry}\`)`);
    md.push('- `[Skill run: if a spec rule exists that should have decided this, treat as Case A and draft the disambiguation; if the spec is silent, this is Case B — NEEDS OWNER DECISION, options only.]`');
  }

  // ── Watching
  md.push('\n## Watching, not acting (below threshold)');
  const watching = [
    ...watchClusters.map((c) => `- \`${c.component ?? '—'}\` / \`${c.ruleId}\`: ${c.builds} build${c.builds === 1 ? '' : 's'}`),
    ...watchThemes.map((t) => `- assumption [${t.category}] "${t.theme}": ${t.builds} build${t.builds === 1 ? '' : 's'}`),
  ];
  md.push(watching.length ? watching.join('\n') : '_Nothing under watch._');

  if (detect.unscoredEntries?.length) {
    md.push('\n## Capture-discipline gap');
    md.push(detect.unscoredEntries.map((u) => `- \`${u}\` logged but never scored`).join('\n'));
  }

  md.push('\n---');
  md.push('_Approval flow: this plan feeds the monthly Claude.ai tightening session. Approved diffs are applied by a human-driven edit + audit re-run — never by this tool. Rejected items should be noted here so the loop does not re-propose them verbatim._');

  fs.mkdirSync(PROPOSALS_DIR, { recursive: true });
  const outName = `${new Date().toISOString().slice(0, 10)}__tightening-plan${sample ? '.SAMPLE' : ''}.md`;
  const outPath = path.join(PROPOSALS_DIR, outName);
  fs.writeFileSync(outPath, md.join('\n') + '\n');

  console.log(`  Hotspot clusters: ${hotClusters.length} → ${pNum} Case A candidate${pNum === 1 ? '' : 's'}, ${hotClusters.length - pNum} Case B`);
  console.log(`  Assumption hotspots: ${hotThemes.length}`);
  console.log(`  Watching: ${watchClusters.length + watchThemes.length}`);
  console.log(`\n  Plan: drift-log/proposals/${outName}`);
  console.log('  Nothing has been applied. Owner review required.\n');
}

run().catch((err) => {
  console.error(`\n  ✗ prescribe failed: ${err.message}\n`);
  process.exit(1);
});

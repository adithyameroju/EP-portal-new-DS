#!/usr/bin/env node

/**
 * Compass Owner Dashboard — cross-team drift rollup (S4 audit loop, owner view).
 *
 * The per-project dashboard (scripts/generate-dashboard.mjs → drift-log/dashboard.html)
 * answers "how is THIS repo doing?" from the compliance reports. THIS script answers
 * a different question — the OWNER's question — from the ledger itself:
 *
 *   Across every designer, every project, every Compass version — where is drift
 *   actually concentrating, and who/what is it landing on?
 *
 * It reads drift-log/entries/*.json (EXCLUDING demo entries) and, when present,
 * joins drift-log/reports/*.json by each report's `entry` field (latest wins —
 * exactly how detect-drift.mjs joins). From that it builds cross-team signals:
 *   - component hotspots   (frequency × severity, across all builds)
 *   - rule hotspots        (which ruleIds fire most, across all builds)
 *   - rule frequency       (the same, as a ranked bar view)
 *   - per-designer rollup  (builds, projects touched, findings, avg score)
 *   - per-project rollup   (builds, designers, findings)   [project = derived, see below]
 *   - trend over time      (builds + errors/warnings bucketed by day)
 *
 * TRUTHFULNESS IS THE POINT. This script never fabricates entries or numbers.
 * Demo entries (`"demo": true`) are excluded by default (the ledger is mostly
 * demo today), so on a fresh system this renders an honest near-empty page:
 * "No non-demo entries yet — this fills as designers build." Nothing is invented.
 *
 * `project` is NOT a field in the ledger schema, so it is DERIVED from each
 * entry's targetFiles (or an explicit `project` field if one ever appears) and
 * the page labels it as derived. No guessing is presented as fact.
 *
 * Output: self-contained static HTML → drift-log/owner-dashboard.html
 * (inline CSS + SVG, zero dependencies, opens by double-click, works offline).
 * Derived artifact — regenerate any time; safe to gitignore.
 *
 * Usage:
 *   node scripts/owner-dashboard.mjs            # non-demo entries only (default)
 *   node scripts/owner-dashboard.mjs --include-demo   # demonstrations only; output labeled DEMO
 *
 * Exit: 0 always (this observes; it never gates).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { ownerDriveSources } from './drift-config.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ENTRIES_DIR = path.join(ROOT, 'drift-log', 'entries');
const REPORTS_DIR = path.join(ROOT, 'drift-log', 'reports');
const OUT_PATH = path.join(ROOT, 'drift-log', 'owner-dashboard.html');

const DEFAULT_WEIGHTS = { errorWeight: 5, warningWeight: 1 };

function loadJson(p, fallback = null) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; }
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--include-demo') args.includeDemo = true;
  }
  return args;
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ─── project derivation (honest best-effort; no ledger `project` field exists) ─

/** The area a single file belongs to, e.g. components/blocks/migrate or app/test. */
function deriveArea(file) {
  const parts = String(file).split('/').filter(Boolean);
  if (parts[0] === 'components' && parts[1] === 'blocks' && parts[2]) return parts.slice(0, 3).join('/');
  if (parts.length >= 2) return parts.slice(0, 2).join('/');
  return parts[0] || '(root)';
}

/** Derive a project label for an entry: explicit field if present, else the
 * dominant file-area of its targetFiles. Always labeled "derived" in the UI. */
function deriveProject(entry) {
  if (entry.project && String(entry.project).trim()) return String(entry.project).trim();
  const files = Array.isArray(entry.targetFiles) ? entry.targetFiles : [];
  if (files.length === 0) return '(no files recorded)';
  const counts = new Map();
  for (const f of files) {
    const a = deriveArea(f);
    counts.set(a, (counts.get(a) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

// ─── data loading ────────────────────────────────────────────────────────────

function git(args) {
  try {
    return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  } catch {
    return '';
  }
}

// Collect committed drift-log entries from EVERY branch (local heads +
// remote-tracking refs), not just the checked-out one — branch-per-designer is the
// collection model, so a designer's entries live on THEIR branch. Deduped by
// filename (entries are immutable and uniquely named). Unioned with the working
// tree so the owner's own uncommitted local entries are also counted. If git is
// unavailable, this degrades to the working tree alone.
function collectEntryFiles() {
  const out = new Map(); // filename -> { ref, read: () => string }
  // 0. OWNER Drive telemetry (PRIMARY) — committed entries synced from every
  // designer's Google Drive subfolder. Attribution: the subfolder = username.
  const drive = ownerDriveSources();
  let driveCount = 0;
  if (drive) {
    for (const e of drive.entries) {
      if (out.has(e.name)) continue;
      out.set(e.name, { ref: `drive:${e.username}`, read: () => fs.readFileSync(e.path, 'utf8') });
      driveCount++;
    }
  }
  // 1. working tree (checked-out branch, including not-yet-committed entries)
  if (fs.existsSync(ENTRIES_DIR)) {
    for (const f of fs.readdirSync(ENTRIES_DIR).filter((f) => f.endsWith('.json'))) {
      out.set(f, { ref: '(working tree)', read: () => fs.readFileSync(path.join(ENTRIES_DIR, f), 'utf8') });
    }
  }
  // 2. every branch's committed entries
  const refs = git(['for-each-ref', '--format=%(refname)', 'refs/heads', 'refs/remotes'])
    .split('\n').map((s) => s.trim()).filter(Boolean);
  for (const ref of refs) {
    const listing = git(['ls-tree', '-r', '--name-only', ref, '--', 'drift-log/entries']);
    for (const p of listing.split('\n').map((s) => s.trim()).filter(Boolean)) {
      if (!p.endsWith('.json')) continue;
      const fname = p.split('/').pop();
      if (out.has(fname)) continue; // first source wins; entries are immutable
      out.set(fname, { ref, read: () => git(['show', `${ref}:${p}`]) });
    }
  }
  return { files: out, refsScanned: refs.length, driveCount, driveDesigners: drive ? drive.designers.length : 0 };
}

function loadLedger(includeDemo) {
  const { files, refsScanned, driveCount, driveDesigners } = collectEntryFiles();
  const entries = [];
  let demoSkipped = 0;
  for (const [f, src] of [...files.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    let e;
    try { e = JSON.parse(src.read()); } catch { continue; }
    if (!e) continue;
    if (e.demo && !includeDemo) { demoSkipped++; continue; }
    entries.push({ file: f, data: e, ref: src.ref });
  }
  return { entries, demoSkipped, refsScanned, driveCount, driveDesigners };
}

function loadReportsByEntry() {
  const files = fs.existsSync(REPORTS_DIR)
    ? fs.readdirSync(REPORTS_DIR).filter((f) => f.endsWith('.json')).sort()
    : [];
  const byEntry = new Map();
  let weights = { ...DEFAULT_WEIGHTS };
  for (const f of files) {
    const r = loadJson(path.join(REPORTS_DIR, f));
    if (!r) continue;
    if (r.rubric && typeof r.rubric.errorWeight === 'number') {
      weights = { errorWeight: r.rubric.errorWeight, warningWeight: r.rubric.warningWeight ?? 1 };
    }
    if (r.entry) byEntry.set(r.entry, r); // later files overwrite = latest wins (matches detect-drift)
  }
  return { byEntry, weights };
}

// ─── aggregation ─────────────────────────────────────────────────────────────

function aggregate(entries, reportsByEntry, weights) {
  const sev = (errors, warnings) => errors * weights.errorWeight + warnings * weights.warningWeight;

  const componentAgg = new Map(); // name -> {errors,warnings,builds:Set,designers:Set}
  const ruleAgg = new Map();      // ruleId -> {count,errors,warnings,level,builds:Set,designers:Set}
  const perDesigner = new Map();
  const perProject = new Map();
  const perVersion = new Map();
  const timeline = new Map();     // YYYY-MM-DD -> {builds,errors,warnings,scoreSum,scored}
  const scores = [];              // {t, score, designer, project}
  let scoredBuilds = 0;

  for (const { file, data } of entries) {
    const designer = data.designer || 'unknown';
    const project = deriveProject(data);
    const version = data.compassVersion || '0.0.0';
    const day = (data.timestamp || '').slice(0, 10) || 'unknown';
    const rel = `drift-log/entries/${file}`;
    const report = reportsByEntry.get(rel) || null;

    const d = perDesigner.get(designer) || { builds: 0, projects: new Set(), components: new Set(), assumptions: 0, errors: 0, warnings: 0, scoreSum: 0, scored: 0, tools: new Set() };
    d.builds++;
    d.projects.add(project);
    (data.componentsUsed || []).forEach((c) => d.components.add(c));
    d.assumptions += (data.assumptions || []).length;
    d.tools.add(data.tool || 'unknown');

    const pj = perProject.get(project) || { builds: 0, designers: new Set(), errors: 0, warnings: 0, components: new Set() };
    pj.builds++;
    pj.designers.add(designer);
    (data.componentsUsed || []).forEach((c) => pj.components.add(c));

    const ver = perVersion.get(version) || { builds: 0, errors: 0, warnings: 0 };
    ver.builds++;

    const tl = timeline.get(day) || { builds: 0, errors: 0, warnings: 0, scoreSum: 0, scored: 0 };
    tl.builds++;

    if (report) {
      scoredBuilds++;
      const errors = report.totals?.errors || 0;
      const warnings = report.totals?.warnings || 0;
      d.errors += errors; d.warnings += warnings;
      pj.errors += errors; pj.warnings += warnings;
      ver.errors += errors; ver.warnings += warnings;
      tl.errors += errors; tl.warnings += warnings;
      if (typeof report.score === 'number') {
        d.scoreSum += report.score; d.scored++;
        tl.scoreSum += report.score; tl.scored++;
        scores.push({ t: data.timestamp || '', score: report.score, designer, project });
      }
      for (const f of report.findings || []) {
        const r = ruleAgg.get(f.ruleId) || { ruleId: f.ruleId, count: 0, errors: 0, warnings: 0, level: f.level, builds: new Set(), designers: new Set() };
        r.count++;
        if (f.level === 'error') r.errors++; else r.warnings++;
        r.builds.add(file); r.designers.add(designer);
        ruleAgg.set(f.ruleId, r);
        if (f.component) {
          const c = componentAgg.get(f.component) || { component: f.component, errors: 0, warnings: 0, builds: new Set(), designers: new Set() };
          if (f.level === 'error') c.errors++; else c.warnings++;
          c.builds.add(file); c.designers.add(designer);
          componentAgg.set(f.component, c);
        }
      }
    }

    perDesigner.set(designer, d);
    perProject.set(project, pj);
    perVersion.set(version, ver);
    timeline.set(day, tl);
  }

  const componentHotspots = [...componentAgg.values()]
    .map((c) => ({ component: c.component, errors: c.errors, warnings: c.warnings, builds: c.builds.size, designers: c.designers.size, weight: sev(c.errors, c.warnings) }))
    .sort((a, b) => b.weight - a.weight || b.builds - a.builds);
  const ruleHotspots = [...ruleAgg.values()]
    .map((r) => ({ ruleId: r.ruleId, count: r.count, errors: r.errors, warnings: r.warnings, builds: r.builds.size, designers: r.designers.size, weight: sev(r.errors, r.warnings) }))
    .sort((a, b) => b.count - a.count || b.weight - a.weight);

  const designers = [...perDesigner.entries()]
    .map(([name, v]) => ({ name, builds: v.builds, projects: v.projects.size, components: v.components.size, assumptions: v.assumptions, errors: v.errors, warnings: v.warnings, avgScore: v.scored ? Math.round(v.scoreSum / v.scored) : null, tools: [...v.tools] }))
    .sort((a, b) => b.builds - a.builds || b.errors - a.errors);
  const projects = [...perProject.entries()]
    .map(([name, v]) => ({ name, builds: v.builds, designers: v.designers.size, errors: v.errors, warnings: v.warnings, components: v.components.size }))
    .sort((a, b) => b.builds - a.builds || b.errors - a.errors);
  const versions = [...perVersion.entries()]
    .map(([version, v]) => ({ version, builds: v.builds, errors: v.errors, warnings: v.warnings }))
    .sort((a, b) => String(a.version).localeCompare(String(b.version)));
  const trend = [...timeline.entries()]
    .map(([day, v]) => ({ day, builds: v.builds, errors: v.errors, warnings: v.warnings, avgScore: v.scored ? Math.round(v.scoreSum / v.scored) : null }))
    .sort((a, b) => a.day.localeCompare(b.day));

  return { componentHotspots, ruleHotspots, designers, projects, versions, trend, scores, scoredBuilds };
}

// ─── SVG builders (all render safely on empty input) ──────────────────────────

function hbarSvg(rows, { label, valueOf, captionOf, colorOf }) {
  if (rows.length === 0) return '<p class="muted">Nothing to show yet.</p>';
  const rowH = 26; const pad = 8; const labelW = 150; const W = 460;
  const H = pad * 2 + rows.length * rowH;
  const max = Math.max(1, ...rows.map(valueOf));
  const barMax = W - labelW - 60;
  let out = '';
  rows.forEach((r, i) => {
    const y = pad + i * rowH;
    const v = valueOf(r);
    const w = (v / max) * barMax;
    const color = colorOf ? colorOf(r) : '#7a62f0';
    out += `<text x="0" y="${y + 16}" class="hb-label">${esc(String(label(r)).slice(0, 22))}</text>`;
    out += `<rect x="${labelW}" y="${y + 5}" width="${Math.max(2, w).toFixed(1)}" height="14" rx="3" fill="${color}"><title>${esc(captionOf(r))}</title></rect>`;
    out += `<text x="${labelW + Math.max(2, w) + 6}" y="${y + 16}" class="hb-val">${esc(captionOf(r))}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="bar chart">${out}</svg>`;
}

function trendSvg(trend) {
  if (trend.length === 0) return '<p class="muted">No dated builds yet.</p>';
  const W = 460; const H = 170; const pad = 34;
  const maxBuilds = Math.max(1, ...trend.map((t) => t.builds));
  const n = trend.length;
  const slot = (W - pad * 2) / Math.max(1, n);
  const bw = Math.min(40, slot - 8);
  let bars = '';
  trend.forEach((t, i) => {
    const x = pad + i * slot + (slot - bw) / 2;
    const h = (t.builds / maxBuilds) * (H - pad * 2);
    const base = H - pad;
    bars += `<rect x="${x.toFixed(1)}" y="${(base - h).toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" rx="3" fill="#7a62f0"><title>${esc(t.day)}: ${t.builds} build${t.builds === 1 ? '' : 's'}, ${t.errors} err / ${t.warnings} warn</title></rect>`;
    bars += `<text x="${(x + bw / 2).toFixed(1)}" y="${H - 12}" text-anchor="middle" class="tick">${esc(t.day.slice(5))}</text>`;
    bars += `<text x="${(x + bw / 2).toFixed(1)}" y="${(base - h - 4).toFixed(1)}" text-anchor="middle" class="tick">${t.builds}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Builds over time">
    <line x1="${pad}" y1="${H - pad}" x2="${W - pad}" y2="${H - pad}" stroke="#3a3a40"/>${bars}</svg>`;
}

function scoreTrendSvg(scores) {
  const scored = scores.filter((s) => typeof s.score === 'number').sort((a, b) => String(a.t).localeCompare(String(b.t)));
  if (scored.length === 0) return '';
  const W = 460; const H = 150; const pad = 30;
  const step = scored.length > 1 ? (W - pad * 2) / (scored.length - 1) : 0;
  const pts = scored.map((s, i) => `${(pad + i * step).toFixed(1)},${(H - pad - (s.score / 100) * (H - pad * 2)).toFixed(1)}`);
  const dots = scored.map((s, i) => {
    const [x, y] = pts[i].split(',');
    return `<circle cx="${x}" cy="${y}" r="4" fill="#7a62f0"><title>${esc(s.designer)} · ${esc(s.project)} — ${s.score}/100</title></circle>`;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Score over time">
    <line x1="${pad}" y1="${H - pad}" x2="${W - pad}" y2="${H - pad}" stroke="#3a3a40"/>
    <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${H - pad}" stroke="#3a3a40"/>
    <text x="${pad - 6}" y="${pad + 4}" text-anchor="end" class="tick">100</text>
    <text x="${pad - 6}" y="${H - pad + 4}" text-anchor="end" class="tick">0</text>
    ${scored.length > 1 ? `<polyline points="${pts.join(' ')}" fill="none" stroke="#7a62f0" stroke-width="2"/>` : ''}${dots}</svg>`;
}

// ─── page assembly ───────────────────────────────────────────────────────────

function render({ agg, entryCount, demoSkipped, includeDemo }) {
  const generated = new Date().toISOString();
  const demoBanner = includeDemo
    ? '<div class="banner demo">DEMO MODE — includes demo entries; NOT real cross-team evidence.</div>'
    : '';

  // Fully empty: no non-demo entries at all.
  if (entryCount === 0) {
    const hint = demoSkipped > 0
      ? `${demoSkipped} demo entr${demoSkipped === 1 ? 'y is' : 'ies are'} present but excluded (demo entries never count as evidence).`
      : 'The ledger is empty.';
    const body = `
      <div class="empty">
        <h2>No non-demo entries yet</h2>
        <p>This owner view fills in as designers build and run <code>npm run log</code>.</p>
        <p class="muted">${esc(hint)} Run <code>--include-demo</code> only to preview the layout on sample data.</p>
        <pre>npm run log                 # capture a real build
npm run audit:compliance -- --entry drift-log/entries/&lt;file&gt;.json   # score it
node scripts/owner-dashboard.mjs   # regenerate this page</pre>
      </div>`;
    return page(generated, demoBanner, body, entryCount, demoSkipped);
  }

  const { componentHotspots, ruleHotspots, designers, projects, versions, trend, scores, scoredBuilds } = agg;

  const unscoredNote = scoredBuilds < entryCount
    ? `<p class="muted">${scoredBuilds}/${entryCount} builds scored. Component &amp; rule hotspots and severity numbers come only from scored builds — run <code>npm run audit:compliance</code> on the rest to complete the picture.</p>`
    : '';

  const compPanel = componentHotspots.length === 0
    ? `<p class="muted">No component-attributed findings in scored builds yet.</p>`
    : hbarSvg(componentHotspots.slice(0, 12), {
        label: (r) => r.component,
        valueOf: (r) => r.weight,
        captionOf: (r) => `${r.errors} err / ${r.warnings} warn · ${r.builds} build${r.builds === 1 ? '' : 's'} · ${r.designers} designer${r.designers === 1 ? '' : 's'}`,
        colorOf: (r) => (r.errors > 0 ? '#e05252' : '#d9a13b'),
      });

  const rulePanel = ruleHotspots.length === 0
    ? `<p class="muted">No rule findings in scored builds yet.</p>`
    : hbarSvg(ruleHotspots.slice(0, 12), {
        label: (r) => r.ruleId,
        valueOf: (r) => r.count,
        captionOf: (r) => `${r.count}× · ${r.errors} err / ${r.warnings} warn · ${r.builds} build${r.builds === 1 ? '' : 's'}`,
        colorOf: (r) => (r.errors > 0 ? '#e05252' : '#7a62f0'),
      });

  const designerRows = designers.map((d) => `<tr>
      <td>${esc(d.name)}</td>
      <td class="num">${d.builds}</td>
      <td class="num">${d.projects}</td>
      <td class="num">${d.components}</td>
      <td class="num">${d.assumptions}</td>
      <td class="num err">${d.errors}</td>
      <td class="num warn">${d.warnings}</td>
      <td class="num">${d.avgScore == null ? '<span class="muted">—</span>' : d.avgScore}</td>
    </tr>`).join('\n');

  const projectRows = projects.map((p) => `<tr>
      <td><code>${esc(p.name)}</code></td>
      <td class="num">${p.builds}</td>
      <td class="num">${p.designers}</td>
      <td class="num">${p.components}</td>
      <td class="num err">${p.errors}</td>
      <td class="num warn">${p.warnings}</td>
    </tr>`).join('\n');

  const versionRows = versions.map((v) => `<tr>
      <td><code>${esc(v.version)}</code></td>
      <td class="num">${v.builds}</td>
      <td class="num err">${v.errors}</td>
      <td class="num warn">${v.warnings}</td>
    </tr>`).join('\n');

  const scoreTrend = scoreTrendSvg(scores);

  const body = `
    <section class="kpis">
      <div class="kpi"><div class="kpi-num">${entryCount}</div><div class="kpi-lbl">non-demo builds</div></div>
      <div class="kpi"><div class="kpi-num">${designers.length}</div><div class="kpi-lbl">designers</div></div>
      <div class="kpi"><div class="kpi-num">${projects.length}</div><div class="kpi-lbl">projects (derived)</div></div>
      <div class="kpi"><div class="kpi-num">${scoredBuilds}</div><div class="kpi-lbl">scored builds</div></div>
    </section>
    ${unscoredNote}
    <section class="grid">
      <div class="panel"><h2>Component hotspots <span class="muted">(frequency × severity)</span></h2>${compPanel}</div>
      <div class="panel"><h2>Rule hotspots <span class="muted">(frequency, all builds)</span></h2>${rulePanel}</div>
      <div class="panel"><h2>Builds over time</h2>${trendSvg(trend)}</div>
      ${scoreTrend ? `<div class="panel"><h2>Compliance score over time</h2>${scoreTrend}</div>` : ''}
    </section>
    <section class="panel">
      <h2>Per-designer rollup</h2>
      <table><thead><tr><th>Designer</th><th class="num">Builds</th><th class="num">Projects</th><th class="num">Components</th><th class="num">Assumptions</th><th class="num">Err</th><th class="num">Warn</th><th class="num">Avg score</th></tr></thead>
      <tbody>${designerRows}</tbody></table>
    </section>
    <section class="grid">
      <div class="panel">
        <h2>Per-project rollup <span class="muted">(project derived from file paths)</span></h2>
        <table><thead><tr><th>Project / area</th><th class="num">Builds</th><th class="num">Designers</th><th class="num">Components</th><th class="num">Err</th><th class="num">Warn</th></tr></thead>
        <tbody>${projectRows}</tbody></table>
      </div>
      <div class="panel">
        <h2>Per Compass version</h2>
        <table><thead><tr><th>Version</th><th class="num">Builds</th><th class="num">Err</th><th class="num">Warn</th></tr></thead>
        <tbody>${versionRows}</tbody></table>
      </div>
    </section>`;

  return page(generated, demoBanner, body, entryCount, demoSkipped);
}

function page(generated, demoBanner, body, entryCount, demoSkipped) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Compass — Owner View (cross-team drift)</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; margin: 0; }
  body { font: 14px/1.5 -apple-system, "Segoe UI", Roboto, sans-serif; background: #131316; color: #e8e8ea; padding: 32px; }
  header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
  h1 { font-size: 20px; } h2 { font-size: 14px; margin-bottom: 10px; color: #bdbdc2; }
  .muted { color: #8a8a92; font-size: 12px; font-weight: 400; }
  .banner { border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; font-size: 13px; }
  .banner.demo { background: rgba(217,161,59,0.15); border: 1px solid #d9a13b; color: #e9c583; }
  .kpis { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; margin-bottom: 18px; }
  .kpi { background: #1c1c21; border: 1px solid #2e2e33; border-radius: 10px; padding: 16px 18px; }
  .kpi-num { font-size: 34px; font-weight: 700; color: #cbc0ff; }
  .kpi-lbl { font-size: 12px; color: #8a8a92; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); gap: 18px; margin-bottom: 18px; }
  .panel { background: #1c1c21; border: 1px solid #2e2e33; border-radius: 10px; padding: 18px; margin-bottom: 18px; }
  svg { width: 100%; height: auto; }
  .tick { fill: #8a8a92; font-size: 10px; }
  .hb-label { fill: #cfcfd6; font-size: 12px; }
  .hb-val { fill: #8a8a92; font-size: 11px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { text-align: left; padding: 6px 10px; border-bottom: 1px solid #26262c; }
  th { color: #8a8a92; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; }
  td.num, th.num { text-align: right; font-variant-numeric: tabular-nums; }
  .err { color: #e05252; } .warn { color: #d9a13b; }
  code { background: #26262c; border-radius: 4px; padding: 1px 5px; font-size: 12px; }
  .empty { max-width: 620px; margin: 10vh auto; text-align: center; }
  .empty pre { text-align: left; background: #131316; border: 1px solid #2e2e33; border-radius: 8px; padding: 14px; margin: 16px 0; overflow-x: auto; font-size: 12px; }
  footer { margin-top: 24px; }
</style>
</head>
<body>
<header>
  <h1>🧭 Compass — Owner View</h1>
  <span class="muted">cross-team drift rollup · generated ${esc(generated)} · ${entryCount} non-demo build${entryCount === 1 ? '' : 's'}${demoSkipped ? ` · ${demoSkipped} demo excluded` : ''} · derived artifact (safe to gitignore) — regenerate with <code>node scripts/owner-dashboard.mjs</code></span>
</header>
${demoBanner}
${body}
<footer class="muted">Owner view reads the ledger (<code>drift-log/entries/</code>) + joined reports (<code>drift-log/reports/</code>). Per-project dashboard is <code>npm run dashboard</code>. The loop proposes; the owner approves. Numbers here are only ever what the ledger holds.</footer>
</body>
</html>
`;
}

// ─── main ────────────────────────────────────────────────────────────────────

function run() {
  const args = parseArgs(process.argv.slice(2));
  console.log(`\n🧭 Compass Owner Dashboard — cross-team drift rollup${args.includeDemo ? '  [DEMO MODE]' : ''}\n`);

  const { entries, demoSkipped, refsScanned, driveCount, driveDesigners } = loadLedger(args.includeDemo);
  if (driveCount > 0) console.log(`  Drive telemetry (PRIMARY): ${driveCount} entr(y/ies) across ${driveDesigners} designer folder(s).`);
  console.log(`  Collected across ${refsScanned} branch ref(s) + working tree (fallback).`);
  const { byEntry, weights } = loadReportsByEntry();
  const agg = aggregate(entries, byEntry, weights);

  const html = render({ agg, entryCount: entries.length, demoSkipped, includeDemo: !!args.includeDemo, weights });
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, html);

  console.log(`  Non-demo builds: ${entries.length}${demoSkipped ? ` (${demoSkipped} demo excluded)` : ''}`);
  console.log(`  Scored builds:   ${agg.scoredBuilds}`);
  console.log(`  Designers:       ${agg.designers.length} · Projects (derived): ${agg.projects.length}`);
  console.log(`  Component hotspots: ${agg.componentHotspots.length} · Rule hotspots: ${agg.ruleHotspots.length}`);
  if (entries.length === 0) console.log('  → Rendered honest empty state (no non-demo entries yet).');
  console.log(`\n  Page: drift-log/owner-dashboard.html\n`);
}

run();

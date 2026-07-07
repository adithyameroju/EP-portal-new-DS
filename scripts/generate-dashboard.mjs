#!/usr/bin/env node

/**
 * Compass Health Dashboard generator — S4 audit loop, Part 5.
 *
 * Reads every compliance report in drift-log/reports/ and writes a single
 * self-contained static page to drift-log/dashboard.html (inline CSS + SVG,
 * zero dependencies — opens by double-click, works offline).
 *
 * Sections (modeled on designsystemops.com-style output):
 *   - Health radar        one axis per compliance dimension C1–C6
 *                         (C2/C3/C4 greyed out until S1 meta.ts lands)
 *   - Severity distribution   errors vs warnings per report over the window
 *   - Priority matrix     rule frequency × severity (top-right = fix first)
 *   - Per-component cards score, top failing rule, trend arrow
 *   - Trend line          overall score over time (the single most important
 *                         signal: is the loop working?)
 *
 * The dashboard is a DERIVED artifact: gitignored, regenerate any time with
 * `npm run dashboard`.
 *
 * Usage: node scripts/generate-dashboard.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPORTS_DIR = path.join(ROOT, 'drift-log', 'reports');
const OUT_PATH = path.join(ROOT, 'drift-log', 'dashboard.html');

const DIMENSIONS = [
  { id: 'C1', label: 'C1 Tokens' },
  { id: 'C2', label: 'C2 Provenance' },
  { id: 'C3', label: 'C3 Composites' },
  { id: 'C4', label: 'C4 Spec coverage' },
  { id: 'C5', label: 'C5 Naming' },
  { id: 'C6', label: 'C6 Imports' },
  { id: 'C7', label: 'C7 Fonts' },
];

// Axis liveness comes from what the latest report actually ran (an axis
// un-greys automatically the moment its check ships), with a pre-meta fallback.
// Tier ids roll up to their dimension axis (C7a → C7) — the axis is live once
// any tier of the check runs; ruleIds (C7-*) already aggregate the same way.
function liveSetOf(latest) {
  const implemented = latest?.checks?.implemented || ['C1', 'C5', 'C6'];
  return new Set(implemented.map((id) => (String(id).match(/^C\d+/) || [id])[0]));
}

// ─── Data loading ────────────────────────────────────────────────────────────

function loadReports() {
  if (!fs.existsSync(REPORTS_DIR)) return [];
  return fs.readdirSync(REPORTS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      try { return JSON.parse(fs.readFileSync(path.join(REPORTS_DIR, f), 'utf8')); }
      catch { return null; }
    })
    .filter(Boolean)
    .sort((a, b) => String(a.generatedAt).localeCompare(String(b.generatedAt)));
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Roll a report's byRule totals up to dimension level (C1-hex → C1). */
function dimensionTotals(report) {
  const dims = {};
  for (const f of report.findings || []) {
    const dim = f.ruleId.split('-')[0];
    const d = (dims[dim] ||= { errors: 0, warnings: 0 });
    d[f.level === 'error' ? 'errors' : 'warnings']++;
  }
  return dims;
}

function dimensionScore(report, dimId) {
  const rubric = report.rubric || { startScore: 100, errorWeight: 5, warningWeight: 1, floor: 0 };
  const d = dimensionTotals(report)[dimId] || { errors: 0, warnings: 0 };
  return Math.max(rubric.floor, rubric.startScore - rubric.errorWeight * d.errors - rubric.warningWeight * d.warnings);
}

// ─── SVG builders ────────────────────────────────────────────────────────────

function radarSvg(latest) {
  const liveSet = liveSetOf(latest);
  const cx = 160; const cy = 150; const R = 105; const n = DIMENSIONS.length;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i, r) => `${(cx + r * Math.cos(angle(i))).toFixed(1)},${(cy + r * Math.sin(angle(i))).toFixed(1)}`;

  let grid = '';
  for (const frac of [0.25, 0.5, 0.75, 1]) {
    grid += `<polygon points="${DIMENSIONS.map((_, i) => pt(i, R * frac)).join(' ')}" fill="none" stroke="#2e2e33" stroke-width="1"/>`;
  }
  let spokes = ''; let labels = '';
  DIMENSIONS.forEach((d, i) => {
    spokes += `<line x1="${cx}" y1="${cy}" x2="${pt(i, R).split(',')[0]}" y2="${pt(i, R).split(',')[1]}" stroke="#2e2e33" stroke-width="1"/>`;
    const lx = cx + (R + 26) * Math.cos(angle(i));
    const ly = cy + (R + 18) * Math.sin(angle(i));
    const live = liveSet.has(d.id);
    const cls = live ? 'axis-live' : 'axis-pending';
    labels += `<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" text-anchor="middle" class="${cls}">${esc(d.label)}${live ? '' : ' *'}</text>`;
  });

  let shape = '';
  if (latest) {
    const points = DIMENSIONS.map((d, i) => {
      const v = liveSet.has(d.id) ? dimensionScore(latest, d.id) : 0;
      return pt(i, (R * v) / 100);
    }).join(' ');
    shape = `<polygon points="${points}" fill="rgba(122,98,240,0.28)" stroke="#7a62f0" stroke-width="2"/>`;
  }
  return `<svg viewBox="0 0 320 300" role="img" aria-label="Health radar">${grid}${spokes}${shape}${labels}</svg>`;
}

function severityBarsSvg(reports) {
  const W = 460; const H = 180; const pad = 30;
  const maxTotal = Math.max(1, ...reports.map((r) => (r.totals?.errors || 0) + (r.totals?.warnings || 0)));
  const bw = Math.min(48, (W - pad * 2) / Math.max(1, reports.length) - 8);
  let bars = '';
  reports.forEach((r, i) => {
    const x = pad + i * ((W - pad * 2) / reports.length) + 4;
    const eh = ((r.totals?.errors || 0) / maxTotal) * (H - pad * 2);
    const wh = ((r.totals?.warnings || 0) / maxTotal) * (H - pad * 2);
    const base = H - pad;
    bars += `<rect x="${x}" y="${base - wh}" width="${bw}" height="${wh.toFixed(1)}" fill="#d9a13b"><title>${esc(r.scope)}: ${r.totals?.warnings || 0} warnings</title></rect>`;
    bars += `<rect x="${x}" y="${base - wh - eh}" width="${bw}" height="${eh.toFixed(1)}" fill="#e05252"><title>${esc(r.scope)}: ${r.totals?.errors || 0} errors</title></rect>`;
    bars += `<text x="${x + bw / 2}" y="${H - 12}" text-anchor="middle" class="tick">${esc(String(r.scope).slice(0, 8))}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Severity distribution">${bars}
    <line x1="${pad}" y1="${H - pad}" x2="${W - pad}" y2="${H - pad}" stroke="#3a3a40"/></svg>`;
}

function priorityMatrixSvg(reports) {
  // frequency (x) × severity share (y) per ruleId across the window
  const W = 460; const H = 220; const pad = 40;
  const rules = {};
  for (const r of reports) {
    for (const f of r.findings || []) {
      const entry = (rules[f.ruleId] ||= { count: 0, errors: 0 });
      entry.count++;
      if (f.level === 'error') entry.errors++;
    }
  }
  const ids = Object.keys(rules);
  const maxCount = Math.max(1, ...ids.map((id) => rules[id].count));
  let dots = '';
  ids.forEach((id) => {
    const { count, errors } = rules[id];
    const x = pad + (count / maxCount) * (W - pad * 2);
    const sev = count ? errors / count : 0; // 0 = all warnings, 1 = all errors
    const y = H - pad - sev * (H - pad * 2);
    const inDanger = count / maxCount > 0.5 && sev > 0.5;
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="7" fill="${inDanger ? '#e05252' : '#7a62f0'}"><title>${esc(id)}: ${count} findings, ${Math.round(sev * 100)}% errors</title></circle>
      <text x="${(x + 10).toFixed(1)}" y="${(y + 4).toFixed(1)}" class="tick">${esc(id)}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Priority matrix">
    <rect x="${W / 2}" y="${pad / 2}" width="${W / 2 - pad / 2}" height="${H / 2 - pad / 2}" fill="rgba(224,82,82,0.08)"/>
    <line x1="${pad}" y1="${H - pad}" x2="${W - pad}" y2="${H - pad}" stroke="#3a3a40"/>
    <line x1="${pad}" y1="${pad / 2}" x2="${pad}" y2="${H - pad}" stroke="#3a3a40"/>
    <text x="${W - pad}" y="${H - pad + 16}" text-anchor="end" class="tick">frequency →</text>
    <text x="${pad - 6}" y="${pad / 2 + 8}" text-anchor="end" class="tick">severity ↑</text>
    <text x="${W - pad - 4}" y="${pad / 2 + 16}" text-anchor="end" class="tick" fill="#e05252">fix first</text>
    ${dots}</svg>`;
}

function trendSvg(reports) {
  const W = 460; const H = 160; const pad = 30;
  const scored = reports.filter((r) => typeof r.score === 'number');
  if (scored.length === 0) return '';
  const step = scored.length > 1 ? (W - pad * 2) / (scored.length - 1) : 0;
  const pts = scored.map((r, i) => `${(pad + i * step).toFixed(1)},${(H - pad - (r.score / 100) * (H - pad * 2)).toFixed(1)}`);
  const dots = scored.map((r, i) => {
    const [x, y] = pts[i].split(',');
    return `<circle cx="${x}" cy="${y}" r="4" fill="#7a62f0"><title>${esc(r.scope)} — ${r.score}/100 (${esc(r.generatedAt)})</title></circle>`;
  }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Score trend">
    <line x1="${pad}" y1="${H - pad}" x2="${W - pad}" y2="${H - pad}" stroke="#3a3a40"/>
    <line x1="${pad}" y1="${pad}" x2="${pad}" y2="${H - pad}" stroke="#3a3a40"/>
    <text x="${pad - 6}" y="${pad + 4}" text-anchor="end" class="tick">100</text>
    <text x="${pad - 6}" y="${H - pad + 4}" text-anchor="end" class="tick">0</text>
    ${scored.length > 1 ? `<polyline points="${pts.join(' ')}" fill="none" stroke="#7a62f0" stroke-width="2"/>` : ''}
    ${dots}</svg>`;
}

// ─── Component cards ─────────────────────────────────────────────────────────

function componentCards(reports) {
  const latest = reports[reports.length - 1];
  const prev = reports[reports.length - 2];
  const all = {};
  for (const r of reports) {
    for (const [name, v] of Object.entries(r.perComponent || {})) {
      const a = (all[name] ||= { errors: 0, warnings: 0 });
      a.errors += v.errors; a.warnings += v.warnings;
    }
  }
  const names = Object.keys(all).sort((a, b) => (all[b].errors - all[a].errors) || (all[b].warnings - all[a].warnings));
  if (names.length === 0) {
    return '<p class="muted">No findings attributable to a specific component yet.</p>';
  }
  return names.map((name) => {
    const cur = latest?.perComponent?.[name];
    const before = prev?.perComponent?.[name];
    let arrow = '·';
    let arrowCls = 'flat';
    if (cur && before) {
      if (cur.errors < before.errors) { arrow = '▼'; arrowCls = 'good'; }
      else if (cur.errors > before.errors) { arrow = '▲'; arrowCls = 'bad'; }
    }
    // top failing rule for this component across the window
    const ruleCounts = {};
    for (const r of reports) {
      for (const f of r.findings || []) {
        if (f.component === name) ruleCounts[f.ruleId] = (ruleCounts[f.ruleId] || 0) + 1;
      }
    }
    const topRule = Object.entries(ruleCounts).sort((a, b) => b[1] - a[1])[0];
    return `<div class="card">
      <div class="card-head"><code>${esc(name)}</code><span class="trend ${arrowCls}">${arrow}</span></div>
      <div class="card-nums"><span class="err">${all[name].errors} err</span> <span class="warn">${all[name].warnings} warn</span></div>
      <div class="card-rule">${topRule ? `top rule: <code>${esc(topRule[0])}</code> ×${topRule[1]}` : ''}</div>
    </div>`;
  }).join('\n');
}

// ─── Page assembly ───────────────────────────────────────────────────────────

function render(reports) {
  const latest = reports[reports.length - 1];
  const generated = new Date().toISOString();

  const emptyState = `
    <div class="empty">
      <h2>No builds scored yet</h2>
      <p>The loop starts with capture. After an AI-assisted build, run:</p>
      <pre>npm run log
npm run audit:compliance -- --entry drift-log/entries/&lt;your-entry&gt;.json
npm run dashboard</pre>
      <p class="muted">This page regenerates from <code>drift-log/reports/</code> each time.</p>
    </div>`;

  const body = reports.length === 0 ? emptyState : `
    <section class="hero">
      <div class="score-big ${latest.score >= 90 ? 'good' : latest.score >= 70 ? 'mid' : 'bad'}">
        <div class="num">${latest.score}</div>
        <div class="lbl">latest compliance score / 100<br><span class="muted">${esc(latest.scope)} · ${esc(latest.generatedAt)}</span></div>
      </div>
      <div class="panel">
        <h2>Health radar</h2>
        ${radarSvg(latest)}
        <p class="muted">* greyed axes = checks not run in the latest report (C7a static font check runs in repo mode; the C7b paint probe is design-only).</p>
      </div>
    </section>
    <section class="grid">
      <div class="panel"><h2>Score trend <span class="muted">(the loop-is-working signal)</span></h2>${trendSvg(reports)}</div>
      <div class="panel"><h2>Severity distribution</h2>${severityBarsSvg(reports)}</div>
      <div class="panel"><h2>Priority matrix</h2>${priorityMatrixSvg(reports)}</div>
      <div class="panel"><h2>Per-component score cards</h2><div class="cards">${componentCards(reports)}</div></div>
    </section>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Compass — System Health</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; margin: 0; }
  body { font: 14px/1.5 -apple-system, "Segoe UI", Roboto, sans-serif; background: #131316; color: #e8e8ea; padding: 32px; }
  header { display: flex; align-items: baseline; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
  h1 { font-size: 20px; } h2 { font-size: 14px; margin-bottom: 10px; color: #bdbdc2; }
  .muted { color: #8a8a92; font-size: 12px; }
  .hero { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 20px; }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 20px; }
  .panel { background: #1c1c21; border: 1px solid #2e2e33; border-radius: 10px; padding: 18px; }
  svg { width: 100%; height: auto; }
  .axis-live { fill: #e8e8ea; font-size: 11px; } .axis-pending { fill: #5a5a62; font-size: 11px; font-style: italic; }
  .tick { fill: #8a8a92; font-size: 10px; }
  .score-big { background: #1c1c21; border: 1px solid #2e2e33; border-radius: 10px; padding: 24px; display: flex; align-items: center; gap: 16px; min-width: 260px; }
  .score-big .num { font-size: 56px; font-weight: 700; }
  .score-big.good .num { color: #58b06d; } .score-big.mid .num { color: #d9a13b; } .score-big.bad .num { color: #e05252; }
  .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 10px; }
  .card { background: #232329; border: 1px solid #2e2e33; border-radius: 8px; padding: 10px; }
  .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
  .card-nums { font-size: 12px; margin-bottom: 4px; } .card-rule { font-size: 11px; color: #8a8a92; }
  .err { color: #e05252; } .warn { color: #d9a13b; }
  .trend.good { color: #58b06d; } .trend.bad { color: #e05252; } .trend.flat { color: #8a8a92; }
  code { background: #26262c; border-radius: 4px; padding: 1px 5px; font-size: 12px; }
  .empty { max-width: 560px; margin: 12vh auto; text-align: center; }
  .empty pre { text-align: left; background: #1c1c21; border: 1px solid #2e2e33; border-radius: 8px; padding: 14px; margin: 14px 0; overflow-x: auto; }
  footer { margin-top: 28px; }
</style>
</head>
<body>
<header>
  <h1>🧭 Compass — System Health</h1>
  <span class="muted">generated ${esc(generated)} · ${reports.length} report${reports.length === 1 ? '' : 's'} in window · derived artifact (gitignored) — regenerate with <code>npm run dashboard</code></span>
</header>
${body}
<footer class="muted">S4 audit loop · the loop proposes, the owner approves · reports: <code>drift-log/reports/</code> · ledger: <code>drift-log/entries/</code></footer>
</body>
</html>
`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

const reports = loadReports();
fs.writeFileSync(OUT_PATH, render(reports));
console.log(`\n🧭 Dashboard written to ${path.relative(ROOT, OUT_PATH)} (${reports.length} report${reports.length === 1 ? '' : 's'} rendered)\n`);

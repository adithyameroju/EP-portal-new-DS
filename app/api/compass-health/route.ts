// Compass Health — dev-only API route.
//
// Runs the Compass audits server-side and returns a score SCOPED TO YOUR WORK
// (the files you've added or changed vs the pristine clone), so the number
// reflects your feature — not the whole design-system repo. It executes shell
// commands, so it MUST NEVER run in a deployed build: the guard below refuses
// when NODE_ENV === 'production'.
//
// Two modes:
//   GET /api/compass-health                → live scoped run over your changed files
//   GET /api/compass-health?build=<f.json> → THIS build's scorecard: the paired report
//                                            drift-log/reports/<f.json> (+ its ledger
//                                            entry), no re-run. This is what the
//                                            end-of-build chat link opens.
//
// Scaffolded by the "Using Compass in Loop" setup. Safe to delete.

import { NextResponse, type NextRequest } from 'next/server'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

export const runtime = 'nodejs'        // needs child_process — not the edge runtime
export const dynamic = 'force-static'

const SCOPE_EXTS = ['.tsx', '.ts', '.jsx', '.css']
const SELF = ['app/compass-health/', 'app/api/compass-health/'] // never score this tool itself

type Finding = {
  ruleId?: string
  level?: string
  file?: string
  line?: number
  message?: string
  suggestion?: string
  component?: string
  pointCost?: number
}

type Assumption = { text: string; category: string }

type Report = {
  generatedAt?: string
  mode?: string
  scope?: string
  entry?: string | null
  rubric?: { startScore?: number; errorWeight?: number; warningWeight?: number }
  checks?: { implemented?: string[]; skipped?: string[] }
  filesScanned?: number
  totals?: { errors?: number; warnings?: number; byRule?: Record<string, number> }
  score?: number
  designer?: string | null
  source?: string | null
  componentsUsed?: string[]
  assumptions?: Assumption[]
  findings?: Finding[]
}

type Entry = {
  designer?: string
  source?: string
  componentsUsed?: string[]
  assumptions?: Assumption[]
}

type ScriptRun = { ok: boolean; code: number | null; stdout: string; stderr: string }

// Point cost per finding from the report's OWN rubric (errors −5, warnings −1 by
// default). Reports written before 2026-09-10 have no pointCost — derive it.
function withCost(findings: Finding[], rubric?: Report['rubric']): Finding[] {
  const e = rubric?.errorWeight ?? 5
  const w = rubric?.warningWeight ?? 1
  return findings.map((f) => ({ ...f, pointCost: f.pointCost ?? -(f.level === 'error' ? e : w) }))
}

function readJson<T>(abs: string): T | null {
  try {
    return JSON.parse(fs.readFileSync(abs, 'utf8')) as T
  } catch {
    return null
  }
}

function runScript(cwd: string, args: string[]): ScriptRun {
  const r = spawnSync(process.execPath, args, {
    cwd,
    encoding: 'utf8',
    timeout: 120_000,
    maxBuffer: 20 * 1024 * 1024,
  })
  return {
    ok: r.status === 0,
    code: r.status,
    stdout: r.stdout ?? '',
    stderr: r.stderr ?? (r.error ? String(r.error.message) : ''),
  }
}

function git(cwd: string, args: string[]): string[] {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8', timeout: 15_000 })
  if (r.status !== 0) return []
  return (r.stdout ?? '').split('\n').map((s) => s.trim()).filter(Boolean)
}

// "Your work" = files you've added or changed vs the pristine clone:
// untracked (new) + modified-vs-HEAD + committed-since-upstream (branch work).
function scopeFiles(cwd: string): string[] {
  const set = new Set<string>()
  git(cwd, ['ls-files', '--others', '--exclude-standard']).forEach((f) => set.add(f))
  git(cwd, ['diff', '--name-only', 'HEAD']).forEach((f) => set.add(f))
  git(cwd, ['diff', '--name-only', '@{upstream}..HEAD']).forEach((f) => set.add(f))
  return [...set].filter(
    (f) =>
      SCOPE_EXTS.includes(path.extname(f)) &&
      !SELF.some((s) => f.startsWith(s)) &&
      !f.startsWith('node_modules/') &&
      !f.startsWith('.next/') &&
      fs.existsSync(path.join(cwd, f)),
  )
}

function newestReport(cwd: string): Report | null {
  const dir = path.join(cwd, 'drift-log', 'reports')
  if (!fs.existsSync(dir)) return null
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ f, m: fs.statSync(path.join(dir, f)).mtimeMs }))
    .sort((a, b) => b.m - a.m)
  if (files.length === 0) return null
  return readJson<Report>(path.join(dir, files[0].f))
}

export async function GET(request: NextRequest) {
  if (process.env.GITHUB_PAGES === 'true') {
    return NextResponse.json({ empty: true, hosted: true })
  }

  // HARD REQUIREMENT: never execute in production.
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'Compass Health is a dev-only tool and is disabled in production.' },
      { status: 403 },
    )
  }

  const cwd = process.cwd()

  if (!fs.existsSync(path.join(cwd, 'scripts', 'token-audit.mjs'))) {
    return NextResponse.json(
      {
        error:
          'Compass is not set up in this project yet — scripts/token-audit.mjs is missing. ' +
          'Run the "Using Compass in Loop" setup first.',
      },
      { status: 412 },
    )
  }

  const ranAt = new Date().toISOString()

  // ── Scorecard mode: THIS build's paired report, no re-run ──────────────────
  const build = request.nextUrl.searchParams.get('build')
  if (build) {
    const name = path.basename(build) // a filename only — never a path
    if (!name.endsWith('.json')) {
      return NextResponse.json({ error: 'build must be a report filename ending in .json' }, { status: 400 })
    }
    const report = readJson<Report>(path.join(cwd, 'drift-log', 'reports', name))
    if (!report) {
      return NextResponse.json(
        {
          error:
            `No report named ${name} in drift-log/reports/ — it may have been cleaned up. ` +
            'Re-run the build, or press "Re-run checks" for a live score.',
        },
        { status: 404 },
      )
    }
    // The paired ledger entry (committed evidence) — only ever read from inside the repo.
    let entry: Entry | null = null
    if (report.entry) {
      const abs = path.resolve(cwd, report.entry)
      if (abs.startsWith(cwd + path.sep)) entry = readJson<Entry>(abs)
    }
    return NextResponse.json({
      ranAt,
      scorecard: {
        build: name,
        generatedAt: report.generatedAt ?? null,
        mode: report.mode ?? null,
        scope: report.scope ?? null,
        score: report.score ?? null,
        startScore: report.rubric?.startScore ?? 100,
        errors: report.totals?.errors ?? 0,
        warnings: report.totals?.warnings ?? 0,
        byRule: report.totals?.byRule ?? {},
        implemented: report.checks?.implemented ?? [],
        skipped: report.checks?.skipped ?? [],
        filesScanned: report.filesScanned ?? 0,
        designer: report.designer ?? entry?.designer ?? null,
        source: report.source ?? entry?.source ?? null,
        components: report.componentsUsed?.length ? report.componentsUsed : (entry?.componentsUsed ?? []),
        assumptions: report.assumptions?.length ? report.assumptions : (entry?.assumptions ?? []),
        findings: withCost(report.findings ?? [], report.rubric).slice(0, 200),
        entryFile: report.entry ?? null,
      },
    })
  }

  // ── Live mode: scoped run over your changed files ──────────────────────────
  const files = scopeFiles(cwd)

  // Whole-repo commit gate — pass/fail only, so you know nothing project-wide is broken.
  const gate = runScript(cwd, ['scripts/token-audit.mjs'])
  const repoGate = { pass: gate.ok }

  // Nothing built yet → friendly empty state, no score.
  if (files.length === 0) {
    return NextResponse.json({ ranAt, empty: true, scope: { files: [], count: 0 }, repoGate })
  }

  // Scoped compliance over YOUR files (C1 token discipline + C2–C6 + C8; C7a is repo-level, skipped).
  runScript(cwd, ['scripts/compliance-audit.mjs', '--files', ...files])
  const r = newestReport(cwd)

  // The rich trend dashboard is an OWNER/admin artifact (scripts/owner-dashboard.mjs),
  // not part of this build-only designer view. We deliberately do NOT generate or
  // expose it here.

  const findings = withCost(r?.findings ?? [], r?.rubric)
  const c1 = findings.filter((f) => String(f.ruleId ?? '').startsWith('C1'))
  const c1Errors = c1.filter((f) => f.level === 'error').length
  const c1Warnings = c1.filter((f) => f.level === 'warning').length

  return NextResponse.json({
    ranAt,
    empty: false,
    scope: { files, count: files.length },
    repoGate,
    // Token discipline for YOUR files (from the scoped C1 checks).
    token: { pass: c1Errors === 0, errors: c1Errors, warnings: c1Warnings },
    compliance: {
      ran: !!r,
      score: r?.score ?? null,
      startScore: r?.rubric?.startScore ?? null,
      errors: r?.totals?.errors ?? null,
      warnings: r?.totals?.warnings ?? null,
      byRule: r?.totals?.byRule ?? {},
      implemented: r?.checks?.implemented ?? [],
      skipped: r?.checks?.skipped ?? [],
      findings: findings.slice(0, 200),
    },
  })
}

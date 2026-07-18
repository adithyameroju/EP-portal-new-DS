// Compass Health — dev-only API route.
//
// Runs the Compass audits server-side and returns a score SCOPED TO YOUR WORK
// (the files you've added or changed vs the pristine clone), so the number
// reflects your feature — not the whole design-system repo. It executes shell
// commands, so it MUST NEVER run in a deployed build: the guard below refuses
// when NODE_ENV === 'production'.
//
// Scaffolded by the "Using Compass in Loop" setup. Safe to delete.

import { NextResponse } from 'next/server'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

export const runtime = 'nodejs'        // needs child_process — not the edge runtime
export const dynamic = 'force-dynamic' // never cache; always re-run on request

const SCOPE_EXTS = ['.tsx', '.ts', '.jsx', '.css']
const SELF = ['app/compass-health/', 'app/api/compass-health/'] // never score this tool itself

type ScriptRun = { ok: boolean; code: number | null; stdout: string; stderr: string }

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

function newestReport(cwd: string): Record<string, unknown> | null {
  const dir = path.join(cwd, 'drift-log', 'reports')
  if (!fs.existsSync(dir)) return null
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ f, m: fs.statSync(path.join(dir, f)).mtimeMs }))
    .sort((a, b) => b.m - a.m)
  if (files.length === 0) return null
  try {
    return JSON.parse(fs.readFileSync(path.join(dir, files[0].f), 'utf8'))
  } catch {
    return null
  }
}

export async function GET() {
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
  const files = scopeFiles(cwd)

  // Whole-repo commit gate — pass/fail only, so you know nothing project-wide is broken.
  const gate = runScript(cwd, ['scripts/token-audit.mjs'])
  const repoGate = { pass: gate.ok }

  // Nothing built yet → friendly empty state, no score.
  if (files.length === 0) {
    return NextResponse.json({ ranAt, empty: true, scope: { files: [], count: 0 }, repoGate, dashboardUrl: null })
  }

  // Scoped compliance over YOUR files (C1 token discipline + C2–C6; C7a is repo-level, skipped).
  runScript(cwd, ['scripts/compliance-audit.mjs', '--files', ...files])
  const report = newestReport(cwd)

  // Dashboard (repo-wide trend) — regenerate and expose under /public.
  let dashboardUrl: string | null = null
  const dash = runScript(cwd, ['scripts/generate-dashboard.mjs'])
  const dashSrc = path.join(cwd, 'drift-log', 'dashboard.html')
  if (dash.ok && fs.existsSync(dashSrc)) {
    try {
      const pub = path.join(cwd, 'public')
      fs.mkdirSync(pub, { recursive: true })
      fs.copyFileSync(dashSrc, path.join(pub, 'compass-dashboard.html'))
      dashboardUrl = '/compass-dashboard.html'
    } catch {
      dashboardUrl = null
    }
  }

  const r = report as
    | {
        score?: number
        rubric?: { startScore?: number }
        totals?: { errors?: number; warnings?: number; byRule?: Record<string, number> }
        checks?: { implemented?: string[]; skipped?: string[] }
        findings?: Array<{ ruleId?: string; level?: string }>
      }
    | null

  const findings = r?.findings ?? []
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
    dashboardUrl,
  })
}

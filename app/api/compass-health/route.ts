// Compass Health — dev-only API route.
//
// Runs the Compass audits server-side and returns structured results for the
// /compass-health page. It executes shell commands, so it MUST NEVER run in a
// deployed build: the guard below refuses when NODE_ENV === 'production'.
//
// Scaffolded by the "Using Compass in Loop" setup. Safe to delete.

import { NextResponse } from 'next/server'
import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

export const runtime = 'nodejs'        // needs child_process — not the edge runtime
export const dynamic = 'force-dynamic' // never cache; always re-run on request

type ScriptRun = { ok: boolean; code: number | null; stdout: string; stderr: string }

function runScript(cwd: string, script: string): ScriptRun {
  const r = spawnSync(process.execPath, [script], {
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

  // Setup sanity: are the audit scripts even here?
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

  // 1 · Token audit — the hard commit gate (0 errors required).
  const token = runScript(cwd, 'scripts/token-audit.mjs')
  const tokErrors = Number(token.stdout.match(/Errors:\s+(\d+)/)?.[1] ?? -1)
  const tokWarnings = Number(token.stdout.match(/Warnings:\s+(\d+)/)?.[1] ?? -1)

  // 2 · Compliance audit — advisory score; writes a JSON report we read back.
  const compliance = runScript(cwd, 'scripts/compliance-audit.mjs')
  const report = newestReport(cwd)

  // 3 · Dashboard — regenerate and expose it under /public so the page can link it.
  let dashboardUrl: string | null = null
  const dash = runScript(cwd, 'scripts/generate-dashboard.mjs')
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
        findings?: unknown[]
      }
    | null

  return NextResponse.json({
    ranAt: new Date().toISOString(),
    token: {
      pass: token.ok,
      errors: tokErrors,
      warnings: tokWarnings,
      raw: token.stdout.trim().split('\n').slice(-12).join('\n'),
    },
    compliance: {
      ran: !!r,
      score: r?.score ?? null,
      startScore: r?.rubric?.startScore ?? null,
      errors: r?.totals?.errors ?? null,
      warnings: r?.totals?.warnings ?? null,
      byRule: r?.totals?.byRule ?? {},
      implemented: r?.checks?.implemented ?? [],
      skipped: r?.checks?.skipped ?? [],
      findings: (r?.findings ?? []).slice(0, 200),
      note: compliance.stderr && !r ? compliance.stderr.trim() : null,
    },
    dashboardUrl,
  })
}

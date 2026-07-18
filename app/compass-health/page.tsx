'use client'

// Compass Health — designer-facing, no terminal needed.
//
// Shows your live Compass score by calling /api/compass-health (which runs the
// audits server-side). Dev-only. Scaffolded by the "Using Compass in Loop"
// setup — safe to delete.

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

type Finding = {
  ruleId?: string
  level?: string
  file?: string
  line?: number
  message?: string
  suggestion?: string
}

type Health = {
  ranAt: string
  token: { pass: boolean; errors: number; warnings: number; raw: string }
  compliance: {
    ran: boolean
    score: number | null
    startScore: number | null
    errors: number | null
    warnings: number | null
    byRule: Record<string, number>
    implemented: string[]
    skipped: string[]
    findings: Finding[]
    note: string | null
  }
  dashboardUrl: string | null
}

const RULE_PLAIN: Record<string, string> = {
  C1: 'Tokens — hard-coded colors / sizes instead of Compass tokens',
  C2: 'Provenance — a raw HTML element where a Compass component exists',
  C3: 'Composites — a component used without its proper sub-parts',
  C4: 'Spec coverage — a component with no written spec yet',
  C5: 'Naming — a file or folder that is not kebab-case',
  C6: 'Imports — a Compass primitive not imported from @/components/ui',
  C7a: 'Fonts — a declared font family with no matching @font-face',
}

function Card(props: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-border bg-card p-6 text-card-foreground ${props.className ?? ''}`}>
      {props.children}
    </div>
  )
}

export default function CompassHealthPage() {
  const [data, setData] = useState<Health | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const run = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/compass-health', { cache: 'no-store' })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? `Request failed (${res.status})`)
        setData(null)
      } else {
        setData(json as Health)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not reach the health API.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    run()
  }, [run])

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Compass Health</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Your project&rsquo;s live Compass score — no terminal required. This runs the same
            checks the design system uses: the token gate (blocks bad colors and sizes) and the
            advisory compliance audit (grades how on-Compass your components are).
          </p>
        </div>
        <Button variant="default" onClick={run} disabled={loading}>
          {loading ? 'Running…' : 'Re-run checks'}
        </Button>
      </header>

      {error && (
        <Card className="mb-6 border-destructive">
          <h2 className="text-base font-semibold text-destructive">Couldn&rsquo;t run the checks</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </Card>
      )}

      {loading && !data && (
        <p className="text-sm text-muted-foreground">Running the audits… this takes a few seconds.</p>
      )}

      {data && (
        <div className="space-y-6">
          {/* Token audit — the hard gate */}
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Token audit</h2>
              <span
                className={`rounded-md border px-3 py-1 text-sm font-medium ${
                  data.token.pass ? 'border-border text-foreground' : 'border-destructive text-destructive'
                }`}
              >
                {data.token.pass ? 'PASS' : 'FAILING'}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              This is the <strong>hard gate</strong>. Errors block a commit — they mean a hard-coded
              color or size slipped in where a Compass token belongs. Warnings are informational.
            </p>
            <div className="mt-4 flex gap-6 text-sm">
              <span className="text-foreground">
                Errors: <strong className={data.token.errors > 0 ? 'text-destructive' : 'text-foreground'}>{data.token.errors}</strong>
              </span>
              <span className="text-muted-foreground">Warnings: {data.token.warnings}</span>
            </div>
            {!data.token.pass && (
              <p className="mt-3 text-sm text-muted-foreground">
                What to do: open the files listed below, replace the flagged hard-coded value with the
                Compass token it suggests, then press <strong>Re-run checks</strong>.
              </p>
            )}
          </Card>

          {/* Compliance — advisory */}
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Compliance score</h2>
              {data.compliance.score != null && (
                <span className="rounded-md border border-border px-3 py-1 text-sm font-medium text-foreground">
                  {data.compliance.score} / {data.compliance.startScore ?? 100}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              This is <strong>advisory</strong> — a health signal, not a blocker. It grades how well
              your components follow the system (right components, right tokens, right structure).
            </p>

            {Object.keys(data.compliance.byRule).length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-foreground">Which checks fired</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(data.compliance.byRule).map(([rule, n]) => (
                    <span
                      key={rule}
                      title={RULE_PLAIN[rule] ?? rule}
                      className="rounded-md border border-border bg-muted px-2 py-1 text-xs text-foreground"
                    >
                      {rule} × {n}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {data.compliance.skipped.length > 0 && (
              <p className="mt-4 text-xs text-muted-foreground">
                Not checked in this project: {data.compliance.skipped.join(', ')} (these need the
                design system&rsquo;s component metadata, which only runs inside the Compass repo).
              </p>
            )}

            {data.compliance.note && (
              <p className="mt-3 text-xs text-muted-foreground">Audit note: {data.compliance.note}</p>
            )}
          </Card>

          {/* Findings */}
          {data.compliance.findings.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-foreground">What to look at</h2>
              <p className="mt-1 mb-4 text-sm text-muted-foreground">
                Each row is one thing the audit noticed, with the file and a plain suggestion.
              </p>
              <div className="space-y-3">
                {data.compliance.findings.map((f, i) => (
                  <div key={i} className="rounded-md border border-border p-3">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span
                        className={`rounded px-1.5 py-0.5 font-medium ${
                          f.level === 'error' ? 'text-destructive' : 'text-muted-foreground'
                        }`}
                      >
                        {(f.level ?? '').toUpperCase()}
                      </span>
                      <span className="font-medium text-foreground">{f.ruleId}</span>
                      <span className="text-muted-foreground">
                        {f.file}
                        {f.line ? `:${f.line}` : ''}
                      </span>
                    </div>
                    {f.message && <p className="mt-1 text-sm text-foreground">{f.message}</p>}
                    {f.suggestion && <p className="mt-1 text-sm text-muted-foreground">{f.suggestion}</p>}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Dashboard link + timestamp */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Last run: {new Date(data.ranAt).toLocaleString()}</span>
            {data.dashboardUrl && (
              <a className="text-primary underline" href={data.dashboardUrl} target="_blank" rel="noreferrer">
                Open full dashboard →
              </a>
            )}
          </div>
        </div>
      )}
    </main>
  )
}

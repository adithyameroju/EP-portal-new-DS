'use client'

// Compass Health — designer-facing, no terminal needed.
//
// Shows YOUR live Compass score — scoped to the files you've added or changed —
// by calling /api/compass-health (which runs the audits server-side). Dev-only.
// Scaffolded by the "Using Compass in Loop" setup — safe to delete.

import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

type Finding = {
  ruleId?: string
  level?: string
  file?: string
  line?: number
  message?: string
  suggestion?: string
  component?: string
}

type Health = {
  ranAt: string
  empty?: boolean
  scope: { files: string[]; count: number }
  repoGate: { pass: boolean }
  token?: { pass: boolean; errors: number; warnings: number }
  compliance?: {
    ran: boolean
    score: number | null
    startScore: number | null
    errors: number | null
    warnings: number | null
    byRule: Record<string, number>
    implemented: string[]
    skipped: string[]
    findings: Finding[]
  }
}

const RULE_PLAIN: Record<string, string> = {
  C1: 'Tokens — hard-coded colors / sizes instead of Compass tokens',
  C2: 'Provenance — a raw HTML element where a Compass component exists',
  C3: 'Composites — a component used without its proper sub-parts',
  C4: 'Spec coverage — a component with no written spec yet (design-system signal, not your defect)',
  C5: 'Naming — a file or folder that is not kebab-case',
  C6: 'Imports — a Compass primitive not imported from @/components/ui',
  C8: 'Motion — a bespoke animation / CSS outside the Compass motion system',
}

// Plain-English, ready-to-paste instruction keyed off the finding's rule code.
// Wording adapts to the finding's own file / line / component.
function fixPrompt(f: Finding): string {
  const file = f.file ?? 'the file'
  const loc = f.line ? `${file}:${f.line}` : file
  const comp = f.component ?? 'the Compass component'
  const base = (f.ruleId ?? '').split('-')[0]
  switch (base) {
    case 'C1':
      return `On ${loc}, replace the hard-coded color/size with the Compass token it suggests, then re-run.`
    case 'C2':
      return `On ${loc}, use the Compass ${comp} component instead of the raw element / hand-rolled markup.`
    case 'C3':
      return `Rebuild ${comp} on ${loc} using its proper sub-parts (e.g. CardHeader / CardContent / CardFooter).`
    case 'C4':
      return `No action needed — ${comp} has no spec yet; this is a signal for the design-system team, not a defect in your screen.`
    case 'C5':
      return `Rename ${file} to kebab-case.`
    case 'C6':
      return `Import ${comp} from @/components/ui/… instead of a relative or copied path on ${loc}.`
    case 'C8':
      return `On ${loc} you've used a custom animation/CSS outside the motion system. Replace it with a Compass motion utility — or if the system has no equivalent, tell the design-system team (it's a gap), don't ship bespoke motion.`
    default:
      return `On ${loc}, follow the suggestion above, then re-run the checks.`
  }
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
    // Deliberate fetch-on-mount: auto-run the audit when the page opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    run()
  }, [run])

  const gateLine = data && (
    <p className="text-xs text-muted-foreground">
      Repo commit gate (whole project):{' '}
      <span className={data.repoGate.pass ? 'text-foreground' : 'text-destructive'}>
        {data.repoGate.pass ? 'passing' : 'failing'}
      </span>
    </p>
  )

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Compass Health</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Your live Compass score — no terminal required. It&rsquo;s scoped to{' '}
            <strong>your work</strong>: the files you&rsquo;ve added or changed, so the number reflects your
            feature, not the whole design system.
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

      {data?.empty && (
        <Card>
          <h2 className="text-lg font-semibold text-foreground">Nothing to score yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven&rsquo;t added or changed any files yet. Ask Cursor to build a screen (start your message with
            &ldquo;Using Compass in Loop&rdquo;), then press <strong>Re-run checks</strong> to see your score.
          </p>
          <div className="mt-4">{gateLine}</div>
        </Card>
      )}

      {data && !data.empty && data.token && data.compliance && (
        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">
            Scoped to <strong>{data.scope.count}</strong> of your files:{' '}
            <span className="text-foreground">{data.scope.files.join(', ')}</span>
          </p>

          {/* Token discipline — your files */}
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Token discipline (your files)</h2>
              <span
                className={`rounded-md border px-3 py-1 text-sm font-medium ${
                  data.token.pass ? 'border-border text-foreground' : 'border-destructive text-destructive'
                }`}
              >
                {data.token.pass ? 'CLEAN' : 'ERRORS'}
              </span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Errors are hard-coded colors or sizes where a Compass token belongs — these block a commit. Warnings
              are informational.
            </p>
            <div className="mt-4 flex gap-6 text-sm">
              <span className="text-foreground">
                Errors:{' '}
                <strong className={data.token.errors > 0 ? 'text-destructive' : 'text-foreground'}>
                  {data.token.errors}
                </strong>
              </span>
              <span className="text-muted-foreground">Warnings: {data.token.warnings}</span>
            </div>
          </Card>

          {/* Compliance — advisory, scoped */}
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Compliance score (your files)</h2>
              {data.compliance.score != null && (
                <span className="rounded-md border border-border px-3 py-1 text-sm font-medium text-foreground">
                  {data.compliance.score} / {data.compliance.startScore ?? 100}
                </span>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              This is <strong>advisory</strong> — a health signal, not a blocker. It grades how well your
              components follow the system (right components, right tokens, right structure).
            </p>

            {Object.keys(data.compliance.byRule).length > 0 ? (
              <div className="mt-4">
                <p className="mb-2 text-sm font-medium text-foreground">Which checks fired</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(data.compliance.byRule).map(([rule, n]) => (
                    <span
                      key={rule}
                      title={RULE_PLAIN[rule.split('-')[0]] ?? rule}
                      className="rounded-md border border-border bg-muted px-2 py-1 text-xs text-foreground"
                    >
                      {rule} × {n}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-foreground">No issues in your files — nice.</p>
            )}
          </Card>

          {/* Findings */}
          {data.compliance.findings.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-foreground">What to look at</h2>
              <p className="mt-1 mb-4 text-sm text-muted-foreground">
                Each row is one thing the audit noticed in your files — with the exact instruction to
                paste into Cursor to fix it.
              </p>

              {/* Rule-code legend */}
              <details className="mb-4 rounded-md border border-border bg-muted p-3">
                <summary className="cursor-pointer text-sm font-medium text-foreground">
                  What the rule codes mean
                </summary>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {Object.entries(RULE_PLAIN).map(([code, desc]) => (
                    <li key={code}>
                      <span className="font-medium text-foreground">{code}</span> — {desc}
                    </li>
                  ))}
                </ul>
              </details>

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
                      <span
                        className="font-medium text-foreground"
                        title={RULE_PLAIN[(f.ruleId ?? '').split('-')[0]] ?? f.ruleId}
                      >
                        {f.ruleId}
                      </span>
                      <span className="text-muted-foreground">
                        {f.file}
                        {f.line ? `:${f.line}` : ''}
                      </span>
                      {f.component && (
                        <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-muted-foreground">
                          {f.component}
                        </span>
                      )}
                    </div>
                    {f.message && <p className="mt-1 text-sm text-foreground">{f.message}</p>}
                    {f.suggestion && <p className="mt-1 text-sm text-muted-foreground">{f.suggestion}</p>}

                    {/* Plain-English, ready-to-paste fix instruction */}
                    <div className="mt-2 rounded-md border border-border bg-muted p-2">
                      <p className="text-xs font-medium text-foreground">To fix, prompt Cursor:</p>
                      <p className="mt-1 text-sm text-foreground">{fixPrompt(f)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Footer: repo gate + timestamp */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="space-y-1">
              <span>Last run: {new Date(data.ranAt).toLocaleString()}</span>
              {gateLine}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

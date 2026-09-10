'use client'

// Compass SOP — the designer front door, rendered as a Storybook React component so
// the Copy/Download buttons work here too. Content mirrors the standalone
// compass-sop.html; the bootstrap text + Compass Feel pack come from ./sop-assets.
// Token-clean (semantic classes only — it is scanned by the token audit).

import { useState } from 'react'
import { BOOTSTRAP, BOOTSTRAP_VERSION, SKILLS_ZIP_B64 } from './sop-assets'

type Tab = 'setup' | 'build' | 'updates'

function Card({ children, tone }: { children: React.ReactNode; tone?: 'plain' | 'fail' }) {
  const base = 'rounded-xl border p-4 md:p-5 my-3.5'
  const cls = tone === 'fail' ? `${base} border-destructive` : `${base} border-border bg-card`
  return <div className={cls}>{children}</div>
}

function download(dataUrl: string, name: string) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export default function CompassSop() {
  const [tab, setTab] = useState<Tab>('setup')
  const [toast, setToast] = useState<string | null>(null)
  const flash = (m: string) => {
    setToast(m)
    window.setTimeout(() => setToast(null), 1800)
  }

  const copyBootstrap = () =>
    navigator.clipboard
      .writeText(BOOTSTRAP)
      .then(() => flash('Rule copied — paste into Cursor → Settings → Rules'))
      .catch(() => flash('Copy failed — select the text manually'))
  const downloadBootstrap = () => {
    download('data:text/markdown;charset=utf-8,' + encodeURIComponent(BOOTSTRAP), 'using-compass-in-loop.cursorrule.md')
    flash('Downloaded the rule')
  }
  const downloadSkills = () => {
    download('data:application/zip;base64,' + SKILLS_ZIP_B64, 'compass-feel-skills.zip')
    flash('Downloaded the Compass Feel pack')
  }

  const tabBtn = (id: Tab, label: string) => (
    <button
      onClick={() => setTab(id)}
      className={`-mb-px border-b-2 px-3.5 py-2.5 text-sm font-semibold ${
        tab === id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 text-foreground">
      <span className="mb-3 inline-block rounded-full border border-border px-3 py-1 text-xs font-semibold text-primary">
        Compass · Acko Enterprise Design System
      </span>
      <h1 className="text-3xl font-semibold tracking-tight">Start here</h1>
      <p className="mt-1 max-w-2xl text-lg text-muted-foreground">
        The one page to install Compass, build with it, and see what&rsquo;s new. Set up once, then say a phrase and
        build — the system keeps you on-brand and gets tighter every time you use it.
      </p>
      <p className="mt-3 text-xs text-muted-foreground">
        Everything here works <strong>today</strong> via the clone path — no aspirational steps. Deep dive:{' '}
        <em>How It Works</em> (sidebar). Questions: <strong>#design-system-feedback</strong>.
      </p>

      <nav className="mt-5 flex gap-1 border-b border-border">
        {tabBtn('setup', '1 · Setup')}
        {tabBtn('build', '2 · Build')}
        {tabBtn('updates', '3 · Updates')}
      </nav>

      {/* ---------------- SETUP ---------------- */}
      {tab === 'setup' && (
        <div className="pt-1">
          <h2 className="mt-6 text-xl font-semibold">One-time setup — about five minutes</h2>
          <Card>
            <h3 className="text-base font-semibold">Before you start</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
              <li><strong className="text-foreground">Acko VPN / network</strong> — Compass tokens come from Acko&rsquo;s internal Nexus registry, only reachable on the Acko network.</li>
              <li><strong className="text-foreground">Accept the GitHub invite first</strong> — the owner sends you a <strong className="text-foreground">Read</strong> invite to <code className="rounded bg-muted px-1">ackotech/enterprise-compass-in-loop</code>; accept it before anything else, because the docs link uses that access. (Ask the owner if you get an access error.) You never push to it.</li>
              <li><strong className="text-foreground">Cursor</strong> installed.</li>
              <li><strong className="text-foreground">Google Drive for Desktop</strong> signed in with your <strong className="text-foreground">Acko</strong> account, and accept the shared <strong className="text-foreground">Compass Drift</strong> folder (below).</li>
            </ul>
          </Card>

          <Card>
            <h3 className="text-base font-semibold">Connect your Compass Drift folder (one-time)</h3>
            <p className="text-sm text-muted-foreground">Your builds sync a tiny drift record to a shared Drive folder so the design-system team can see where to tighten. No git, no tokens — just your synced Drive.</p>
            <ol className="mt-2 list-decimal pl-5 text-sm">
              <li>Accept the <strong>Compass Drift</strong> share — it lands under &ldquo;Shared with me&rdquo;, which does <strong>not</strong> sync to your computer on its own.</li>
              <li>At drive.google.com → right-click <strong>Compass Drift</strong> → <strong>Add shortcut to Drive</strong> → My Drive. It then appears locally: macOS <code className="rounded bg-muted px-1">~/Library/CloudStorage/GoogleDrive-&lt;you&gt;@acko.tech/My Drive/Compass Drift</code>; Windows <code className="rounded bg-muted px-1">%USERPROFILE%\My Drive\Compass Drift</code>.</li>
              <li>On your <strong>first build</strong>, the rule asks for this path <strong>once</strong> — paste it, never asked again. Drive offline? Builds still work; records sync later — <strong>telemetry never blocks a build</strong>.</li>
            </ol>
          </Card>

          <h3 className="mt-5 text-base font-semibold">1 · Paste the setup rule into Cursor (once)</h3>
          <p className="text-sm text-muted-foreground">Cursor → Settings → Rules → paste this. A single time — everything after ships with the repo, so you never re-paste.</p>
          <div className="my-2.5 flex items-center gap-2">
            <button onClick={copyBootstrap} className="rounded-lg border border-primary bg-primary px-3.5 py-1.5 text-sm font-semibold text-primary-foreground">Copy rule</button>
            <button onClick={downloadBootstrap} className="rounded-lg border border-border bg-card px-3.5 py-1.5 text-sm font-semibold text-foreground">Download .md</button>
            <span className="text-xs text-muted-foreground">Current: <strong className="text-foreground">{BOOTSTRAP_VERSION}</strong></span>
          </div>
          <p className="text-sm text-muted-foreground">The rule is stamped with its version. If Cursor says your pasted rule is older than the version above, re-copy it here — a stale paste is what let an unrelated rule capture a build before.</p>
          <pre className="max-h-80 overflow-auto rounded-lg border border-border bg-muted p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap">{BOOTSTRAP}</pre>

          <h3 className="mt-5 text-base font-semibold">2 · What happens on your first prompt</h3>
          <p className="text-sm">Open an empty folder in Cursor and type e.g. <code className="rounded bg-muted px-1">Using Compass in Loop, build a signup screen</code>. The rule <strong>detects</strong> whether you&rsquo;re set up, <strong>clones + installs</strong> if not, <strong>verifies</strong> (audit runs, brand font wired, app boots), then builds. <strong>You do nothing</strong> but watch and answer its questions.</p>

          <Card tone="fail">
            <h3 className="text-base font-semibold text-destructive">If you have another Acko/retail Cursor rule</h3>
            <p className="mt-1 text-sm text-muted-foreground">Only one Settings rule should react to a build request. If a non-Compass rule (e.g. a retail project&rsquo;s rule) ever starts committing or capturing while you build — especially outside your cloned Compass repo — that&rsquo;s a collision. Start your message with <code className="rounded bg-muted px-1">Using Compass in Loop</code> so this rule leads (it matches that phrase in any capitalisation), and disable the other Acko rule while doing Compass work. The repo also refuses to commit or capture in a folder that isn&rsquo;t a Compass checkout, so a misfire can&rsquo;t quietly capture your build in the wrong place.</p>
          </Card>

          <Card tone="fail">
            <h3 className="text-base font-semibold text-destructive">When it fails — and what to do</h3>
            <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
              <li><code className="rounded bg-muted px-1">E404 @acko/enterprise-tokens</code> / <code className="rounded bg-muted px-1">ETIMEDOUT</code> / <code className="rounded bg-muted px-1">ENOTFOUND nexus-dev.acko.in</code> → off the Acko network. <strong className="text-foreground">Connect to the VPN</strong>, then say the phrase again.</li>
              <li><strong className="text-foreground">git auth failed / repo not found</strong> → no ackotech access yet. Ping <strong>#design-system-feedback</strong>.</li>
              <li><strong className="text-foreground">Anything else</strong> → paste the error into <strong>#design-system-feedback</strong>.</li>
            </ul>
          </Card>

          <h3 className="mt-5 text-base font-semibold">3 · Optional — the &ldquo;Compass Feel&rdquo; craft pack</h3>
          <p className="text-sm">Short craft guides (typography voice, spacing rhythm, density, motion restraint, form patterns, do/don&rsquo;t) distilled from the specs. The build rule reads them before generating, so output feels more on-brand. Craft only — it never overrides the enforced tokens/components/specs.</p>
          <div className="my-2.5 flex gap-2">
            <button onClick={downloadSkills} className="rounded-lg border border-primary bg-primary px-3.5 py-1.5 text-sm font-semibold text-primary-foreground">Download Compass Feel pack (.zip)</button>
          </div>
          <p className="text-sm text-muted-foreground"><strong className="text-foreground">Cursor (primary):</strong> unzip to <code className="rounded bg-muted px-1">~/compass-feel/</code> (macOS/Linux) or <code className="rounded bg-muted px-1">%USERPROFILE%\compass-feel\</code> (Windows). <strong className="text-foreground">Claude Code:</strong> <code className="rounded bg-muted px-1">~/.claude/skills/compass-feel/</code>. Per-designer, across all your projects.</p>
        </div>
      )}

      {/* ---------------- BUILD ---------------- */}
      {tab === 'build' && (
        <div className="pt-1">
          <h2 className="mt-6 text-xl font-semibold">Build with Compass</h2>
          <p className="text-sm text-muted-foreground">Three ways in. Each starts with a phrase; the AI stays on Compass components + tokens and ends with a &ldquo;What I assumed&rdquo; list — read it, that&rsquo;s where you confirm or correct its guesses.</p>
          <div className="my-3.5 grid gap-3.5 md:grid-cols-3">
            <Card>
              <h3 className="text-base font-semibold">Prompt → build</h3>
              <p className="text-sm text-muted-foreground">Say: <code className="rounded bg-muted px-1">Using Compass in Loop, build a &lt;screen&gt;</code></p>
              <ol className="mt-1 list-decimal pl-5 text-sm">
                <li>Describe the screen in plain words.</li>
                <li>The AI builds from Compass components.</li>
                <li>It ends with &ldquo;What I assumed&rdquo;.</li>
                <li>Confirm / correct; it captures the build.</li>
              </ol>
              <p className="mt-1 text-sm"><strong className="text-primary">Good output:</strong> real Compass components, semantic tokens, 0 audit errors.</p>
            </Card>
            <Card>
              <h3 className="text-base font-semibold">Figma frame → build</h3>
              <p className="text-sm text-muted-foreground">Say: <code className="rounded bg-muted px-1">Using Compass in Loop, build this Figma frame …</code></p>
              <ol className="mt-1 list-decimal pl-5 text-sm">
                <li>Connect the <strong>Figma MCP</strong> in Cursor.</li>
                <li>Point it at the frame.</li>
                <li>It maps frame values onto Compass tokens/components.</li>
                <li>The &ldquo;What I assumed&rdquo; list is longer — every mapping is a choice.</li>
              </ol>
              <p className="mt-1 text-sm"><strong className="text-primary">Good output:</strong> values mapped to tokens; anything that didn&rsquo;t map cleanly surfaced as a question.</p>
            </Card>
            <Card>
              <h3 className="text-base font-semibold">Migrate a codebase</h3>
              <p className="text-sm text-muted-foreground">Say: <code className="rounded bg-muted px-1">Migrate this project to Compass using the compass-migrate skill</code></p>
              <ol className="mt-1 list-decimal pl-5 text-sm">
                <li>Open the existing project.</li>
                <li>The skill inventories foreign components.</li>
                <li>It writes <code className="rounded bg-muted px-1">-compass</code> variants + reports.</li>
                <li>It STOPS before deleting/repointing — your call.</li>
              </ol>
              <p className="mt-1 text-sm"><strong className="text-primary">Good output:</strong> heavy flagging is the tool working — a long needs-decision list means it refused to silently mis-map.</p>
            </Card>
          </div>

          <Card>
            <h3 className="text-base font-semibold">See your score — <code className="rounded bg-muted px-1">/compass-health</code></h3>
            <p className="mt-1 text-sm">After building, run the app and open <code className="rounded bg-muted px-1">http://localhost:3000/compass-health</code> — no terminal. It scores <strong>only your files</strong>:</p>
            <ul className="mt-2 list-disc pl-5 text-sm">
              <li><strong>Token discipline</strong> — hard-coded colors/sizes. <strong className="text-destructive">Errors here are the only hard gate</strong> (they block a commit); fix first.</li>
              <li><strong>Compliance score</strong> — advisory. Warnings are signals, not blockers; each has a &ldquo;To fix, prompt Cursor:&rdquo; line to paste back.</li>
            </ul>
            <p className="mt-2 text-sm text-muted-foreground">Rule of thumb: <strong className="text-foreground">token audit at 0 errors → you can ship.</strong> Warnings never block you.</p>
          </Card>

          <Card>
            <h3 className="text-base font-semibold">Work on a branch — never <code className="rounded bg-muted px-1">main</code></h3>
            <ol className="mt-1 list-decimal pl-5 text-sm">
              <li>Before building: <code className="rounded bg-muted px-1">git checkout -b &lt;your-name&gt;/&lt;feature&gt;</code></li>
              <li>Build. Capture happens automatically.</li>
              <li><strong>End of day: <code className="rounded bg-muted px-1">git push -u origin &lt;your-branch&gt;</code></strong> — every day, even if unfinished. That&rsquo;s how your work + drift data reach the team.</li>
              <li>Never push to <code className="rounded bg-muted px-1">main</code>; open a PR when a feature is ready.</li>
            </ol>
          </Card>
        </div>
      )}

      {/* ---------------- UPDATES ---------------- */}
      {tab === 'updates' && (
        <div className="pt-1">
          <h2 className="mt-6 text-xl font-semibold">What&rsquo;s new</h2>
          <p className="text-sm text-muted-foreground">Every Compass release shows up here. Usually there&rsquo;s nothing to do — the rule pulls updates into your branch automatically on your next build. This is the loop made visible: several of these came from drift the tool saw in real builds.</p>

          <Card>
            <h3 className="text-base font-semibold">Latest — on <code className="rounded bg-muted px-1">main</code>, 2026-09-10 <span className="ml-1 rounded-full border border-primary px-2 py-0.5 text-xs font-semibold text-primary">new</span></h3>
            <p className="mt-1 text-sm"><strong>What you do: re-copy the Setup rule once.</strong> Open the <strong>Setup</strong> tab, hit <strong>Copy</strong> (it shows the current version), and paste it into Cursor → Settings → Rules, replacing the old one.</p>
            <ul className="mt-2 list-disc pl-5 text-sm">
              <li><strong>The Setup rule is version-stamped (now v2)</strong> — if your pasted copy ever goes stale, Cursor tells you to re-copy it. No more silent staleness.</li>
              <li><strong>Case-insensitive trigger</strong> — &ldquo;using compass in loop&rdquo; works however you capitalise it, so another Acko/retail rule can&rsquo;t quietly take over your build.</li>
              <li><strong>Safer capture</strong> — a build is only ever committed or captured inside a real Compass checkout, never an empty or foreign folder.</li>
            </ul>
          </Card>

          <Card>
            <h3 className="text-base font-semibold">On <code className="rounded bg-muted px-1">main</code>, 2026-07-21</h3>
            <p className="mt-1 text-sm"><strong>What you do: nothing</strong> (one-time: paste the Settings rule once, build on a branch).</p>
            <ul className="mt-2 list-disc pl-5 text-sm">
              <li><strong>Automatic drift capture</strong> on every build — no manual step.</li>
              <li><strong><code className="rounded bg-muted px-1">/compass-health</code> scoped to your work</strong>, with a paste-ready fix for each warning. The trend dashboard moved to owners.</li>
              <li><strong>Sharper audit</strong> — removed a false &ldquo;hand-rolled Menubar&rdquo; flag; new advisory check for bespoke CSS/motion.</li>
              <li><strong>Status/semantic-token gap now surfaces as the top drift hotspot</strong> — <em>driven by your real Figma + migration builds</em>. (Values are an owner + FE-dev decision.)</li>
              <li><strong>Zero-touch updates</strong> + <strong>branch-protected <code className="rounded bg-muted px-1">main</code></strong>.</li>
              <li><strong>Drift telemetry via Google Drive</strong> — builds sync a drift record to a shared folder so the DS team sees drift and tightens the system. <em>What you do:</em> accept the share + paste your path once (the rule prompts). Never blocks a build.</li>
              <li>This SOP page, the Compass Feel pack, and a third-party skills gate.</li>
            </ul>
          </Card>

          <Card>
            <h3 className="text-base font-semibold">0.1.0 — 2026-07-07 <span className="ml-1 rounded-full border border-primary px-2 py-0.5 text-xs font-semibold text-primary">first release</span></h3>
            <ul className="mt-2 list-disc pl-5 text-sm">
              <li>55 components (shadcn/ui v4 + Base UI), all with machine-readable contracts.</li>
              <li>Storybook docs + 6 token foundations pages + the interactive SOP, on Chromatic.</li>
              <li>The audit loop: token gate + compliance audit + drift ledger + detect/prescribe.</li>
              <li>The <code className="rounded bg-muted px-1">compass-migrate</code> skill for existing React + Tailwind codebases.</li>
            </ul>
          </Card>
        </div>
      )}

      <footer className="mt-9 flex flex-wrap gap-5 border-t border-border pt-4 text-sm text-muted-foreground">
        <a href="https://main--6a4c6bc7a7294c9b64f0b80e.chromatic.com/" target="_blank" rel="noopener" className="font-medium text-primary underline">Live docs — Storybook on Chromatic</a>
        <span>How It Works (deep dive — sidebar)</span>
        <span>Storybook component docs (sidebar)</span>
        <span>Help: <strong>#design-system-feedback</strong></span>
      </footer>

      {toast && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 rounded-lg bg-foreground px-4 py-2 text-sm text-background shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}

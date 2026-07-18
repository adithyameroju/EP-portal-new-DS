Trigger: activate this rule ONLY when the user's message begins with the exact
phrase "Using Compass in Loop" (e.g. "Using Compass in Loop, build a signup
screen"). If the message does not start with that phrase, ignore this rule
completely. The user is a designer, not a developer — narrate briefly in plain
English, and when a command fails, explain why before doing anything else.

When active, run these three phases in order. Never skip Phase 2.

═══ PHASE 1 · SETUP (idempotent) ═══
"Already set up" means the workspace ROOT contains ALL of: CLAUDE.md,
scripts/token-audit.mjs, a package.json whose "name" is "@acko/compass", AND a
node_modules/@acko/enterprise-tokens folder. If all are present, say "Compass is
already set up" and skip straight to Phase 3.

Otherwise set it up via the CLONE path (most reliable for a designer — fonts,
tokens, CSS wiring, the full audit loop, and the /compass-health page are all
pre-wired in this repo):

1. If the workspace root is NOT already a Compass checkout (no package.json named
   "@acko/compass"), clone it and use that folder as the root:
     git clone https://github.com/ackotech/enterprise-compass-in-loop.git
   If git auth fails, STOP and tell the user they need access to the ackotech
   GitHub org.
2. Install dependencies:  npm install
   This pulls @acko/enterprise-tokens from Acko's INTERNAL Nexus registry (see
   the repo's .npmrc → nexus-dev.acko.in). If install fails with any of
   "E404 @acko/enterprise-tokens", "ETIMEDOUT", or "ENOTFOUND nexus-dev.acko.in",
   STOP and say exactly: "I can't reach Acko's package registry. Connect to the
   Acko network or VPN, then say 'Using Compass in Loop' again." Do not continue.
   (The repo ships the /compass-health page at app/compass-health — no scaffolding
   needed. In the rare case it's missing, tell the user their clone is out of date
   and to pull the latest.)

═══ PHASE 2 · VERIFY (never build on a broken setup) ═══
Run all three. If ANY fails, STOP and report the specific failure in plain
English — do NOT start building.
1. Audit executes:  npm run audit
   Exit 0 (clean) and exit 1 (violations found) are BOTH acceptable — the point
   is that it RUNS. "Missing script: audit" means setup is broken → STOP.
2. Euclid font is wired (not the system font):  npm run audit:compliance
   Confirm there is no C7a error in the output. A C7a error means Euclid Circular
   B is not registered → STOP and say the brand font isn't wired.
3. App boots:  npm run dev
   Confirm it reaches "Ready". Then tell the user: "Open
   http://localhost:3000/compass-health to see your live Compass score." (If port
   3000 is busy, use the port Next prints.)

═══ PHASE 3 · BUILD (constrained to Compass) ═══
Read the workspace's OWN CLAUDE.md and .claude/specs/** and follow them exactly —
they are the source of truth, do not restate or override them. The essentials:
- Use Compass components from components/ui/ only. Never hand-roll a raw
  <button>/<input>/<select>/<textarea>/<table> where a Compass component exists.
- Use semantic token classes only (bg-primary, text-foreground, border-input,
  text-muted-foreground …). Never hard-code hex, Tailwind palette colors
  (bg-purple-600), or arbitrary values (p-[13px], rounded-[7px]).
- Use composite sub-parts: Card → CardHeader/CardContent/CardFooter; forms use
  the Field system (Field/FieldLabel/FieldContent/FieldError/FieldDescription).
- kebab-case file names. Base UI composition uses the render prop, not asChild.
- lucide-react icons only.
After generating, run npm run audit and fix every error before you finish. Then do
these THREE steps IN THIS ORDER, every build, never skipped — this is what lets the
system learn from what it got wrong:

1. SNAPSHOT THE RAW AI OUTPUT as its own commit, BEFORE the designer edits anything:
     git add -A
     git commit -m "compass: raw AI output — <short task description>"
   This is the baseline. Any spacing/copy tweak the designer makes afterward is now
   a clean git diff on top of it — the drift the system should have gotten right.

2. CAPTURE THE ASSUMPTIONS — non-interactive, never prompt, never block the designer.
   Run ONE command with a repeatable --assume "<category>: <text>" for EACH item in
   your "What I assumed" list (categories: styling, spacing, component-choice,
   content, behavior, token), plus the files you built:
     npm run log -- --no-input \
       --assume "component-choice: <text>" \
       --assume "token: <text>" \
       --files <comma,separated,build,files>
   This writes a committed drift-log/entries/ record pointing at the raw-output
   commit. Do NOT pass --demo. If git or `npm run log` isn't available, say so in one
   line and continue — capture is best-effort and must NEVER block the build.

3. SHOW THE DESIGNER your "What I assumed" list (the same items you just captured) so
   they can confirm or correct. Never silently substitute — anything Figma/spec/token
   didn't cleanly resolve is a question, not a guess.

# Designer Quickstart — build with Compass in 10 minutes

The fastest path: **clone the Compass repo and build inside it.** No package
install, no Nexus, no tarball — everything (components, tokens, Euclid, the
governance, the audit loop) is already wired in this repo. This is the soft-launch
path; if you later need Compass *in your own project*, use
[Flow A](./flow-a-new-project.md) instead.

> **In Cursor, this is now one step.** With the "Using Compass in Loop" rule
> installed (Cursor → Settings → Rules), start a message with **"Using Compass in
> Loop, build …"** — it clones, installs, verifies the setup, then builds. The
> steps below are exactly what it runs for you. Afterwards open **`/compass-health`**
> to see your score (scoped to your files) with no terminal.

---

## 1 · Clone & install

```bash
git clone https://github.com/ackotech/enterprise-compass-in-loop.git
cd enterprise-compass-in-loop
npm install
```
> `npm install` pulls `@acko/enterprise-tokens` from Acko's Nexus — you need the
> `@acko` registry line (it's already in this repo's `.npmrc`). On the Acko
> network this just works. Euclid Circular B is bundled (`app/fonts/`), so text
> renders in the brand font out of the box.

## ⚠️ Branch workflow — you push BRANCHES, never `main` (read first)

`main` is **protected**: you can't push to it or merge without the owner's review.
You work on your own branch and push THAT. Four steps:

1. **Before you build, create a branch:**
   ```bash
   git checkout -b <your-name>/<feature>     # e.g. git checkout -b asha/claim-status
   ```
2. **Build.** The loop auto-commits your raw output and writes a `drift-log/entries/`
   record for each build — you don't do anything for that to happen.
3. **⭐ END OF DAY — PUSH YOUR BRANCH. This is the ONE manual step, and the owner's
   whole improvement pipeline depends on it.** Your captured drift only reaches the
   owner when you push:
   ```bash
   git push -u origin <your-name>/<feature>
   ```
   Do this **every day you build**, even if the feature isn't finished. Forget, and
   your ledger never arrives — the team's data has a hole.
4. **Never `git push origin main`, never merge to `main`.** When a feature is ready,
   open a Pull Request; the owner reviews and the audit CI must pass before it merges.

## 2 · Run it

```bash
npm run dev          # the app        → http://localhost:3000  (port busy? PORT=3010 npm run dev)
npm run storybook    # the docs + SOP → http://localhost:6006
```
Open Storybook first and read **Introduction → How It Works**, then
**Working with Compass** (the interactive SOP) — that's how you pick the right
component for a job.

## 3 · Where to build

Put your screens in **`components/blocks/`** (that's the compositions area — the
less-strictly-gated space for real product screens, assembled from the primitives
in `components/ui/`). Don't edit `components/ui/` — those are the system's
primitives.

```
components/blocks/my-feature/      ← your work goes here (kebab-case filenames)
```

## 4 · How to prompt

Open the repo in **Cursor or Claude Code**. `CLAUDE.md` and everything in
`.claude/` load automatically — that's what keeps the AI on Compass components
and tokens instead of hardcoding.

> **Good prompt:** *"In components/blocks/, build a signup card: a Card with a
> heading, email + password fields, a primary submit button, and a 'Forgot
> password?' text action. Use Compass components and tokens only."*

The AI should end with a **"What I assumed"** list. Read it — that list is the
whole point (step 6).

## 5 · Run the loop

```bash
npm run audit              # ① HARD GATE — must be 0 errors (blocks hardcoded colors etc.)
npm run audit:compliance   # ② advisory score — did it use the right components?
npm run log                # ③ capture — paste the "What I assumed" block when asked
npm run dashboard          # ④ open drift-log/dashboard.html to see health
```

## 6 · What GOOD vs OFF looks like

| | Good | Off (needs a look) |
|---|---|---|
| `audit` | `Errors: 0` | any error → a hardcoded value slipped in; fix before anything else |
| `audit:compliance` | score ~95+; only C1 layout warnings | `C2-raw-element` (rebuilt a component as divs), `C5-naming` (PascalCase file) |
| "What I assumed" | only roundings (15px → `gap-4`) | a **decision** ("assumed the card needs a border") — that's the AI guessing |

## 7 · What to send me

After a build, send:
1. The **drift-log entry** you just created (`drift-log/entries/<timestamp>__*.json`), **and**
2. The AI's **"What I assumed"** block, **and**
3. Your **compliance score** (the one line from `audit:compliance`).

That's everything I need to see how Compass held up and where it drifted — the
raw material for tightening the specs. If `audit` had errors you couldn't
resolve, send those too and say so.

---

**The one rule:** `npm run audit` at 0 errors is the only hard bar. Everything
else is a signal — and anything the specs don't decide will surface as a flag for
me to rule, never a silent guess. Build freely; the system will tell us honestly
how it went.

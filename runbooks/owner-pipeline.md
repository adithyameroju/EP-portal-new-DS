# Owner pipeline — the weekly Compass tightening cycle

How the design-system owner turns designers' captured drift into system
improvements. **Google Drive is the primary collection model:** each build syncs the
designer's drift entry + score to a shared **Compass Drift** folder, one subfolder
per designer (username derived from their git/GitHub identity). Your machine reads
that synced folder as the PRIMARY source; committed branch entries stay as a fallback.

One-time owner setup: `node scripts/drift-config.mjs --set-path "<your synced Compass
Drift path>"`, then set `"role": "owner"` in `~/.compass/config.json`. Run the cycle
weekly (or after a burst of building).

## 1 · Confirm Drive is synced
Open Google Drive for Desktop and confirm **Compass Drift** shows the designer
subfolders and recent files (green check, not syncing). That's the whole collection
step — no fetch, no PATs. (Branch fallback: if you also want branch-committed entries,
`git fetch --all --prune`.)

## 2 · Cross-team rollup — owner dashboard
```bash
npm run owner:dashboard          # scripts/owner-dashboard.mjs
open drift-log/owner-dashboard.html
```
This reads committed entries from **every branch**, not just your checked-out one
(that's the point) — excluding demo entries. It prints `Collected across N branch
ref(s)` so you can confirm it saw everyone, and shows per-designer / per-project
rollups, component & rule hotspots, and trends. Truthful empty state until real data
arrives.

## 3 · Find the hotspots — detect
`detect` clusters the ledger: repeated **assumptions** → a spec/token gap; repeated
**rule findings** → a rough edge. To run it across all branches, first gather every
branch's committed entries into your working tree, then detect:
```bash
for ref in $(git for-each-ref --format='%(refname)' refs/remotes); do
  git checkout "$ref" -- drift-log/entries/ 2>/dev/null || true
done
npm run detect                   # clusters entries (+ reports) → drift-log/detect/
```
Read `drift-log/detect/<latest>.md`. **The top of the list is what to fix first.** A
recurring assumption theme — e.g. "no success token" appearing across builds — is a
gap the system should close.

## 4 · Propose tightenings — prescribe
```bash
npm run prescribe                # → drift-log/proposals/<date>__tightening-plan.md
```
Drafts PROPOSED spec/token tightenings (or "NEEDS OWNER DECISION" flags) with
evidence. **It never edits a rule itself — you do.**

## 5 · You rule, then commit to `main`
Read the proposals. Approve / amend / reject each. Apply the ones you approve (edit
the spec, add the token in the Figma library then `@acko/enterprise-tokens`, tune the
rubric), record the ruling in the DECISION LOG (`.compass-build/STATE.md`), and commit
to `main` (via PR if you like — protection lets you, the owner, merge).

## 6 · Designers pick it up — zero action
Your commit to `main` reaches designers with **no effort on their part**: next time a
designer says "Using Compass in Loop", the rule runs `git fetch` and offers to pull
your tightenings into their branch (see `.cursorrules` → "Session start"). The loop
closes.

## Reset (after step 3's gather)
The gather leaves other branches' entries in your working tree. Reset:
```bash
git checkout main -- drift-log/entries/
```
Or run the whole cycle in a throwaway clone you don't build in.

---

## The cycle in one line
**confirm Drive synced → detect + owner:dashboard (Drive-primary) → prescribe → you
rule → ship (commit `main` + add the SOP → Updates changelog entry) → designers pull
on next build.** Every week the system gets tighter.

## Note on scoring
Assumption-theme hotspots (the highest-value signal — e.g. a missing token) come
straight from the entries and work today. Component/rule hotspots (which C-rule fired
how often) additionally need each entry to carry its compliance score; per-entry
scoring is being finalized so those aggregate across branches too. `owner-dashboard`
already reads across branches natively; `detect` uses the gather step above until its
own cross-branch read lands.

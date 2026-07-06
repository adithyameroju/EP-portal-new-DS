# PROPOSED — Prescribe step (build after S1)

*S4 track design doc. Status: PROPOSED — not implemented. The single most
guard-railed part of the loop: it PROPOSES, the owner APPROVES. It never writes
to a spec, never edits a rule, never applies anything. Its only output is a
markdown plan for review.*

## Input

The newest Detect output (`drift-log/detect/*.json`). Only clusters/themes at
or above the hotspot threshold are eligible. Anything below threshold is listed
in a "watching, not acting" appendix — visible but not actioned.

## Per-hotspot procedure

1. **Locate the governing spec** via meta (`specPath` for the component; or the
   foundations spec for token-rule hotspots, e.g. C1 spacing → 
   `.claude/specs/foundations/spacing.md`).
2. **Classify through the opinion firewall** (the hard rule):
   - **Case A — ambiguity tightening (PROPOSE):** the spec already has a rule
     on this topic, but the ledger shows the LLM guessing at its meaning
     (assumptions contradicting each other, or repeated violations of a rule
     that exists but is vague). → Draft the exact spec edit as a unified diff.
   - **Case B — missing opinion (FLAG, NEVER PROPOSE):** the spec is silent —
     deciding would require a NEW design opinion Compass has not formed. →
     Emit a **"NEEDS OWNER DECISION"** item: the question, the observed
     behaviors, 2–3 options with trade-offs, and NO recommendation phrased as
     a rule. Compass opinions form through product work and owner decisions,
     never through the loop.
   - Classification test (mechanical first pass): does grep of the governing
     spec find a rule addressing the drifted topic? If yes → candidate Case A
     (LLM judgment confirms the rule is genuinely ambiguous, citing its text).
     If no → Case B, always.
3. **Attach the evidence trace** — mandatory, machine-checkable: every proposal
   cites ≥ hotspotMinBuilds ledger entry filenames from the Detect cluster.
   **A prescription with no ledger evidence is invalid and must not be
   emitted.**

## Output

`drift-log/proposals/<ISO-date>__tightening-plan.md` (committed — proposals are
evidence of the loop working), structured:

```
# Compass tightening plan — <date>   [PROPOSED — nothing applied]

## Proposals (ambiguity tightening — approve/reject each)
### P1: card / C3-missing-subparts (4 builds)
Evidence: <entry>, <entry>, <entry>, <entry>
Governing spec: .claude/specs/components/card.md
Existing rule: "<verbatim quote>"
Why it's ambiguous: ...
Proposed edit:
```diff
- <current spec line>
+ <tightened spec line>
```

## Needs owner decision (new opinions — the loop will not decide these)
### D1: <question>
Observed: ... (evidence: <entries>)
Options: (a) ... (b) ... — trade-offs only, no recommendation-as-rule

## Watching, not acting (below threshold)
...
```

## Approval flow

The plan feeds the monthly Claude.ai tightening session. Nikhil approves,
rejects, or edits each item there; approved diffs are applied by a human-driven
edit (normal PR/commit path, audit re-run) — **never by the Prescribe step
itself**. A rejected proposal is recorded in the next plan's header so the loop
doesn't re-propose it verbatim.

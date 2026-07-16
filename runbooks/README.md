# Compass runbooks

Practical, step-by-step procedures for actually using Compass. Stamped against
the build at `s3-build-complete` (2026-07-07). For *how the system works*, read
[COMPASS_SYSTEM.md](../COMPASS_SYSTEM.md) or the Storybook's
**Introduction → How It Works**.

| Runbook | Use it when |
|---|---|
| [FLOW A — New project](./flow-a-new-project.md) | Starting fresh: prompt → build → audit → log → dashboard. **Read this first** — A2 and B build on it. |
| [FLOW A2 — Figma frame input](./flow-a2-figma-frame.md) | Same loop, but you're building *from a Figma frame*. Covers only what differs (Code Connect, the Figma MCP path, the heavier assumption list). |
| [FLOW B — Migrate an existing codebase](./flow-b-migration.md) | You have a Lovable/other prototype and want Compass-native code. **Sets the expectation up front: heavy flagging = the design working.** |

## The one thing that's true in all three

`npm run audit` (0 errors) is the **only hard gate**. The compliance score,
detect, and prescribe are *signals* — they inform, they don't block. And nothing
that needs a design decision gets decided for you: it surfaces as a flag.

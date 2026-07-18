# Compass runbooks

Practical, step-by-step procedures for actually using Compass. Stamped against
the build at `s3-build-complete` (2026-07-07), updated through 2026-07-18 to fold
in the post-build rulings (Card composition ruling, the 12 SOP rulings, the
standing decision queue, and the Storybook story fixes; see
`.compass-build/STATE.md`). For *how the system works*, read
[COMPASS_SYSTEM.md](../COMPASS_SYSTEM.md) or the Storybook's
**Introduction → How It Works**.

| Runbook | Use it when |
|---|---|
| [Designer Quickstart](./designer-quickstart.md) | **Start here for a soft-launch designer.** Clone this repo and build inside it — no package/Nexus. 10 minutes to first build. |
| [FLOW A — New project](./flow-a-new-project.md) | You want Compass *in your own project* (package/tarball install), not inside this repo. A2 and B build on it. |
| [FLOW A2 — Figma frame input](./flow-a2-figma-frame.md) | Same loop, but you're building *from a Figma frame*. Covers only what differs (Code Connect, the Figma MCP path, the heavier assumption list). |
| [FLOW B — Migrate an existing codebase](./flow-b-migration.md) | You have a Lovable/other prototype and want Compass-native code. **Sets the expectation up front: heavy flagging = the design working.** |

## The one thing that's true in all three

`npm run audit` (0 errors) is the **only hard gate**. The compliance score,
detect, and prescribe are *signals* — they inform, they don't block. And nothing
that needs a design decision gets decided for you: it surfaces as a flag.

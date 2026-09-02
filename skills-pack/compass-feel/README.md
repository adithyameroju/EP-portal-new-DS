# Compass Feel

Per-designer **craft guidance** the AI reads before it generates UI. Six short guides
distilled strictly from existing Compass specs — the "feel" of the system:

- `typography-voice.md` — single typeface, semibold headings, tight display tracking
- `spacing-rhythm.md` — 4px grid, Tailwind scale, responsive page rhythm
- `density-and-layout.md` — spacing + radius restraint + elevation restraint
- `motion-restraint.md` — fast, quiet transitions (150ms ease-in-out default)
- `form-patterns.md` — labeled inputs, Field for validation, one primary button
- `do-and-dont.md` — tokens over values, system over invention, surface every call

## This is feel, not the enforced system

Compass **tokens, components, and specs always supersede this pack.** These guides
help the AI match the system's texture; they do not override the hard system. If a
guide ever disagrees with a token, a `components/ui/` primitive, or a `.claude/specs/`
file, the spec wins. Every line here traces back to one of those specs — nothing new
was invented.

## Install

### Primary — Cursor

Unzip the pack to a home-level folder so the "Using Compass in Loop" rule reads it
before generating (if present):

- macOS / Linux: `~/compass-feel/`
- Windows: `%USERPROFILE%\compass-feel\`

### Secondary — Claude Code

Unzip the pack into your skills directory:

- macOS / Linux: `~/.claude/skills/compass-feel/`
- Windows: `%USERPROFILE%\.claude\skills\compass-feel\`

After unzipping, the folder should contain the six `.md` guides plus this README.

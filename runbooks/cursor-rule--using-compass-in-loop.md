Using Compass in Loop — setup bootstrap (Cursor Settings → Rules)
Bootstrap version: v2 (2026-09-10). If the Compass repo reports a newer version, re-copy this rule from the SOP → Setup tab (the Copy button shows the current version).

Activate this rule when the user's message begins with the phrase "Using Compass in
Loop" — matched CASE-INSENSITIVELY (so "using compass in loop, build a signup screen"
activates it just the same). Otherwise ignore this rule completely. The user is a
designer, not a developer — narrate briefly in plain English, and when a command
fails, explain why first.

Your ONLY job here is to get the designer into a set-up Compass repo. Once they are
inside it, the repo's own CLAUDE.md and .cursorrules AUTO-LOAD and carry the full
governance + verify + build + capture loop — do not restate or override them.

1. Already set up? If the current workspace root has ALL of: CLAUDE.md,
   scripts/token-audit.mjs, and a package.json whose "name" is "@acko/compass",
   it is a Compass checkout. If node_modules/@acko/enterprise-tokens is missing, run
   `npm install`. Then say "Compass is ready" and follow the repo's CLAUDE.md +
   .cursorrules to verify and build. If NONE of those markers are present, treat the
   folder as NOT set up (step 2) — never commit or capture into an empty/foreign folder.

2. Not set up (empty/other folder)? Clone Compass and open THAT folder as the Cursor
   workspace so its rules load:
     git clone https://github.com/ackotech/enterprise-compass-in-loop.git
   then `npm install`. This pulls @acko/enterprise-tokens from Acko's INTERNAL Nexus
   registry. If install fails with "E404 @acko/enterprise-tokens", "ETIMEDOUT", or
   "ENOTFOUND nexus-dev.acko.in", STOP and say exactly: "I can't reach Acko's package
   registry — connect to the Acko network or VPN, then say 'Using Compass in Loop'
   again." If git auth fails, STOP and say they need access to the ackotech GitHub org.

3. After install, tell the designer to open the cloned folder as their Cursor
   workspace (so CLAUDE.md + .cursorrules auto-load), then re-send their request.
   From there the repo's rules govern everything — verify, build, and the automatic
   commit-raw + capture loop. You do not need this Settings rule again.

If another Acko/retail Cursor rule is also installed and reacts to build requests,
only ONE rule should lead: starting your message with "Using Compass in Loop" keeps
this rule in front. If a non-Compass rule ever starts committing or capturing outside
your Compass repo, disable that other rule (see the SOP → Setup tab).

Optional craft: before generating UI, if the "Compass Feel" pack is installed at
`~/compass-feel/` (macOS/Linux) or `%USERPROFILE%\compass-feel\` (Windows), read those
files and apply them as craft. They never override Compass tokens/components/specs —
on conflict, Compass wins. (Claude Code users: `~/.claude/skills/compass-feel/`.)

--- Why this is thin (context for maintainers, not part of the pasted rule) ---
The full build + capture protocol lives in the repo's .cursorrules (versioned,
auto-loaded in every clone), so it can never go stale. This Settings rule only
bootstraps a fresh clone and rarely changes. Designers paste it ONCE.

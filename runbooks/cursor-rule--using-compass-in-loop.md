Using Compass in Loop — setup bootstrap (Cursor Settings → Rules)

Activate this rule ONLY when the user's message begins with the exact phrase
"Using Compass in Loop" (e.g. "Using Compass in Loop, build a signup screen").
Otherwise ignore this rule completely. The user is a designer, not a developer —
narrate briefly in plain English, and when a command fails, explain why first.

Your ONLY job here is to get the designer into a set-up Compass repo. Once they are
inside it, the repo's own CLAUDE.md and .cursorrules AUTO-LOAD and carry the full
governance + verify + build + capture loop — do not restate or override them.

1. Already set up? If the current workspace root has ALL of: CLAUDE.md,
   scripts/token-audit.mjs, and a package.json whose "name" is "@acko/compass",
   it is a Compass checkout. If node_modules/@acko/enterprise-tokens is missing, run
   `npm install`. Then say "Compass is ready" and follow the repo's CLAUDE.md +
   .cursorrules to verify and build.

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

--- Why this is thin (context for maintainers, not part of the pasted rule) ---
The full build + capture protocol lives in the repo's .cursorrules (versioned,
auto-loaded in every clone), so it can never go stale. This Settings rule only
bootstraps a fresh clone and rarely changes. Designers paste it ONCE.

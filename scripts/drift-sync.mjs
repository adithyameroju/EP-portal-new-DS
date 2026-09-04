#!/usr/bin/env node

/**
 * Compass drift telemetry — Drive push (fail-safe).
 *
 * Copies a build's committed drift entry + its scoped compliance report to the
 * designer's synced Google Drive folder, attributed to their sticky username:
 *   <driftFolder>/<username>/entries/<same-filename>.json
 *   <driftFolder>/<username>/reports/<same-filename>.json
 * Copies are byte-identical (no mutation → integrity across local, Drive, owner).
 *
 * HARD RULE: this NEVER blocks or fails a build. Any problem (no config yet, folder
 * missing, Drive offline) → the files are queued to ~/.compass/pending-sync/ and the
 * push is retried at next session start. This process ALWAYS exits 0.
 *
 * CLI:
 *   node scripts/drift-sync.mjs --entry <path> --report <path>   # push one build
 *   node scripts/drift-sync.mjs --drain                          # flush the queue
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  readConfig, resolveUsername, validateDrivePath, driveDirs, PENDING_DIR,
} from './drift-config.mjs';

const KIND_DIR = { entry: 'entries', report: 'reports' };
const QUEUE_PATH = path.join(PENDING_DIR, 'queue.json');

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--entry') a.entry = argv[++i];
    else if (argv[i] === '--report') a.report = argv[++i];
    else if (argv[i] === '--drain') a.drain = true;
    else if (argv[i] === '--quiet') a.quiet = true;
  }
  return a;
}
function log(quiet, ...m) { if (!quiet) console.log('  [drift-sync]', ...m); }
function readQueue() { try { return JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8')); } catch { return []; } }
function writeQueue(q) { fs.mkdirSync(PENDING_DIR, { recursive: true }); fs.writeFileSync(QUEUE_PATH, JSON.stringify(q, null, 2) + '\n'); }
function copyInto(dir, srcPath) { fs.mkdirSync(dir, { recursive: true }); const dest = path.join(dir, path.basename(srcPath)); fs.copyFileSync(srcPath, dest); return dest; }

/** Queue one file locally (kept byte-identical) and record it. Marks it pending-sync. */
function queue(kind, srcPath) {
  const dir = path.join(PENDING_DIR, KIND_DIR[kind]);
  const stored = copyInto(dir, srcPath);
  const q = readQueue();
  const name = path.basename(srcPath);
  if (!q.some((x) => x.name === name && x.kind === kind)) {
    q.push({ name, kind, queuedAt: new Date().toISOString() });
    writeQueue(q);
  }
  return stored;
}

/** Try to push one file to Drive. Returns true on success. */
function pushToDrive(cfg, username, kind, srcPath) {
  const dirs = driveDirs(cfg, username);
  if (!dirs) return false;
  copyInto(dirs[KIND_DIR[kind]], srcPath);
  return true;
}

function driveReady(cfg) {
  if (!cfg.driftFolder) return false;
  return validateDrivePath(cfg.driftFolder).ok;
}

function syncOne(a) {
  const cfg = readConfig();
  const { username, warned } = resolveUsername(cfg, true);
  if (warned) log(a.quiet, 'WARNING —', warned);
  const items = [];
  if (a.entry && fs.existsSync(a.entry)) items.push(['entry', a.entry]);
  if (a.report && fs.existsSync(a.report)) items.push(['report', a.report]);
  if (items.length === 0) { log(a.quiet, 'nothing to sync (no entry/report found).'); return; }

  const ready = driveReady(cfg) && !!username;
  for (const [kind, src] of items) {
    try {
      if (ready && pushToDrive(cfg, username, kind, src)) {
        log(a.quiet, `synced ${kind} → Drive/${username}/${KIND_DIR[kind]}/`);
      } else {
        queue(kind, src);
        log(a.quiet, `queued ${kind} (pending-sync) — ${cfg.driftFolder ? 'Drive not reachable' : 'no Drive path set yet'}; will retry at next session.`);
      }
    } catch (e) {
      try { queue(kind, src); } catch { /* give up silently — never block */ }
      log(a.quiet, `queued ${kind} after error: ${e && e.message}`);
    }
  }
}

function drain(a) {
  const cfg = readConfig();
  const q = readQueue();
  if (q.length === 0) { log(a.quiet, 'queue empty.'); return; }
  const { username } = resolveUsername(cfg, true);
  if (!driveReady(cfg) || !username) { log(a.quiet, `${q.length} item(s) still pending — Drive not reachable yet.`); return; }
  const remaining = [];
  let sent = 0;
  for (const item of q) {
    const src = path.join(PENDING_DIR, KIND_DIR[item.kind], item.name);
    try {
      if (fs.existsSync(src)) { pushToDrive(cfg, username, item.kind, src); fs.rmSync(src); sent++; }
      // if the pending file vanished, drop it from the queue silently
    } catch { remaining.push(item); }
  }
  writeQueue(remaining);
  log(a.quiet, `drained ${sent} item(s) to Drive/${username}/; ${remaining.length} still pending.`);
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  try { if (a.drain) drain(a); else syncOne(a); }
  catch (e) { log(a.quiet, 'non-fatal error (build unaffected):', e && e.message); }
  process.exit(0); // NEVER block a build
}
main();

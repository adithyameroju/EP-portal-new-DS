#!/usr/bin/env node

/**
 * Compass drift telemetry — per-machine config + identity (Drive transport).
 *
 * Config lives at ~/.compass/config.json (UNTRACKED, per machine). It is NOT in the
 * repo — no PATs, no API keys, no git remote for telemetry; the transport is the
 * designer's own synced Google Drive folder.
 *
 * Username (the Drive subfolder) is DERIVED, never self-declared, and STICKY:
 *   1. gh api user --jq .login  (GitHub identity behind the commits)
 *   2. fallback: slug of git author email local-part
 * On first successful derivation it is RECORDED in config; later runs use the
 * recorded value. If a fresh derivation ever disagrees, we WARN and keep the
 * recorded one — a lapsed gh auth must never silently fork telemetry into a second
 * identity folder.
 *
 * CLI:
 *   node scripts/drift-config.mjs --check            # JSON status
 *   node scripts/drift-config.mjs --set-path "<p>"   # validate + store the Drive path
 *   node scripts/drift-config.mjs --username         # print the resolved sticky username
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const CONFIG_DIR = path.join(os.homedir(), '.compass');
export const CONFIG_PATH = path.join(CONFIG_DIR, 'config.json');
export const PENDING_DIR = path.join(CONFIG_DIR, 'pending-sync');

export const FIX_PATH_MSG =
  'That path isn\'t a synced Google Drive folder. Fix: go to drive.google.com → ' +
  'right-click the shared "Compass Drift" → "Add shortcut to Drive" → My Drive. Then ' +
  'paste the synced path — macOS: ~/Library/CloudStorage/GoogleDrive-<you>@acko.tech/My Drive/Compass Drift ; ' +
  'Windows: %USERPROFILE%\\My Drive\\Compass Drift (or your Drive letter, e.g. G:\\My Drive\\Compass Drift).';

export function readConfig() {
  try { return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')); } catch { return {}; }
}
export function writeConfig(cfg) {
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2) + '\n');
}

function tryExec(cmd, args, timeout = 8000) {
  try { return execFileSync(cmd, args, { encoding: 'utf8', timeout, stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
  catch { return ''; }
}
export function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^[-.]+|[-.]+$/g, '') || 'unknown';
}

/** Derive a username from identity — GitHub login first, then git author email. */
export function deriveUsername() {
  const gh = tryExec('gh', ['api', 'user', '--jq', '.login']);
  if (gh) return { username: slug(gh), source: 'gh' };
  const email = tryExec('git', ['config', 'user.email']);
  if (email) return { username: slug(email.split('@')[0]), source: 'git-email' };
  return { username: '', source: 'none' };
}

/**
 * Sticky username: record on first success; keep the recorded value forever after,
 * warning (never switching) if a fresh derivation disagrees.
 * Returns { username, warned }.
 */
export function resolveUsername(cfg, persist = true) {
  const fresh = deriveUsername();
  if (cfg.username) {
    if (fresh.username && fresh.username !== cfg.username) {
      return {
        username: cfg.username,
        warned:
          `derived "${fresh.username}" (${fresh.source}) but the recorded username is ` +
          `"${cfg.username}" — keeping the recorded one so your telemetry stays under a ` +
          `single identity (re-auth gh, or edit ~/.compass/config.json to change it deliberately).`,
      };
    }
    return { username: cfg.username, warned: null };
  }
  if (fresh.username && persist) {
    cfg.username = fresh.username;
    cfg.usernameSource = fresh.source;
    writeConfig(cfg);
  }
  return { username: fresh.username, warned: null };
}

export function expandHome(p) {
  if (!p) return p;
  if (p === '~') return os.homedir();
  if (p.startsWith('~/') || p.startsWith('~\\')) return path.join(os.homedir(), p.slice(2));
  return p;
}

/** Validate a pasted Drive path: must exist, be a directory, and look like a
 *  Drive-for-Desktop synced folder (rejects a random local folder). */
export function validateDrivePath(p) {
  const abs = expandHome(p);
  if (!abs) return { ok: false, reason: 'empty', fix: FIX_PATH_MSG };
  if (!fs.existsSync(abs)) return { ok: false, reason: 'not-found', fix: FIX_PATH_MSG };
  try { if (!fs.statSync(abs).isDirectory()) return { ok: false, reason: 'not-a-directory', fix: FIX_PATH_MSG }; }
  catch { return { ok: false, reason: 'unreadable', fix: FIX_PATH_MSG }; }
  const looksDrive = /CloudStorage|GoogleDrive|Google Drive|My Drive/i.test(abs);
  if (!looksDrive) return { ok: false, reason: 'not-a-drive-folder', fix: FIX_PATH_MSG };
  return { ok: true, abs };
}

/** The two target dirs for a given username under the configured Drive folder. */
export function driveDirs(cfg, username) {
  if (!cfg.driftFolder || !username) return null;
  const base = path.join(cfg.driftFolder, username);
  return { base, entries: path.join(base, 'entries'), reports: path.join(base, 'reports') };
}

function safeReaddir(dir) { try { return fs.readdirSync(dir); } catch { return []; } }
function isDir(p) { try { return fs.statSync(p).isDirectory(); } catch { return false; } }

/**
 * OWNER-side read source: when this machine is role:"owner" with a valid Drive
 * folder, gather every designer subfolder's committed entries + reports as the
 * PRIMARY telemetry source. Attribution = the subfolder name (username) plus each
 * entry's own `designer` field. Returns null when not an owner / folder invalid, so
 * callers fall back to local/repo sources.
 */
export function ownerDriveSources(cfg = readConfig()) {
  if (cfg.role !== 'owner' || !cfg.driftFolder || !validateDrivePath(cfg.driftFolder).ok) return null;
  const base = cfg.driftFolder;
  const entries = [];
  const reports = [];
  for (const user of safeReaddir(base)) {
    const ud = path.join(base, user);
    if (!isDir(ud)) continue;
    for (const f of safeReaddir(path.join(ud, 'entries'))) {
      if (f.endsWith('.json')) entries.push({ name: f, path: path.join(ud, 'entries', f), username: user });
    }
    for (const f of safeReaddir(path.join(ud, 'reports'))) {
      if (f.endsWith('.json')) reports.push({ name: f, path: path.join(ud, 'reports', f), username: user });
    }
  }
  return { base, designers: safeReaddir(base).filter((u) => isDir(path.join(base, u))), entries, reports };
}

// ─── CLI ─────────────────────────────────────────────────────────────────────
function main() {
  const argv = process.argv.slice(2);
  const cfg = readConfig();

  if (argv[0] === '--check') {
    const hasPath = !!cfg.driftFolder;
    const v = hasPath ? validateDrivePath(cfg.driftFolder) : { ok: false };
    const { username } = resolveUsername(cfg, false);
    console.log(JSON.stringify({
      hasConfig: fs.existsSync(CONFIG_PATH),
      driftFolder: cfg.driftFolder || null,
      pathValid: !!v.ok,
      role: cfg.role || 'designer',
      username: username || null,
      needsPath: !hasPath || !v.ok,
    }, null, 2));
    return;
  }

  if (argv[0] === '--set-path') {
    const p = argv[1];
    const v = validateDrivePath(p);
    if (!v.ok) { console.error(v.fix); process.exit(1); }
    cfg.driftFolder = v.abs;
    if (!cfg.role) cfg.role = 'designer';
    if (!cfg.createdAt) cfg.createdAt = new Date().toISOString();
    const { username, warned } = resolveUsername(cfg, true); // records username stickily
    writeConfig(cfg);
    if (warned) console.error('warning: ' + warned);
    console.log(`Compass Drift path saved. You are "${username}". You won't be asked again.`);
    return;
  }

  if (argv[0] === '--username') {
    const { username, warned } = resolveUsername(cfg, false);
    if (warned) console.error('warning: ' + warned);
    console.log(username || '(none)');
    return;
  }

  console.log('usage: drift-config.mjs --check | --set-path "<path>" | --username');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();

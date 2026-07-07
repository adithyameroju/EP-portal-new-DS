/**
 * Compass CLI — package-root resolution.
 *
 * The CLI must work from two positions:
 *   1. inside this repo:            <repo>/cli/lib/paths.mjs   → root = <repo>
 *   2. installed in a consumer:     <consumer>/node_modules/<pkg>/cli/lib/paths.mjs
 *                                                              → root = <pkg>
 * In both cases the Compass source root is two directories above this file.
 * We verify the anchor artifacts actually exist so a broken install fails
 * loudly instead of scaffolding garbage.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** Absolute path to the Compass package/repo root the CLI is running from. */
export const PKG_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
);

/** Anchor artifacts that must exist at a valid Compass root. */
const ANCHORS = [
  'components/ui',
  '.claude/specs',
  '.claude/skills',
  'CLAUDE.md',
];

/** Throws with a clear message if PKG_ROOT is not a Compass source root. */
export function assertCompassRoot() {
  const missing = ANCHORS.filter((rel) => !fs.existsSync(path.join(PKG_ROOT, rel)));
  if (missing.length > 0) {
    throw new Error(
      `Compass source root not found at ${PKG_ROOT} — missing: ${missing.join(', ')}. `
      + 'The compass CLI resolves its source files relative to its own install location '
      + '(repo root or the installed package root inside node_modules).',
    );
  }
}

/** Repo-relative → absolute path inside the Compass package root. */
export function srcPath(...rel) {
  return path.join(PKG_ROOT, ...rel);
}

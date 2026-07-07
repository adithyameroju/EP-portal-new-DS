/**
 * Compass CLI — ComponentMeta loader.
 *
 * Same approach as scripts/compliance-audit.mjs#loadMetaIndex (S4, owner-
 * approved): transpile components/ui/<name>.meta.ts with the project's own
 * `typescript` package and import the result as a data: URL module. Meta files
 * are declarative object literals (type-only imports get erased), so this is
 * safe and needs zero new runtime dependencies — `typescript` already ships as
 * a devDependency of this repo and of every consumer Next/TS project.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

import { PKG_ROOT, srcPath } from './paths.mjs';

const UI_DIR = srcPath('components', 'ui');

/** Resolve the `typescript` module — from the CLI's own tree first (covers the
 *  repo case), then from the consumer's cwd (covers the installed case where
 *  typescript is hoisted to the consumer's node_modules). */
async function loadTypescript() {
  try {
    const { default: ts } = await import('typescript');
    return ts;
  } catch {
    // fall through to cwd-relative resolution
  }
  const require = createRequire(path.join(process.cwd(), 'package.json'));
  return require('typescript'); // throws if genuinely absent — caught by caller
}

/** Kebab-case names of every component that has a .meta.ts file. */
export function listMetaNames() {
  if (!fs.existsSync(UI_DIR)) return [];
  return fs.readdirSync(UI_DIR)
    .filter((f) => f.endsWith('.meta.ts') && !f.startsWith('_'))
    .map((f) => f.replace(/\.meta\.ts$/, ''))
    .sort();
}

/**
 * Loads one component's meta. Returns the ComponentMeta object.
 * Throws Error with a human-actionable message on any failure.
 */
export async function loadMeta(name) {
  const metaFile = path.join(UI_DIR, `${name}.meta.ts`);
  if (!fs.existsSync(metaFile)) {
    const available = listMetaNames();
    throw new Error(
      `No meta found for "${name}" (looked for components/ui/${name}.meta.ts under ${PKG_ROOT}).`
      + (available.length > 0
        ? `\nAvailable components:\n  ${available.join(', ')}`
        : ''),
    );
  }

  let ts;
  try {
    ts = await loadTypescript();
  } catch {
    throw new Error(
      'Could not load the `typescript` package (needed to read the .meta.ts file). '
      + 'Install it in your project: npm install --save-dev typescript',
    );
  }

  const src = fs.readFileSync(metaFile, 'utf8');
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const mod = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
  const meta = Object.values(mod)[0];
  if (!meta || !meta.name) {
    throw new Error(`components/ui/${name}.meta.ts loaded but exported no ComponentMeta object.`);
  }
  return meta;
}

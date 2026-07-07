import { defineConfig } from "tsup"

/**
 * Compass package build (S3). Bundles lib/index.ts (the 55-component barrel
 * + meta layer + cn) into dist/ as ESM + CJS with type declarations.
 *
 * Key decisions (see lib/PACKAGING.md for the full story):
 * - `external`: React/Next and every runtime dependency stay external — the
 *   bundle contains only Compass source (components/ui/*, hooks/use-mobile,
 *   lib/utils). `@base-ui/react` needs a regex because components import
 *   deep subpaths (`@base-ui/react/accordion`, …).
 * - `@/` path alias: esbuild (which tsup wraps) natively reads
 *   `compilerOptions.paths` from tsconfig.json, and tsup's dts step
 *   (rollup-plugin-dts) does too — no extra alias plugin is needed. This is
 *   verified in the S3 acceptance test (consumer tsc against dist types).
 * - "use client": esbuild drops per-file directives when bundling, so the
 *   directive is re-added via `banner` at the top of each output bundle.
 *   This marks the ENTIRE barrel as a client module — a documented
 *   limitation (see PACKAGING.md §use-client).
 * - Extensions: the repo's root package.json is CommonJS-typed (no
 *   "type" field — deliberately untouched: the CLI lane may ship CJS bin
 *   scripts). So ESM output is `.js` + a generated dist/package.json
 *   {"type":"module"} (written post-build by `build:pkg`), and CJS
 *   output is `.cjs`.
 *   That yields exactly the exports-map shape S3 specifies:
 *   dist/index.js (ESM) / dist/index.cjs (CJS) / dist/index.d.ts.
 * - dts: `incremental` must be off for tsup's dts worker (TS5074) — the
 *   repo tsconfig enables it for Next, so it's overridden here.
 */
export default defineConfig({
  entry: { index: "lib/index.ts" },
  format: ["esm", "cjs"],
  outExtension({ format }) {
    return { js: format === "cjs" ? ".cjs" : ".js" }
  },
  dts: {
    compilerOptions: { incremental: false, composite: false },
  },
  sourcemap: true,
  clean: true,
  outDir: "dist",
  // Post-build steps (dist/package.json {"type":"module"} + index.d.cts
  // copy) live in the `build:pkg` npm script, NOT in onSuccess: tsup fires
  // onSuccess when the esbuild passes finish, racing the parallel dts
  // worker — index.d.ts may not exist yet. Always build via
  // `npm run build:pkg`, not bare `npx tsup`.
  banner: {
    // Re-applies the RSC client boundary that bundling strips from the
    // individual component files. Must stay the first statement in output.
    js: '"use client";',
  },
  external: [
    "react",
    "react-dom",
    "next",
    /^@base-ui\/react/, // deep imports: @base-ui/react/<part>
    "class-variance-authority",
    "clsx",
    "cmdk",
    "date-fns",
    "embla-carousel-react",
    "input-otp",
    "lucide-react",
    "next-themes",
    "react-day-picker",
    "react-resizable-panels",
    "recharts",
    "sonner",
    "tailwind-merge",
    "vaul",
    "@acko/enterprise-tokens",
  ],
})

/**
 * Phase 3 Day 1 — Visual comparison page
 *
 * Side-by-side render of:
 *   Left  — Test 1 (sign-in-test.tsx): first Cursor run, before spec tightening
 *   Right — Test 2 (sign-in-test-2.tsx): re-run after spec tightening, all criteria met
 *
 * Open at: http://localhost:3000/test
 */

import { SignInTest } from "@/components/blocks/sign-in-test"
import { SignInTest2 } from "@/components/blocks/sign-in-test-2"

export default function TestPage() {
  return (
    <div className="min-h-svh bg-muted/40 p-8">
      <div className="mx-auto max-w-7xl flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Phase 3 Day 1 — Cursor Test Comparison
          </h1>
          <p className="text-sm text-muted-foreground">
            Both screens generated from the same Figma frame (node 1-2785).
            Test 2 was run after spec tightening to confirm all drift items were fixed.
          </p>
        </div>

        {/* Side-by-side columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Test 1 */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">
                  3 drift items
                </span>
                <span className="text-sm font-medium text-foreground">Test 1 — Before fixes</span>
              </div>
              <ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5 mt-1">
                <li>CardTitle replaced with plain div</li>
                <li>Extra <code className="font-mono">border border-border</code> on Card</li>
                <li>Ghost button overridden with className</li>
              </ul>
            </div>
            <div className="rounded-xl overflow-hidden ring-1 ring-foreground/10">
              <SignInTest />
            </div>
          </div>

          {/* Test 2 */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                  All criteria met
                </span>
                <span className="text-sm font-medium text-foreground">Test 2 — After fixes</span>
              </div>
              <ul className="text-xs text-muted-foreground list-disc list-inside space-y-0.5 mt-1">
                <li>CardTitle, CardDescription, CardAction correct</li>
                <li>No extra border — ring only</li>
                <li>Ghost button zero overrides</li>
              </ul>
            </div>
            <div className="rounded-xl overflow-hidden ring-1 ring-foreground/10">
              <SignInTest2 />
            </div>
          </div>

        </div>

        {/* Footer note */}
        <p className="text-xs text-muted-foreground text-center">
          Audit result: 0 errors · 34 warnings (all in shadcn base components, none in generated code)
        </p>

      </div>
    </div>
  )
}

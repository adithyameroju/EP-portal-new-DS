/**
 * meta-doc-blocks — shared, mechanical renderer for Compass component docs.
 *
 * Renders the S2.3 page structure (Compass_GA_Roadmap.md):
 *   purpose → when-to-use / when-not → variants (+ gallery slot) →
 *   do's & don'ts → tokens → a11y → AI hints → parent/child relationships →
 *   version + status badges.
 *
 * Provenance rule (S2 standing gate — zero authored prose): every rendered
 * string is (a) a field value from a ComponentMeta object
 * (components/ui/<name>.meta.ts — each entry there carries its own spec
 * citation), (b) a _meta-schema.ts field name, or (c) a structure label
 * quoted from the roadmap's S2.3 line. Empty meta fields render
 * "Not documented yet" — never invented content.
 *
 * Dogfooding: built from Compass's own components/ui primitives.
 */

import type * as React from "react"
import { Stories } from "@storybook/addon-docs/blocks"

import type { ComponentCategory, ComponentMeta } from "@/components/ui/_meta-schema"
import { componentMetaIndex } from "@/components/ui/_meta-index"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/** Mandated empty-field text (S2.3 scope) — never invented content. */
export const NOT_DOCUMENTED = "Not documented yet"

/** Sidebar taxonomy plurals for meta.category (roadmap S2.1). */
export const CATEGORY_PLURAL: Record<ComponentCategory, string> = {
  atom: "Atoms",
  molecule: "Molecules",
  organism: "Organisms",
  template: "Templates",
  pattern: "Patterns",
}

/** kebab-case meta.name → PascalCase display name (mechanical). */
export function pascalName(kebab: string): string {
  return kebab
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("")
}

/**
 * Story title for a meta: "<CategoryPlural>/<PascalName>" (e.g. "Atoms/Button").
 * NOTE: Storybook's CSF indexer requires `title` to be a static string literal,
 * so each .stories.tsx writes this value out literally; this helper exists so
 * cross-links below always agree with that convention.
 */
export function storyTitle(meta: ComponentMeta): string {
  return `${CATEGORY_PLURAL[meta.category]}/${pascalName(meta.name)}`
}

/** Storybook docs-page id for a meta (its sanitized title). */
function docsPath(meta: ComponentMeta): string {
  return `/docs/${storyTitle(meta).toLowerCase().replace(/[^a-z0-9]+/g, "-")}--docs`
}

function Section({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-foreground">{label}</h2>
      {children}
    </section>
  )
}

function NotDocumented() {
  return <p className="text-sm text-muted-foreground italic">{NOT_DOCUMENTED}</p>
}

function MetaList({ items }: { items: string[] }) {
  if (items.length === 0) return <NotDocumented />
  return (
    <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm text-foreground">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  )
}

/** Small provenance line — the "source citation shown small" from S2.3 scope. */
function SourceNote({ source }: { source: string }) {
  return <p className="font-mono text-xs text-muted-foreground">{source}</p>
}

function TokenBadges({ tokens }: { tokens: string[] }) {
  if (tokens.length === 0) return <NotDocumented />
  return (
    <div className="flex flex-wrap gap-2">
      {tokens.map((token) => (
        <Badge key={token} variant="secondary" className="font-mono">
          {token}
        </Badge>
      ))}
    </div>
  )
}

/** Parent/child links: resolved against the meta index; components without a
 *  meta entry render as plain badges. Links resolve once the target's story
 *  exists (all 55 by end of S2.3). */
function RelatedLinks({ names }: { names: string[] }) {
  if (names.length === 0) return <NotDocumented />
  return (
    <div className="flex flex-wrap gap-2">
      {names.map((name) => {
        const related = componentMetaIndex[name]
        if (!related) {
          return (
            <Badge key={name} variant="outline" className="font-mono">
              {name}
            </Badge>
          )
        }
        return (
          <a key={name} href={`/?path=${docsPath(related)}`} target="_top">
            <Badge variant="outline" className="font-mono">
              {storyTitle(related)}
            </Badge>
          </a>
        )
      })}
    </div>
  )
}

function VariantTable({ meta }: { meta: ComponentMeta }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {/* Column labels = _meta-schema.ts VariantAxis field names */}
          <TableHead>prop</TableHead>
          <TableHead>values</TableHead>
          <TableHead>default</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {meta.variants.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-muted-foreground italic">
              {NOT_DOCUMENTED}
            </TableCell>
          </TableRow>
        ) : (
          meta.variants.map((axis, i) => (
            <TableRow key={`${axis.prop}-${i}`}>
              <TableCell className="font-mono">{axis.prop}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1.5">
                  {axis.values.map((value) => (
                    <Badge key={value} variant="outline" className="font-mono">
                      {value}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className="font-mono">{axis.default ?? "—"}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}

/** Do's & don'ts side-by-side, from antiPatterns wrong/instead (S2.3 scope).
 *  Column labels = _meta-schema.ts AntiPattern field names. */
function DosAndDonts({ meta }: { meta: ComponentMeta }) {
  if (meta.antiPatterns.length === 0) return <NotDocumented />
  return (
    <div className="flex flex-col gap-4">
      {meta.antiPatterns.map((antiPattern) => (
        <div
          key={antiPattern.wrong}
          className="overflow-hidden rounded-lg border border-border"
        >
          <div className="grid md:grid-cols-2">
            <div className="flex flex-col gap-1.5 p-4">
              <p className="text-xs font-semibold tracking-wide text-destructive uppercase">
                wrong
              </p>
              <p className="text-sm text-foreground">{antiPattern.wrong}</p>
            </div>
            <div className="flex flex-col gap-1.5 border-t border-border p-4 md:border-t-0 md:border-l">
              <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                instead
              </p>
              <p className="text-sm text-foreground">{antiPattern.instead}</p>
            </div>
          </div>
          <div className="border-t border-border bg-muted px-4 py-2">
            <SourceNote source={antiPattern.source} />
          </div>
        </div>
      ))}
    </div>
  )
}

function ConfusedWithTable({ meta }: { meta: ComponentMeta }) {
  if (meta.aiHints.confusedWith.length === 0) return <NotDocumented />
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {/* Column labels = _meta-schema.ts AiHints.confusedWith field names */}
          <TableHead>component</TableHead>
          <TableHead>disambiguation</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {meta.aiHints.confusedWith.map((entry) => (
          <TableRow key={entry.component}>
            <TableCell className="align-top font-mono">{entry.component}</TableCell>
            <TableCell className="whitespace-normal">{entry.disambiguation}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

/** Version + status badges (specStatus, codeConnectStatus, version, category). */
function StatusBadges({ meta }: { meta: ComponentMeta }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{meta.category}</Badge>
        <Badge variant={meta.specStatus === "specced" ? "default" : "secondary"}>
          specStatus: {meta.specStatus}
        </Badge>
        <Badge
          variant={meta.codeConnectStatus === "mapped" ? "default" : "secondary"}
        >
          codeConnectStatus: {meta.codeConnectStatus}
        </Badge>
        <Badge variant="outline" className="font-mono">
          v{meta.version}
        </Badge>
        <Badge variant="secondary" className="font-mono">
          {meta.primitiveSource}
        </Badge>
      </div>
      {meta.specPath ? <SourceNote source={meta.specPath} /> : null}
    </div>
  )
}

/**
 * The full S2.3 docs page for one ComponentMeta. `gallery` slots the variant
 * gallery (the file's stories) into the roadmap's page order, right after
 * the variants table.
 */
export function MetaDocPage({
  meta,
  gallery,
}: {
  meta: ComponentMeta
  gallery?: React.ReactNode
}) {
  return (
    <div className="sb-unstyled flex flex-col gap-8 py-4 font-sans text-foreground">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">{pascalName(meta.name)}</h1>
        {/* Purpose — meta.purpose, lifted from the spec's purpose statement */}
        <p className="text-sm text-muted-foreground">
          {meta.purpose || NOT_DOCUMENTED}
        </p>
      </header>

      <Separator />

      {/* when-to-use / when-not (aiHints.selectionCriteria + confusedWith) */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>When to use</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <MetaList items={meta.aiHints.selectionCriteria} />
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                use cases
              </p>
              <MetaList items={meta.useCases} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>When not (confused with)</CardTitle>
          </CardHeader>
          <CardContent>
            <ConfusedWithTable meta={meta} />
          </CardContent>
        </Card>
      </div>

      <Section label="Variants">
        <VariantTable meta={meta} />
      </Section>

      {gallery}

      <Section label="Do's & don'ts">
        <DosAndDonts meta={meta} />
      </Section>

      <Section label="Tokens">
        <TokenBadges tokens={meta.tokens} />
      </Section>

      <Section label="A11y">
        <MetaList items={meta.a11y} />
      </Section>

      <Section label="AI hints">
        <div className="flex flex-col gap-3">
          {/* selectionCriteria + confusedWith render above (when-to-use/when-not);
              this section carries the remaining aiHints field: compositionRules */}
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            composition rules
          </p>
          <MetaList items={meta.aiHints.compositionRules} />
          <SourceNote source={meta.aiHints.source} />
        </div>
      </Section>

      <Section label="Parent/child relationships">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              parentComponents
            </p>
            <RelatedLinks names={meta.parentComponents} />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              childComponents
            </p>
            <RelatedLinks names={meta.childComponents} />
          </div>
        </div>
      </Section>

      <Separator />

      <StatusBadges meta={meta} />
    </div>
  )
}

/**
 * Docs `page` factory for .stories.tsx files:
 *   parameters: { docs: { page: metaDocsPage(buttonMeta) } }
 * Slots the file's stories in as the roadmap's "variant gallery" step.
 */
export function metaDocsPage(meta: ComponentMeta) {
  return function MetaDocs() {
    return (
      <MetaDocPage
        meta={meta}
        gallery={
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-foreground">
              Variant gallery
            </h2>
            {/* Storybook addon-docs Stories block — renders this file's stories */}
            <Stories title="" includePrimary />
          </div>
        }
      />
    )
  }
}

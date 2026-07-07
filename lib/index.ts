/**
 * Compass package barrel (S3) — the single public entry point for
 * `@acko/compass` consumers. Re-exports:
 *   1. every public export of all 55 components in `components/ui/`
 *   2. the meta layer: ComponentMeta types (_meta-schema), all 55 *Meta
 *      objects, `componentMetaIndex`, and `allComponentMeta` (_meta-index)
 *   3. the `cn` class-merge utility (lib/utils)
 *
 * Built by tsup (see tsup.config.ts / lib/PACKAGING.md). Do not import this
 * file from app/ code — the app keeps importing `@/components/ui/*` directly.
 */

// ---- components (55) --------------------------------------------------
export * from "@/components/ui/accordion"
export * from "@/components/ui/alert"
export * from "@/components/ui/alert-dialog"
export * from "@/components/ui/aspect-ratio"
export * from "@/components/ui/avatar"
export * from "@/components/ui/badge"
export * from "@/components/ui/breadcrumb"
export * from "@/components/ui/button"
export * from "@/components/ui/button-group"
export * from "@/components/ui/calendar"
export * from "@/components/ui/card"
export * from "@/components/ui/carousel"
export * from "@/components/ui/chart"
export * from "@/components/ui/checkbox"
export * from "@/components/ui/collapsible"
export * from "@/components/ui/combobox"
export * from "@/components/ui/command"
export * from "@/components/ui/context-menu"
export * from "@/components/ui/dialog"
export * from "@/components/ui/direction"
export * from "@/components/ui/drawer"
export * from "@/components/ui/dropdown-menu"
export * from "@/components/ui/empty"
export * from "@/components/ui/field"
export * from "@/components/ui/hover-card"
export * from "@/components/ui/input"
export * from "@/components/ui/input-group"
export * from "@/components/ui/input-otp"
export * from "@/components/ui/item"
export * from "@/components/ui/kbd"
export * from "@/components/ui/label"
export * from "@/components/ui/menubar"
export * from "@/components/ui/native-select"
export * from "@/components/ui/navigation-menu"
export * from "@/components/ui/pagination"
export * from "@/components/ui/popover"
export * from "@/components/ui/progress"
export * from "@/components/ui/radio-group"
export * from "@/components/ui/resizable"
export * from "@/components/ui/scroll-area"
export * from "@/components/ui/select"
export * from "@/components/ui/separator"
export * from "@/components/ui/sheet"
export * from "@/components/ui/sidebar"
export * from "@/components/ui/skeleton"
export * from "@/components/ui/slider"
export * from "@/components/ui/sonner"
export * from "@/components/ui/spinner"
export * from "@/components/ui/switch"
export * from "@/components/ui/table"
export * from "@/components/ui/tabs"
export * from "@/components/ui/textarea"
export * from "@/components/ui/toggle"
export * from "@/components/ui/toggle-group"
export * from "@/components/ui/tooltip"

// ---- meta layer (S1) ---------------------------------------------------
// All schema types (ComponentMeta, PropMeta, SlotMeta, …)
export * from "@/components/ui/_meta-schema"
// All 55 named *Meta objects + componentMetaIndex + allComponentMeta
export * from "@/components/ui/_meta-index"

// ---- utilities ----------------------------------------------------------
export { cn } from "@/lib/utils"

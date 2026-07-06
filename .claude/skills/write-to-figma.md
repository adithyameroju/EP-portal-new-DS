# Compass — Write to Figma Skill

> Instructions for writing Compass designs back to Figma as proper
> library component instances. This ensures the Figma output uses
> published Compass library components, not raw frames.

## When this skill applies

Use this skill whenever:
- A designer asks to "write back to Figma" or "sync to Figma"
- A designer asks to "create this in Figma" or "show this in Figma"
- After building a screen in code, the designer wants it in Figma

## Critical rule

**NEVER use `figma.createFrame()` or `figma.createRectangle()` to
represent a Compass component.** Always use `figma.importComponentByKeyAsync(key)`
to create proper library instances from the published Compass library.

Raw frames lose all library connections, use wrong fonts, hardcode
colors, and break the design system. Library instances inherit
variables, tokens, fonts, and variant properties correctly.

---

## Step 1 — Read the component key registry

Before writing anything to Figma, read `.claude/specs/figma/component-keys.md`.
This file maps every Compass component to its Figma library key.

---

## Step 2 — Plan the layout

For the screen being written to Figma:
1. List every Compass component used in the code
2. Look up each component's **Default Variant Key** in the registry
3. Determine which variant properties need to be set on each instance
4. Plan the layout structure (frames for positioning, instances for components)

---

## Step 3 — Write to Figma using the `use_figma` tool

Use the Figma MCP's `use_figma` tool. The code MUST follow this pattern:

```javascript
// 1. Import components from the Compass library
const buttonComponent = await figma.importComponentByKeyAsync("9072208bc6696d66fa217fbf8248f31db2aad416");
const cardComponent = await figma.importComponentByKeyAsync("0eac4951b21351151275f293ecf3bfd37861e6f3");

// 2. Create the page frame (raw frame for the outermost container is acceptable)
const page = figma.createFrame();
page.name = "Screen Name";
page.resize(1280, 960);
page.layoutMode = "VERTICAL";
page.paddingTop = 24;
page.paddingBottom = 24;
page.paddingLeft = 24;
page.paddingRight = 24;
page.itemSpacing = 24;

// 3. Create component instances (NOT raw frames)
const cardInstance = cardComponent.createInstance();
page.appendChild(cardInstance);

const buttonInstance = buttonComponent.createInstance();

// 4. For layout containers that are NOT components (rows, grids, spacers),
//    use figma.createFrame() with auto-layout — acceptable for structural
//    containers that don't correspond to Compass components
const row = figma.createFrame();
row.layoutMode = "HORIZONTAL";
row.itemSpacing = 16;
row.fills = []; // transparent
row.name = "Card Row";

// 5. Place on canvas
figma.currentPage.appendChild(page);
```

---

## Step 4 — Rules for specific components

### Button
```javascript
const btn = await figma.importComponentByKeyAsync("9072208bc6696d66fa217fbf8248f31db2aad416");
const instance = btn.createInstance();
// Variant: instance.setProperties({ "Variant": "Secondary" });
// Available variants: Default, Secondary, Destructive, Outline, Ghost, Link
// Size: instance.setProperties({ "Size": "sm" });
// Available sizes: xs, default, sm, lg, icon, icon-xs, icon-sm, icon-lg
```

### Card
```javascript
const card = await figma.importComponentByKeyAsync("0eac4951b21351151275f293ecf3bfd37861e6f3");
const instance = card.createInstance();
```

### Badge
```javascript
const badge = await figma.importComponentByKeyAsync("8415023d518c32339795531f2096af0d023bb83c");
const instance = badge.createInstance();
// Variants: Default, Secondary, Destructive, Outline
```

### Input
```javascript
const input = await figma.importComponentByKeyAsync("b40d2e24634985a6199c7e3e5b2d559615ab2f0f");
const instance = input.createInstance();
```

### Tabs
```javascript
const tabs = await figma.importComponentByKeyAsync("f081eb1a79638543c8696c25129aeaeaa4af37e8");
const instance = tabs.createInstance();
// Variant: instance.setProperties({ "Variant": "Line" }); // Default or Line
```

### Sidebar (composed from sub-components)
```javascript
const menuButton = await figma.importComponentByKeyAsync("32169a88b2ccd5b69b7dec810197725f0f46b199");
const group = await figma.importComponentByKeyAsync("aeb1bc95f39cf8e271548b16cdbf1ea7a48c9df6");
const groupLabel = await figma.importComponentByKeyAsync("70f3201fe625b3f83e2cdcd0cc9d77c71ec3d65e");

const sidebarFrame = figma.createFrame();
sidebarFrame.layoutMode = "VERTICAL";
sidebarFrame.itemSpacing = 4;
sidebarFrame.fills = [];

const labelInstance = groupLabel.createInstance();
sidebarFrame.appendChild(labelInstance);

const btn1 = menuButton.createInstance();
btn1.setProperties({ "Active": "true" });
sidebarFrame.appendChild(btn1);
```

---

## Step 5 — Self-check before presenting

After writing to Figma, verify:
- [ ] Every Compass component is an INSTANCE node (not FRAME) — check `node.type === "INSTANCE"`
- [ ] No hardcoded hex colors — all fills use Figma variables
- [ ] Font is Euclid Circular B (not Inter, not system font)
- [ ] Auto-layout is applied to all container frames
- [ ] Component variant properties are set correctly

---

## What is acceptable as a raw frame

Only these elements should be `createFrame()`:
- Page-level container (the outermost wrapper)
- Layout rows/columns (structural grid that isn't a Compass component)
- Spacer elements
- Custom layout containers that don't map to any Compass component

Everything else MUST be a library instance via `importComponentByKeyAsync`.

---

## Fallback

If a component key is not in the registry:
1. Check `.claude/specs/figma/component-keys.md` — it may have been added recently
2. If truly missing, create a raw frame BUT:
   - Flag it in the output: "Warning: [Component] written as raw frame — key not in registry"
   - Name the frame clearly: `TODO: Replace with [Component] instance`
   - Note it in the "What I assumed" section of the output

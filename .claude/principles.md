# Compass — Design Principles

> **Compass** — Acko's enterprise design system. A shared sense of direction
> for every team building Acko products, from Figma to production.

---

## About this document

This is a living document. It captures the design principles and constraints
that guide Compass decisions. As Acko's enterprise products are built on this
system, opinions and conventions will form from real usage — they should be
added here when they solidify, not invented in advance.

LLMs (Cursor, Claude Code) should read this file at session start alongside
the spec files. When a design decision is ambiguous and the component specs
don't resolve it, these principles are the tiebreaker.

---

## Core principles

### 1. System over invention

Every UI element comes from the Compass component library. Designers compose
from existing components — they do not detach, override, or create new
primitives outside the system. If the system doesn't have what you need,
that's a signal to extend the system, not work around it.

### 2. Tokens over values

Every color, spacing value, radius, shadow, and font reference uses a Compass
token. Hardcoded hex values, arbitrary pixel values, and Tailwind color
utilities (`bg-red-500`, `text-gray-700`) are not allowed. The token audit
script enforces this at build time.

### 3. Correctness over speed

Compass prioritizes producing correct, consistent output over fast output.
A component that takes an extra iteration to match the spec exactly is better
than one shipped quickly with "close enough" values. When in doubt, slow down
and check the spec.

### 4. Closed set, open composition

The primitives (Button, Input, Card, etc.) are a closed set — tightly
specified, owned by CODEOWNERS review, not modified casually. But composition
is open — any combination of existing primitives into layouts, patterns, and
pages is encouraged. The system constrains the atoms, not the molecules.

### 5. Figma is the design, code is the product

Figma is where design intent is expressed. Code is where it becomes real.
The two must match. When they diverge, the Figma design is the source of
intent — but the code's token system is the source of allowed values. Neither
overrides the other; they reconcile through the spec files.

---

## Brand context

Acko is an insurance company that built its reputation on cutting through
complexity. Compass extends that ethos inward: clarity, directness, and
confidence in every interface element.

### What we know

- **Typeface:** Euclid Circular B — geometric, clean, modern
- **Primary color:** Purple (`#6841E6` light / `#7A62F0` dark) — distinctive,
  not the typical insurance blue
- **Tone:** Professional but not corporate-stiff. Clear over clever.
- **Icon set:** Lucide — clean line icons, consistent stroke weight

### What we'll learn through building

These sections are intentionally blank. They will be filled in as the first
Acko enterprise products are designed and built on Compass:

- **Information density preferences** — compact tables vs. spacious cards?
- **Navigation patterns** — sidebar-heavy vs. top-nav?
- **Data visualization conventions** — which chart types, how much annotation?
- **Form density** — one field per row vs. multi-column forms?
- **Tone of microcopy** — formal vs. conversational error messages?
- **Mobile-first vs. desktop-first** — where do enterprise users actually work?

> When you form an opinion on any of the above from real product work, add it
> here. One sentence per opinion is enough. The goal is a growing set of
> convictions that prevent the same debate from happening twice.

---

## For LLMs

When these principles conflict with each other:
- "System over invention" wins over speed or convenience
- "Tokens over values" wins over visual approximation
- When two principles don't resolve the question, surface the ambiguity to
  the designer — don't guess

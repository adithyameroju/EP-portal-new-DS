import type { ComponentMeta } from "./_meta-schema"

export const inputOtpMeta: ComponentMeta = {
  name: "input-otp",
  category: "molecule",
  purpose:
    "One-time-passcode input built on the input-otp library, rendering per-character slots with an animated fake caret, active-slot ring, and optional group separators.",
  useCases: [],
  antiPatterns: [],
  variants: [],
  sizes: [],
  parentComponents: [],
  childComponents: ["input-otp-group", "input-otp-slot", "input-otp-separator"],
  tokens: [
    "border-input",
    "border-ring",
    "ring-ring",
    "border-destructive",
    "ring-destructive",
    "bg-input",
    "bg-foreground",
  ],
  a11y: [
    "role=separator on InputOTPSeparator",
    "Slot and group styling respond to aria-invalid (destructive border and ring)",
  ],
  aiHints: {
    selectionCriteria: [],
    confusedWith: [],
    compositionRules: [],
    source: "types-only",
  },
  specStatus: "none",
  specPath: null,
  codeConnectStatus: "not-planned",
  primitiveSource: "input-otp",
  version: "1.0.0",
}

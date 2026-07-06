import type { ComponentMeta } from "./_meta-schema"

export const avatarMeta: ComponentMeta = {
  name: "avatar",
  category: "atom",
  purpose:
    "A circular user avatar with image, initials/icon fallback, optional status badge, and grouped overlapping-stack support.",
  useCases: [
    "User photo with initials fallback in profile rows, headers, and menus",
    "Fallback-only avatar (initials) when no photo URL exists",
    "Avatar with a status dot or verified-check badge (AvatarBadge)",
    "Team or assignee stacks with overflow count (AvatarGroup + AvatarGroupCount)",
  ],
  antiPatterns: [
    {
      wrong: "Render AvatarImage without an AvatarFallback",
      instead:
        "Always include AvatarFallback; it is what the user sees when the image fails to load or src is empty — omitting it results in a blank circle",
      source: "spec:.claude/specs/components/avatar.md#rules-for-llms",
    },
    {
      wrong: "Put long text inside AvatarFallback",
      instead:
        "Keep AvatarFallback to 1-2 character initials or a single icon; longer text overflows the circle",
      source: "spec:.claude/specs/components/avatar.md#rules-for-llms",
    },
    {
      wrong:
        "Add size utility classes to Avatar or its sub-components instead of the size prop",
      instead:
        "Set the size prop on the Avatar root (sm/default/lg); it cascades to AvatarFallback and AvatarBadge via data attributes",
      source: "spec:.claude/specs/components/avatar.md#rules-for-llms",
    },
    {
      wrong: "Add negative margins manually to overlap avatars in a group",
      instead:
        "Use AvatarGroup, which applies the overlap spacing and background ring to each child avatar automatically",
      source: "spec:.claude/specs/components/avatar.md#rules-for-llms",
    },
    {
      wrong: "Put an icon inside AvatarBadge on a small avatar (size sm)",
      instead:
        "Use a plain AvatarBadge with no icon at size sm; the 24px avatar is too small and the icon is auto-hidden via CSS",
      source: "spec:.claude/specs/components/avatar.md#rules-for-llms",
    },
    {
      wrong: "Add rounded-full to Avatar",
      instead: "Omit it; rounded-full is built into the component",
      source: "spec:.claude/specs/components/avatar.md#rules-for-llms",
    },
  ],
  variants: [
    {
      prop: "size",
      values: ["default", "sm", "lg"],
      default: "default",
    },
  ],
  sizes: ["default", "sm", "lg"],
  parentComponents: [],
  childComponents: [
    "avatar-image",
    "avatar-fallback",
    "avatar-badge",
    "avatar-group",
    "avatar-group-count",
  ],
  tokens: [
    "bg-muted",
    "text-muted-foreground",
    "bg-primary",
    "text-primary-foreground",
    "ring-background",
    "border-border",
  ],
  a11y: [
    "Always pass alt text on AvatarImage (all spec examples include a descriptive alt, e.g. the user's name)",
    "AvatarFallback guarantees visible content (initials or icon) when the image is absent or fails to load",
  ],
  aiHints: {
    selectionCriteria: [
      "Circular photo in a design maps to Avatar + AvatarImage + AvatarFallback",
      "Circular initials placeholder maps to Avatar + AvatarFallback (no AvatarImage)",
      "A colored dot bottom-right of an avatar maps to AvatarBadge",
      "Overlapping avatars in a row map to AvatarGroup with multiple Avatar children",
      "A +N overflow count at the end of a stack maps to AvatarGroupCount",
    ],
    confusedWith: [],
    compositionRules: [
      "Standard order inside Avatar: AvatarImage, then AvatarFallback, then optional AvatarBadge",
      "Always include AvatarFallback, even when an image src is provided",
      "The size prop lives on the Avatar root only and cascades to sub-components via group data attributes",
      "In AvatarGroup, place Avatar children first and AvatarGroupCount last for the overflow indicator",
    ],
    source: ".claude/specs/components/avatar.md",
  },
  specStatus: "specced",
  specPath: ".claude/specs/components/avatar.md",
  codeConnectStatus: "not-planned",
  primitiveSource: "base-ui",
  version: "1.0.0",
}

/**
 * Combobox stories — S2.3 generation pass.
 * Title from comboboxMeta.category ("organism" → "Organisms"). Combobox has
 * no variant axes (comboboxMeta.variants = []); stories are the composition
 * shapes verbatim from .claude/specs/components/combobox.md "Common
 * patterns", including the corrected chips example (real Base UI API:
 * chips are mapped from selected values via the ComboboxValue render
 * function — ComboboxChip has no value prop). Skipped per lane-B
 * conventions: "Controlled combobox" (controlled useState example).
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { comboboxMeta } from "@/components/ui/combobox.meta"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Organisms/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    docs: { page: metaDocsPage(comboboxMeta) },
  },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Verbatim: spec:.claude/specs/components/combobox.md
 * "Standard combobox (searchable single-select)". w-96 is the lane-B
 * sized-wrapper convention (spec rule 5: ComboboxInput defaults to w-auto).
 */
export const StandardCombobox: Story = {
  render: () => (
    <div className="w-96">
      <Combobox>
        <ComboboxInput placeholder="Select insurer..." />
        <ComboboxContent>
          <ComboboxList>
            <ComboboxEmpty>No insurers found.</ComboboxEmpty>
            <ComboboxItem value="acko">Acko</ComboboxItem>
            <ComboboxItem value="hdfc-ergo">HDFC Ergo</ComboboxItem>
            <ComboboxItem value="bajaj-allianz">Bajaj Allianz</ComboboxItem>
            <ComboboxItem value="icici-lombard">ICICI Lombard</ComboboxItem>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  ),
}

/** Verbatim: spec:.claude/specs/components/combobox.md "Combobox with grouped options". */
export const GroupedOptions: Story = {
  render: () => (
    <div className="w-96">
      <Combobox>
        <ComboboxInput placeholder="Select coverage..." />
        <ComboboxContent>
          <ComboboxList>
            <ComboboxEmpty>No coverage found.</ComboboxEmpty>
            <ComboboxGroup>
              <ComboboxLabel>Motor</ComboboxLabel>
              <ComboboxItem value="own-damage">Own Damage</ComboboxItem>
              <ComboboxItem value="third-party">Third Party</ComboboxItem>
            </ComboboxGroup>
            <ComboboxSeparator />
            <ComboboxGroup>
              <ComboboxLabel>Health</ComboboxLabel>
              <ComboboxItem value="individual">Individual</ComboboxItem>
              <ComboboxItem value="family-floater">Family Floater</ComboboxItem>
            </ComboboxGroup>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  ),
}

/**
 * Verbatim: spec:.claude/specs/components/combobox.md "Multi-select with
 * chips" (the corrected Base UI API example). Simplification (flagged): the
 * useComboboxAnchor hook must run inside a component, so the spec example is
 * wrapped in a named function component; its JSX is unchanged. w-96 is the
 * lane-B sized-wrapper convention.
 */
function ChipsMultiSelect() {
  const anchor = useComboboxAnchor()

  return (
    <div className="w-96">
      <Combobox multiple defaultValue={["Motor", "Health"]}>
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(value: string[]) => (
              <>
                {value.map((coverage) => (
                  <ComboboxChip key={coverage}>{coverage}</ComboboxChip>
                ))}
                <ComboboxChipsInput placeholder="Add coverage..." />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxList>
            <ComboboxItem value="Motor">Motor</ComboboxItem>
            <ComboboxItem value="Health">Health</ComboboxItem>
            <ComboboxItem value="Life">Life</ComboboxItem>
            <ComboboxItem value="Travel">Travel</ComboboxItem>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}

export const MultiSelectWithChips: Story = {
  render: () => <ChipsMultiSelect />,
}

/**
 * Verbatim: spec:.claude/specs/components/combobox.md
 * "Combobox inside a Field (with label and error)". w-96 is the lane-B
 * sized-wrapper convention.
 */
export const InsideField: Story = {
  render: () => (
    <div className="w-96">
      <Field>
        <FieldLabel>Policy type</FieldLabel>
        <Combobox>
          <ComboboxInput placeholder="Select type..." className="w-full" />
          <ComboboxContent>
            <ComboboxList>
              <ComboboxEmpty>No types found.</ComboboxEmpty>
              <ComboboxItem value="motor">Motor</ComboboxItem>
              <ComboboxItem value="health">Health</ComboboxItem>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <FieldError />
      </Field>
    </div>
  ),
}

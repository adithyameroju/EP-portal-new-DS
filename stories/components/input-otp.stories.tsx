/**
 * InputOTP stories — generated from the S2.3 pattern.
 * Title from inputOtpMeta.category ("molecule" → "Molecules"). InputOTP is
 * UNSPECCED (inputOtpMeta is types-only) and has no variant axes
 * (inputOtpMeta.variants = []); stories compose the meta childComponents
 * (input-otp-group, input-otp-slot, input-otp-separator) minimally —
 * "per-character slots ... and optional group separators"
 * (inputOtpMeta.purpose). No rendered copy; slot counts are the only
 * composition choice (6 = maxLength, flagged).
 */

import type { Meta, StoryObj } from "@storybook/nextjs-vite"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { inputOtpMeta } from "@/components/ui/input-otp.meta"
import { metaDocsPage } from "./meta-doc-blocks"

const meta = {
  title: "Molecules/InputOtp",
  component: InputOTP,
  tags: ["autodocs"],
  args: { maxLength: 6 },
  parameters: {
    layout: "centered",
    docs: { page: metaDocsPage(inputOtpMeta) },
  },
} satisfies Meta<typeof InputOTP>

export default meta
type Story = StoryObj<typeof meta>

/** One InputOTPGroup of per-character InputOTPSlots (indices 0–5). */
export const Group: Story = {
  args: { maxLength: 6, children: null },
  render: () => (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  ),
}

/** Two InputOTPGroups split by an InputOTPSeparator ("optional group separators"). */
export const GroupsWithSeparator: Story = {
  args: { maxLength: 6, children: null },
  render: () => (
    <InputOTP maxLength={6}>
      <InputOTPGroup>
        {[0, 1, 2].map((index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        {[3, 4, 5].map((index) => (
          <InputOTPSlot key={index} index={index} />
        ))}
      </InputOTPGroup>
    </InputOTP>
  ),
}

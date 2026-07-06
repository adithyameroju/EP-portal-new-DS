import figma from "@figma/code-connect";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

figma.connect(
  Field,
  "https://www.figma.com/design/zgzPlhKxDXc3E9OmfxmF9y/ACKO-Enterprise-Design-System-v1.0.0?node-id=18684-15220",
  {
    props: {
      orientation: figma.enum("Orientation", {
        Vertical: "vertical",
        Responsive: "horizontal",
      }),
      label: figma.string("Label"),
      description: figma.string("Description"),
    },
    example: ({ orientation, label, description }) => (
      <Field orientation={orientation}>
        <FieldLabel>{ label }</FieldLabel>
        <FieldDescription>{ description }</FieldDescription>
        <Input placeholder="Enter value..." />
        <FieldError />
      </Field>
    ),
  }
);

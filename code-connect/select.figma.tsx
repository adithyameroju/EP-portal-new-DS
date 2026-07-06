import figma from "@figma/code-connect";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

figma.connect(
  Select,
  "https://www.figma.com/design/zgzPlhKxDXc3E9OmfxmF9y/ACKO-Enterprise-Design-System-v1.0.0?node-id=345-11530",
  {
    props: {
      size: figma.enum("Size", {
        default: "default",
        sm: "sm",
      }),
      placeholder: figma.string("Placeholder"),
    },
    example: ({ size, placeholder }) => (
      <Select>
        <SelectTrigger size={size}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option-1">Option 1</SelectItem>
          <SelectItem value="option-2">Option 2</SelectItem>
          <SelectItem value="option-3">Option 3</SelectItem>
        </SelectContent>
      </Select>
    ),
  }
);

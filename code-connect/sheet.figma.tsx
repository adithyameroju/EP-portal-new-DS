import figma from "@figma/code-connect";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

figma.connect(
  Sheet,
  "https://www.figma.com/design/zgzPlhKxDXc3E9OmfxmF9y/ACKO-Enterprise-Design-System-v1.0.0?node-id=220-4633",
  {
    props: {
      side: figma.enum("Position", {
        right: "right",
        left: "left",
        bottom: "bottom",
        top: "top",
      }),
      title: figma.string("Title"),
      description: figma.string("Description"),
    },
    example: ({ side, title, description }) => (
      <Sheet>
        <SheetTrigger render={<Button variant="outline">Open</Button>} />
        <SheetContent side={side}>
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>
          {/* Content goes here */}
          <SheetFooter>
            <SheetClose render={<Button variant="outline">Cancel</Button>} />
            <Button>Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    ),
  }
);

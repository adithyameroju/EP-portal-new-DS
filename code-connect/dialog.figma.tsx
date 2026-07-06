import figma from "@figma/code-connect";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

figma.connect(
  Dialog,
  "https://www.figma.com/design/zgzPlhKxDXc3E9OmfxmF9y/ACKO-Enterprise-Design-System-v1.0.0?node-id=112-601",
  {
    props: {},
    example: () => (
      <Dialog>
        <DialogTrigger render={<Button variant="outline">Open</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog title</DialogTitle>
            <DialogDescription>This is a dialog description.</DialogDescription>
          </DialogHeader>
          {/* Content goes here */}
          <DialogFooter>
            <Button variant="outline">Cancel</Button>
            <Button>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  }
);

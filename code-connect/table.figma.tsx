import figma from "@figma/code-connect";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

figma.connect(
  Table,
  "https://www.figma.com/design/zgzPlhKxDXc3E9OmfxmF9y/ACKO-Enterprise-Design-System-v1.0.0?node-id=325-388",
  {
    props: {},
    example: () => (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Policy</TableHead>
            <TableHead>Insured</TableHead>
            <TableHead>Premium</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Motor Insurance 2024</TableCell>
            <TableCell>Nikhil Thakkar</TableCell>
            <TableCell>₹12,500</TableCell>
            <TableCell>
              <Badge variant="default">Active</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ),
  }
);

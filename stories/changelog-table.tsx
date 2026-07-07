import { allComponentMeta } from "@/components/ui/_meta-index"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

/** S2.5 versioning surface — per-component version/status read live from
 *  meta.ts. Semver policy + changelog discipline wire in at S3 (roadmap). */
export function ComponentVersionTable() {
  return (
    <div className="sb-unstyled font-sans">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Component</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Spec</TableHead>
            <TableHead>Code Connect</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allComponentMeta.map((m) => (
            <TableRow key={m.name}>
              <TableCell className="font-medium">{m.name}</TableCell>
              <TableCell>{m.category}</TableCell>
              <TableCell>
                <Badge variant="outline">{m.version}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={m.specStatus === "specced" ? "default" : "secondary"}>
                  {m.specStatus}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={m.codeConnectStatus === "mapped" ? "default" : "secondary"}>
                  {m.codeConnectStatus}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

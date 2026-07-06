import figma from "@figma/code-connect";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

figma.connect(
  Tabs,
  "https://www.figma.com/design/zgzPlhKxDXc3E9OmfxmF9y/ACKO-Enterprise-Design-System-v1.0.0?node-id=21133-27311",
  {
    props: {
      variant: figma.enum("Variant", {
        Default: "default",
        Line: "line",
      }),
    },
    example: ({ variant }) => (
      <Tabs defaultValue="tab-1">
        <TabsList variant={variant}>
          <TabsTrigger value="tab-1">Overview</TabsTrigger>
          <TabsTrigger value="tab-2">Details</TabsTrigger>
          <TabsTrigger value="tab-3">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="tab-1">Overview content</TabsContent>
        <TabsContent value="tab-2">Details content</TabsContent>
        <TabsContent value="tab-3">Documents content</TabsContent>
      </Tabs>
    ),
  }
);

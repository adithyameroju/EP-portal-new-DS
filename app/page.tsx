import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-8">
      <main className="flex w-full max-w-2xl flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col gap-2">
          <Badge variant="outline" className="w-fit">Design System</Badge>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground">
            Compass
          </h1>
          <p className="text-base text-muted-foreground">
            Acko&apos;s enterprise design system — built on shadcn/ui and Tailwind CSS v4.
          </p>
        </div>

        {/* Token health card */}
        <Card>
          <CardHeader>
            <CardTitle>Token audit passing</CardTitle>
            <CardDescription>
              All components use semantic tokens. No hardcoded values in the codebase.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="default">Primary action</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-sm text-muted-foreground">
          Replace this page with real Acko product screens. This file exists only to
          verify the token layer is wired up correctly.
        </p>

      </main>
    </div>
  );
}

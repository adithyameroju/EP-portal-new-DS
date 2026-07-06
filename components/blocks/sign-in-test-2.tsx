"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/**
 * Sign In Test 2 — Figma DS-Test, node 1:2785 (“Sign In Test”).
 * Structure aligned with Figma Code Connect / `code-connect/card.figma.tsx`:
 * Card → CardHeader (title, description, action) → CardContent → CardFooter.
 *
 * @see https://www.figma.com/design/ir3mv5noeyStzT7hi3PbTw/DS-Test?node-id=1-2785
 */
export function SignInTest2() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6">
      <form
        className="w-full max-w-sm"
        noValidate
        onSubmit={(event) => {
          event.preventDefault()
        }}
      >
        <Card className="w-full shadow-xs" data-node-id="1:2785">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardAction>
              <Button type="button" variant="link">
                Sign up
              </Button>
            </CardAction>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid gap-1.5">
              <Label htmlFor="signin-test-2-email">Email</Label>
              <Input
                id="signin-test-2-email"
                type="email"
                autoComplete="email"
                placeholder="m@example.com"
              />
            </div>
            <div className="grid gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor="signin-test-2-password">Password</Label>
                <Button type="button" variant="ghost" size="sm">
                  Forgot your password?
                </Button>
              </div>
              <Input
                id="signin-test-2-password"
                type="password"
                autoComplete="current-password"
                placeholder="Placeholder"
              />
            </div>
          </CardContent>
          <CardFooter className="flex w-full flex-col items-stretch gap-4">
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button type="button" variant="outline" className="w-full">
              Login with Google
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

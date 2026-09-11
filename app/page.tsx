"use client"

import { useState } from "react"
import { CircleCheck } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignupPage() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-8">
      <form
        className="w-full max-w-sm"
        onSubmit={(event) => {
          event.preventDefault()
          setSubmitted(true)
        }}
      >
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your name, email, and phone number to sign up.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {submitted ? (
              <Alert>
                <CircleCheck />
                <AlertTitle>Signup received</AlertTitle>
                <AlertDescription>
                  This is a demo form. No account was created.
                </AlertDescription>
              </Alert>
            ) : null}
            <div className="grid gap-1.5">
              <Label htmlFor="signup-name">Name</Label>
              <Input
                id="signup-name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Rahul Sharma"
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="rahul@acko.com"
                required
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="signup-phone">Phone number</Label>
              <Input
                id="signup-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                placeholder="+91 98765 43210"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}

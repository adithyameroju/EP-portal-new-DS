import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Compass — Acko Enterprise Design System",
  description: "Acko's enterprise design system, built on shadcn/ui and Base UI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

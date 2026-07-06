import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const euclid = localFont({
  src: [
    { path: "./fonts/Euclid_Circular_B_Light.woff2", weight: "300", style: "normal" },
    { path: "./fonts/Euclid_Circular_B_Light_Italic.woff2", weight: "300", style: "italic" },
    { path: "./fonts/Euclid_Circular_B_Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/Euclid_Circular_B_Italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/Euclid_Circular_B_Medium.woff2", weight: "500", style: "normal" },
    { path: "./fonts/Euclid_Circular_B_Medium_Italic.woff2", weight: "500", style: "italic" },
    { path: "./fonts/Euclid_Circular_B_SemiBold.woff2", weight: "600", style: "normal" },
    { path: "./fonts/Euclid_Circular_B_SemiBold_Italic.woff2", weight: "600", style: "italic" },
    { path: "./fonts/Euclid_Circular_B_Bold.woff2", weight: "700", style: "normal" },
    { path: "./fonts/Euclid_Circular_B_Bold_Italic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-euclid",
  display: "swap",
});

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
    <html lang="en" className={`${euclid.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

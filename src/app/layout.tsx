import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { RootProvider } from "@/shared/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Profile - Professional Developer Profiles",
    template: "%s | Profile",
  },
  description: "Create and share your professional developer profile and resume.",
  keywords: ["developer", "profile", "resume", "portfolio", "career"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d1117",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased`}
      >
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}

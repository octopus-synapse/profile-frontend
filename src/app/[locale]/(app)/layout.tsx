/**
 * Main App Layout
 * Layout with Navbar for main application pages
 */

import { ReactNode } from "react";
import { Navbar } from "@/features/navigation";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
    </>
  );
}

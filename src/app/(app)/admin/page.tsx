/**
 * Admin Dashboard Page (Server Component)
 */

import { Metadata } from "next";
import AdminDashboardPage from "./page.client";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Administration dashboard",
};

export default function Page() {
  return <AdminDashboardPage />;
}

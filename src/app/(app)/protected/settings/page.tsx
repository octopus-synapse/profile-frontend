/**
 * Settings Page
 * Developer-inspired design with code aesthetic
 */

import { Metadata } from "next";
import { SettingsPage } from "@/features/settings";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your profile, data, and preferences",
};

export default function SettingsRoute() {
  return <SettingsPage />;
}

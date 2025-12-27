/**
 * Profile Page
 * Redirects to settings page
 */

import { redirect } from "next/navigation";

export default function ProfilePage() {
  redirect("/protected/settings");
}

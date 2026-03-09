"use client";

/**
 * Auth Provider
 * Wraps the app with NextAuth SessionProvider
 */

import { SessionProvider } from "next-auth/react";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}

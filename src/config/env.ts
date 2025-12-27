import { z } from "zod";

/**
 * Environment configuration with Zod validation
 * Validates both client and server environment variables
 */

const serverEnvSchema = z.object({
 NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
 NEXTAUTH_SECRET: z
  .string()
  .min(32, "NEXTAUTH_SECRET must be at least 32 characters"),
 NEXTAUTH_URL: z.string().url().optional(),
});

const clientEnvSchema = z.object({
 NEXT_PUBLIC_API_URL: z.string().url().default("http://localhost:3001/api"),
 NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
 NEXT_PUBLIC_APP_NAME: z.string().default("ProFile"),
});

// Validate server environment (only runs on server)
function getServerEnv() {
 if (typeof window !== "undefined") {
  throw new Error("Server env accessed on client");
 }

 const parsed = serverEnvSchema.safeParse(process.env);

 if (!parsed.success) {
  console.error(
   "❌ Invalid server environment variables:",
   parsed.error.flatten().fieldErrors
  );
  throw new Error("Invalid server environment variables");
 }

 return parsed.data;
}

// Validate client environment
function getClientEnv() {
 // Filter out undefined values so Zod defaults can apply
 const envInput: Record<string, string> = {};
 if (process.env.NEXT_PUBLIC_API_URL) envInput.NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;
 if (process.env.NEXT_PUBLIC_APP_URL) envInput.NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL;
 if (process.env.NEXT_PUBLIC_APP_NAME) envInput.NEXT_PUBLIC_APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;

 const parsed = clientEnvSchema.safeParse(envInput);

 if (!parsed.success) {
  console.error(
   "❌ Invalid client environment variables:",
   parsed.error.flatten().fieldErrors
  );
  throw new Error("Invalid client environment variables");
 }

 return parsed.data;
}

// Export typed env objects
export const clientEnv = getClientEnv();

// Lazy server env to avoid errors on client
export function getServerConfig() {
 return getServerEnv();
}

// Convenience exports
export const API_URL = clientEnv.NEXT_PUBLIC_API_URL;
export const APP_URL = clientEnv.NEXT_PUBLIC_APP_URL;
export const APP_NAME = clientEnv.NEXT_PUBLIC_APP_NAME;

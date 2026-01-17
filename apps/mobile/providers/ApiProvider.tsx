/**
 * API Provider
 * Configures ProfileApiClient with token management for mobile
 */

import React, { createContext, useContext, useMemo } from "react";
import {
 createProfileApiClient,
 type ProfileApiClient,
} from "@profile/api-client";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

const ApiContext = createContext<ProfileApiClient | null>(null);

const TOKEN_KEY = "profile_access_token";
const REFRESH_TOKEN_KEY = "profile_refresh_token";

// Get API URL from environment or use default
const API_URL =
 Constants.expoConfig?.extra?.apiUrl ?? "http://localhost:3000/api";

interface ApiProviderProps {
 children: React.ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
 const apiClient = useMemo(() => {
  return createProfileApiClient({
   baseURL: API_URL,

   // Get token from secure storage
   getToken: async () => {
    try {
     return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
     console.error("Failed to get token:", error);
     return null;
    }
   },

   // Refresh token logic
   refreshToken: async () => {
    try {
     const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
     if (!refreshToken) return null;

     // Call refresh endpoint
     const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
     });

     if (!response.ok) return null;

     const data = await response.json();
     const newAccessToken = data.accessToken;

     // Save new token
     await SecureStore.setItemAsync(TOKEN_KEY, newAccessToken);
     return newAccessToken;
    } catch (error) {
     console.error("Failed to refresh token:", error);
     return null;
    }
   },

   // Handle unauthorized (e.g., navigate to login)
   onUnauthorized: () => {
    // Clear tokens
    SecureStore.deleteItemAsync(TOKEN_KEY).catch(console.error);
    SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY).catch(console.error);
    // You can navigate to login here if needed
   },
  });
 }, []);

 return <ApiContext.Provider value={apiClient}>{children}</ApiContext.Provider>;
}

export function useApi() {
 const context = useContext(ApiContext);
 if (!context) {
  throw new Error("useApi must be used within ApiProvider");
 }
 return context;
}

// Helper functions to manage tokens
export const tokenManager = {
 async setTokens(accessToken: string, refreshToken: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
 },

 async clearTokens() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
 },

 async getAccessToken() {
  return await SecureStore.getItemAsync(TOKEN_KEY);
 },

 async getRefreshToken() {
  return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
 },
};

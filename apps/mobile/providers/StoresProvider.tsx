/**
 * Stores Provider
 * Provides Zustand stores to the app
 */

import React, { createContext, useContext, useMemo } from "react";
import {
 createAuthStore,
 createResumeStore,
 createChatStore,
 createSocialStore,
} from "@profile/stores";
import type {
 AuthStore,
 ResumeStore,
 ChatStore,
 SocialStore,
} from "@profile/stores";
import { useApi } from "./ApiProvider";
import type { AxiosInstance } from "axios";

interface StoresContextValue {
 authStore: AuthStore;
 resumeStore: ResumeStore;
 chatStore: ChatStore;
 socialStore: SocialStore;
 apiClient: AxiosInstance;
}

const StoresContext = createContext<StoresContextValue | null>(null);

interface StoresProviderProps {
 children: React.ReactNode;
}

export function StoresProvider({ children }: StoresProviderProps) {
 const apiClient = useApi();

 const stores = useMemo(() => {
  return {
   authStore: createAuthStore(apiClient),
   resumeStore: createResumeStore(apiClient),
   chatStore: createChatStore(apiClient),
   socialStore: createSocialStore(apiClient),
   apiClient,
  };
 }, [apiClient]);

 return (
  <StoresContext.Provider value={stores}>{children}</StoresContext.Provider>
 );
}

export function useStores() {
 const context = useContext(StoresContext);
 if (!context) {
  throw new Error("useStores must be used within StoresProvider");
 }
 return context;
}

// Individual store hooks for convenience
export function useAuthStore() {
 return useStores().authStore;
}

export function useResumeStore() {
 return useStores().resumeStore;
}

export function useChatStore() {
 return useStores().chatStore;
}

export function useSocialStore() {
 return useStores().socialStore;
}

export function useApiClient() {
 return useStores().apiClient;
}

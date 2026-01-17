/**
 * Settings Store Tests
 *
 * Tests user settings and GDPR operations.
 */

import { describe, it, expect, mock } from "bun:test";
import { createSettingsStore } from "../settings.store";
import type { ProfileApiClient } from "@profile/api-client";

const mockUser = {
 id: "user-1",
 email: "test@example.com",
 username: "testuser",
 preferences: {
  emailNotifications: true,
  marketingEmails: false,
  twoFactorEnabled: true,
  language: "pt-BR",
  theme: "dark",
 },
};

const mockDataExport = {
 exportedAt: "2025-01-14T00:00:00Z",
 dataRetentionPolicy: "30 days",
 user: { id: "user-1", email: "test@example.com" },
 consents: [{ type: "marketing", granted: false }],
 resumes: [{ id: "resume-1", title: "My Resume" }],
 auditLogs: [{ action: "login", timestamp: "2025-01-10" }],
};

const createMockApiClient = (
 overrides: {
  users?: Partial<ProfileApiClient["users"]>;
  gdpr?: Partial<ProfileApiClient["gdpr"]>;
 } = {}
) => {
 return {
  users: {
   getMe: mock(() => Promise.resolve(mockUser)),
   updateMe: mock(() => Promise.resolve(mockUser)),
   ...overrides.users,
  },
  gdpr: {
   exportData: mock(() => Promise.resolve(mockDataExport)),
   deleteAccount: mock(() => Promise.resolve()),
   ...overrides.gdpr,
  },
 } as unknown as ProfileApiClient;
};

describe("SettingsStore", () => {
 describe("Initial State", () => {
  it("should have null settings when created", () => {
   const apiClient = createMockApiClient();
   const useStore = createSettingsStore(apiClient);

   expect(useStore.getState().settings).toBeNull();
  });

  it("should have null dataExport when created", () => {
   const apiClient = createMockApiClient();
   const useStore = createSettingsStore(apiClient);

   expect(useStore.getState().dataExport).toBeNull();
  });

  it("should have all loading states as false", () => {
   const apiClient = createMockApiClient();
   const useStore = createSettingsStore(apiClient);
   const state = useStore.getState();

   expect(state.isLoading).toBe(false);
   expect(state.isExporting).toBe(false);
   expect(state.isDeleting).toBe(false);
  });

  it("should have no error initially", () => {
   const apiClient = createMockApiClient();
   const useStore = createSettingsStore(apiClient);

   expect(useStore.getState().error).toBeNull();
  });
 });

 describe("setLoading / setError / clearError", () => {
  it("should update loading state", () => {
   const apiClient = createMockApiClient();
   const useStore = createSettingsStore(apiClient);

   useStore.getState().setLoading(true);

   expect(useStore.getState().isLoading).toBe(true);
  });

  it("should set and clear error", () => {
   const apiClient = createMockApiClient();
   const useStore = createSettingsStore(apiClient);

   useStore.getState().setError("Error");
   expect(useStore.getState().error).toBe("Error");

   useStore.getState().clearError();
   expect(useStore.getState().error).toBeNull();
  });
 });

 describe("fetchSettings", () => {
  it("should fetch user settings from profile", async () => {
   const apiClient = createMockApiClient();
   const useStore = createSettingsStore(apiClient);

   const result = await useStore.getState().fetchSettings();

   expect(result.language).toBe("pt-BR");
   expect(result.theme).toBe("dark");
   expect(result.twoFactorEnabled).toBe(true);
   expect(useStore.getState().settings).toEqual(result);
   expect(useStore.getState().isLoading).toBe(false);
  });

  it("should use default values when preferences missing", async () => {
   const apiClient = createMockApiClient({
    users: {
     getMe: mock(() =>
      Promise.resolve({ ...mockUser, preferences: undefined })
     ),
    },
   });
   const useStore = createSettingsStore(apiClient);

   const result = await useStore.getState().fetchSettings();

   expect(result.emailNotifications).toBe(true);
   expect(result.marketingEmails).toBe(false);
   expect(result.language).toBe("en");
   expect(result.theme).toBe("system");
  });

  it("should handle fetch error", async () => {
   const apiClient = createMockApiClient({
    users: {
     getMe: mock(() => Promise.reject(new Error("Unauthorized"))),
    },
   });
   const useStore = createSettingsStore(apiClient);

   await expect(useStore.getState().fetchSettings()).rejects.toThrow(
    "Unauthorized"
   );
   expect(useStore.getState().error).toBe("Unauthorized");
   expect(useStore.getState().isLoading).toBe(false);
  });
 });

 describe("updateSettings", () => {
  it("should update partial settings", async () => {
   const apiClient = createMockApiClient();
   const useStore = createSettingsStore(apiClient);

   // First fetch to populate settings
   await useStore.getState().fetchSettings();

   // Then update
   await useStore.getState().updateSettings({ language: "en" });

   expect(apiClient.users.updateMe).toHaveBeenCalledWith({
    preferences: { language: "en" },
   });
   expect(useStore.getState().settings?.language).toBe("en");
  });

  it("should handle update error", async () => {
   const apiClient = createMockApiClient({
    users: {
     getMe: mock(() => Promise.resolve(mockUser)),
     updateMe: mock(() => Promise.reject(new Error("Update failed"))),
    },
   });
   const useStore = createSettingsStore(apiClient);

   await expect(
    useStore.getState().updateSettings({ language: "fr" })
   ).rejects.toThrow("Update failed");
   expect(useStore.getState().error).toBe("Update failed");
  });
 });

 describe("exportUserData (GDPR)", () => {
  it("should export user data and store result", async () => {
   const apiClient = createMockApiClient();
   const useStore = createSettingsStore(apiClient);

   const result = await useStore.getState().exportUserData();

   expect(result.exportedAt).toBe("2025-01-14T00:00:00Z");
   expect(result.user.email).toBe("test@example.com");
   expect(result.resumes.length).toBe(1);
   expect(useStore.getState().dataExport).toEqual(result);
   expect(useStore.getState().isExporting).toBe(false);
  });

  it("should handle export error", async () => {
   const apiClient = createMockApiClient({
    gdpr: {
     exportData: mock(() =>
      Promise.reject(new Error("Export service unavailable"))
     ),
    },
   });
   const useStore = createSettingsStore(apiClient);

   await expect(useStore.getState().exportUserData()).rejects.toThrow(
    "Export service unavailable"
   );
   expect(useStore.getState().error).toBe("Export service unavailable");
   expect(useStore.getState().isExporting).toBe(false);
  });
 });

 describe("deleteAccount (GDPR)", () => {
  it("should delete user account", async () => {
   const apiClient = createMockApiClient();
   const useStore = createSettingsStore(apiClient);

   await useStore.getState().deleteAccount();

   expect(apiClient.gdpr.deleteAccount).toHaveBeenCalled();
   expect(useStore.getState().isDeleting).toBe(false);
  });

  it("should handle delete error", async () => {
   const apiClient = createMockApiClient({
    gdpr: {
     deleteAccount: mock(() =>
      Promise.reject(new Error("Cannot delete account"))
     ),
    },
   });
   const useStore = createSettingsStore(apiClient);

   await expect(useStore.getState().deleteAccount()).rejects.toThrow(
    "Cannot delete account"
   );
   expect(useStore.getState().error).toBe("Cannot delete account");
   expect(useStore.getState().isDeleting).toBe(false);
  });
 });
});

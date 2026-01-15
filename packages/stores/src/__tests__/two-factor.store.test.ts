/**
 * Two-Factor Store Tests
 *
 * Security-critical functionality requires thorough testing.
 * Tests cover all success and failure paths.
 */

import { describe, it, expect, mock } from "bun:test";
import { createTwoFactorStore } from "../two-factor.store";
import type { ProfileApiClient } from "@profile/api-client";

// Mock data
const mockSetup = {
 secret: "JBSWY3DPEHPK3PXP",
 qrCodeUrl: "data:image/png;base64,iVBORw0KGgo...",
 backupCodes: ["12345678", "87654321", "11223344"],
};

const mockStatus = {
 enabled: true,
 verifiedAt: new Date(),
};

const createMockApiClient = (
 overrides: Partial<ProfileApiClient["twoFactor"]> = {}
) => {
 return {
  twoFactor: {
   getStatus: mock(() => Promise.resolve(mockStatus)),
   setup: mock(() => Promise.resolve(mockSetup)),
   verifySetup: mock(() =>
    Promise.resolve({ backupCodes: mockSetup.backupCodes })
   ),
   verifyLogin: mock(() => Promise.resolve({ success: true })),
   disable: mock(() => Promise.resolve()),
   regenerateBackupCodes: mock(() =>
    Promise.resolve({ backupCodes: ["newcode1", "newcode2"] })
   ),
   ...overrides,
  },
 } as unknown as ProfileApiClient;
};

describe("TwoFactorStore", () => {
 describe("Initial State", () => {
  it("should have null status", () => {
   const apiClient = createMockApiClient();
   const useStore = createTwoFactorStore(apiClient);

   expect(useStore.getState().status).toBeNull();
  });

  it("should have null setup", () => {
   const apiClient = createMockApiClient();
   const useStore = createTwoFactorStore(apiClient);

   expect(useStore.getState().setup).toBeNull();
  });

  it("should have empty backup codes", () => {
   const apiClient = createMockApiClient();
   const useStore = createTwoFactorStore(apiClient);

   expect(useStore.getState().backupCodes).toEqual([]);
  });
 });

 describe("fetchStatus", () => {
  it("should fetch and store 2FA status", async () => {
   const apiClient = createMockApiClient();
   const useStore = createTwoFactorStore(apiClient);

   await useStore.getState().fetchStatus();

   expect(useStore.getState().status).toBeDefined();
   expect(useStore.getState().status?.enabled).toBe(true);
  });

  it("should return status", async () => {
   const apiClient = createMockApiClient();
   const useStore = createTwoFactorStore(apiClient);

   const status = await useStore.getState().fetchStatus();

   expect(status.enabled).toBe(true);
  });

  it("should set error on failure", async () => {
   const apiClient = createMockApiClient({
    getStatus: mock(() => Promise.reject(new Error("Unauthorized"))),
   });
   const useStore = createTwoFactorStore(apiClient);

   await expect(useStore.getState().fetchStatus()).rejects.toThrow();

   expect(useStore.getState().error).toBe("Unauthorized");
  });
 });

 describe("startSetup", () => {
  it("should fetch and store setup data", async () => {
   const apiClient = createMockApiClient();
   const useStore = createTwoFactorStore(apiClient);

   await useStore.getState().startSetup();

   expect(useStore.getState().setup).toBeDefined();
   expect(useStore.getState().setup?.secret).toBe(mockSetup.secret);
  });

  it("should return setup data with QR code", async () => {
   const apiClient = createMockApiClient();
   const useStore = createTwoFactorStore(apiClient);

   const setup = await useStore.getState().startSetup();

   expect(setup.qrCodeUrl).toBeDefined();
   expect(setup.secret).toBeDefined();
  });
 });

 describe("verifySetup", () => {
  it("should verify setup and enable 2FA", async () => {
   const apiClient = createMockApiClient();
   const useStore = createTwoFactorStore(apiClient);

   await useStore.getState().verifySetup("123456");

   expect(useStore.getState().status?.enabled).toBe(true);
  });

  it("should store backup codes after verification", async () => {
   const apiClient = createMockApiClient();
   const useStore = createTwoFactorStore(apiClient);

   await useStore.getState().verifySetup("123456");

   expect(useStore.getState().backupCodes).toHaveLength(3);
  });

  it("should clear setup data after verification", async () => {
   const apiClient = createMockApiClient();
   const useStore = createTwoFactorStore(apiClient);

   // Start setup first
   await useStore.getState().startSetup();
   expect(useStore.getState().setup).toBeDefined();

   // Then verify
   await useStore.getState().verifySetup("123456");

   expect(useStore.getState().setup).toBeNull();
  });

  it("should call API with token", async () => {
   const apiClient = createMockApiClient();
   const useStore = createTwoFactorStore(apiClient);

   await useStore.getState().verifySetup("654321");

   expect(apiClient.twoFactor.verifySetup).toHaveBeenCalledWith({
    token: "654321",
   });
  });

  it("should set error on invalid token", async () => {
   const apiClient = createMockApiClient({
    verifySetup: mock(() => Promise.reject(new Error("Invalid token"))),
   });
   const useStore = createTwoFactorStore(apiClient);

   await expect(useStore.getState().verifySetup("wrong")).rejects.toThrow();

   expect(useStore.getState().error).toBe("Invalid token");
  });
 });

 describe("verifyLogin", () => {
  it("should verify 2FA token for login", async () => {
   const apiClient = createMockApiClient();
   const useStore = createTwoFactorStore(apiClient);

   const success = await useStore.getState().verifyLogin("123456");

   expect(success).toBe(true);
  });

  it("should call API with token", async () => {
   const apiClient = createMockApiClient();
   const useStore = createTwoFactorStore(apiClient);

   await useStore.getState().verifyLogin("789012");

   expect(apiClient.twoFactor.verifyLogin).toHaveBeenCalledWith({
    token: "789012",
   });
  });

  it("should return false on invalid token", async () => {
   const apiClient = createMockApiClient({
    verifyLogin: mock(() => Promise.resolve({ success: false })),
   });
   const useStore = createTwoFactorStore(apiClient);

   const success = await useStore.getState().verifyLogin("wrong");

   expect(success).toBe(false);
  });
 });

 describe("disable", () => {
  it("should disable 2FA", async () => {
   const apiClient = createMockApiClient();
   const useStore = createTwoFactorStore(apiClient);

   // Set initial enabled state
   useStore.setState({ status: { enabled: true, verifiedAt: new Date() } });

   await useStore.getState().disable("123456");

   expect(useStore.getState().status?.enabled).toBe(false);
  });

  it("should call API with token", async () => {
   const apiClient = createMockApiClient();
   const useStore = createTwoFactorStore(apiClient);

   await useStore.getState().disable("654321");

   expect(apiClient.twoFactor.disable).toHaveBeenCalledWith("654321");
  });

  it("should clear backup codes", async () => {
   const apiClient = createMockApiClient();
   const useStore = createTwoFactorStore(apiClient);

   useStore.setState({ backupCodes: ["code1", "code2"] });

   await useStore.getState().disable("123456");

   expect(useStore.getState().backupCodes).toEqual([]);
  });
 });

 describe("regenerateBackupCodes", () => {
  it("should generate new backup codes", async () => {
   const apiClient = createMockApiClient();
   const useStore = createTwoFactorStore(apiClient);

   const codes = await useStore.getState().regenerateBackupCodes("123456");

   expect(codes).toHaveLength(2);
   expect(codes).toContain("newcode1");
  });

  it("should update stored backup codes", async () => {
   const apiClient = createMockApiClient();
   const useStore = createTwoFactorStore(apiClient);

   await useStore.getState().regenerateBackupCodes("123456");

   expect(useStore.getState().backupCodes).toEqual(["newcode1", "newcode2"]);
  });
 });

 describe("clearSetup", () => {
  it("should clear setup data", () => {
   const apiClient = createMockApiClient();
   const useStore = createTwoFactorStore(apiClient);

   useStore.setState({ setup: mockSetup });

   useStore.getState().clearSetup();

   expect(useStore.getState().setup).toBeNull();
  });
 });

 describe("clearError", () => {
  it("should clear error", () => {
   const apiClient = createMockApiClient();
   const useStore = createTwoFactorStore(apiClient);

   useStore.setState({ error: "Some error" });

   useStore.getState().clearError();

   expect(useStore.getState().error).toBeNull();
  });
 });
});

/**
 * Two-Factor Store Tests
 *
 * Tests the pure state management for 2FA setup.
 * Zustand stores are pure state containers - no side effects.
 */

import { describe, test, expect, beforeEach } from "bun:test";
import { createTwoFactorStore } from "../two-factor.store";

describe("TwoFactorStore (Pure State)", () => {
 let store: ReturnType<typeof createTwoFactorStore>;

 beforeEach(() => {
  store = createTwoFactorStore();
 });

 describe("initial state", () => {
  test("should initialize with enabled false", () => {
   expect(store.getState().isEnabled).toBe(false);
  });

  test("should initialize with null qrCode", () => {
   expect(store.getState().qrCode).toBeNull();
  });

  test("should initialize with empty backupCodes", () => {
   expect(store.getState().backupCodes).toEqual([]);
  });

  test("should initialize with loading false", () => {
   expect(store.getState().isLoading).toBe(false);
  });

  test("should initialize with null error", () => {
   expect(store.getState().error).toBeNull();
  });
 });

 describe("setEnabled", () => {
  test("should set enabled to true", () => {
   store.getState().setEnabled(true);

   expect(store.getState().isEnabled).toBe(true);
  });

  test("should set enabled to false", () => {
   store.getState().setEnabled(true);
   store.getState().setEnabled(false);

   expect(store.getState().isEnabled).toBe(false);
  });
 });

 describe("setQrCode", () => {
  test("should set QR code string", () => {
   const qrCode = "data:image/png;base64,iVBORw0KGgoAAAANS...";

   store.getState().setQrCode(qrCode);

   expect(store.getState().qrCode).toBe(qrCode);
  });

  test("should set QR code to null", () => {
   store.getState().setQrCode("some-qr-code");
   store.getState().setQrCode(null);

   expect(store.getState().qrCode).toBeNull();
  });
 });

 describe("setBackupCodes", () => {
  test("should set backup codes array", () => {
   const codes = ["ABC123", "DEF456", "GHI789", "JKL012"];

   store.getState().setBackupCodes(codes);

   expect(store.getState().backupCodes).toEqual(codes);
   expect(store.getState().backupCodes).toHaveLength(4);
  });

  test("should replace existing backup codes", () => {
   store.getState().setBackupCodes(["OLD1", "OLD2"]);
   store.getState().setBackupCodes(["NEW1", "NEW2", "NEW3"]);

   expect(store.getState().backupCodes).toHaveLength(3);
   expect(store.getState().backupCodes[0]).toBe("NEW1");
  });

  test("should handle empty array", () => {
   store.getState().setBackupCodes(["CODE1"]);
   store.getState().setBackupCodes([]);

   expect(store.getState().backupCodes).toEqual([]);
  });
 });

 describe("loading state", () => {
  test("should set loading to true", () => {
   store.getState().setLoading(true);

   expect(store.getState().isLoading).toBe(true);
  });

  test("should set loading to false", () => {
   store.getState().setLoading(true);
   store.getState().setLoading(false);

   expect(store.getState().isLoading).toBe(false);
  });
 });

 describe("error handling", () => {
  test("should set error message", () => {
   store.getState().setError("Invalid verification code");

   expect(store.getState().error).toBe("Invalid verification code");
  });

  test("should clear error with setError null", () => {
   store.getState().setError("Error");
   store.getState().setError(null);

   expect(store.getState().error).toBeNull();
  });

  test("should clear error with clearError", () => {
   store.getState().setError("Error");
   store.getState().clearError();

   expect(store.getState().error).toBeNull();
  });
 });

 describe("reset", () => {
  test("should reset all state to initial", () => {
   // Modify all state
   store.getState().setEnabled(true);
   store.getState().setQrCode("qr-code-data");
   store.getState().setBackupCodes(["CODE1", "CODE2"]);
   store.getState().setLoading(true);
   store.getState().setError("Error");

   // Reset
   store.getState().reset();

   // Verify all back to initial
   expect(store.getState().isEnabled).toBe(false);
   expect(store.getState().qrCode).toBeNull();
   expect(store.getState().backupCodes).toEqual([]);
   expect(store.getState().isLoading).toBe(false);
   expect(store.getState().error).toBeNull();
  });
 });

 describe("2FA setup flow", () => {
  test("should handle typical enable flow", () => {
   // Start setup
   store.getState().setLoading(true);

   // Receive QR code and backup codes
   store.getState().setQrCode("data:image/png;base64,...");
   store.getState().setBackupCodes(["A1B2C3", "D4E5F6", "G7H8I9"]);
   store.getState().setLoading(false);

   expect(store.getState().qrCode).not.toBeNull();
   expect(store.getState().backupCodes).toHaveLength(3);

   // User verifies and enables
   store.getState().setEnabled(true);

   expect(store.getState().isEnabled).toBe(true);
  });

  test("should handle disable flow", () => {
   // Already enabled
   store.getState().setEnabled(true);
   store.getState().setBackupCodes(["CODE1"]);

   // Disable
   store.getState().setEnabled(false);
   store.getState().setQrCode(null);
   store.getState().setBackupCodes([]);

   expect(store.getState().isEnabled).toBe(false);
   expect(store.getState().qrCode).toBeNull();
   expect(store.getState().backupCodes).toEqual([]);
  });

  test("should handle verification error", () => {
   store.getState().setQrCode("qr-code");
   store.getState().setLoading(true);

   // Verification failed
   store.getState().setError("Invalid code");
   store.getState().setLoading(false);

   expect(store.getState().error).toBe("Invalid code");
   expect(store.getState().isEnabled).toBe(false);
  });
 });

 describe("store isolation", () => {
  test("should create independent store instances", () => {
   const store1 = createTwoFactorStore();
   const store2 = createTwoFactorStore();

   store1.getState().setEnabled(true);
   store1.getState().setBackupCodes(["CODE1"]);

   expect(store1.getState().isEnabled).toBe(true);
   expect(store2.getState().isEnabled).toBe(false);
   expect(store2.getState().backupCodes).toEqual([]);
  });
 });
});

/**
 * useAuth hook tests
 * Tests behavior, edge cases, and potential bugs
 */

import { describe, it, expect, beforeEach, mock, spyOn } from "bun:test";
import { renderHook } from "@testing-library/react";
import { useAuth } from "../use-auth";

// Import the actual modules to spy on
import * as nextAuth from "next-auth/react";
import * as nextNavigation from "next/navigation";

// Mock modules before importing the hook
const mockUseSession = mock(() => ({
  data: null,
  status: "unauthenticated",
}));

const mockSignIn = mock(() => Promise.resolve({ ok: true, error: null }));
const mockSignOut = mock(() => Promise.resolve());

const mockRouter = {
  push: mock(() => {}),
  refresh: mock(() => {}),
};

const mockUseRouter = mock(() => mockRouter);

// Setup mocks
spyOn(nextAuth, "useSession").mockImplementation(mockUseSession);
spyOn(nextAuth, "signIn").mockImplementation(mockSignIn);
spyOn(nextAuth, "signOut").mockImplementation(mockSignOut);
spyOn(nextNavigation, "useRouter").mockImplementation(mockUseRouter);

describe("useAuth", () => {
  beforeEach(() => {
    // Reset mocks
    mockUseSession.mockClear();
    mockSignIn.mockClear();
    mockSignOut.mockClear();
    mockRouter.push.mockClear();
    mockRouter.refresh.mockClear();
  });

  describe("user state", () => {
    it("returns null user when not authenticated", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });

    it("returns user when authenticated", () => {
      const mockSession = {
        user: {
          id: "user-123",
          email: "test@example.com",
          name: "Test User",
          role: "USER" as const,
          username: "testuser",
          hasCompletedOnboarding: false,
          image: null,
        },
        accessToken: "token-123",
      };

      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.user).not.toBeNull();
      expect(result.current.user?.id).toBe("user-123");
      expect(result.current.user?.email).toBe("test@example.com");
      expect(result.current.isAuthenticated).toBe(true);
    });

    it("handles partial user data (edge case)", () => {
      const mockSession = {
        user: {
          id: "user-123",
          email: null,
          name: null,
          role: "USER" as const,
          username: null,
          hasCompletedOnboarding: false,
          image: null,
        },
        accessToken: "token-123",
      };

      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.user).not.toBeNull();
      expect(result.current.user?.email).toBeNull();
      expect(result.current.user?.name).toBeNull();
      expect(result.current.user?.username).toBeNull();
    });

    it("handles missing role (defaults to USER)", () => {
      const mockSession = {
        user: {
          id: "user-123",
          email: "test@example.com",
          name: "Test",
          role: undefined,
          username: "test",
          hasCompletedOnboarding: false,
        },
        accessToken: "token-123",
      };

      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.user?.role).toBe("USER");
    });

    it("handles missing hasCompletedOnboarding (defaults to false)", () => {
      const mockSession = {
        user: {
          id: "user-123",
          email: "test@example.com",
          name: "Test",
          role: "USER" as const,
          username: "test",
          hasCompletedOnboarding: undefined,
        },
        accessToken: "token-123",
      };

      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.user?.hasCompletedOnboarding).toBe(false);
    });

    it("returns null user when userId is missing", () => {
      const mockSession = {
        user: {
          id: undefined,
          email: "test@example.com",
          role: "USER" as const,
        },
        accessToken: "token-123",
      };

      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe("isAuthenticated", () => {
    it("returns false when status is loading", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "loading",
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(true);
    });

    it("returns false when status is unauthenticated", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
    });

    it("returns true only when status is authenticated AND user exists", () => {
      const mockSession = {
        user: {
          id: "user-123",
          email: "test@example.com",
          role: "USER" as const,
        },
        accessToken: "token-123",
      };

      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe("isAdmin", () => {
    it("returns true when user role is ADMIN", () => {
      const mockSession = {
        user: {
          id: "admin-123",
          email: "admin@example.com",
          role: "ADMIN" as const,
        },
        accessToken: "token-123",
      };

      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.isAdmin).toBe(true);
    });

    it("returns false when user role is USER", () => {
      const mockSession = {
        user: {
          id: "user-123",
          email: "user@example.com",
          role: "USER" as const,
        },
        accessToken: "token-123",
      };

      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.isAdmin).toBe(false);
    });

    it("returns false when user is null", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.isAdmin).toBe(false);
    });
  });

  describe("signIn", () => {
    it("returns true on successful login", async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      });

      mockSignIn.mockResolvedValue({
        ok: true,
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      const success = await result.current.signIn("test@example.com", "password");
      expect(success).toBe(true);
      expect(mockSignIn).toHaveBeenCalledWith("credentials", {
        email: "test@example.com",
        password: "password",
        redirect: false,
      });
      expect(mockRouter.push).toHaveBeenCalled();
      expect(mockRouter.refresh).toHaveBeenCalled();
    });

    it("returns false on failed login", async () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      });

      mockSignIn.mockResolvedValue({
        ok: false,
        error: "Invalid credentials",
      });

      const { result } = renderHook(() => useAuth());

      const success = await result.current.signIn("test@example.com", "wrong");
      expect(success).toBe(false);
      expect(mockSignIn).toHaveBeenCalled();
    });

    it("uses callbackUrl when provided", async () => {
      mockSignIn.mockResolvedValue({
        ok: true,
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await result.current.signIn("test@example.com", "password", "/custom-path");
      expect(mockRouter.push).toHaveBeenCalledWith("/custom-path");
    });

    it("uses default route when callbackUrl is not provided", async () => {
      mockSignIn.mockResolvedValue({
        ok: true,
        error: null,
      });

      const { result } = renderHook(() => useAuth());

      await result.current.signIn("test@example.com", "password");
      expect(mockRouter.push).toHaveBeenCalledWith("/protected/profile");
    });
  });

  describe("signOut", () => {
    it("calls nextAuth signOut and redirects to home", async () => {
      mockSignOut.mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuth());

      await result.current.signOut();
      expect(mockSignOut).toHaveBeenCalledWith({ redirect: false });
      expect(mockRouter.push).toHaveBeenCalledWith("/");
      expect(mockRouter.refresh).toHaveBeenCalled();
    });
  });

  describe("hasRole", () => {
    it("returns true when user has the role", () => {
      const mockSession = {
        user: {
          id: "user-123",
          email: "test@example.com",
          role: "ADMIN" as const,
        },
        accessToken: "token-123",
      };

      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.hasRole("ADMIN")).toBe(true);
      expect(result.current.hasRole("USER")).toBe(false);
    });

    it("returns false when user is null", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.hasRole("ADMIN")).toBe(false);
      expect(result.current.hasRole("USER")).toBe(false);
    });
  });

  describe("hasAnyRole", () => {
    it("returns true when user has any of the roles", () => {
      const mockSession = {
        user: {
          id: "user-123",
          email: "test@example.com",
          role: "ADMIN" as const,
        },
        accessToken: "token-123",
      };

      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.hasAnyRole(["ADMIN", "USER"])).toBe(true);
      expect(result.current.hasAnyRole(["USER"])).toBe(false);
    });

    it("returns false when user is null", () => {
      mockUseSession.mockReturnValue({
        data: null,
        status: "unauthenticated",
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.hasAnyRole(["ADMIN", "USER"])).toBe(false);
    });

    it("returns false for empty roles array", () => {
      const mockSession = {
        user: {
          id: "user-123",
          email: "test@example.com",
          role: "USER" as const,
        },
        accessToken: "token-123",
      };

      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.hasAnyRole([])).toBe(false);
    });
  });

  describe("accessToken", () => {
    it("returns accessToken from session", () => {
      const mockSession = {
        user: {
          id: "user-123",
          email: "test@example.com",
          role: "USER" as const,
        },
        accessToken: "token-123",
      };

      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.accessToken).toBe("token-123");
    });

    it("returns undefined when session has no accessToken", () => {
      const mockSession = {
        user: {
          id: "user-123",
          email: "test@example.com",
          role: "USER" as const,
        },
        accessToken: undefined,
      };

      mockUseSession.mockReturnValue({
        data: mockSession,
        status: "authenticated",
      });

      const { result } = renderHook(() => useAuth());
      expect(result.current.accessToken).toBeUndefined();
    });
  });
});

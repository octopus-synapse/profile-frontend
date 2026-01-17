/**
 * RoleGuard component tests
 * Tests all strategies, edge cases, and potential bugs
 *
 * Note: UI component mocks are provided globally in test.setup.ts
 */

import { describe, it, expect, beforeEach, mock } from "bun:test";
import { render, screen } from "@testing-library/react";
import { RoleGuard, AdminOnly, AuthenticatedOnly } from "../role-guard";
import { useAuth } from "../../hooks/use-auth";

// Mock useAuth for this test file
void mock.module("../../hooks/use-auth", () => ({
  useAuth: mock(() => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isAdmin: false,
  })),
}));

describe("RoleGuard", () => {
  let mockUseAuth: ReturnType<typeof mock>;

  beforeEach(() => {
    mockUseAuth = mock(() => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isAdmin: false,
    }));

    void (useAuth as ReturnType<typeof mock>).mockImplementation(mockUseAuth);
  });

  describe("strategy: any (default)", () => {
    it("shows children when user has any required role", () => {
      mockUseAuth.mockReturnValue({
        user: { id: "1", role: "ADMIN" },
        isAuthenticated: true,
        isLoading: false,
      });

      render(
        <RoleGuard roles={["ADMIN", "USER"]}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(screen.getByText("Protected Content")).not.toBeNull();
    });

    it("shows fallback when user has no required role", () => {
      mockUseAuth.mockReturnValue({
        user: { id: "1", role: "USER" },
        isAuthenticated: true,
        isLoading: false,
      });

      render(
        <RoleGuard roles={["ADMIN"]} fallback={<div>Access Denied</div>}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(screen.queryByText("Protected Content")).toBeNull();
      expect(screen.getByText("Access Denied")).not.toBeNull();
    });

    it("shows nothing when fallback is not provided", () => {
      mockUseAuth.mockReturnValue({
        user: { id: "1", role: "USER" },
        isAuthenticated: true,
        isLoading: false,
      });

      const { container } = render(
        <RoleGuard roles={["ADMIN"]}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(container.firstChild).toBeNull();
    });

    it("handles empty roles array", () => {
      mockUseAuth.mockReturnValue({
        user: { id: "1", role: "USER" },
        isAuthenticated: true,
        isLoading: false,
      });

      render(
        <RoleGuard roles={[]}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(screen.queryByText("Protected Content")).toBeNull();
    });
  });

  describe("strategy: exact", () => {
    it("shows children when user has exact role", () => {
      mockUseAuth.mockReturnValue({
        user: { id: "1", role: "ADMIN" },
        isAuthenticated: true,
        isLoading: false,
      });

      render(
        <RoleGuard roles={["ADMIN"]} strategy="exact">
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(screen.getByText("Protected Content")).not.toBeNull();
    });

    it("shows fallback when user role doesn't match exactly", () => {
      mockUseAuth.mockReturnValue({
        user: { id: "1", role: "USER" },
        isAuthenticated: true,
        isLoading: false,
      });

      render(
        <RoleGuard roles={["ADMIN"]} strategy="exact" fallback={<div>Denied</div>}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(screen.queryByText("Protected Content")).toBeNull();
      expect(screen.getByText("Denied")).not.toBeNull();
    });

    it("shows fallback when multiple roles provided (exact requires single)", () => {
      mockUseAuth.mockReturnValue({
        user: { id: "1", role: "ADMIN" },
        isAuthenticated: true,
        isLoading: false,
      });

      render(
        <RoleGuard roles={["ADMIN", "USER"]} strategy="exact" fallback={<div>Denied</div>}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      // Exact strategy requires exactly 1 role
      expect(screen.queryByText("Protected Content")).toBeNull();
      expect(screen.getByText("Denied")).not.toBeNull();
    });
  });

  describe("strategy: all", () => {
    it("shows children when user has all roles (single role case)", () => {
      mockUseAuth.mockReturnValue({
        user: { id: "1", role: "ADMIN" },
        isAuthenticated: true,
        isLoading: false,
      });

      render(
        <RoleGuard roles={["ADMIN"]} strategy="all">
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(screen.getByText("Protected Content")).not.toBeNull();
    });

    it("shows fallback when user doesn't have all roles", () => {
      mockUseAuth.mockReturnValue({
        user: { id: "1", role: "USER" },
        isAuthenticated: true,
        isLoading: false,
      });

      render(
        <RoleGuard roles={["ADMIN", "USER"]} strategy="all" fallback={<div>Denied</div>}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      // User has USER but not ADMIN, so doesn't have "all"
      expect(screen.queryByText("Protected Content")).toBeNull();
      expect(screen.getByText("Denied")).not.toBeNull();
    });
  });

  describe("loading state", () => {
    it("shows loading when isLoading is true", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: true,
      });

      render(
        <RoleGuard roles={["ADMIN"]}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      // Should show spinner (default loading)
      const spinner = screen.getByRole("status");
      expect(spinner).not.toBeNull();
      expect(screen.queryByText("Protected Content")).toBeNull();
    });

    it("shows custom loading component", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: true,
      });

      render(
        <RoleGuard roles={["ADMIN"]} loading={<div>Custom Loading</div>}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(screen.getByText("Custom Loading")).not.toBeNull();
      expect(screen.queryByText("Protected Content")).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("handles undefined user role", () => {
      mockUseAuth.mockReturnValue({
        user: { id: "1", role: undefined },
        isAuthenticated: true,
        isLoading: false,
      });

      render(
        <RoleGuard roles={["ADMIN"]} fallback={<div>Denied</div>}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(screen.queryByText("Protected Content")).toBeNull();
      expect(screen.getByText("Denied")).not.toBeNull();
    });

    it("handles null user", () => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      render(
        <RoleGuard roles={["ADMIN"]} fallback={<div>Denied</div>}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      expect(screen.queryByText("Protected Content")).toBeNull();
      expect(screen.getByText("Denied")).not.toBeNull();
    });

    it("handles invalid strategy gracefully", () => {
      mockUseAuth.mockReturnValue({
        user: { id: "1", role: "ADMIN" },
        isAuthenticated: true,
        isLoading: false,
      });

      // @ts-expect-error - Testing invalid strategy
      render(
        <RoleGuard roles={["ADMIN"]} strategy="invalid" fallback={<div>Denied</div>}>
          <div>Protected Content</div>
        </RoleGuard>
      );

      // Should default to showing fallback when strategy is invalid
      expect(screen.queryByText("Protected Content")).toBeNull();
      expect(screen.getByText("Denied")).not.toBeNull();
    });
  });
});

describe("AdminOnly", () => {
  it("shows children for admin users", () => {
    (useAuth as ReturnType<typeof mock>).mockReturnValue({
      user: { id: "1", role: "ADMIN" },
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <AdminOnly>
        <div>Admin Content</div>
      </AdminOnly>
    );

    expect(screen.getByText("Admin Content")).not.toBeNull();
  });

  it("shows fallback for non-admin users", () => {
    (useAuth as ReturnType<typeof mock>).mockReturnValue({
      user: { id: "1", role: "USER" },
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <AdminOnly fallback={<div>Not Admin</div>}>
        <div>Admin Content</div>
      </AdminOnly>
    );

    expect(screen.queryByText("Admin Content")).toBeNull();
    expect(screen.getByText("Not Admin")).not.toBeNull();
  });
});

describe("AuthenticatedOnly", () => {
  it("shows children for authenticated users", () => {
    (useAuth as ReturnType<typeof mock>).mockReturnValue({
      user: { id: "1", role: "USER" },
      isAuthenticated: true,
      isLoading: false,
    });

    render(
      <AuthenticatedOnly>
        <div>Authenticated Content</div>
      </AuthenticatedOnly>
    );

    expect(screen.getByText("Authenticated Content")).not.toBeNull();
  });

  it("shows fallback for unauthenticated users", () => {
    (useAuth as ReturnType<typeof mock>).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    render(
      <AuthenticatedOnly fallback={<div>Please Login</div>}>
        <div>Authenticated Content</div>
      </AuthenticatedOnly>
    );

    expect(screen.queryByText("Authenticated Content")).toBeNull();
    expect(screen.getByText("Please Login")).not.toBeNull();
  });

  it("shows loading during authentication check", () => {
    (useAuth as ReturnType<typeof mock>).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: true,
    });

    render(
      <AuthenticatedOnly>
        <div>Authenticated Content</div>
      </AuthenticatedOnly>
    );

    const spinner = screen.getByRole("status");
    expect(spinner).not.toBeNull();
    expect(screen.queryByText("Authenticated Content")).toBeNull();
  });
});

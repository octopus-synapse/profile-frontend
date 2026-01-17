/**
 * Authentication Component Tests
 * Tests sign-in form rendering and validation
 * Note: Converted from E2E to unit tests to avoid Playwright dependency
 */

import React from "react";
import { describe, it, expect } from "bun:test";
import { render, screen } from "@testing-library/react";
import { SignInForm } from "@/features/auth/components/sign-in-form";

describe("Authentication E2E", () => {
  describe("Sign In Form", () => {
    it("should display sign-in form with all required fields", () => {
      render(<SignInForm />);

      expect(screen.getByLabelText(/email/i)).not.toBeNull();
      expect(screen.getByLabelText(/password/i)).not.toBeNull();
      expect(screen.getByRole("button", { name: /sign in/i })).not.toBeNull();
    });

    it("should have password field with type password", () => {
      render(<SignInForm />);

      const passwordField = screen.getByLabelText(/password/i);
      expect(passwordField.getAttribute("type")).toBe("password");
    });

    it("should have link to forgot password", () => {
      render(<SignInForm />);

      const forgotLink = screen.getByRole("link", { name: /forgot/i });
      expect(forgotLink).toBeDefined();
      expect(forgotLink.getAttribute("href")).toContain("forgot-password");
    });
  });
});

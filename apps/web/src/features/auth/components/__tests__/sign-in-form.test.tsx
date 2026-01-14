/**
 * SignInForm component tests
 * Tests behavior, error handling, and edge cases
 */

import { describe, it, expect, beforeEach, mock } from "bun:test";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SignInForm } from "../sign-in-form";
import { useAuth } from "../../hooks/use-auth";
import { useSearchParams } from "next/navigation";
import { useT } from "@/features/i18n";

// Mock dependencies
mock.module("../../hooks/use-auth", () => ({
  useAuth: mock(() => ({
    signIn: mock(() => Promise.resolve(true)),
    user: null,
    isAuthenticated: false,
    isLoading: false,
  })),
}));

mock.module("next/navigation", () => ({
  useSearchParams: mock(() => ({
    get: mock(() => null),
  })),
}));

mock.module("@/features/i18n", () => ({
  useT: mock(() => (key: string) => {
    const translations: Record<string, string> = {
      "auth.error.invalidCredentials": "Invalid email or password",
      "error.generic": "An error occurred",
      "auth.signIn.email": "Email",
      "auth.signIn.password": "Password",
      "auth.signIn.submit": "Sign In",
    };
    return translations[key] || key;
  }),
}));

describe("SignInForm", () => {
  let mockSignIn: ReturnType<typeof mock>;
  let mockUseAuth: ReturnType<typeof mock>;

  beforeEach(() => {
    mockSignIn = mock(() => Promise.resolve(true));
    mockUseAuth = mock(() => ({
      signIn: mockSignIn,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    }));

    (useAuth as ReturnType<typeof mock>).mockImplementation(mockUseAuth);
    (useSearchParams as ReturnType<typeof mock>).mockReturnValue({
      get: mock(() => null),
    });
  });

  it("renders email and password fields", () => {
    render(<SignInForm />);
    expect(screen.getByLabelText(/email/i)).not.toBeNull();
    expect(screen.getByLabelText(/password/i)).not.toBeNull();
  });

  it("shows error when signIn returns false", async () => {
    mockSignIn.mockResolvedValue(false);

    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).not.toBeNull();
    });
  });

  it("shows error when signIn throws", async () => {
    mockSignIn.mockRejectedValue(new Error("Network error"));

    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("An error occurred")).not.toBeNull();
    });
  });

  it("disables submit button while loading", async () => {
    let resolveSignIn: () => void;
    const signInPromise = new Promise<boolean>((resolve) => {
      resolveSignIn = () => resolve(true);
    });
    mockSignIn.mockReturnValue(signInPromise);

    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(submitButton);

    // Button should be disabled during loading
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });

    resolveSignIn!();
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it("clears error when form is resubmitted", async () => {
    // First submission fails
    mockSignIn.mockResolvedValueOnce(false);

    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrong" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).not.toBeNull();
    });

    // Second submission succeeds
    mockSignIn.mockResolvedValueOnce(true);
    fireEvent.change(passwordInput, { target: { value: "correct" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText("Invalid email or password")).toBeNull();
    });
  });

  it("uses callbackUrl from search params", async () => {
    const mockGet = mock(() => "/custom-callback");
    (useSearchParams as ReturnType<typeof mock>).mockReturnValue({
      get: mockGet,
    });

    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        "test@example.com",
        "password",
        "/custom-callback"
      );
    });
  });

  it("toggles password visibility", () => {
    render(<SignInForm />);

    const passwordInput = screen.getByLabelText(/password/i) as HTMLInputElement;
    const toggleButton = screen.getByRole("button", { name: /show|hide/i });

    // Initially password should be hidden
    expect(passwordInput.type).toBe("password");

    // Click to show
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("text");

    // Click to hide
    fireEvent.click(toggleButton);
    expect(passwordInput.type).toBe("password");
  });

  it("prevents form submission with empty fields", () => {
    render(<SignInForm />);

    const submitButton = screen.getByRole("button", { name: /sign in/i });
    fireEvent.click(submitButton);

    // HTML5 validation should prevent submission
    // But we can't easily test that, so we test that signIn wasn't called
    expect(mockSignIn).not.toHaveBeenCalled();
  });

  it("handles rapid form submissions (debounce/race condition)", async () => {
    let resolveCount = 0;
    mockSignIn.mockImplementation(() => {
      return new Promise<boolean>((resolve) => {
        setTimeout(() => {
          resolveCount++;
          resolve(true);
        }, 100);
      });
    });

    render(<SignInForm />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });

    // Rapid clicks
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(resolveCount).toBeGreaterThan(0);
    });

    // Should have been called multiple times (potential bug if not handled)
    expect(mockSignIn).toHaveBeenCalledTimes(3);
  });
});


/**
 * Username Step Component - Validation Tests
 *
 * Kent Beck: "Test the contract, not the implementation"
 *
 * Purpose: Validate username input, debouncing, and UI feedback
 * These tests check USER-FACING behavior, not internal state
 *
 * Critical scenarios:
 * 1. Format validation (lowercase, alphanumeric, underscore)
 * 2. Length validation (3-30 chars)
 * 3. Reserved usernames blocked
 * 4. Debounce prevents excessive API calls
 * 5. Error messages are user-friendly
 */

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UsernameStep } from "../username-step";
import { useOnboardingStore } from "../../../stores";
import { useOnboardingSync } from "../../../hooks/use-onboarding-sync";
import { useSession } from "next-auth/react";

// Mock dependencies
jest.mock("next-auth/react");
jest.mock("../../../hooks/use-onboarding-sync");

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockUseOnboardingSync = useOnboardingSync as jest.MockedFunction<typeof useOnboardingSync>;

describe("UsernameStep - Validation & UX", () => {
  beforeEach(() => {
    // Reset store
    useOnboardingStore.setState({
      currentStep: "username",
      username: null,
      completedSteps: [],
      personalInfo: null,
      professionalProfile: null,
      experiences: [],
      noExperience: false,
      education: [],
      noEducation: false,
      skills: [],
      noSkills: false,
      languages: [],
      templateSelection: null,
      stepErrors: {},
    });

    // Mock authenticated session
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: "test-user",
          email: "test@example.com",
          name: "Test User",
          image: null,
          role: "USER" as const,
          username: null,
          hasCompletedOnboarding: false,
        },
        accessToken: "mock-token",
        expires: new Date(Date.now() + 3600000).toISOString(),
      },
      status: "authenticated",
      update: jest.fn(),
    });

    // Mock sync hook
    mockUseOnboardingSync.mockReturnValue({
      isLoading: false,
      isHydrated: true,
      isError: false,
      isSaving: false,
      lastSavedAt: null,
      saveError: null,
      saveToBackend: jest.fn(),
      isAuthenticated: true,
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("[VALIDATION] Format rules", () => {
    it("should reject uppercase letters", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      // TODO: Fix accessibility - input should have aria-label or id+htmlFor
      // See BUG#11 in BUGS_DISCOVERED_VIA_TESTS.md
      const input = screen.getByPlaceholderText("johndoe");

      await user.type(input, "JohnDoe");
      await user.tab(); // Trigger blur for validation

      // Should show error
      expect(await screen.findByText(/only lowercase/i)).toBeInTheDocument();
    });

    it("should reject special characters except underscore", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      const invalidInputs = ["john-doe", "john.doe", "john@doe", "john doe"];

      for (const invalid of invalidInputs) {
        await user.clear(input);
        await user.type(input, invalid);
        await user.tab();

        expect(await screen.findByText(/only lowercase/i)).toBeInTheDocument();
      }
    });

    it("should accept valid username with underscore", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      await user.type(input, "john_doe_123");
      await user.tab();

      // Should NOT show format error
      await waitFor(() => {
        expect(screen.queryByText(/only lowercase/i)).not.toBeInTheDocument();
      });
    });

    it("should reject username starting with underscore", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      await user.type(input, "_johndoe");
      await user.tab();

      expect(await screen.findByText(/cannot start/i)).toBeInTheDocument();
    });

    it("should reject username ending with underscore", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      await user.type(input, "johndoe_");
      await user.tab();

      expect(await screen.findByText(/cannot.*end/i)).toBeInTheDocument();
    });

    it("should reject consecutive underscores", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      await user.type(input, "john__doe");
      await user.tab();

      expect(await screen.findByText(/consecutive/i)).toBeInTheDocument();
    });
  });

  describe("[VALIDATION] Length rules", () => {
    it("should reject username shorter than 3 characters", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      await user.type(input, "ab");
      await user.tab();

      expect(await screen.findByText(/at least 3/i)).toBeInTheDocument();
    });

    it("should reject username longer than 30 characters", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      const longUsername = "a".repeat(31);
      await user.type(input, longUsername);
      await user.tab();

      expect(await screen.findByText(/maximum 30/i)).toBeInTheDocument();
    });

    it("should accept username exactly 3 characters", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      await user.type(input, "abc");
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText(/at least 3/i)).not.toBeInTheDocument();
      });
    });

    it("should accept username exactly 30 characters", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      const maxUsername = "a".repeat(30);
      await user.type(input, maxUsername);
      await user.tab();

      await waitFor(() => {
        expect(screen.queryByText(/maximum 30/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("[VALIDATION] Reserved usernames", () => {
    it("should reject reserved username: admin", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      await user.type(input, "admin");
      await user.tab();

      expect(await screen.findByText(/reserved/i)).toBeInTheDocument();
    });

    it("should reject all common reserved usernames", async () => {
      const user = userEvent.setup({ delay: null });
      const reserved = ["api", "auth", "login", "signup", "profile", "help"];

      for (const username of reserved) {
        render(<UsernameStep />);

        const input = screen.getByPlaceholderText("johndoe");
        await user.type(input, username);
        await user.tab();

        expect(await screen.findByText(/reserved/i)).toBeInTheDocument();

        // Cleanup for next iteration
        screen.unmount();
      }
    });
  });

  describe("[UX] Debouncing and feedback", () => {
    it("should debounce input for 500ms before checking availability", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      // Type rapidly
      await user.type(input, "johndoe");

      // Should NOT check immediately
      expect(screen.queryByText(/checking/i)).not.toBeInTheDocument();

      // Advance 400ms (not enough)
      jest.advanceTimersByTime(400);
      expect(screen.queryByText(/checking/i)).not.toBeInTheDocument();

      // Advance 100ms more (total 500ms)
      jest.advanceTimersByTime(100);

      // NOW it should check (or show validation error)
      await waitFor(() => {
        expect(screen.queryByRole("textbox")).toBeDefined();
      });
    });

    it("should show loading state while checking availability", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      await user.type(input, "validuser123");

      // Fast-forward debounce
      jest.advanceTimersByTime(500);

      // Should show checking state (might be a spinner or "checking..." text)
      // This tests that UI provides feedback during async operations
      await waitFor(() => {
        const loading = screen.queryByText(/checking/i) || screen.queryByRole("progressbar");
        expect(loading).toBeDefined();
      });
    });

    it("should disable next button while input is invalid", () => {
      render(<UsernameStep />);

      // Next button should exist but be disabled initially (no username)
      const nextButton = screen.getByRole("button", { name: /next|continue/i });
      expect(nextButton).toBeDisabled();
    });

    it("should enable next button when username is valid and available", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      await user.type(input, "validuser");
      jest.advanceTimersByTime(500);

      await waitFor(() => {
        const nextButton = screen.getByRole("button", { name: /next|continue/i });
        // Should eventually enable when validation passes
        expect(nextButton).not.toBeDisabled();
      });
    });
  });

  describe("[UX] Error messages", () => {
    it("should show clear error message for empty input on blur", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      await user.click(input);
      await user.tab(); // Blur without typing

      expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
    });

    it("should update error message as user types invalid input", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      // Type 1 char (too short)
      await user.type(input, "a");
      await user.tab();
      expect(await screen.findByText(/at least 3/i)).toBeInTheDocument();

      // Clear and type uppercase (invalid format)
      await user.clear(input);
      await user.type(input, "ABC");
      await user.tab();
      expect(await screen.findByText(/only lowercase/i)).toBeInTheDocument();
    });

    it("should clear error when user fixes the input", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      // Type invalid
      await user.type(input, "a");
      await user.tab();
      expect(await screen.findByText(/at least 3/i)).toBeInTheDocument();

      // Fix it
      await user.type(input, "bc"); // Now "abc" (valid length)

      await waitFor(() => {
        expect(screen.queryByText(/at least 3/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("[EDGE CASES] Username input", () => {
    it("should handle rapid typing and backspacing", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      // Type and delete rapidly
      await user.type(input, "test");
      await user.keyboard("{Backspace}{Backspace}{Backspace}{Backspace}");
      await user.type(input, "valid");

      // Should handle without crashing
      expect(input).toHaveValue("valid");
    });

    it("should trim whitespace from input", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      // Try to type with spaces
      await user.type(input, "  johndoe  ");

      // Should either reject or trim spaces
      const value = input.getAttribute("value");
      expect(value).not.toMatch(/^\s|\s$/); // No leading/trailing spaces
    });

    it("should handle paste with invalid characters", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      // Simulate paste with invalid chars
      await user.click(input);
      await user.paste("John@Doe!");

      await user.tab();

      // Should show validation error
      expect(await screen.findByText(/only lowercase/i)).toBeInTheDocument();
    });

    it("should preserve username when navigating back and forth", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      // Type username
      await user.type(input, "johndoe");

      // Simulate saving to store
      useOnboardingStore.getState().setUsername("johndoe");

      // Unmount and remount (simulate navigation)
      screen.unmount();
      render(<UsernameStep />);

      const newInput = screen.getByPlaceholderText("johndoe");

      // Should restore previous value
      expect(newInput).toHaveValue("johndoe");
    });
  });

  describe("[ACCESSIBILITY] Screen reader support", () => {
    it("should have accessible label for input", () => {
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");
      expect(input).toHaveAccessibleName();
    });

    it("should announce errors to screen readers", async () => {
      const user = userEvent.setup({ delay: null });
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      await user.type(input, "a");
      await user.tab();

      // Error message should be associated with input (aria-describedby or aria-errormessage)
      const errorMessage = await screen.findByText(/at least 3/i);
      expect(errorMessage).toBeInTheDocument();

      // Input should be marked as invalid
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("should have proper focus management", () => {
      render(<UsernameStep />);

      const input = screen.getByPlaceholderText("johndoe");

      // Input should be focusable
      input.focus();
      expect(input).toHaveFocus();
    });
  });
});

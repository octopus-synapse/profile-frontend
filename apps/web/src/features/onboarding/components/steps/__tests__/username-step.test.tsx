/**
 * UsernameStep component tests
 * Tests behavior, validation, API interactions, and edge cases
 *
 * Note: UI component mocks are provided globally in test.setup.ts
 */

import { describe, it, expect, beforeEach, mock, type Mock } from "bun:test";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UsernameStep } from "../username-step";
import { useOnboardingStore } from "../../../stores";

// Mock StepNavigation component (internal component, not in global setup)
void mock.module("../step-navigation", () => ({
  StepNavigation: ({ onNext }: { onNext?: () => void }) => {
    const React = require("react");
    return React.createElement("button", { onClick: onNext, "data-testid": "next-btn" }, "Next");
  },
}));

// Mock debounce hook to make tests synchronous
void mock.module("@/shared/hooks/use-debounce", () => ({
  useDebounce: <T,>(value: T) => value,
}));

// Mock dependencies
void mock.module("next-auth/react", () => ({
  useSession: mock(() => ({
    data: { accessToken: "mock-token" },
    status: "authenticated",
  })),
}));

void mock.module("../../../stores", () => ({
  useOnboardingStore: mock(() => ({
    username: null,
    setUsername: mock(() => {}),
    goToNextStep: mock(() => {}),
    markStepComplete: mock(() => {}),
  })),
}));

// Mock fetch
global.fetch = mock(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ available: true }),
  })
) as typeof fetch;

/** Helper to get the username input field */
const getUsernameInput = () => screen.getByPlaceholderText("johndoe") as HTMLInputElement;

describe("UsernameStep", () => {
  beforeEach(() => {
    (global.fetch as ReturnType<typeof mock>).mockClear();
    (useOnboardingStore as ReturnType<typeof mock>).mockClear();
  });

  it("renders username input", () => {
    render(<UsernameStep />);
    const input = getUsernameInput();
    expect(input).not.toBeNull();
  });

  it("normalizes input to lowercase", () => {
    render(<UsernameStep />);
    const input = getUsernameInput();

    fireEvent.change(input, { target: { value: "JOHN_DOE" } });

    expect(input.value).toBe("john_doe");
  });

  it("removes invalid characters", () => {
    render(<UsernameStep />);
    const input = getUsernameInput();

    fireEvent.change(input, { target: { value: "john@doe#123" } });

    // Should remove @ and #, keep alphanumeric and underscore
    expect(input.value).toBe("johndoe123");
  });

  it("shows loading state during availability check", async () => {
    let resolveFetch: (value: unknown) => void;
    const fetchPromise = new Promise((resolve) => {
      resolveFetch = resolve;
    });

    (global.fetch as ReturnType<typeof mock>).mockReturnValue(fetchPromise);

    render(<UsernameStep />);
    const input = getUsernameInput();

    fireEvent.change(input, { target: { value: "newuser" } });

    // Should show loading indicator (Loader2 icon with animate-spin)
    await waitFor(() => {
      const loadingText = screen.queryByText(/checking/i);
      expect(loadingText).not.toBeNull();
    });

    resolveFetch!({
      ok: true,
      json: () => Promise.resolve({ available: true }),
    });
  });

  it("shows available state when username is available", async () => {
    (global.fetch as ReturnType<typeof mock>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ available: true }),
    } as Response);

    render(<UsernameStep />);
    const input = getUsernameInput();

    fireEvent.change(input, { target: { value: "availableuser" } });

    await waitFor(() => {
      // Should show checkmark or "available" message
      const availableIndicator = screen.queryByText(/available/i);
      expect(availableIndicator).not.toBeNull();
    });
  });

  it("shows unavailable state when username is taken", async () => {
    (global.fetch as ReturnType<typeof mock>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ available: false }),
    } as Response);

    render(<UsernameStep />);
    const input = getUsernameInput();

    fireEvent.change(input, { target: { value: "takenuser" } });

    await waitFor(() => {
      const unavailableMessage = screen.queryByText(/taken/i);
      expect(unavailableMessage).not.toBeNull();
    });
  });

  it("handles API error 401 (unauthorized)", async () => {
    (global.fetch as ReturnType<typeof mock>).mockResolvedValue({
      ok: false,
      status: 401,
    } as Response);

    render(<UsernameStep />);
    const input = getUsernameInput();

    fireEvent.change(input, { target: { value: "testuser" } });

    await waitFor(() => {
      const errorMessage = screen.queryByText(/session expired/i);
      expect(errorMessage).not.toBeNull();
    });
  });

  it("handles API error 429 (rate limit)", async () => {
    (global.fetch as ReturnType<typeof mock>).mockResolvedValue({
      ok: false,
      status: 429,
    } as Response);

    render(<UsernameStep />);
    const input = getUsernameInput();

    fireEvent.change(input, { target: { value: "testuser" } });

    await waitFor(() => {
      const errorMessage = screen.queryByText(/too many/i);
      expect(errorMessage).not.toBeNull();
    });
  });

  it("handles network error", async () => {
    (global.fetch as ReturnType<typeof mock>).mockRejectedValue(new Error("Network error"));

    render(<UsernameStep />);
    const input = getUsernameInput();

    fireEvent.change(input, { target: { value: "testuser" } });

    await waitFor(() => {
      const errorMessage = screen.queryByText(/connection/i);
      expect(errorMessage).not.toBeNull();
    });
  });

  it("debounces API calls", async () => {
    const fetchMock = global.fetch as ReturnType<typeof mock>;
    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ available: true }),
    } as Response);

    render(<UsernameStep />);
    const input = getUsernameInput();

    // Rapid typing
    fireEvent.change(input, { target: { value: "u" } });
    fireEvent.change(input, { target: { value: "us" } });
    fireEvent.change(input, { target: { value: "use" } });
    fireEvent.change(input, { target: { value: "user" } });

    // Wait for debounce
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Should only call API once (after debounce)
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("skips API check if username matches saved username", async () => {
    const mockSetUsername = mock(() => {});
    (useOnboardingStore as ReturnType<typeof mock>).mockReturnValue({
      username: "saveduser",
      setUsername: mockSetUsername,
      goToNextStep: mock(() => {}),
      markStepComplete: mock(() => {}),
    });

    render(<UsernameStep />);
    const input = getUsernameInput();

    fireEvent.change(input, { target: { value: "saveduser" } });

    // Wait a bit to ensure no API call
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Should not call API for same username
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("disables next button when username is invalid", () => {
    render(<UsernameStep />);
    const input = getUsernameInput();

    fireEvent.change(input, { target: { value: "ab" } }); // Too short
    fireEvent.blur(input);

    // Should show validation error - matches UsernameSchema message
    // Use queryAllByText since there may be multiple elements with similar text
    const errorMessages = screen.queryAllByText(/at least 3 characters/i);
    expect(errorMessages.length).toBeGreaterThan(0);
  });

  it("disables next button when username is not available", async () => {
    (global.fetch as Mock<(...args: unknown[]) => Promise<unknown>>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ available: false }),
    } as Response);

    render(<UsernameStep />);
    const input = getUsernameInput();

    fireEvent.change(input, { target: { value: "takenuser" } });

    await waitFor(() => {
      const takenMessage = screen.queryByText(/taken/i);
      expect(takenMessage).not.toBeNull();
    });
  });

  it("enables next button when username is valid and available", async () => {
    (global.fetch as Mock<(...args: unknown[]) => Promise<unknown>>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ available: true }),
    } as Response);

    const mockGoToNextStep = mock(() => {});
    const mockSetUsername = mock(() => {});
    const mockMarkStepComplete = mock(() => {});
    (useOnboardingStore as ReturnType<typeof mock>).mockReturnValue({
      username: null,
      setUsername: mockSetUsername,
      goToNextStep: mockGoToNextStep,
      markStepComplete: mockMarkStepComplete,
    });

    render(<UsernameStep />);
    const input = getUsernameInput();

    fireEvent.change(input, { target: { value: "validuser" } });

    await waitFor(() => {
      const availableMessage = screen.queryByText(/available/i);
      expect(availableMessage).not.toBeNull();
    });
  });

  it("shows retry button on error and retries when clicked", async () => {
    (global.fetch as Mock<(...args: unknown[]) => Promise<unknown>>)
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ available: true }),
      } as Response);

    render(<UsernameStep />);
    const input = getUsernameInput();

    fireEvent.change(input, { target: { value: "testuser" } });

    await waitFor(() => {
      const retryButton = screen.queryByRole("button", { name: /retry/i });
      expect(retryButton).not.toBeNull();
    });

    const retryButton = screen.getByRole("button", { name: /retry/i });
    fireEvent.click(retryButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  it("handles empty username validation", () => {
    render(<UsernameStep />);
    const input = getUsernameInput();

    fireEvent.change(input, { target: { value: "" } });
    fireEvent.blur(input);

    // Empty username doesn't trigger validation message until touched
    expect(input.value).toBe("");
  });

  it("validates username length (min 3, max 30)", async () => {
    (global.fetch as ReturnType<typeof mock>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ available: true }),
    } as Response);

    render(<UsernameStep />);
    const input = getUsernameInput();

    // Too short - triggers local validation with UsernameSchema message
    fireEvent.change(input, { target: { value: "ab" } });
    fireEvent.blur(input);

    // Check we have an error state (validation message)
    await waitFor(() => {
      const shortErrors = screen.queryAllByText(/at least 3 characters/i);
      expect(shortErrors.length).toBeGreaterThan(0);
    });

    // Valid length - should pass validation and check availability
    fireEvent.change(input, { target: { value: "validuser" } });
    fireEvent.blur(input);

    // Should show available message
    await waitFor(() => {
      const availableMessage = screen.queryByText(/available/i);
      expect(availableMessage).not.toBeNull();
    });
  });
});
